---
title: "BESOBeam（旧FFF）コンポーネントについて"
date: "2015-08-31"
draft: false
path: "/articles/besobeamfff"
article-tags: ["karamba", "grasshopper"]
---

karamba の BESOBeam（旧 FFF）コンポーネントの使用法について説明します。

このコンポーネントはもともとの名称 FFF（ForceFlowFinder）、つまりは力の流れを見るためのコンポーネントです。理論的には、Y.M.Xie と G.P.Steven によって研究された方法、Evolutionary structural optimization（ESO）（進化的構造最化）を使用しているようです。モデルに対して解析を行い、荷重の負担が少ない要素を削除し、再度解析を行い、荷重の分担を確認し、削除を行うというアルゴリズムによって構成されており、最終的にはすべての要素が高い比率で荷重を負担している形状となります。これはすなわち、主要な力の流れの可視化を行っているというようにも考えることができます。

Karamba のマニュアルを参照するとこのコンポーネントは、最適化手法というよりかは、力の流れをみて、力の流れの概略を理解することにより、形状への考察のために使った方がよいと書かれています。また、Karamba では、解析に際して要素を削除しているのではなく、剛性が非常に小さな部材とする SoftKill の手法が使用されています。  
　では実際に、BESOBeam コンポーネントを使用してみます。解析対象として、力の流れの可視化が分かりやすいよう、以下のような各節点同士をつないだ形状を考えます。

[![](http://1.bp.blogspot.com/-3VF5hNiGL7Q/VeMQ8YhYv8I/AAAAAAAAA08/UC8U1fC25J0/s640/%25E8%25A7%25A3%25E6%259E%2590%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB.JPG)](http://1.bp.blogspot.com/-3VF5hNiGL7Q/VeMQ8YhYv8I/AAAAAAAAA08/UC8U1fC25J0/s1600/%25E8%25A7%25A3%25E6%259E%2590%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB.JPG)

左端を固定、右端の中心に節点荷重をかける片持ち梁形状とします。  
　モデルの作成方法は、Rectangle コンポーネントで長方形を作成し、それを MeshSurface コンポーネントでメッシュ分割します。分割したメッシュに対して DeconstructMesh コンポーネントを使用し、メッシュを構成する各点の座標を取得します。

[![](http://1.bp.blogspot.com/-V-KnkUdbdvs/VeMRRTE1HCI/AAAAAAAAA1E/mYHYCbSvz7g/s640/%25E8%25A7%25A3%25E6%259E%2590%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)](http://1.bp.blogspot.com/-V-KnkUdbdvs/VeMRRTE1HCI/AAAAAAAAA1E/mYHYCbSvz7g/s1600/%25E8%25A7%25A3%25E6%259E%2590%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)

取得した点は、リストでひとまとめになっているので、ListItem コンポーネントを使用することで、各点を抽出します。ここで力技となってしまいますが、上図のように点がつながるように、一つずつ繋いでモデルを作成しました。

[![](http://3.bp.blogspot.com/-o2M6Rypu8oo/VeMTCzfd4hI/AAAAAAAAA1Q/nhcIi7ySpY4/s640/%25E7%2582%25B9%25E3%2581%25AE%25E6%258E%25A5%25E7%25B6%259A%25E6%25B3%2595.JPG)](http://3.bp.blogspot.com/-o2M6Rypu8oo/VeMTCzfd4hI/AAAAAAAAA1Q/nhcIi7ySpY4/s1600/%25E7%2582%25B9%25E3%2581%25AE%25E6%258E%25A5%25E7%25B6%259A%25E6%25B3%2595.JPG)

境界条件や荷重条件は、MD スライダーと EvaluateSurface コンポーネントを使用することにより、節点番号ではなく、位置に対して設定しています。

[![](http://3.bp.blogspot.com/-eLeKEwne0L0/VeMUKRPQ4gI/AAAAAAAAA1c/B-3MKK1_M-o/s640/%25E5%25A2%2583%25E7%2595%258C%25E6%259D%25A1%25E4%25BB%25B6%25E3%2581%25AE%25E8%25A8%25AD%25E5%25AE%259A.JPG)](http://3.bp.blogspot.com/-eLeKEwne0L0/VeMUKRPQ4gI/AAAAAAAAA1c/B-3MKK1_M-o/s1600/%25E5%25A2%2583%25E7%2595%258C%25E6%259D%25A1%25E4%25BB%25B6%25E3%2581%25AE%25E8%25A8%25AD%25E5%25AE%259A.JPG)

モデルの準備ができたので、BESOBeam コンポーネントを使用してみます。ここで非常に重要なことがあります。それは、grasshopper には、解析実行ボタンのようなものはないので、ワイヤーをコンポーネントに接続した瞬間解析を行ってしまうことです。BESOBeam コンポーネントのような収束計算を伴う、重い計算を行うコンポーネントを使用するときは、迂闊につなげるとフリーズしかねないので注意しましょう。  
　では、解析結果を確認してみます。BESOBeam コンポーネントでは、解析対象を設定した ElementId ごとや GroupId ごと、荷重ケースごとにすることができますが、今回は Target の部分のみ使用しています。これは、入力された初期のモデルの重さに対して何％になるまで部材を削減するかの目標値を設定するものです。100%からちゃんとした解を得ることができた 35%まで各結果を下に示します。表示は Uti ｌ ization としています。

[![](http://2.bp.blogspot.com/-jjNsDhkC4Mk/VeMY-ElL7aI/AAAAAAAAA18/TXGED12z4ho/s640/%25E7%25B5%2590%25E6%259E%259C1.JPG)](http://2.bp.blogspot.com/-jjNsDhkC4Mk/VeMY-ElL7aI/AAAAAAAAA18/TXGED12z4ho/s1600/%25E7%25B5%2590%25E6%259E%259C1.JPG)

[![](http://1.bp.blogspot.com/-SMnADzi5qjI/VeMY-I9py6I/AAAAAAAAA2Q/MWNMX-8V664/s640/%25E7%25B5%2590%25E6%259E%259C0.8.JPG)](http://1.bp.blogspot.com/-SMnADzi5qjI/VeMY-I9py6I/AAAAAAAAA2Q/MWNMX-8V664/s1600/%25E7%25B5%2590%25E6%259E%259C0.8.JPG)

[![](http://4.bp.blogspot.com/-9SfAahd0oWA/VeMY9ZUwvQI/AAAAAAAAA2I/T93BI1Eixdg/s640/%25E7%25B5%2590%25E6%259E%259C0.6.JPG)](http://4.bp.blogspot.com/-9SfAahd0oWA/VeMY9ZUwvQI/AAAAAAAAA2I/T93BI1Eixdg/s1600/%25E7%25B5%2590%25E6%259E%259C0.6.JPG)

[![](http://3.bp.blogspot.com/-wlWoYa8Apzk/VeMY9eeKIWI/AAAAAAAAA2E/5Q4ZcIilESU/s640/%25E7%25B5%2590%25E6%259E%259C0.4.JPG)](http://3.bp.blogspot.com/-wlWoYa8Apzk/VeMY9eeKIWI/AAAAAAAAA2E/5Q4ZcIilESU/s1600/%25E7%25B5%2590%25E6%259E%259C0.4.JPG)

[![](http://2.bp.blogspot.com/-76Mi6b205UA/VeMY9Ya-N-I/AAAAAAAAA2A/7wfAF2yLp4A/s640/%25E7%25B5%2590%25E6%259E%259C0.35.JPG)](http://2.bp.blogspot.com/-76Mi6b205UA/VeMY9Ya-N-I/AAAAAAAAA2A/7wfAF2yLp4A/s1600/%25E7%25B5%2590%25E6%259E%259C0.35.JPG)

35%の結果のものには、グラフを追加しました。収束計算の各ステップごとに重さがどのように変化しているか確認することができます。また、Hist や Is Active はステップごとに、どこの要素がアクティブなのかを出力しています。  
　最終結果では、初期のモデルに対して要素の使用率が高くなっているのが分かります。感覚的には曲げモーメントが卓越する形状なので、上下で対称な形状になるような気がしますが、解析結果はそのようになっていません。この手の最適化は主応力方向に部材が配置されるミッシェルトラス形状となるのが通常ですが今回なっていないので、モデル化の間違えがあるかも知れません。

どちらにしろこの形状やミッシェルトラスを現実で作成するのは難しいので、このコンポーネントはやはり力の流れをみて部材形状を考えるツールの一つとして使用するのが適しているのではないかと思います。
