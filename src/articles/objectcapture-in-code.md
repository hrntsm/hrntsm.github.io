---
title: "Swift を使って ObjectCapture をやってみる"
date: "2021-12-05"
draft: false
path: "/articles/ObjectCapture-in-code"
article-tags: ["Swift", "Photogrammetry"]
---

## はじめに

[こちらの記事](./Rhino8-NewFunc-ObjectCapture) では Rhino WIP を使って ObjectCapture をやる方法を紹介しました。
その記事内で書いたようにこの機能は macOS によって提供されている機能なため、Rhino でなくとも ObjectCapture を使うことができます。
ここでは以下の Apple のサンプルをもとに Swift を使って ObjectCapture を実行する方法を紹介します。

- [Creating a Photogrammetry Command-Line App](https://developer.apple.com/documentation/realitykit/creating_a_photogrammetry_command-line_app)

### 必要な環境

1. Xcode
1. Apple Silicon Mac
1. Monterey 以降の macOS

## コードを作成

### Xcode で Swift のテンプレートを開く

以下の手順で Swift のテンプレートが作成されます。

1. Xcode を立ち上げる
1. Create a new Xcode project を選択する
1. 一番上のタブから macOS を選択してその中なら Command Line Tool を選択する
1. Product Name と Organization Identifier を適当に設定し、Language を Swift にし Next を押し作成先のフォルダを設定する

上記を行うとテンプレートが作成されて以下のような main.swift ファイルが作成されていると思います。

```Swift
//
//  main.swift
//  testProject
//
//  Created by hiron on 2021/12/05.
//

import Foundation

print("Hello, World!")
```

この状態で Xcode の上部の左側にある ▷ ボタンを押すと Build が実行されコンソールに Hello, World! が表示されます。
これでコードを書く下準備ができたので、ここからコードを書いていきます。

### 必要なライブラリのインストール

テンプレートでは Foundation しかインポートしていないので、必要なものをインポートします。
RealityKit が実際に ObjectCapture を行う機能を提供している部分になります。

```Swift
import Foundation
import os
import RealityKit
import Metal
```

### 入出力の設定

ObjectCapture の対象となる画像のあるフォルダと作成したモデルの出力先を指定します。
出力先はファイル名を指定し、拡張子を .usdz にしてください。

```Swift
let inputFolder = "ここにインプットする画像のフォルダのパスを入れる"
let outputFilename = "ここに作成したファイルの出力先を入れる（拡張子は .usdz）"
```

### Session の設定を作成

次に実際に処理する際の設定をもつ Session を作成します。
取り込む画像の順序を設定する SampleOrdering と FeatureSensitivity の設定は
PhotogrammetrySession の Configuration で指定します。

ドキュメントは以下なので必要に応じて参照してください。

- [PhotogrammetrySession.Configuration](https://developer.apple.com/documentation/realitykit/photogrammetrysession/configuration)
- [enum PhotogrammetrySession.Configuration.SampleOrdering
](https://developer.apple.com/documentation/realitykit/photogrammetrysession/configuration/sampleordering)
- [enum PhotogrammetrySession.Configuration.FeatureSensitivity
](https://developer.apple.com/documentation/realitykit/photogrammetrysession/configuration/featuresensitivity)

ここでは SampleOrdering は unordered、featureSensitivity は normal にしています。

```Swift
let inputFolderUrl = URL(fileURLWithPath: inputFolder, isDirectory: true)
var configure = PhotogrammetrySession.Configuration()
configure.sampleOrdering = PhotogrammetrySession.Configuration.SampleOrdering.unordered
configure.featureSensitivity =
    PhotogrammetrySession.Configuration.FeatureSensitivity.normal

let session = try PhotogrammetrySession(
    input: inputFolderUrl,
    configuration: configure
)
```

### 実行時の状態出力の設定

上で作成した session の output を for で処理して、その結果に合わせて Switch でコンソール上に書き出すようにしています。

output のケースは結構あるので、ここでは完了した processingComplete 以外は default で処理しています。
どんな出力があるかは以下のドキュメントを参照し適宜出力するようにしてください。

- [PhotogrammetrySession.Output](https://developer.apple.com/documentation/realitykit/photogrammetrysession/output)

```Swift
let waiter = Task {
    do {
        for try await output in session.outputs {
            switch output {
                case .processingComplete:
                    print("complete!!")
                    Foundation.exit(0)
            @unknown default:
                print("Output: unhandled message")
            }
        }
    } catch {
        print("Output: ERROR")
        Foundation.exit(1)
    }
}
```

### 処理の実行部分の作成

最初に request を作成していますが、それを作成する関数はこのあとで作成しています。

```Swift
withExtendedLifetime((session, waiter)) {
    do {
        let request = makeRequest()
        print("Using request: \(String(describing: request))")
        try session.process(requests: [ request ])
        RunLoop.main.run()
    } catch {
        print("Process got error: \(String(describing: error))")
        Foundation.exit(1)
    }
}
```

### 作成したファイルの出力先とファイルの作成の詳細度を設定

最後に処理の実行の部分で呼び出している Request を取得する関数を作成します。
ここでは一番処理が軽い preview を指定しています。
公式のドキュメントは以下になります。

- [PhotogrammetrySession.Request](https://developer.apple.com/documentation/realitykit/photogrammetrysession/request)
- [enum PhotogrammetrySession.Request.Detail](https://developer.apple.com/documentation/realitykit/photogrammetrysession/request/detail)

より精密なデータを作成したい場合は別の値を設定してください。
設定可能な値は「preview」「reduce」「medium」「full」「raw」の5つです。
あとの選択肢ほどメッシュ数が増え処理に時間がかかるようになるので注意してください。

```Swift
private func makeRequest()-> PhotogrammetrySession.Request {
    let outputUrl = URL(fileURLWithPath: outputFilename)
    
    return PhotogrammetrySession.Request.modelFile(
        url: outputUrl,
        detail: PhotogrammetrySession.Request.Detail.preview)
}
```

### 完成！

これでコードが完成したので、Hello, World! と出力したときと同じように Build を実行することで ObjectCapture が実行されます。

作成が問題なく完了すると outputFilename で指定した箇所にファイルが出力されています。
ダブルクリックするとそのままファイルが開かれモデルを確認することができます。

## 作成したコード全体

以下に参考にここまでで作成したコード全体を記載します。
冒頭で出した Apple の公式のサンプルと合わせて適宜参考にしてください。

```Swift
import Foundation
import os
import RealityKit
import Metal

// 入出力の設定
let inputFolder = "ここにインプットする画像のフォルダのパスを入れる"
let outputFilename = "ここに作成したファイルの出力先を入れる（拡張子は .usdz）"

// Session の設定作成
let inputFolderUrl = URL(fileURLWithPath: inputFolder, isDirectory: true)
var configure = PhotogrammetrySession.Configuration()
configure.sampleOrdering = PhotogrammetrySession.Configuration.SampleOrdering.unordered
configure.featureSensitivity =
    PhotogrammetrySession.Configuration.FeatureSensitivity.normal

let session = try PhotogrammetrySession(
    input: inputFolderUrl,
    configuration: configure
)

// 動作実行時の状態出力の設定作成
let waiter = Task {
    do {
        for try await output in session.outputs {
            switch output {
                case .processingComplete:
                    print("complete!!")
                    Foundation.exit(0)
            @unknown default:
                print("Output: unhandled message")
            }
        }
    } catch {
        print("Output: ERROR")
        Foundation.exit(1)
    }
}

// 処理の実行
withExtendedLifetime((session, waiter)) {
    do {
        let request = makeRequest()
        print("Using request: \(String(describing: request))")
        try session.process(requests: [ request ])
        RunLoop.main.run()
    } catch {
        print("Process got error: \(String(describing: error))")
        Foundation.exit(1)
    }
}

// 完成したファイルの出力先とファイル作成の詳細度を設定
private func makeRequest() -> PhotogrammetrySession.Request {
    let outputUrl = URL(fileURLWithPath: outputFilename)
    
    return PhotogrammetrySession.Request.modelFile(
        url: outputUrl,
        detail: PhotogrammetrySession.Request.Detail.preview)
}
```