---
title: "Rhino 8 の新機能紹介 〜ObjectCapture編〜"
date: "2021-12-01"
draft: false
path: "/articles/Rhino8-NewFunc-ObjectCapture"
article-tags: ["Rhinoceros", "Photogrammetry"]
---

## はじめに

Rhino 7 が発売されてだいぶ立ちましたが、開発版の RhinoWIP（将来のRhino8）にじわじわと新しい機能が追加されだしました。

その中で **Apple Silicon Mac 版の Rhino WIP にのみ** 追加された機能である ObjectCaptureFromPhotos を紹介します。

どのような機能かというと物体の周囲を撮影した写真のデータをもとに立体を作成する機能になります。
以下のようなものが Rhino で作成されます。いわゆるフォトグラメトリと言われるものになります。

<blockquote class="twitter-tweet" data-partner="tweetdeck"><p lang="ja" dir="ltr">M1Pro を使った Rhino8 のオブジェクトキャプチャー機能の試し。<br>これで簡単に Rhino でフォトグラメトリできるね！！ <a href="https://t.co/vli9tRPGvq">pic.twitter.com/vli9tRPGvq</a></p>&mdash; hiron (@hiron_rgkr) <a href="https://twitter.com/hiron_rgkr/status/1464805976142319618?ref_src=twsrc%5Etfw">November 28, 2021</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

なお開発途中の機能の紹介ですので、今後実装が変わる可能性があるので注意してください。
2021/12/01時点での情報になります。

### 必要な環境

1. [Rhinoceros WIP](https://www.rhino3d.com/download/rhino/wip) 
1. Apple Silicon Mac (M1 以降のCPU)


## サンプルの実行

上にも書いたように開発版の機能なので、最新情報は例えば以下の Rhinoceros Forum を参照してください。
- [Rhino 8 (Mac) Feature: ObjectCaptureFromPhotos](https://discourse.mcneel.com/t/rhino-8-mac-feature-objectcapturefromphotos/133086?u=hiron)

サンプルを使った ObjectCapture の手順は以下になります。

1. macOS Monterey を使用していて、Apple Silicon Mac で Rhinoceros WIP を起動
1. 現在開発版なので RhinoWIP は最新版なのか確認
1. [サンプルの写真のセット](https://files.mcneel.com/misc/Shoe-Photos.zip) をダウンロードし解凍
1. Rhino で `ObjectCaptureFromPhotos` コマンドを実行
1. 3 で回答した写真のあるフォルダに移動し OK をクリック
1. コマンドオプションを指定（詳細は以下に記載）し Enter
1. 処理が開始
    - 上記サンプルとデフォルトのオプションを使用すると約90秒かかります。
1. 処理が完了するとモデルウインドウに新しいメッシュが表示される
1. 確認したいウインドウのビューのモードをレンダリングにするとモデルが表示される

これでサンプルの実行は終わりです。とても簡単に実行できますね。
自分で撮った写真を使いたい場合は、対象となっているものは jpeg, heic, png の3種類になります。

### 実行時オプション

実行時に UI で設定できるオプションは以下の3つがあります。

1. Detail Level
    - Preview
        - 荒いメッシュでクオリティの低いマテリアルになるが最速で処理される
    - Reduce
        - Preview よりクオリティが高いが処理が遅くなる
    - Medium
        - 密なメッシュと詳細なマテリアルになるが処理が遅くなる
    - Full
        - 最も良い品質のメッシュとマテリアルになるが、処理が最も遅くなる
1. Sample Ordering（撮った画像の順序）
    - Unordered
        - 画像の並びが空間的に順序立っていない場合に選択する
        - 処理は順序だっている場合に対して遅い
    - Sequential
        - 画像の並びがターンテーブルを使って撮影した場合のように空間で順序だっている場合に選択する
        - 処理の速度を早くすることができる
1. Feature Sensitivity
    - Normal
        - 典型的な形状、エッジ、テクスチャの場合に選択
    - High
        - 識別可能な構造、エッジ、テクスチャーがあまりないオブジェクトの場合に選択

### なぜ Mac のみ対象の機能なのか

この機能は Mac 版のRhinoのみに実装される機能になります。
なぜかというと、macOS によって提供されている Object Capture 可能な API である RealityKit を使用しているからです。

オプションはこの API で提供されているオプションを Rhino の UI でラップしたものになっており、mcneel側の実装ではないです。

Apple が出している公式のサンプルは以下になります。
これはコマンドラインから Rhino でできることとほぼ同様のことを実行するアプリになります。
違いは出力が usdz 形式担っているところです。

- [Creating a Photogrammetry Command-Line App](https://developer.apple.com/documentation/realitykit/creating_a_photogrammetry_command-line_app)

Detail level は `PhotogrammetrySession.Request` で設定可能な Detail の enum に相当します。

- [PhotogrammetrySession.Request](https://developer.apple.com/documentation/realitykit/photogrammetrysession/request)
- [enum PhotogrammetrySession.Request.Detail](https://developer.apple.com/documentation/realitykit/photogrammetrysession/request/detail)

このドキュメントを見ると出力の戻り値には Bounds を選択することができ、これはモデルのバウンディングボックスを返すようです。
ですがこれは Rhino 側の機能でもカバーできるので、この API は使用していないようです。

また Detail の enum を見ると Rhino では選択できない raw という設定があることがわかります。
サイズが非常に大きくなるため Rhino 側では使用できないようにしているのかもしれません。

設定とサイズはドキュメントに記載があったので、以下に引用します。

|Detail Level|Triangles|Estimated File Size | Texture Size | Texture Memory Required |
| -- | -- | -- | -- | -- |
| .preview | <25k  | <5MB   | 1024x1024 |  10.7MB |
| .reduce  | <50k  | <10MB  | 2048x2048 |  42.7MB |
| .medium  | <100k | <30MB  | 4096x4096 | 170.7MB |
| .full    | <250k | <100MB | 8192x8192 | 853.3MB |
| .raw     | <30M  | Varies | 8192x8192(multiple) | Varies |


Sample Ordering と Feature Sensitivity は `PhotogrammetrySession.Configuration` での設定可能な enum に相当します。

- [PhotogrammetrySession.Configuration](https://developer.apple.com/documentation/realitykit/photogrammetrysession/configuration)
- [enum PhotogrammetrySession.Configuration.SampleOrdering
](https://developer.apple.com/documentation/realitykit/photogrammetrysession/configuration/sampleordering)
- [enum PhotogrammetrySession.Configuration.FeatureSensitivity
](https://developer.apple.com/documentation/realitykit/photogrammetrysession/configuration/featuresensitivity)

この2つのオプションは Detail Level のような無効化されているオプションはありませんでした。

## 画像の作り方

こちらは様々なフォトグラメトリの TIPS をいろんな方が上げているので、参考を上げることにとどめます。

- [Object Captureの紹介 Apple公式](https://developer.apple.com/jp/augmented-reality/object-capture/)
- [ObjectCaptureの使い方 lileaLab](https://lilea.net/lab/how-to-use-object-capture/)