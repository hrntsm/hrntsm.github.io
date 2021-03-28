---
title: "Grasshopper の Hops のはじめ方"
date: "2021-04-03"
draft: false
path: "/articles/try-hops-component"
article-tags: ["Grasshopper", "Python"]
---

## はじめに

### Hops とは

Hops は Rhino7 から使用できるようになった新しい Grasshopper コンポーネントです。

### 必要な環境

1. Windows（内部で RhinoInside が動く部分があるため）
1. Rhino 7.4 以上
1. CPython 3.8 以上
1. Visual Studio Code(任意の Python を書きやすいテキストエディタ)

### 参考資料

前半の Hops を Grasshopper の Cluster のように使用をする方法は以下の公式の資料をもとにしています。

[Hops Component](https://developer.rhino3d.com/guides/grasshopper/hops-component/)

後半の Hops を使った CPython コンポーネント作成は以下の RhinocerosForums の以下のディスカッションや RhinoCompute のリポジトリをもとにしています。

- [Create CPython components using Hops in Grasshopper](https://discourse.mcneel.com/t/create-cpython-components-using-hops-in-grasshopper/120517?u=hiron)
- [compute.rhino3d/src/ghhops-server-py/](https://github.com/mcneel/compute.rhino3d/tree/master/src/ghhops-server-py)

## Hops コンポーネントのインストール方法

## Hops を使った CPython コンポーネントの作成

### GH Hops CPython とは

Grasshopper 内でも Python を使用できます。
ですが、IronPyrhon と呼ばれる .NET 環境向けの Python となっており、CPython に比べて自由度が低いです。

Hops を使った CPython のコンポーネント作成では CPython3.8 以上が対応バージョンとなっており、最新の Python 環境、ライブラリを使用できるようになります。

以下のような利点が挙げられています。

1. Numpy や Scipy などの CPython のライブラリを呼ぶことができます
1. TensorFlow のような最新の CPython を使用できます
1. 並列処理できて再利用可能に作ることができます
1. ブレークポイントを含むデバッグモードを使用できます
1. Visual Studio Code をフルでサポートしています

### 仕組みについて

内蔵されているデフォルトの HTTP サーバーを使って、Grasshopper のコンポーネントとして機能したり、Flask アプリのミドルウェアとして機能したりできます。
Hops の基本は HTTP で RhinoCompute とやり取りをして結果を返すものでした。
前の章では、Grasshopper の .gh ファイルそのものを使って RhinoCompute を読んでいましたが、ここでは Python から RhinoCompute をよんでその結果を Grasshopper に返すものになっています。

### 環境構築

Python の venv を使用して Python の環境を構築します。
環境を構築したいフォルダに移動して以下を実行し環境構築し、アクティブにします。

```python
python -m venv venv
.\venv\Script\activate
```

Python が複数インストールされている場合は、3.8 以上であること確認してください。以下でバージョンを確認できます。

```python
python -V
```

デフォルトの Python が想定しているバージョンではなかった場合、例えば以下のようバージョンを指定して venv を作成するとその環境は対象のバージョンになります。

```python
python3.9 -m venv venv
# 以降は同じ
```

必要なライブラリをインストールします。

```python
pip install ghhops-server flask
```

### コードをかく

実装例は以下です。

```python
from flask import Flask
import ghhops_server as hs
import rhino3dm

# register hops app as middleware
app = Flask(__name__)
hops = hs.Hops(app)

@hops.component(
    "/pointat",
    name="PointAt",
    description="Get point along curve",
    inputs=[
        hs.HopsCurve("Curve", "C", "Curve to evaluate"),
        hs.HopsNumber("t", "t", "Parameter on Curve to evaluate", default=2.0),
    ],
    outputs=[
        hs.HopsPoint("P", "P", "Point on curve at t")
    ],
)
def pointat(curve:rhino3dm.Curve, t:float):
    return curve.PointAt(t)


if __name__ == "__main__":
    app.run(debug=True)
```

@hops.component の箇所でコンポーネントの見た目を設定しています。
C# コンポーネントでいうところの GH_Component を継承したクラスのコンストラクタや RegisterInput/OutputParams に該当する部分です。

inputs や outputs の部分であるように入出力には型指定が必要なので、適切な型を選択するようにしてください。以下の型があります。
[実装](https://github.com/mcneel/compute.rhino3d/blob/master/src/ghhops-server-py/ghhops_server/params.py#L9) をみるとそれ以外の型はコメントアウトされているので、そのうち実装されるかもしれません。

- HopsBoolean
- HopsBrep
- HopsCurve
- HopsInteger
- HopsLine
- HopsMesh
- HopsNumber
- HopsPoint
- HopsString
- HopsSubD
- HopsSurface
- HopsVector

icon も指定できます。

