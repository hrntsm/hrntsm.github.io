---
title: "RhinoInside Dynamo ができるかのチャレンジ"
date: "2021-03-04"
draft: false
path: "/articles/entry-rhinoinside-dynamo"
article-tags: ["RhinoInside", "Python", "Dynamo"]
---

[RhinoInside CPython 入門](./entry-rhinoinside-cpython) で Python で RhinoInside が使えたので、Dynamo でもつかってみます。

## やること

環境構築して、Dynamo の Python Script で RhinoInside を動かすことをやります。

## 環境構築

最初に Dynamo から RhinoInside を呼べるようにします。

RhinoInside.dll が必要なので、それを用意してください。冒頭で上げた記事と同様に pip すればたぶん問題ないです。

```python
pip install --user rhinoinside
```

## Dynamo でうごかす

動作させるのは CPython のときと同じようにポイントを作って、そこを通るラインを作り、そのラインの長さを出力させます。

なお、Dynamo の Python は IronPython です。
CPython ではないので注意してください。

### Dynamo 内でポイント作成

単純にコード内でポイントを作成しても面白くないので、以下のように Point.ByCoordinates を使って UI で作成したポイントを取り込むようにしてみました。

![Dynamo](https://hiron.dev/article-images/entry-rhinoinside-dynamo/dynamo.png)

### RhinoInside の読み込み

Dynamo の Python スクリプトから RhinoInside を呼び出したいので、以下支度しています。

```python
# RhinoInside 読み込み
clr.AddReference('RhinoInside')
import RhinoInside

# RhinoInside 初期化
RhinoInside.Resolver.Initialize()

# RhinoCommon 読み込み
clr.AddReference("RhinoCommon")
import Rhino

# 裏で Rhino 起動
__rhino_core = Rhino.Runtime.InProcess.RhinoCore()
```

### Rhino のジオメトリの作成

Dynamo のポイントを取得していて Rhino のポイントとは違うので、Rhino で読み込めるように座標の各成分を取得して Rhino の Point3d にしています。
インプットは変数名 IN でリストになっているので以下のような形です。

```python
pts = System.Collections.Generic.List[Rhino.Geometry.Point3d]()
pts.Add(Rhino.Geometry.Point3d(IN[0].X,IN[0].Y,IN[0].Z))
pts.Add(Rhino.Geometry.Point3d(IN[1].X,IN[1].Y,IN[1].Z))
pts.Add(Rhino.Geometry.Point3d(IN[2].X,IN[2].Y,IN[2].Z))
```

最後にカーブを作成して、その長さを OUT で出力しています。

```python
crv = Rhino.Geometry.Curve.CreateInterpolatedCurve(pts,3)
OUT = crv.GetLength()
```

### 結果の確認

上記の画像であるように、Watch のノードで結果を確認するとちゃんとカーブの長さが出力されています。

### ちなみに

以下の部分で Rhino を起動しているのですが、今のコードだとちゃんと判定していないので、スクリプトを実行するたびに毎回 Rhino を起動させているので重いしすぐ落ちます。

```python
__rhino_core = Rhino.Runtime.InProcess.RhinoCore()
```

ちゃんとやる場合は [ここ](https://github.com/mcneel/rhino.inside-cpython/blob/master/rhinoinside/__init__.py#L30) にあるように、__rhino_core が None かどうかをしっかり確認するコードにしましょう。

## コード全文

```python
# Python 標準ライブラリおよび DesignScript ライブラリをロード
import sys
import clr
clr.AddReference('ProtoGeometry')
from Autodesk.DesignScript.Geometry import *

# Rhino の読み込み関係
clr.AddReference('RhinoInside')
import RhinoInside
RhinoInside.Resolver.Initialize()
clr.AddReference("RhinoCommon")
import Rhino
__rhino_core = Rhino.Runtime.InProcess.RhinoCore()

import System

pts = System.Collections.Generic.List[Rhino.Geometry.Point3d]()
pts.Add(Rhino.Geometry.Point3d(IN[0].X,IN[0].Y,IN[0].Z))
pts.Add(Rhino.Geometry.Point3d(IN[1].X,IN[1].Y,IN[1].Z))
pts.Add(Rhino.Geometry.Point3d(IN[2].X,IN[2].Y,IN[2].Z))

crv = Rhino.Geometry.Curve.CreateInterpolatedCurve(pts,3)
OUT = crv.GetLength()
```
