---
title: "Grasshopper を Python コードのように使おう"
date: "2021-12-08"
draft: false
path: "/articles/Grasshopper-as-a-code-with-Python"
article-tags: ["Grasshopper", "Python", "RhinoCompute"]
---

## はじめに

RhinoInside や Rhino3dm、RhinoCompute など コードから Rhino のデータ、機能を扱う機能は現在色々と提供されています。
言語としては C#、Python、Javascript の3つが公式でライブラリが提供されており、いろんな環境で使いやすいように整備されています。

とはいえ、現実問題、普段コードを書いていない人がこういった機能をうまく使うことは難しいです。

その中で、RhinoCompute は Grasshopper から使用するコンポーネントである Hops が公式から提供されており、コードを使うことなく使用することができる機能になっています。

Hops v0.8 のアップデートで Hops で読み込んだ Grasshopper をデータを動かす Python コードを自動生成して出力する機能が追加されました。
これを使うことで Python にあまり慣れていない人でも Grasshopper を コードにように扱うことで、Python で簡単に Rhino のデータを扱うことができるようになりました。

本記事ではそのやり方について紹介します。

## Hops から Python のコードを出力する

Hops の環境構築や使い方については以下の記事を参照してください。

[Grasshopper の Hops のはじめ方](./try-hops-component)

PackageManager で Hops をインストールする際には 0.8 以降のバージョンを指定するようにしてください。

ここでは例として以下のように足し算をするコンポーネントを作成します。

![Sum Component](https://hiron.dev/article-images/grasshopper-as-a-code-with-python/SumComponent.png)

Hops で読み込んで上の画像で上げた足し算をする機能を持った Hops コンポーネントが作成します。
値をインプットしたらコンポーネントを右クリックします。
クリックすると以下のようコンテキストメニューが出てくるのでに Export から Export python sample... を選びます。

![Export python code](https://hiron.dev/article-images/grasshopper-as-a-code-with-python/ExportPythonCode.png)

例えば sum.py と名前をつけてデスクトップに出力先を選択すると今回であれば以下のようなコードが生成されます。

```python
# pip install compute_rhino3d and rhino3dm
import compute_rhino3d.Util
import compute_rhino3d.Grasshopper as gh
import rhino3dm
import json

compute_rhino3d.Util.url = 'http://localhost:6500/'

# create DataTree for each input
input_trees = []
tree = gh.DataTree("A")
tree.Append([0], ["10.0"])
input_trees.append(tree)

tree = gh.DataTree("B")
tree.Append([0], ["5.0"])
input_trees.append(tree)

output = gh.EvaluateDefinition('Path/to/Desktop/sum.gh', input_trees)
errors = output['errors']
if errors:
    print('ERRORS')
    for error in errors:
        print(error)
warnings = output['warnings']
if warnings:
    print('WARNINGS')
    for warning in warnings:
        print(warning)

values = output['values']
for value in values:
    name = value['ParamName']
    inner_tree = value['InnerTree']
    print(name)
    for path in inner_tree:
        print(path)
        values_at_path = inner_tree[path]
        for value_at_path in values_at_path:
            data = value_at_path['data']
            if isinstance(data, str) and 'archive3dm' in data:
                obj = rhino3dm.CommonObject.Decode(json.loads(data))
                print(obj)
            else:
                print(data)
```

## Python で Grasshopper を動かしてみる

では出力されたコードを確認していきましょう。

### 環境の構築

生成されたコードを見ると最初の行に以下のように書かれています。

```python
# pip install compute_rhino3d and rhino3dm
import compute_rhino3d.Util
import compute_rhino3d.Grasshopper as gh
import rhino3dm
import json
```

pip を使って必要なライブラリをインストールします。
これによって import している各ライブラリが使えるようになります。

```python
pip install compute_rhino3d rhino3dm
```

### RhinoCompute のサーバーの指定

以下の箇所では、RhinoCompute のサーバーを指定しています。

```python
compute_rhino3d.Util.url = 'http://localhost:6500/'
```

Hops がインストールされている環境では、Grasshopper を起動すると裏で自動で RhinoCompute のサーバーが上記 URL で起動するので、基本的には特に操作する必要はありません。

### 入力の値を指定

以下の箇所では入力の値を指定しています。

```python
# create DataTree for each input
input_trees = []
tree = gh.DataTree("A")
tree.Append([0], ["10.0"])
input_trees.append(tree)

tree = gh.DataTree("B")
tree.Append([0], ["5.0"])
input_trees.append(tree)
```

`tree = gh.DataTree("A")` の箇所では Hops の A の入力の箇所の値を指定しています。
Export する時の画像を確認していただくと A には 10 の値が入力されていることが分かると思います。
ですので別の計算を行いたかったら、`tree.Append([0], ["10.0"])` の箇所の 10.0 の箇所を変えれば別の結果を得ることができます。

`tree = gh.DataTree("B")` の箇所も A と同様の内容です。

### 計算の実行

以下の箇所で grasshopper で計算を実行しています。

```python
output = gh.EvaluateDefinition('Path/to/Desktop/sum.gh', input_trees)
```

メソッドの名称からもわかるように grasshopper の ファイル（definition）を評価（Evaluate）しています。

output には計算の実行結果が入っています。

### 結果の処理

以下の箇所で結果の出力のための処理をしています。

```python
# error を取得
errors = output['errors']
if errors:
    print('ERRORS')
    for error in errors:
        print(error)

# warning を取得
warnings = output['warnings']
if warnings:
    print('WARNINGS')
    for warning in warnings:
        print(warning)

# 結果の値を取得
values = output['values']
for value in values:
    name = value['ParamName']
    inner_tree = value['InnerTree']
    # 出力の名前を出力（例えば RH_OUT:result）
    print(name)
    for path in inner_tree:
        # 結果のデータツリーでのパスを出力
        print(path)
        values_at_path = inner_tree[path]
        for value_at_path in values_at_path:
            data = value_at_path['data']
            # 結果を出力
            if isinstance(data, str) and 'archive3dm' in data:
                obj = rhino3dm.CommonObject.Decode(json.loads(data))
                print(obj)
            else:
                print(data)
```

### 計算を実行する

pip を使って必要なライブラリをインストールできていれば、以下を実行するればこれらのコードが流れます。

```python
python ./sum.py
```

問題なく処理が実行されると以下のように結果が返ってきます。

```
RH_OUT:result
{0}
15.0
```

今回は出力を RH_OUT:result しか作っていないので結果は一つですが、それぞれの結果の名前、データツリーでのパス、結果を出力することができます。


### 複数の結果を取得してみる

これでは Grasshopper でそのまま流すことと変わらないので、for文を使って複数の処理を流してみます。


```python
import compute_rhino3d.Util
import compute_rhino3d.Grasshopper as gh
import rhino3dm
import json

compute_rhino3d.Util.url = 'http://localhost:6500/'

# for 文を追加
for i in range(1,5):
    input_trees = []
    tree = gh.DataTree("A")

    # もともと 10.0 を入力していたが、
    # i を入力することで、for文中で値を変える
    tree.Append([0], [i])
    input_trees.append(tree)

    tree = gh.DataTree("B")
    tree.Append([0], ["5.0"])
    input_trees.append(tree)

    output = gh.EvaluateDefinition('./sum.gh', input_trees)

    # 以降変化なし
```

こちらを実行すると i が 1 から 4 に変化し 4 回計算が流れるので、以下のような結果が返ってきます。
これで少しコードで処理する利点が出たのではないでしょうか。

```
RH_OUT:result
{0}
6.0
RH_OUT:result
{0}
7.0
RH_OUT:result
{0}
8.0
RH_OUT:result
{0}
9.0
```

## まとめ

今回は単純な足し算だったので、Python でコードを書いたほうが早い内容でした。
ですが、基本的には Hops でできることはすべてコードから実行することができます。

例えば簡単な処理なんだけどスライダーをちょこちょこ動かして一つづつ保存のような作業をこの機能を使うと for 文化して一気に行うことができます。

また、この機能で特に面白いのは Python の豊富なライブラリの中に Grasshopper があたかもコードのような振る舞いで組み込まれるところにあります。

例えば Karamba3D を使った構造解析であれば、形状を決めるパラメータを入力にして、出力を検定比や最大変位などにし、その値を最小化する最適化問題を Python の最適化ライブラリを使って実行することができます。

Python でも構造解析のライブラリはありますが、基本的にコードではモデル作成が難しい場合がほとんどです。
その点、形状生成は Grasshopper が得意とするところなので、とても簡単にモデルの作成を行うことができます。

Grasshopper では galapagos のような特定のコンポーネントでしか最適化を行うことができませんが、この事によってより細かい設定が可能なライブラリを使った検討を行えるようになります。

RhinoCompute と Hops を使って Grasshopper データをコードのように扱うことで、コードと Grasshopper それぞれの得意な点を簡単に組み合わせてより効率的に検討を進めていきましょう。
