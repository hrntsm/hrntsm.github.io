---
title: "RhinoInside を使ってリアルタイムで人の動きのFEM解析をやってみる　～速度改善編～"
date: "2020-03-22"
draft: false
path: "/articles/Rhino.Inside.Unity-withFEM2"
article-tags: ["Karamba3D", "Unity", "VR", "RhinoInside", "CSharp", "構造とデジタル"]
---

以前の記事で、RhinoInside を使った人の動きの FEM 解析をやりましたが、速度が全然出ずちょっと実用に耐えられなかったので原因を調べて改善した内容についてです。

改善した結果以下のようになったので、かなりいい感じではないでしょうか。

[![](https://1.bp.blogspot.com/-7kEpT72OnH0/XncdEshJ9YI/AAAAAAAAB1Q/O5Wf_iQu2CwaFF4BzoJJRzdRh_fiAyLpQCLcBGAsYHQ/s400/stevia_bar.gif)](https://1.bp.blogspot.com/-7kEpT72OnH0/XncdEshJ9YI/AAAAAAAAB1Q/O5Wf_iQu2CwaFF4BzoJJRzdRh_fiAyLpQCLcBGAsYHQ/s1600/stevia_bar.gif)

## 原因の調査

改善するためにはまず原因を調べないといけないので、Unity の Profiler を使って何に一番時間がかかっているかを調べました。
ここは以下の Unite の講演のアーカイブを参考にさせていただきました。

[![](https://img.youtube.com/vi/rvnsU8oCMcI/0.jpg)](https://www.youtube.com/watch?v=rvnsU8oCMcI)

結果として原因は Unity 内で Rhino へ送るために行っている NameCallback が重いことでした。
原因が分かったのでそこを改善していきます。

コードの箇所で言うと [前回の記事](./Rhino.Inside.Unity-withFEM) で書いた以下の 1 行目です。

```cs
public static void SendBonePosition(string boneName, Vector3 pos)
{
  if (_firstRun) 
  {
    ShowGrasshopperWindow();
    UnityEditor.EditorApplication.isPaused = true;
  }
  if (boneName != null)
  {
    var pt = pos.ToRhino();
    using (var args = new Rhino.Runtime.NamedParametersEventArgs())
    {
      args.Set("point", new Rhino.Geometry.Point(pt));
      Rhino.Runtime.HostUtils.ExecuteNamedCallback(boneName, args);
    }
  }
}
```

## 問題の改善方法

問題は、Unity で Update が実行されるたびに、ボーンの各点をポイントとして送っていることでした。

具体的には NameCallback が 18 回（送っているポイントの数）も行われることで、Profiler によればここに 600ms 程度かかっていました。
2fps 程度しか出ていないことになります。

なので NameCallback の回数を減らすことを考えます。
13 行目での args.Set でポイントを 1 つだけセットしていては回数を減らせないので、別の方法を考えます。

RhinoCommonAPI を調べてみると

```cs
IEnumerable<GeometryBase>
```

が送れるようなので、それを使います（[ここ参照](https://developer.rhino3d.com/wip/api/RhinoCommon/html/M_Rhino_Runtime_NamedParametersEventArgs_Set_4.htm)）  
Point クラスは GeometryBase を継承しているので、List でまとめて送れることになります。

## コードの修正

上記を踏まえて修正した SendBonePosition は以下になります。

```cs
public class GrasshopperInUnity:MonoBehaviour
{
    static List<GeometryBase> _points = new List<GeometryBase>(19);

    private void Awake()
    {
        Point pt = new Point(new Point3d(0, 0, 0));
        for (int i = 0; i < _points.Capacity; i++)
        {
            _points.Add(pt);
        }
    }
    
    public void SendBonePosition(string boneName, Vector3 pos, int num) 
    {
        if (_firstRun)
        {
            ShowGrasshopperWindow();
            UnityEditor.EditorApplication.isPaused = true;
        }

        if (boneName != null) 
        {
            var pt = pos.ToRhino();
            _points[num] = pt;

            if (num == 18)
            {
                using (var args = new Rhino.Runtime.NamedParametersEventArgs())
                {
                    List<GeometryBase> pts2Rhino = _points;
                    args.Set("point", pts2Rhino);
                    Rhino.Runtime.HostUtils.ExecuteNamedCallback("pointList", args);
                }
            }
        }
    }
}
```

2 ～ 12 行目で、IEnumerable を作って初期化し、25 行目で各ボーンのポジションを入れていっています。
num はボーンの名前と紐づけていて、例えば num=0 なら Head のボーンの位置を表すような形にしています。

そして 27 行目の if で num = 18 のときのみ List を NameCallback で送るようにしています。

これで NameCallback の回数は 1/18 になったので単純計算でこの箇所の実行速度は 600/18 = 33.3ms になるので何とか 30fps 程度まで近づけたのではないでしょうか。

## 細かい修正点

他の修正点として 24 行目にある pos.ToRhino() の挙動を変えました。

以前は Unity の Vector3 型を Rhino の Point3d 型に変換しでポイントを送っていましたが、[Point3d は構造体](https://developer.rhino3d.com/wip/api/RhinoCommon/html/T_Rhino_Geometry_Point3d.htm) なので GeometryBase にできません。

なので、GeometryBase を継承している[Point クラス](https://developer.rhino3d.com/wip/api/RhinoCommon/html/T_Rhino_Geometry_Point.htm)に変換するように以下のように書き換えています。

```cs
static class RhinoConvert
{
  public static Point ToRhino(this Vector3 p)
         => new Point(new Point3d((double) p.x, (double) p.z, (double) p.y));

  static public IEnumerable<Point> ToRhino(this ICollection<Vector3> points)
  {
    var result = new List<Point>(points.Count);
    foreach (var p in points)
    {
      result.Add(p.ToRhino());
    }

    return result;
  }
}
```

これで人の運動とか解析したら楽しそうですね。
