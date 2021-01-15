---
title: "RhinoVRの使い方"
date: "2019-01-06"
draft: false
path: "/articles/HowtoUseRhinoVR"
article-tags: ["VR", "Rhinoceros", "構造とデジタル"]
---

2019 年 1 月現在、公式によって開発公開されている Rhinoceros の VR 対応化のプラグインの導入法、使い方について説明します。  
　詳細は McNeel の公式の[フォーラム](https://discourse.mcneel.com/t/rhinovr-a-sample-plug-in-for-rendering-rhino-viewports-in-virtual-reality/64481)と[github](https://github.com/mcneel/RhinoVR)を参照してください。

[![](https://1.bp.blogspot.com/-KB3Q6SCvhbk/XDHtlcvs3TI/AAAAAAAABlM/WO86Jb29RtIl1Nck2z3rT0Q1g4b5r9s7QCLcBGAs/s400/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)](https://1.bp.blogspot.com/-KB3Q6SCvhbk/XDHtlcvs3TI/AAAAAAAABlM/WO86Jb29RtIl1Nck2z3rT0Q1g4b5r9s7QCLcBGAs/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

McNeel は Rhino での VR プラグイン開発の参考にすることを目的にサンプルの VR プラグインを公開しているので、その導入法と使い方を紹介します。

## 必要なもの

- Oculus Rift または HTC VIVE
- Steam の SteamVR のインストール
- Rhino ６ または RhinoWIP

## プラグインのダウンロード場所  
　[mcneel の RhinoVR の github](https://github.com/mcneel/RhinoVR/releases)  から RhinoVR.rhi をダウンロードし、rhino の画面にドラック&ドロップするとインストールが始まります。

## 使い方
　通常と同様に rhino を立ち上げて、表示したいモデルを読み込み、コマンドラインに RhinoVR と打ち込むと起動します。この時に自動で Steam と SteamVR も起動し、HMD の位置で VR 側の表示のキャリブレーションされているようです。同様にもう一度コマンドラインに RhinoVR と打ち込むと終了します。

以下は代表で HTC VIVE での操作法を紹介します。Oculus Rift は公式の解説を見てください。

- 左側のコントローラーのタッチパッドで前後左右の移動ができます。右側のコントローラーで左右の回転と上下の移動ができます。
- オブジェクトはタッチパッドを押すことで選択できます。
- 右側のコントローラーのアプリケーションメニューボタンを押すことで Rhino の move のコマンドを使用できます。
- 左側のコントローラーのアプリケーションメニューボタンを押すことで Rhino の Undo のコマンドを使用できます。
- 右側のコントローラートリガーを押すと Enter キーを押すのと同じ挙動になります。
- 左側のコントローラートリガーを押すと grasshopper の画面を表示します。
- 右側のコントローラーのグリップボタンを押すと Esc キーを押すのと同じ挙動になります。

公式には以上のように書かれていましたが、実際使った感じ少し違う気がしたので、使用する際は確認しながら使ってください。
