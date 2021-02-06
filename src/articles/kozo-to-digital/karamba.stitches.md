---
title: "Stitches コンポーネントを使用したトラスの作成"
date: "2015-11-03"
draft: false
path: "/articles/karamba.stitches"
article-tags: ["Karamba3D", "Grasshopper", "構造とデジタル"]
---

今回は Karamba3D の Stitches コンポーネントの使用法についてです。

このコンポーネントは名前の通り"縫う"機能を持っています。設定した要素群同士をつなげます。

このコンポーネントの特徴は、Grasshopper のほかのコンポーネントを使用してラインを作成し、それを Karamba3D に取り込むという作業を必要としないところにあります。
そのため最適化等の複数のモデルから最適解を求める問題の場合、karamba3D に要素を取り込むという作業をなくすことができるため、計算コストの削減につなげることができます。

## モデルの作成

Stitches コンポーネントは ver1.0.9 でわかれていた「Simple Stitch」「Stacked Stitch」「Proxy Stitch」を 1 つにまとめたコンポーネントです。
基本的に要素間をつなげることは同じなので、ここでは最も基本的な Simple Stitch を使用します。

まずモデルを作成します。

ラチス材を Stitches コンポーネントを使用して作成するので、枠だけ作ります。
荷重は鉛直方向に 1g、境界条件は下弦材の端部をピンとしています。  
　ここで重要な点は、Line to Beam コンポーネントで梁要素を作成するときに BeamID を設定することです。Stitches コンポーネントは設定した ID の要素間を接続するものなので、しっかりと設定しましょう。ここでは下弦材の ID を「A」、上弦材の ID を「B」としています。

[![](http://1.bp.blogspot.com/-q3HqV_VKpeU/VjhIWfGDozI/AAAAAAAAA9E/IeGibE_fmAA/s640/%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)](http://1.bp.blogspot.com/-q3HqV_VKpeU/VjhIWfGDozI/AAAAAAAAA9E/IeGibE_fmAA/s1600/%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)

## Stitches を使ったラチスの作成

ではここからが本題です。

始めに Make Element Set（MKSet）コンポーネントを使用して要素セットを作成します。
セットは要素の ID で作成するので、先程作成した ID を使用して 2 つの要素セットを作成します。
セットにも ID が必要なのでここでは SET1、SET2 としています。

下準備ができたので、Stitches コンポーネントを使用します。
BeamSets には先程設定した２つの要素セットを入力します。
NConnect は、セット間を何本接続するか入力します。
ここでは 4 本としていますが、次の記事で行う最適化のパラメータの 1 つとしています。

Stitches コンポーネントだけでは要素を作成できません。次に Mapper コンポーネントを使用します。使用手順は以下です。

1. Assemble Model コンポーネントで作成したモデルを Model へ入力
1. Stitches コンポーネントの出力を Mappinng へ入力
1. Params には繋ぎ方のパラメータを入力

ここで Param へは Gene Pool コンポーネントを使用して入力しています。
パラメータはセットの中での要素の全長を 1 として、どこを始点、終点とし繋ぐかを設定します。
たとえば「0.5」「0.5」と入力すれば中央に要素が配置されます。
始点と終点を指定するため繋ぐ本数に対して 2 倍のパラメータの設定が必要です。

[![](http://1.bp.blogspot.com/-HwN-jr1hGS4/VjhLrzaPePI/AAAAAAAAA9Q/3kpiTW7L9u0/s640/stitches%25E3%2582%25B3%25E3%2583%25B3%25E3%2583%259D%25E3%2583%25BC%25E3%2583%258D%25E3%2583%25B3%25E3%2583%2588.JPG)](http://1.bp.blogspot.com/-HwN-jr1hGS4/VjhLrzaPePI/AAAAAAAAA9Q/3kpiTW7L9u0/s1600/stitches%25E3%2582%25B3%25E3%2583%25B3%25E3%2583%259D%25E3%2583%25BC%25E3%2583%258D%25E3%2583%25B3%25E3%2583%2588.JPG)

出来たモデルを Mapper コンポ―ネントの出力から、例えば Analyze コンポーネントに入力すれば解析ができます。

次の記事では、このモデルを使用して形状の最適化を行っていきます。

[![](http://1.bp.blogspot.com/-f3KyLlT6ryQ/VjhRi0a-KEI/AAAAAAAAA9g/I16B6uX8CJw/s640/%25E8%25A7%25A3%25E6%259E%2590.JPG)](http://1.bp.blogspot.com/-f3KyLlT6ryQ/VjhRi0a-KEI/AAAAAAAAA9g/I16B6uX8CJw/s1600/%25E8%25A7%25A3%25E6%259E%2590.JPG)
