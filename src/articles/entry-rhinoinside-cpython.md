---
title: "RhinoInside CPython 入門"
date: "2021-02-20"
draft: false
path: "/articles/entry-rhinoinside-cpython"
article-tags: ["RhinoInside", "Python"]
---

CPython で RhinoInside を使いたくなったので、まず入門してみました。

## やること

環境構築して、CPython 内でジオメトリを作成して、3dm で保存することをやります。中身としては挙げられているサンプルに保存用の部分を追加したものになります。

## 環境構築

PYPI の [RhinoInside python](https://pypi.org/project/rhinoinside/) のサイトを見るとインストールの仕方が書いてあります。venv などの仮想環境を作らないのであれば以下でインストールできます。

```python
pip install --user rhinoinsite
```

以下の環境が必要なので、私は Python 3.7 を使いました。

- Rhino7
- Windows(64 ビット版)
- CPython(2.7, 3.5, 3.6, 3.7)

## なぜ CPython で RhinoInside が動くのか

pip で RhinoInside をインストールするとわかりますが、Pytonnet を使うことで .NET 向けに書かれた RhinoInside を使っています。

pythonnet については、[公式サイト](http://pythonnet.github.io/) やググって Qiita の記事などで調べることができます。
GitHub の README を見てみると、.NET Foundation からサポートを受けているので、体制にも安心感があります。

## カーブを作成してみる

PYPI のサイトに上げられているサンプルのコードを以下に引用します。
問題なく流れていると最後に print されているようにカーブの長さが出力されます。

```python
import rhinoinside
rhinoinside.load()
import System
import Rhino

# for now, you need to explicitly use floating point
# numbers in Point3d constructor
pts = System.Collections.Generic.List[Rhino.Geometry.Point3d]()
pts.Add(Rhino.Geometry.Point3d(0.0,0.0,0.0))
pts.Add(Rhino.Geometry.Point3d(1.0,0.0,0.0))
pts.Add(Rhino.Geometry.Point3d(1.5,2.0,0.0))

crv = Rhino.Geometry.Curve.CreateInterpolatedCurve(pts,3)
print (crv.GetLength())
```

Dynamo などで Python 使われている方はおなじみだと思いますが、.NET のものを呼ぶときは、例えば以下のように通常します。

```python
import clr
clr.AddReference('System.Windows.Forms')
```

RhinoInside Cpython では rhinoinside.load() を行っている箇所で上記を行っています。
そのため、import System の前にその一行が入っています。load メソッドが引数に Rhino のインストールフォルダを指定できるのは、中が clr.AddReference するためです。

実装は [mcneel/rhino.inside-cpython](https://github.com/mcneel/rhino.inside-cpython/blob/master/rhinoinside/__init__.py#L12) を参照してください。

## 書き出し用の設定を付ける

### JSON 化する

Rhino7 からジオメトリを JSON 化するメソッドが追加されたので、それを使ってジオメトリをテキストにしてみます。


```python
serial = Rhino.FileIO.SerializationOptions()
json = crv.ToJSON(serial)
```

ジオメトリに対して .ToJSON メソッドを使うことで JSON 化され以下のような出力になります。

```JSON
{
    "version":10000,
    "archive3dm":70,
    "opennurbs":-1912047423,
    "data":"+n8CAD4BAAAAAAAA+/8CABQAAAAAAAAAGRGvXlEL1BG//gAQgwEi8EoaeRf8/wIABgEAAAAAAAARAwAAAAAAAAAEAAAABQAAAAAAAAAAAAAAAAAAAAAA8D8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA8L8AAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPA/AAAAAAAAAEAAAAAAAAAAQAAAAAAAAABABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMMxpRI3rdQ/rKJrO4cCtb8AAAAAAAAAAJhq9B6FhfA/fVBbNJfW478AAAAAAAAAAGDebf2nyfk/qAoSqL8m9T8AAAAAAAAAAAAAAAAAAPg/AAAAAAAAAEAAAAAAAAAAAACFWuj3/38CgAAAAAAAAAAA"
}
```

FromJSON メソッドも存在するので、それを使うことでこの JSON からモデルを復元できます。

### DRACO 化する

上記の JSON 化と同じように Rhino7 からメッシュを Draco 化するメソッドも追加されているので試しに使ってみます。

そもそも Draco とは何かというと Google が開発したオープンソースの 3D データ圧縮フォーマットです。Google の発表によると高い圧縮率を実現できるそうです。詳細は以下の記事などを参照してください。

[劇的に3Dデータ容量を削減するDRACO圧縮のデータを自前描画する方法](https://qiita.com/kioku/items/bbb672d287792a987faa)

メッシュと点群を対象としたフォーマットなため、カーブをパイプ状のメッシュにし、それを Draco 化します。Draco はバイナリ形式なのでここでは Base64 の文字列にしています。

```python
mesh = Rhino.Geometry.Mesh.CreateFromCurvePipe(crv, 1.0, 6, 1, 1, True)
draco = Rhino.FileIO.DracoCompression.Compress(mesh).ToBase64String()
print(draco)
```

結果は以下のようになりました。

```
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
```

保存した 3dm では以下のようになっておりサイズは 7KB です。それが上記テキストなので、圧縮されている気がします。

![Mesh Image](https://hiron.dev/article-images/entry-rhinoinside-cpython/mesh.png)

### 3dm で保存する

以下のように WriteMultipleObjects メソッドを使うことで "OUTPUT_PATH" にカーブとメッシュの含まれた 3dm ファイルが出力されます。

```python
obj = System.Collections.Generic.List[Rhino.Geometry.GeometryBase]()
obj.Add(crv)
obj.Add(mesh)

Rhino.FileIO.File3dm.WriteMultipleObjects("OUTPUT_PATH", obj)
```


## コード全文

作成したコード全文です。

rhinoinside.load で私の環境ではうまく読み込めなかったので、パスを直接指定しています。

```python
import rhinoinside
rhinoinside.load("C:\\Program Files\\Rhino 7\\System")
import System
import Rhino

# for now, you need to explicitly use floating point
# numbers in Point3d constructor
pts = System.Collections.Generic.List[Rhino.Geometry.Point3d]()
pts.Add(Rhino.Geometry.Point3d(0.0,0.0,0.0))
pts.Add(Rhino.Geometry.Point3d(1.0,0.0,0.0))
pts.Add(Rhino.Geometry.Point3d(1.5,2.0,0.0))

crv = Rhino.Geometry.Curve.CreateInterpolatedCurve(pts,3)

# JSON 化
serial = Rhino.FileIO.SerializationOptions()
json = crv.ToJSON(serial)
print(json)

# Draco 化
mesh = Rhino.Geometry.Mesh.CreateFromCurvePipe(crv, 0.1, 10, 1, 1, True)
draco = Rhino.FileIO.DracoCompression.Compress(mesh).ToBase64String()
print(draco)

# 3dm で保存
obj = System.Collections.Generic.List[Rhino.Geometry.GeometryBase]()
obj.Add(crv)
obj.Add(mesh)

Rhino.FileIO.File3dm.WriteMultipleObjects("OUTPUT_PATH", obj)

```
