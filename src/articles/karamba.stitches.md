---
title: "stitchesコンポーネントを使用したトラスの作成"
date: "2015-11-03"
draft: false
path: "/articles/karamba.stitches"
article-tags: ["karamba", "grasshopper"]
---

今回は karamba の stitches コンポーネントの使用法についてです。このコンポーネントは名前の通り縫う機能を持っています。設定した要素群同士をつなげる機能を持っています。  
　このコンポーネントの特徴は、grasshopper のほかのコンポーネントを使用してラインを作成し、それを kramba に取り込むという作業を必要としないところにあります。そのため最適化等の複数のモデルから最適解を求める問題の場合、kramba に要素を取り込むという作業をなくすことができるため、計算コストの削減につなげることができます。

では使用法です。stitches コンポーネントは ver1.0.9 わかれていた「Simple Stitch」「Stacked Stitch」「Proxy 　 Stitch」を一つにまとめたコンポーネントになっています。基本的に要素間をつなげることは同じなので、ここでは最も基本的な Simple Stitch を使用します。  
　モデルを作成します。ラチス材を stitches コンポーネントを使用して作成するので、枠だけ作ります。荷重は鉛直方向に１ g、境界条件は下弦材の端部をピンとしています。  
　ここで重要な点は、Line to Beam コンポーネントで梁要素を作成するときに BeamID を設定することです。Stitches コンポーネントは設定した ID の要素間を接続するものなので、しっかりと設定しましょう。ここでは下弦材の ID を「A」、上弦材の ID を「B」としています。

[![](http://1.bp.blogspot.com/-q3HqV_VKpeU/VjhIWfGDozI/AAAAAAAAA9E/IeGibE_fmAA/s640/%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)](http://1.bp.blogspot.com/-q3HqV_VKpeU/VjhIWfGDozI/AAAAAAAAA9E/IeGibE_fmAA/s1600/%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)

ではここからが本題です。stitches ツールを使用してラチス材部分の作成を行います。始めに Make Element Set（MKSet）コンポーネントを使用して要素セットを作成します。セットは要素の ID で作成するので、先程作成した ID を使用して 2 つの要素セットを作成します。セットにも ID が必要なのでここでは SET １、SET ２としています。  
　下準備ができたので、stitches コンポーネントを使用します。BeamSets には先程設定した２つの要素セットを入力します。NConnect は、セット間を何本接続するか入力します。ここでは４本としていますが、次の記事で行う最適化でここをパラメータの一つとしています。  
　 stitches コンポーネントだけでは要素を作成することができません。Mapper コンポーネントを使用します。使用法は、Assemble Model コンポーネントで作成したモデルを Model へ、stitches コンポーネントの出力を Mappinng へ、Params には繋ぎ方のパラメータを入力します。  
　ここで Param へは Gene Pool コンポーネントを使用して入力しています。パラメータはセットの中での要素の全長を 1 として、どこを始点、終点とし繋ぐかを設定します。たとえば「0.5」「0.5」と入力すれば中央に要素が配置されます。始点と終点を指定するため繋ぐ本数に対して 2 倍のパラメータの設定が必要です。

[![](http://1.bp.blogspot.com/-HwN-jr1hGS4/VjhLrzaPePI/AAAAAAAAA9Q/3kpiTW7L9u0/s640/stitches%25E3%2582%25B3%25E3%2583%25B3%25E3%2583%259D%25E3%2583%25BC%25E3%2583%258D%25E3%2583%25B3%25E3%2583%2588.JPG)](http://1.bp.blogspot.com/-HwN-jr1hGS4/VjhLrzaPePI/AAAAAAAAA9Q/3kpiTW7L9u0/s1600/stitches%25E3%2582%25B3%25E3%2583%25B3%25E3%2583%259D%25E3%2583%25BC%25E3%2583%258D%25E3%2583%25B3%25E3%2583%2588.JPG)

出来たモデルを Mapper コンポ―ネントの出力から解析を行うコンポーネントに入力してあげれば解析を行うことができます。次の記事では、このモデルを使用して形状の最適化を行っていきたいと思います。

[![](http://1.bp.blogspot.com/-f3KyLlT6ryQ/VjhRi0a-KEI/AAAAAAAAA9g/I16B6uX8CJw/s640/%25E8%25A7%25A3%25E6%259E%2590.JPG)](http://1.bp.blogspot.com/-f3KyLlT6ryQ/VjhRi0a-KEI/AAAAAAAAA9g/I16B6uX8CJw/s1600/%25E8%25A7%25A3%25E6%259E%2590.JPG)