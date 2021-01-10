---
path: "/blog/2019/01/HowtoUseRhinoVR"
title: "RhinoVRの使い方"
date: "19/01/06"
originalUrl: "https://rgkr-memo.blogspot.com/2019/01/HowtoUseRhinoVR.html"
slug: "/blog/2019/01/HowtoUseRhinoVR"
tags:
    - VR
    - rhinoceros
---
　2019年1月現在、公式によって開発公開されているRhinocerosのVR対応化のプラグインの導入法、使い方について説明します。  
　詳細はMcNeelの公式の[フォーラム](https://discourse.mcneel.com/t/rhinovr-a-sample-plug-in-for-rendering-rhino-viewports-in-virtual-reality/64481)と[github](https://github.com/mcneel/RhinoVR)を参照してください。  

<div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-KB3Q6SCvhbk/XDHtlcvs3TI/AAAAAAAABlM/WO86Jb29RtIl1Nck2z3rT0Q1g4b5r9s7QCLcBGAs/s400/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)](https://1.bp.blogspot.com/-KB3Q6SCvhbk/XDHtlcvs3TI/AAAAAAAABlM/WO86Jb29RtIl1Nck2z3rT0Q1g4b5r9s7QCLcBGAs/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)</div>  

　McNeelはRhinoでののVRプラグイン開発の参考にすることを目的にサンプルのVRプラグインを公開しているので、その導入法と使い方を紹介します。  
<div>  

**必要なもの**  

*   Oculus Rift または HTC VIVE
*   Steam の SteamVR のインストール
*   Rhino６ または RhinoWIP  
**プラグインのダウンロード場所**  
　[mcneelのRhinoVRのgithub](https://github.com/mcneel/RhinoVR/releases) からRhinoVR.rhi をダウンロードし、rhinoの画面にドラック&ドロップするとインストールが始まります。  

**使い方**  
　通常と同様にrhinoを立ち上げて、表示したいモデルを読み込み、コマンドラインにRhinoVRと打ち込むと起動します。この時に自動でSteamとSteamVRも起動し、HMDの位置でVR側の表示のキャリブレーションされているようです。同様にもう一度コマンドラインにRhinoVRと打ち込むと終了します。  

　以下は代表で HTC VIVEでの操作法を紹介します。Oculus Rift は公式の解説を見てください。  

*   左側のコントローラーのタッチパッドで前後左右の移動ができます。右側のコントローラーで左右の回転と上下の移動ができます。
*   オブジェクトはタッチパッドを押すことで選択できます。
*   右側のコントローラーのアプリケーションメニューボタンを押すことでRhinoのmoveのコマンドを使用できます。
*   左側のコントローラーのアプリケーションメニューボタンを押すことでRhinoのUndoのコマンドを使用できます。
*   右側のコントローラートリガーを押すとEnterキーを押すのと同じ挙動になります。
*   左側のコントローラートリガーを押すとgrasshopperの画面を表示します。
*   右側のコントローラーのグリップボタンを押すとEscキーを押すのと同じ挙動になります。<div>　公式には以上のように書かれていましたが、実際使った感じ少し違う気がしたので、使用する際は確認しながら使ってください。</div>  
**紹介動画**  
　探り探りさわっているので時折上記と少し違うことを言っていてすみません。実際の使用感としては私の使用環境は i7-6700K GTX1060 3GBですが 描画が重い感じになっています。  
<div class="separator" style="clear: both; text-align: center;"><iframe allowfullscreen="" class="YOUTUBE-iframe-video" data-thumbnail-src="https://i.ytimg.com/vi/0yAKbjpuyhU/0.jpg" frameborder="0" height="266" src="https://www.youtube.com/embed/0yAKbjpuyhU?feature=player_embedded" width="320"></iframe></div>  

</div>