---
title: "RhinoInside を使ってリアルタイムで人の動きの FEM解析 をやってみる"
date: "2020-03-09"
draft: false
path: "/articles/Rhino.Inside.Unity-withFEM"
article-tags: ["Karamba3D", "Unity", "VR", "RhinoInside", "CSharp", "構造とデジタル"]
---

バーチャルモーションキャプチャーと Rhino.Inside.Unity を使って以下の動画のような形で人型に対するリアルタイムでの FEM 解析をやってみます。

[![](https://1.bp.blogspot.com/-X7Wmy3d32-c/XmW2fkPcgWI/AAAAAAAAB0g/3LxrkN8GmLUOFBorIu-ZTqh_WuhJhyoDQCLcBGAsYHQ/s320/VMCmoment.gif)](https://1.bp.blogspot.com/-X7Wmy3d32-c/XmW2fkPcgWI/AAAAAAAAB0g/3LxrkN8GmLUOFBorIu-ZTqh_WuhJhyoDQCLcBGAsYHQ/s1600/VMCmoment.gif)

## 流れの概要

大きな流れとしては、以下の形です。

1. [バーチャルモーションキャプチャー](https://sh-akira.github.io/VirtualMotionCapture/) で VR 機器からの情報を取得
1. [EVMC4U](https://github.com/gpsnmeajp/EasyVirtualMotionCaptureForUnity) を使ってバーチャルモーションキャプチャーからの情報を Unity に取得する
1. Rhino.Inside.Unity で各ボーンの情報を Rhino に送る
1. Karamba3D で FEM 解析

バーチャルモーションキャプチャー（以下ばもきゃ）と EVMC4U についての詳細は、上記のリンクから各ソフトの HP でのそれぞれの説明を確認してください。
上記の動画では VIVE と VIVE トラッカーを 3 つ使って頭、両手、腰、両足をトラッキングしながら撮影しています。

ばもきゃと EVMC4U の接続については、[EVMC4U の wiki](https://github.com/gpsnmeajp/EasyVirtualMotionCaptureForUnity/wiki) を参照してください。

## はまったところ

ばもきゃとのやり取りでハマった箇所としては、ばもきゃと EVMC4U は OSC で情報のやり取りをしていますが、送られているボーン位置の情報はローカル座標で送らている点です。
最初はグローバルの座標で送られていると思いそのまま座標を Rhino に送ろうとしていましたが、ローカル座標のためボーンが意味不明な位置になってしまい結構悩みました。

## Rhino へ送信用に EVMC4U に変更を加える

ここから今回のために変更した個所の説明をします。

EVMC4U を使える段階にすると ExternalReceiver.cs を使って情報をばもきゃから受信する形になっています。
ここに Rhino へボーン情報を送信用の部分を以下の 18 行目からの個所のように追記しています。
ExternalReceiver.cs 全体でいうと 576 行目くらいから始まる  private void BoneSynchronizeSingle の個所になります。

```cs
private void BoneSynchronizeSingle(Transform t, ref HumanBodyBones bone, ref Vector3 pos, ref Quaternion rot, bool posFilter, bool rotFilter)
{
    BoneFilter = Mathf.Clamp(BoneFilter, 0f, 1f);

    //ボーン位置同期が有効か
    if (BonePositionSynchronize)
    {
        //ボーン位置フィルタが有効か
        if (posFilter)
        {
            bonePosFilter[(int)bone] = (bonePosFilter[(int)bone] * BoneFilter) + pos * (1.0f - BoneFilter);
            t.localPosition = bonePosFilter[(int)bone];
        }
        else
        {
            t.localPosition = pos;
        }
        // ここを追記
     　　string boneName = bone.ToString();
        if (boneName == "Neck" ||
            boneName == "Head" ||
            boneName == "Hips" ||
            boneName == "Spine" ||
            boneName == "Chest" ||
            boneName == "LeftUpperArm" ||
            boneName == "RightUpperArm" ||
            boneName == "LeftLowerArm" ||
            boneName == "RightLowerArm" ||
            boneName == "LeftHand" ||
            boneName == "RightHand" ||
            boneName == "LeftUpperLeg" ||
            boneName == "RightUpperLeg" ||
            boneName == "LeftLowerLeg" ||
            boneName == "RightLowerLeg" ||
            boneName == "LeftFoot" ||
            boneName == "RightFoot" ||
            boneName == "LeftToes" ||
            boneName == "RightToes")
        {
          GrasshopperInUnity.SendBonePosition(boneName, t.position);
        }
    }
// 省略
}
```

ここでは、ばもきゃから受信したボーンの各点の座標を各ボーンに適用しているので、その値を取得し対象のボーンの名前とポジションを GrasshopperInUnity.SendBonePosition の引数として入力します。
途中の長い if 文は今回必要なボーンだけを設定するように場合分けしているだけなので、必要に応じて修正してください。

## Rhino とやり取りすための CallBack の設定

次に GrasshopperInUnity についてです。ここでは参考として[Rhino.Inside.Unity のサンプル 2](https://github.com/mcneel/rhino.inside/tree/master/Unity/Sample2)を使用しているので、そこからの追記箇所についての説明になります。追記したものは以下です。

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

最初の動作だった場合(\_firstRun が True)は、Grasshopper を起動させ、Unity をいったんポーズの状態にします。
ポーズにする理由は、Grasshopper を起動後、.gh ファイルを選択し開くまでの間は Unity が止まっていないと Rhino.Inside.Unity での送り先がなくエラーになってしまうからです。

6 行目以降はボーンの座標を args にセットして Grasshopper 側で受け取れるようにしています。

## 解析実行！

これで各ボーンの頂点データが Grasshopper 側で受け取れるようになったので、あとはその点を使って骨組みを作り Karamba3D で解析します。

解析した結果の応力図のメッシュを [RhinoInside Unity で Rhino へメッシュを送るやり方](../rhino.inside.unity-sendmesh) にあるような形で Unity 側に送り返しモデルと併せて表示すれば冒頭のような絵が撮れます。


## おわりに

一連の説明は以上です。

冒頭の動画のようにこの動作は非常に重いので、もう少し高速化できたら楽しそうなのですが、それは今後の課題です。
