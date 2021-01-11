---
title: "RhinoInside を使ってリアルタイムで人の動きのFEM解析をやってみる　～速度改善編～"
date: "2020-03-22"
draft: false
path: "/articles/Rhino.Inside.Unity-withFEM2"
article-tags: ["Karamba", "Unity", "VR", "RhinoInside", "CSharp"]
---

以前の記事で、RhinoInside を使った人の動きの FEM 解析をやりましたが、速度が全然出ずちょっと実用に耐えられなかったので、原因を調べて改善したので、その内容についてです。  
　改善した結果以下のようになったので、かなりいい感じではないでしょうか。

[![](https://1.bp.blogspot.com/-7kEpT72OnH0/XncdEshJ9YI/AAAAAAAAB1Q/O5Wf_iQu2CwaFF4BzoJJRzdRh_fiAyLpQCLcBGAsYHQ/s400/stevia_bar.gif)](https://1.bp.blogspot.com/-7kEpT72OnH0/XncdEshJ9YI/AAAAAAAAB1Q/O5Wf_iQu2CwaFF4BzoJJRzdRh_fiAyLpQCLcBGAsYHQ/s1600/stevia_bar.gif)

改善するためにはまず原因を調べないといけないので、Unity の Profiler を使って何に一番時間がかかっているかを調べました。ここは以下の Unite の講演のアーカイブを参考にさせていただきました。

結果として原因は Unity 内で Rhino に送るために行っている NameCallback が重いことが分かったのでそこを改善していきます。[前回の記事](https://rgkr-memo.blogspot.com/2020/03/Rhino.Inside.Unity-withFEM.html)で書いた以下の 10 行目です。

```cs
public static void SendBonePosition(string boneName, Vector3 pos){
  if (_firstRun) {
    ShowGrasshopperWindow();
    UnityEditor.EditorApplication.isPaused = true;
  }
  if (boneName != null) {
    var pt = pos.ToRhino();
    using (var args = new Rhino.Runtime.NamedParametersEventArgs()) {
      args.Set("point", new Rhino.Geometry.Point(pt));
      Rhino.Runtime.HostUtils.ExecuteNamedCallback(boneName, args);
    }
  }
}
```

問題は、ボーンの各点をポイントとして送っているので、Unity で Update が実行されるたびに、ここでは NameCallback が 18 回（送っているポイントの数分）だけ行われることでした。Profiler によればここに 600ms 程度かかっていました。2fps 程度しか出ていないことになります。  
　なので NameCallback の回数を減らすことを考えます。9 行目での args.Set でポイントを一つだけセットしていては回数を減らせないので、RhinoCommonAPI を調べてみると  
IEnumerable<GeometryBase>が送れるようなので、それを使います。（[ここ参照](https://developer.rhino3d.com/wip/api/RhinoCommon/html/M_Rhino_Runtime_NamedParametersEventArgs_Set_3.htm)）  
　上記を踏まえて修正した SendBonePosition は以下になります。

```cs
public class GrasshopperInUnity:MonoBehaviour {
    static List<GeometryBase> _points = new List<GeometryBase>(19);

    private void Awake() {
        Point pt = new Point(new Point3d(0, 0, 0));
        for (int i = 0; i < _points.Capacity; i++) {
            _points.Add(pt);
        }
    }
    
    public void SendBonePosition(string boneName, Vector3 pos, int num) {
        if (_firstRun) {
            ShowGrasshopperWindow();
            UnityEditor.EditorApplication.isPaused = true;
        }

        if (boneName != null) {
            var pt = pos.ToRhino();
            _points[num] = pt;

            if (num == 18) {
                using (var args = new Rhino.Runtime.NamedParametersEventArgs()) {
                    List<GeometryBase> pts2Rhino = _points;
                    args.Set("point", pts2Rhino);
                    Rhino.Runtime.HostUtils.ExecuteNamedCallback("pointList", args);
                }
            }
        }
    }
}
```

2 ～ 9 行目で、List<GeometryBase>を作って初期化し、19 行目で各ボーンのポジションを入れていっています。num はボーンの名前と紐づけていて、例えば num=0 なら Head のボーンの位置を表すような形にしています。  
　そして 21 行目の if で num が 18 のときのみ List を NameCallback で送るようにしています。これで NameCallback の回数は 1/18 になったので単純計算でこの箇所の実行速度は 600/18 = 33.3ms になるので何とか 30fps 程度まで近づけたのではないでしょうか。

他の修正点として 18 行目にある .ToRhino() の動作を変えました。以前は Unity の Vector3 型を Rhino の Point3d 型に変換しでポイントを送っていましたが、[Point3d は構造体](https://developer.rhino3d.com/wip/api/RhinoCommon/html/T_Rhino_Geometry_Point3d.htm)なので GeometryBase にすることはできません。なので、GeometryBase を継承している[Point クラス](https://developer.rhino3d.com/wip/api/RhinoCommon/html/T_Rhino_Geometry_Point.htm)に変換するように以下のように書き換えています。

```cs
static class RhinoConvert {

  public static Point ToRhino(this Vector3 p) => new Point(new Point3d((double) p.x, (double) p.z, (double) p.y));

  static public IEnumerable<Point> ToRhino(this ICollection<Vector3> points) {
    var result = new List<Point>(points.Count);
    foreach (var p in points)
      result.Add(p.ToRhino());

    return result;
  }
}
```

これで人の運動とか解析したら楽しそうですね。
