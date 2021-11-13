---
title: "Rhino3dm.js の使い方 〜HTML編〜"
date: "2021-11-13"
draft: false
path: "/articles/Intro-Rhino3dm-js-in-html"
article-tags: ["Rhinoceros", "JavaScript"]
---

## はじめに

### Rhino3dm.js とは

Rhino に関する処理をコードでする際には一般的に C# や Python でやる場合が多いと思いますが、
JS を使っても処理することができる場合があるので、試してみましょう。

Rhino3dm.js は Rhino のファイル形式である 3dm ファイルを扱うためのライブラリになります。
RhinoCommon の高級な幾何計算はできず、ファイルの中身（Rhino が扱うタイプのデータ形式）を扱うものです。

### 参考データ

参考のデータは以下の GitHub にアップしているので適宜参照してください。

- [hrntsm/Introduction-Rhino3dmjs](https://github.com/hrntsm/Introduction-Rhino3dmjs)

### 必要な環境

1. Node.js
1. VSCode

## Sphere を作成する

Rhino3dm.js の機能を使って簡単なジオメトリを作成してみましょう。例として Sphere を作成します。

注意点ですが、JS の Rhino3dm の処理は wasm を使っているため、
動作は非同期になるように、await や then() などを使って処理する必要があります。

index.html ファイルを作成して、以下の内容を入れてください。
今後このコードをベースに作成していきます。

```html
<!DOCTYPE html>
<html>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/rhino3dm.min.js"></script>
    <script>
      rhino3dm().then((rhino) => {
        // ここにコードを入れていく
      }
    </script>
  </body>
</html>
```

以下のコードで球を作ることができます。
この内容を上記の`// ここにコードを入れていく`の場所に入れてください。

```js
let center = [0, 0, 0]
let radius = 10
let sphere = new rhino.Sphere(center, radius)
console.log(sphere)
```

ファイルを作成したら Index.html ファイルをブラウザで開いてください。
開いたあと F12 を押すとブラウザのコンソールを表示できます。
問題なく sphere が作成されていた場合、コンソールに作成された sphere の情報が表示されています。

作成したコードの内容はこのような形で結果が所得されていることを確認していきます。

以下のようにすることがバウンディングボックスを取得することもできます。

```js
let brep = sphere.toBrep()
let bbox = brep.getBoundingBox()
console.log("Min Pt(" + bbox.min + ") Max Pt(" + bbox.max + ")")
```

ジオメトリに対して文字列を追加することもできます。

以下の例では作成した sphere の Brep に対して key: Test, value: Hello Rhino! の文字列を追加しており、
Hello Rhino! が出力されます。

```js
brep.setUserString("Test", "Hello Rhino!")
alert(brep.getUserString("Test"))
```

作成したデータは 3dm ファイルとしてダウンロードして取得することができます。

```js
rhino3dm().then((rhino) => {
  let sphere = new rhino.Sphere([1, 2, 3], 12)
  let doc = new rhino.File3dm()
  doc.objects().add(sphere, null)
  saveByteArray("sphere.3dm", doc.toByteArray())
})

function saveByteArray(fileName, byte) {
  let blob = new Blob([byte], { type: "application/octect-stream" })
  let link = document.createElement("a")
  link.href = window.URL.createObjectURL(blob)
  link.download = fileName
  link.click()
}
```

なお、上で設定した UserString は、ジオメトリに結びついていて、
Rhino の UI で確認するのは手間なので、
以下のように objectAttribute として設定すると、Rhino 上でも確認することができます。

```js
rhino3dm().then((rhino) => {
  let sphere = new rhino.Sphere([1, 2, 3], 12)
  let doc = new rhino.File3dm()

  let attribute = new rhino.ObjectAttribute()
  attribute.setUserString("Test", "Hello Rhino Attribute!")

  doc.objects().add(sphere, attribute)
  saveByteArray("sphere.3dm", doc.toByteArray())
})
```

以下のような形でレイヤーの設定をすることもできます。
ここでは 「CreatedLayer」という名前の赤いレイヤーを作成しています。

```js
rhino3dm().then((rhino) => {
  let doc = new rhino.File3dm()

  const layer = new rhino.Layer()
  layer.name = "CreatedLayer"
  layer.color = { r: 255, g: 0, b: 0, a: 255 }
  doc.layers().add(layer)

  let attribute = new rhino.ObjectAttribute()
  attribute.setUserString("Test", "Hello Rhino!")
  attribute.layerIndex = 0

  let sphere = new rhino.Sphere([1, 2, 3], 12)
  doc.objects().add(sphere, attribute)

  saveByteArray("sphere.3dm", doc.toByteArray())
})
```

Rhino3dm.js を使って Sphere を作成する方法は以上になります。

### ファイル全体

参考としてこれまで書いてきたコードの全体を以下に示します。

```html
<!DOCTYPE html>
<html>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/rhino3dm.min.js"></script>
    <script>
      rhino3dm().then((rhino) => {
        console.log("Loaded rhino3dm")

        // sphere  の作成
        let center = [0, 0, 0]
        let radius = 10
        let sphere = new rhino.Sphere(center, radius)
        console.log(sphere)

        // sphere を Brep 化してバウンディングボックスを所得する
        let brep = sphere.toBrep()
        let bbox = brep.getBoundingBox()
        console.log("Min Pt(" + bbox.min + ") Max Pt(" + bbox.max + ")")

        // UserString を brep に追加する
        brep.setUserString("Test", "Hello Rhino!")
        alert(brep.getUserString("Test"))

        // 3dm ファイル作成のため doc を作成
        let doc = new rhino.File3dm()

        // 属性情報を作成
        let attribute = new rhino.ObjectAttributes()
        attribute.setUserString("Test", "Hello Rhino!")
        doc.objects().add(brep, attribute)
        attribute.layerIndex = 0

        // Layer 情報を作成
        const layer = new rhino.Layer()
        layer.name = "CreatedLayer"
        layer.color = { r: 255, g: 0, b: 0, a: 255 }
        doc.layers().add(layer)

        // 作成したファイルをダウンロード
        saveByteArray("sphere.3dm", doc.toByteArray())
      })

      // ファイルをダウンロードするための処理の関数
      function saveByteArray(fileName, byte) {
        let blob = new Blob([byte], { type: "application/octect-stream" })
        let link = document.createElement("a")
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName
        link.click()
      }
    </script>
  </body>
</html>
```

## 既存のファイルを読み取る

次に既存のファイルを読み取る方法を紹介します。

ファイルを読み取る際も同様に始めます。
ファイルを作成する際との違いは、読み取りたいファイルのパスは定数なので
はじめに設定しておきます。

読み取りたいファイルは Index.html と同じフォルダに置いておきます。

```html
<!DOCTYPE html>
<html>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/rhino3dm.min.js"></script>
    <script>
      // 読み取りたいファイルを指定しておく
      const file = "sphere.3dm"

      rhino3dm().then(async (rhino) => {
        // ここにコードを入れていく
      })
    </script>
  </body>
</html>
```

まずファイルを読み込みます。
ブラウザから直接ローカルファイルへアクセスすることはセキュリティにより制限されているため
以下のような手順を踏んで、ローカルの 3dm ファイルを取り込みます。

```js
rhino3dm().then(async rhino => {
  let res = await fetch(file);
  let buffer = await res.arrayBuffer();
  let arr = new Uint8Array(buffer);
  let doc = rhino.File3dm.fromByteArray(arr);
}
```

ファイル内の情報は、モデルを作成したときと逆のことをすれば確認できます。

例えばジオメトリへの情報の取得は以下です。
上で作成した sphere は objects の 0 番目に Add したので、
0 番目にアクセスすることでそれに関する情報を取得することができます。

```js
let objects = doc.objects()
let obj = objects.get(0)
console.log(obj.geometry().getUserStrings())
console.log(obj.attributes().layerIndex)
console.log(obj.attributes().getUserString("Test"))
```

レイヤーも同様です。

```js
let layers = doc.layers()
let layer = layers.get(0)
console.log(layer.name)
console.log(layer.color)
```

### ファイル全体

参考にファイル全体を以下に示します。

```html
<!DOCTYPE html>
<html>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/rhino3dm.min.js"></script>
    <script>
      const file = "sphere.3dm"

      rhino3dm().then(async (rhino) => {
        console.log("Loaded rhino3dm")
        let res = await fetch(file)
        let buffer = await res.arrayBuffer()
        let arr = new Uint8Array(buffer)
        let doc = rhino.File3dm.fromByteArray(arr)

        let objects = doc.objects()
        let obj = objects.get(0)
        console.log(obj.geometry().getUserStrings())
        console.log(obj.attributes().layerIndex)
        console.log(obj.attributes().getUserString("Test"))

        let layers = doc.layers()
        let layer = layers.get(0)
        console.log(layer.name)
        console.log(layer.color)
      })
    </script>
  </body>
</html>
```

## まとめ

詳細にどのようなことができるかは
[公式ドキュメント](https://mcneel.github.io/rhino3dm/javascript/api/index.html)
を確認してみてください。
このドキュメント少し不親切で、どの型がどの型を継承しているかが書かれておらず、
各項目を見るとどこから継承されているかが書かれています。

- バウンディングボックスの取得は GeometryBase クラス
- 文字列の追加は CommonObject クラス

に書かれており、それらを Brep クラスは継承しているため使えます。
そういった継承関係は
[RhinoCommon](https://developer.rhino3d.com/api/RhinoCommon/html/R_Project_RhinoCommon.htm)
の SDK がそこそこ頭に入っていないとパッとわからないためで注意が必要です。

Rhino3dm.js でできること概ねこのようなことになります。

これ以上のこと、例えば「複数のカーブを使って Sweep する」のようなことできません。
Rhino で存在するタイプをそのまま作成、または既に作成されているもののデータを読み取ることしかできません。

一方で利点として、rhino3dm は Rhino がインストールされていなくても動作するので、
例えば RhinoCompute などで生成したデータを保存したり中身をチェックするときに使えます。

今回は簡単な Rhino3dm.js の使い方でいわゆる GUI をを伴ったブラウザのサイトになっていません。
次の記事では React を使った GUI を持った Rhino3dm.js の使い方を紹介します。
