---
title: "2019/12 今の RhinoInside 完全に理解した話"
date: "2019-12-18"
draft: false
path: "/articles/201912-rhinoinside"
article-tags: ["RhinoInside", "Qiita"]
---

## はじめに

この記事は「xRArchi の皆がやったこと、やってること Advent Calendar 2019」の 16 日目です。

- [xRArchi の皆がやったこと、やってること Advent Calendar 2019](https://adventar.org/calendars/4686)

今年は Rhino.Inside にはまっていたので、サンプルで何ができるのかまとめます。Rhino.Inside は WIP で今まさに開発が進んでいるので、ここでの内容は 2019/12 現在の情報です。

ここでは実際に動かしている様子を動画にして紹介します。基本的には公式の github のサンプルをダウンロードしたそのままか、少しいじった程度のものです。自分の環境で動作させる際につまづいた点や実際に使ってみた感想を書いてます。

やり方としては、データをダウンロードして、VS2017 を使ってビルドして各ソフトで使っています。

## そもそも Rhino.Inside って？

[公式の説明](https://www.rhino3d.com/inside)や[AMD lab さんの記事](https://amdlaboratory.com/amdblog/rhino-inside%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6revit%E3%81%A8%E9%80%A3%E6%90%BA%E3%81%97%E3%81%A6%E3%81%BF%E3%82%8B/)がわかりやすいのでこちらをどうぞ。以下は公式の説明からの引用

> Rhino.Inside は、Rhino や Grasshopper を Revit および AutoCAD のような他の 64 ビットの Windows のアプリケーションの中で実行できるようにすることを可能にするオープンソースの Rhino WIP プロジェクトです。

上記にあるように 64 ビットの windows のアプリ向けかつ.NET ベースで作られているところに制約があります。

もし Mac やほかの環境で使いたい場合はサーバー側で処理をし REST 形式で返してくれる[Rhino Compute Service](https://www.rhino3d.com/compute)もあるので、興味がある方はそちらもどうぞ。

### これは公式ドキュメント見たほうが早いんじゃ…？

正しいです。そんな人は[公式の github](https://github.com/mcneel/rhino.inside)で各ソフトのフォルダにある README とかミテネ

## 各 Rhino.Inside の話

### Rhino.Inside Illastrator

[これの github のページ](https://github.com/mcneel/rhino.inside/tree/master/Adobe/Illustrator)には README がないため、最初これは何していいかわからないので、環境整えるまでハードル高い気がします。

Illustrator の SDK は C++なので、Rhino.Inside 側の操作は C#で、Illustrator 側の操作は C++でやっているようです。
つまづいた点として Rhino.Inside.Illustrator.Plugin のターゲットが最初 WindowsSDK ver8 とかになっているので、自分の環境に合わせてリターゲットする必要がありました。
（私の試した環境は WindowsSDK ver10.0.17763.0）

もう一点がビルド時に Tutrial.rc で、

```
fatal error RC1015: cannot open include file 'afxres.h'
```

というエラーが出たので、以下のように書き換えましたが C++よくわからないので、これが最適な対応かはよくわからないです。

```cpp
//#include "afxres.h"
#include <windows.h>
#define IDC_STATIC -1
```

動作は以下のような感じです。
オブジェクトのフィルターに Rhino があるのでそれから Rhino.Inside を起動します。
そうするとカーブを選択してくださいと出るので、カーブを選ぶとそれが Illustrator に表示されます。
ですが、なんだかうまく送れていないようで、線が閉じていないですしぶれているようにも見えます。

その問題をうまく整えれば、Rhino で作ったモデルを Make2D とかで線にして図面にする前に Illustrator でいい感じの資料作りとかに使えそうな気がします。

![RiAi.gif](https://hiron.dev/image/qiita/RI_Illustrator.gif)

### Rhino.Inside AutoCAD

AutoCAD のサンプルは AutoCAD 用のコマンド作ってそこから Rhino を呼ぶものでした。以降もよく出てきますが、sphere を作成してそのメッシュを相手のソフト側に出力するということをやっています。

![RiAutoCAD.gif](https://hiron.dev/image/qiita/RI_AutoCAD.gif)

### Rhino.Inside Revit

Rhino.Inside Revit は最近取り上げた記事もそこそこ出ている気がするので、そちらを紹介して終わりにします。
私も過去にさわっている動画を Youtube チャンネルにあげているので参考にどうぞ（ただし半年くらい前なのでバージョン古め）。

- [AMD lab さんの記事](https://amdlaboratory.com/amdblog/rhino-inside%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6revit%E3%81%A8%E9%80%A3%E6%90%BA%E3%81%97%E3%81%A6%E3%81%BF%E3%82%8B/)

- 私の Youtube チャンネルの動画（画像で Youtube チャンネルに飛びます）
  - こちらは AMD さんの記事と同じくサンプルを触っている 2 時間くらいの動画ですので、実際のさわってる感じを知りたければ飛ばし飛ばしどうぞ

[![Rhino.Inside Revit 完全に理解した](http://img.youtube.com/vi/RrctY-pwwos/hqdefault.jpg)](https://www.youtube.com/watch?v=RrctY-pwwos)

### Rhino.Inside BricsCAD

Rhino.Inside さわるまで私はこのソフトのこと知らなかったんですが、AutoCAD 互換 CAD ソフトです。少しさわった感じ CAD データの保存も dwg でできて UI も AutoCAD に非常に近いものでした。また BricsCAD の Rhino.Inside については BricsCAD を作っている Bricsys が開発していて驚きました。

使用する際は、BricsCAD Application Store で[「Rhino/Grasshopper Connection for BricsCAD BIM」](https://www.bricsys.com/applications/a/?rhino/grasshopper-connection-for-bricscad-bim-a1353-al2360)としてダウンロードしてそのまま使えるので、これについては VS で自分でビルドして環境整備していません。
自分で構築するときは mcneel ではなく[Bricsys の github](https://github.com/Bricsys/rhino.inside-bricscad)に置いてあるので、自分で中身を確認しながらでもやることができます。

![RiBricks.gif](https://hiron.dev/image/qiita/RI_BricsCAD.gif)

### Rhino.Inside ConsoleApps

コンソールから Rhino.Inside を動かす例が示されています。
ソフト連携ではなくまず Rhino.Inside のみを動かすことを確認したいときはこれを参照するといいと思います。
サンプルデータではスフィアを作成して、作ったメッシュの頂点数を出力する [ConsoleApps/HelloWorld](https://github.com/mcneel/rhino.inside/tree/master/ConsoleApps/HelloWorld) の C#版とそれ VB 版、Grasshopper を呼んで特定の名前が付けられたコンポーネントに入力されているラインの始点終点の座標を出力する [ConsoleApps/RunGrasshopper](https://github.com/mcneel/rhino.inside/tree/master/ConsoleApps/RunGrasshopper) があります。ここでは、RunGrasshopper の例を出します。

exe ファイルを起動するとコンソール画面が現れて右の Grasshopper の CollectMe に入力されているラインの情報を出力しています。わかりやすくするために Grasshopper の画面を右半分に出していますが、gh ファイルを読みに行っているので、Rhino を起動している必要はありませんでした。

![RiConsole.gif](https://hiron.dev/image/qiita/RI_ConsoleApps.gif)

### Rhino.Inside DotNet

サンプルでは WindowsForm で Rhino のモデルを表示するものです。これは WindowsForm で作っていますが、Eto のサンプルも挙げられていました。

![RIDotnet.gif](https://hiron.dev/image/qiita/RI_DotNet.gif)

## Rhino.Inside JavaScript

サンプルは Node.js から Rhino 使う例が出ていました。

1 つ目はコンソールから Rhino を起動させて sphere を作成してその頂点数を出力するものです。

![RIjs1.gif](https://hiron.dev/image/qiita/RI_JavaScript.gif)

2 つ目は Electron.js や Three.js を使用して Grasshopper で作成したモデルをウインドウに表示するものでした。
ですが JavaScript わからんマンなので、Grasshopper を起動するとこまでは行きましたが、モデルの表示はうまくいきませんでした… 実際どんな感じかは[ココ](https://github.com/hrntsm/rhino.inside/tree/master/JavaScript/Sample-4)を見てください。

![RIjs2.gif](https://hiron.dev/image/qiita/RI_JavaScript2.gif)

### Rhino.Inside UE

最新の UE は 4.24(2019/12 現在)ですが、Rhino.Inside を動かすために必要な USharp は 4.23 でないと動かないようなので注意してください。
Rhino.Inside は.NET API を持つソフトでないと動かないのですが、UE は C++ API なのでラッパーとしてこの USharp を使用しています。

UE については、Rhino.Inside のワークショップで取り扱ったようで、UE のみでなく Rhino.Inside の導入から UE での使用法まで細かく書かれた[ワークショップの資料](https://github.com/mcneel/Rhino.Inside-Workshop/wiki/Sample-3)があるので、こちらを参照すると Rhino.Inside がどんなものかよくわかるかもしれません。

操作感としては以下の動画の感じでわかるようにサクサクではありません。
Grasshopper 連携は下の Unity 項目でもやっていますが、Unity はサクサク動いているので、Rhino.Inside の問題ではないような気がします。
私は UE をこの記事のために初めて触ったので、原因が一回ラッパーをかましているからなのか、ブループリントを使っているからなのか、それともやっぱり Rhino.Inside の実装の問題なのかよくわかりませんでした。

![RiUE.gif](https://hiron.dev/image/qiita/RI_UE.gif)

### Rhino.Inside Excel

公式のサンプルに対して、Excel に書き込みして 3dm モデルを出力する部分を追加しています。

サンプルをいじっているだけなので、Rhino 側から Excel への入力のみですが、Excel 側からも Rhino に出力できるはずなので、Excel の特性を活かしてデータの管理なんかに使うといいかもしれません。

![RIExcel.gif](https://hiron.dev/image/qiita/RI_Excel.gif)

### Rhino.Inside Unity

こちらは公式のものをもとにして、ちょっと時間をかけて VR アプリを作ったりしていました。実際にどう作ったについては別に記事を書いているので、そちらを見てください。

- [Unity で RhinoInside を使って VR アプリを作ってみる](./unity-rhinoinside-vr-app)

![RIUnity.gif](https://hiron.dev/image/qiita/RI_Unity.gif)

Grasshopper と連携するサンプルもあるので試すと楽しいです。
これは Unity からメインカメラの座標を Grasshopper に送って、そのポイントに対して周囲の球を動かしてそれを Unity に送っているものの例です。

![RIUnityGrasshopper.gif](https://hiron.dev/image/qiita/RI_Unity2.gif)

## まとめ

いろいろなソフトに対して公式でサンプルが作られているので、さわってみると楽しいです。新たなソフトにさわってみるきっかけにもなるのでおすすめです。
