---
title: "Grasshopper の Hops のはじめ方"
date: "2021-04-03"
draft: false
path: "/articles/try-hops-component"
article-tags: ["Grasshopper", "Python", "RhinoCompute"]
---

## はじめに
### Hops とは

Hops は Rhino7 から使用できるようになった新しい Grasshopper コンポーネントです。

### 必要な環境

1. Windows
1. Rhino 7.4 以上
1. CPython 3.8 以上
1. Visual Studio Code(任意の Python を書きやすいテキストエディタ)

### 参考資料

前半の Hops を Grasshopper の Cluster のように使用をする方法は以下の公式の資料をもとにしています。

- [Hops Component](https://developer.rhino3d.com/guides/grasshopper/hops-component/)

後半の Hops を使った CPython コンポーネント作成は以下の RhinocerosForums の以下のディスカッションや RhinoCompute のリポジトリをもとにしています。

- [Create CPython components using Hops in Grasshopper](https://discourse.mcneel.com/t/create-cpython-components-using-hops-in-grasshopper/120517?u=hiron)
- [compute.rhino3d/src/ghhops-server-py/](https://github.com/mcneel/compute.rhino3d/tree/master/src/ghhops-server-py)

## Hops コンポーネントのインストール方法

ああああああああああああああああ

なお Hops の実装は以下の GitHub リポジトリで公開されているので、興味がある方はどうぞ。

- [compute.rhino3d/src/hops/](https://github.com/mcneel/compute.rhino3d/tree/master/src/hops)

## 外部の gh ファイルを使用する

基本的な使い方は冒頭でも上げた以下の公式のページを参照してください。

- [Hops Component](https://developer.rhino3d.com/guides/grasshopper/hops-component/)

ここではそこで触れられていない部分について追記しています。

### デフォルトの値の設定方法

公式のページでは GetNumber コンポーネントを使用したサンプルが載っていますが、デフォルトの値が指定されていません。

Hops で使うデフォルトの値は以下のようにコンポーネントに値を入力することでしてできます。

![Set default value](https://hiron.dev/article-images/try-hops-component/SetHopsDefaultVal.png)

### GrasshopperPlayer 向け以外のコンポーネントを使った入力値の設定

対象をグループ化して「RH_IN:」で始める名前をつけると読み込まれます。
例えば Bool の値を使いたいときは Boolean コンポーネントを使用しグループの名前をつけることで、isBake という名前の入力を作れます。

![Bool input](https://hiron.dev/article-images/try-hops-component/BoolInput.png)

### 並列計算数を増やすには

Hops コンポーネントを右クリックします。
Local Computes から「1More」を選ぶと 1 インスタンス、「6Pack」を選ぶと 6 インスタンスの RhinoCompute が追加されます。

つまり 複数起動された RhinoCompute が並列で走るという意味です。

![Parallel Rhino Compute](https://hiron.dev/article-images/try-hops-component/ParallelRhinoCompute.png)

### どこで RhinoCompute が起動して処理しているのか

バックで compute.geometry が動いていますがこれが RhinoCompute と呼ばれるものです。
タスクマネージャーなどで確認すると、実際に動いているのが確認できます。

なお、デフォルトで開かれるポートは 6500 です。

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

前の章では、Grasshopper の .gh ファイルそのものを使って RhinoCompute を読んでいましたが、ここでは Python から RhinoCompute や RhinoInside をよんでその結果を Grasshopper に返すものになっています。

### 環境構築

Python の venv を使用して Python の環境を構築します。
環境を構築したいフォルダに移動して以下を実行し環境構築し、アクティブにします。

```bash
python -m venv venv
.\venv\Script\activate
```

Python が複数インストールされている場合は、3.8 以上であること確認してください。以下でバージョンを確認できます。

```bash
python -V
```

デフォルトの Python が想定しているバージョンではなかった場合、例えば以下のようバージョンを指定して venv を作成するとその環境は対象のバージョンになります。

```bash
python3.9 -m venv venv
# 以降は同じ
```

必要なライブラリをインストールします。

```bath
pip install ghhops-server flask
```

### サンプルプログラム

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
