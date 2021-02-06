---
title: "Stitches と Octopus を使用した最適化"
date: "2015-11-10"
draft: false
path: "/articles/karamba.how.to.use.octopus"
article-tags: ["Karamba3D", "Grasshopper", "Octopus", "構造とデジタル"]
---

今回は [stitches コンポーネントを使用したトラスの作成](../karamba.stitches) の記事で作成したモデルに対して最適化を行います。
また、最適化にあたっては Grasshopper のプラグイン Octopus を使用します。

Octopus の作成者は、Karamba3D の製作チームであるオーストリアのエンジニアリング会社 ボリンジャー＋グローマンです。

[![](http://api.ning.com/files/oszb1oYwZCkXPkYOZKVfZ*6pJcAQDyg3gptJqne-XRdK01ZcaOftgnUqUpPYOMZRqdfOZ6-q4IgY6L9TBNxnKRfBgEUn42Vu/o3_.png?crop=1%3A1)](http://api.ning.com/files/oszb1oYwZCkXPkYOZKVfZ*6pJcAQDyg3gptJqne-XRdK01ZcaOftgnUqUpPYOMZRqdfOZ6-q4IgY6L9TBNxnKRfBgEUn42Vu/o3_.png?crop=1%3A1)

Octopus は Grasshopper の標準で搭載されている Galapagos ツールとの違いは、galapagos は単一の目的値の最小化・最大化問題を遺伝的アルゴリズムで解くのに対して、
Octopus は多目的遺伝的アルゴリズムのプラグインであるため、複数の目的値の最適化を同時に行うことができます。
またそれを可視化して、パレート解を確認することができます。

パレート解とは、多目的を最適化しているため、「A を最適にすると B はいまいち、B を最適化すると A はいまいち、A、B の二つがそこそこよい値」などアルゴリズムだけでは甲乙つけがたい複数の最適解が生まれます。
その解の集まりをパレート解群と言います。
多目的遺伝的アルゴリズムは、現状の最適化で非常に多く使われているので、検索すれば多くの手法、理論がでてくると思いますので、説明はこの程度にしておきます。

では実際に使用していきます。下図は Octopus コンポーネントを配置したものです。
外観や仕様は Galapagos ツールをもとに作成していると開発者のページにかいてあり、実際の使用法も似ています。  

変化させる値を G（Genome）と接続し、目的値を O（Octopus）と接続します。P、Ps を使用することで、より細かな設定ができますが、今回は使用しません。  

目的値は、トラスの構造性能の最大化と部材量の最小化を目的として、karamba の AnalyzeTh1 での Disp（最大変位）と G（自重）の二つの値を目的値として設定しています。パラメータは上弦材と下弦材を接続する部材の接続箇所（0.001 ～ 0.999 まで 0.001 刻み）としています。（※ここで接続箇所とは、部材全長を 1 としたときの相対的な位置）  

ラチス材の本数は、ここでは 6 本としています。では、最適化を行っていきます。

![](http://2.bp.blogspot.com/-tThMnAIt3u0/Vj9AFhpoUZI/AAAAAAAAA9w/JiNQ4svbahM/s1600/%25E6%25A6%2582%25E8%25A6%2581.JPG)

Galapagos コンポーネントと同様に、Octopas コンポーネントをダブルクリックすると下図のように最適化用の別の画面が表示されます。

ここで遺伝的アルゴリズムに使用する交差率や突然変異率、一世代の個体数、最大世帯数などのパラメータを設定します。
Octopus では、個体の評価に SEPA-2 と HypE が選択可能となっています。
ここでは SEPA-2 を使用します。

[![](http://1.bp.blogspot.com/-utVLemdbI6w/Vj9Bz7675AI/AAAAAAAAA98/TuHk_lxG3kc/s640/Octopus%25E8%25B5%25B7%25E5%258B%2595.JPG)](http://1.bp.blogspot.com/-utVLemdbI6w/Vj9Bz7675AI/AAAAAAAAA98/TuHk_lxG3kc/s1600/Octopus%25E8%25B5%25B7%25E5%258B%2595.JPG)

では最適化結果です。

50 世代やったすべての個体を図示したもの、パレート解周辺を示したものの順番で並べてあります。ある程度曲線状となったため、ここで最適化を止めています。

[![](http://4.bp.blogspot.com/-aF4IUv-9NSw/VkHrYQofXvI/AAAAAAAAA-M/ODyuMm2OOD0/s400/%25E3%2581%2599%25E3%2581%25B9%25E3%2581%25A6%25E3%2581%25AE%25E5%2580%258B%25E4%25BD%2593.JPG)](http://4.bp.blogspot.com/-aF4IUv-9NSw/VkHrYQofXvI/AAAAAAAAA-M/ODyuMm2OOD0/s1600/%25E3%2581%2599%25E3%2581%25B9%25E3%2581%25A6%25E3%2581%25AE%25E5%2580%258B%25E4%25BD%2593.JPG)

全個体

[![](http://2.bp.blogspot.com/-ZvfNF0nqZ9U/VkHrYRFcy8I/AAAAAAAAA-Q/vsayhtcfwvQ/s400/%25E3%2583%2591%25E3%2583%25AC%25E3%2583%25BC%25E3%2583%2588%25E3%2583%2595%25E3%2583%25AD%25E3%2583%25B3%25E3%2583%2588%25E4%25BB%2598%25E8%25BF%2591.JPG)](http://2.bp.blogspot.com/-ZvfNF0nqZ9U/VkHrYRFcy8I/AAAAAAAAA-Q/vsayhtcfwvQ/s1600/%25E3%2583%2591%25E3%2583%25AC%25E3%2583%25BC%25E3%2583%2588%25E3%2583%2595%25E3%2583%25AD%25E3%2583%25B3%25E3%2583%2588%25E4%25BB%2598%25E8%25BF%2591.JPG)

パレート解付近拡大

では、自重最小、変位最小、それぞれの中間位置の各結果を示します。解の位置は図中の黄色の丸でマークされているものです。  

今回解析モデルの設定上、端部は剛節としているため、自重が最小のものは部材長が最小、すなわちフィーレンディールトラスのような形状となっています。最適化の世代をさらに進めれば、完全なフィーレンディールとなるでしょう。  

変位が最小のもののから自重が最小のものの間では、変位が 5 倍、自重が 0.98 倍となっているので、単純な部材配置だけで変位を大きく減少させることができることが分かります。  

一方で、部材数は同じなので、自重はほとんど変化しないことはもともと分かっているので、ここでわざわざ多目的最適化する必要がなかったのでは？という点がありますが、今回は使用法ということで、パラメータの設定に失敗していることはあまり気にしないでください。すみません。

[![](http://2.bp.blogspot.com/-SANuwm6tf64/VkHsi-id20I/AAAAAAAAA-g/_YMnEhmSr-o/s640/%25E4%25B8%25AD%25E9%2596%2593.JPG)](http://2.bp.blogspot.com/-SANuwm6tf64/VkHsi-id20I/AAAAAAAAA-g/_YMnEhmSr-o/s1600/%25E4%25B8%25AD%25E9%2596%2593.JPG)

変位と自重が中間

[![](http://3.bp.blogspot.com/--u0Lb4miAko/VkHsi0AD7WI/AAAAAAAAA-k/KWEj6po3hfk/s640/%25E5%25A4%2589%25E4%25BD%258D%25E6%259C%2580%25E5%25A4%25A7.JPG)](http://3.bp.blogspot.com/--u0Lb4miAko/VkHsi0AD7WI/AAAAAAAAA-k/KWEj6po3hfk/s1600/%25E5%25A4%2589%25E4%25BD%258D%25E6%259C%2580%25E5%25A4%25A7.JPG)

自重が最小

[![](http://1.bp.blogspot.com/-gTIICVdv1ck/VkHsi38dbuI/AAAAAAAAA-o/oT1L_QwDSEA/s640/%25E6%259C%2580%25E3%2582%2582%25E9%2587%258D%25E3%2581%258F%25E3%2581%25A6%25E5%25A4%2589%25E4%25BD%258D%25E5%25B0%258F.JPG)](http://1.bp.blogspot.com/-gTIICVdv1ck/VkHsi38dbuI/AAAAAAAAA-o/oT1L_QwDSEA/s1600/%25E6%259C%2580%25E3%2582%2582%25E9%2587%258D%25E3%2581%258F%25E3%2581%25A6%25E5%25A4%2589%25E4%25BD%258D%25E5%25B0%258F.JPG)

変位が最小

遺伝的アルゴリズムは設定するパラメータ（変化させる値と、最適化上の突然変異等の双方のパラメータ）を少し変えただけで結果が結構変わる手法なので、次解析した際に同様の解にならないのが、このアルゴリズムの難しさでもあります。。  

ですが、こうやって簡単に変わることが手法の特徴だと思うと、最適化とは、一般の人が抱いているような本当の最適なものではなく、設計者、設定者、エンジニア側にとって設計意図を伝える上で最適な結果だと私は感じてしまいます。ですが私は設計者側なので、必要に応じて仕事でも機会があれば”最適化をした最適な建築”を進めていきたいですね。
