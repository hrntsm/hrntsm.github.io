---
title: "孔の空いたシェル要素の解析"
date: "2018-02-25"
draft: true
path: "/articles/karamba-ShellwithaHole"
article-tags: ["Karamba3D", "Grasshopper", "構造とデジタル"]
---


# いろいろいまいちなので 下書きにした

板に孔があくと応力がどうなるか気になっていたので、Karamba3D を使用して孔の開いたシェルの解析を試してみます。

結果としては安定した解が得られず、Karamba3D のシェル要素の注意点がわかりました。

[![](https://2.bp.blogspot.com/-6gh2ZRiadoI/Wo1_4STK5kI/AAAAAAAABfg/bWGlTtS7jEAvC3_rqvBRYv4Yc_XmrG8TwCLcBGAs/s640/%25E3%2582%25BF%25E3%2582%25A4%25E3%2583%2588%25E3%2583%25AB.PNG)](https://2.bp.blogspot.com/-6gh2ZRiadoI/Wo1_4STK5kI/AAAAAAAABfg/bWGlTtS7jEAvC3_rqvBRYv4Yc_XmrG8TwCLcBGAs/s1600/%25E3%2582%25BF%25E3%2582%25A4%25E3%2583%2588%25E3%2583%25AB.PNG)

## モデル化

モデル化について説明します。

曲げの影響が支配的になる梁として、10 倍の比率をとりスパン 8m、梁せい 800mm とします。
断面形状は H 型としシェル要素でモデル化します。

モデル化の概要は以下のようになっています。

はじめにウェブのモデル化をします。ただの板(Srf4Pt)と円のジオメトリ(Cir)を作成し、その境界から BoundarySurface コンポーネントを使用して孔の開いたサーフェスを作成します。

孔の位置は初めに Area コンポーネントで板の中央の点を参照しそこから Move コンポーネントと MD Slider コンポーネントを使用することで孔の位置を自由に動かせるようにしています。また、鋼管での梁貫通補強を考えて貫通孔の円を Extrude コンポーネントを使用して押し出してパイプをつけています。

[![](https://2.bp.blogspot.com/-3XGu1yJDEw0/WotZAoskwGI/AAAAAAAABe0/e7LLwQM9gN8jWegmaoNEeezxTBRq5cpPwCLcBGAs/s640/%25E3%2582%25A6%25E3%2582%25A7%25E3%2583%2596%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E5%258C%2596%25E9%2583%25A8%25E5%2588%2586.PNG)](https://2.bp.blogspot.com/-3XGu1yJDEw0/WotZAoskwGI/AAAAAAAABe0/e7LLwQM9gN8jWegmaoNEeezxTBRq5cpPwCLcBGAs/s1600/%25E3%2582%25A6%25E3%2582%25A7%25E3%2583%2596%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E5%258C%2596%25E9%2583%25A8%25E5%2588%2586.PNG)

次にフランジのモデル化についてです。

作成法はウェブのサーフェスを DeconstructionBrep コンポーネントを使用してフランジ位置のエッジのカーブを取得しフランジ幅分 Extrude コンポーネントで押し出して作成します。その後 BrepJoin コンポーネントで一体化し H 型の梁が完成です。

[![](https://1.bp.blogspot.com/-vNZr-v5SqxY/Woyq4ZSeQ1I/AAAAAAAABfQ/KTieP3GMLpUVa1Q-8UozqwAMOqtlNonWACLcBGAs/s640/%25E3%2583%2595%25E3%2583%25A9%25E3%2583%25B3%25E3%2582%25B8%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E5%258C%2596%25E9%2583%25A8%25E5%2588%2586.PNG)](https://1.bp.blogspot.com/-vNZr-v5SqxY/Woyq4ZSeQ1I/AAAAAAAABfQ/KTieP3GMLpUVa1Q-8UozqwAMOqtlNonWACLcBGAs/s1600/%25E3%2583%2595%25E3%2583%25A9%25E3%2583%25B3%25E3%2582%25B8%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E5%258C%2596%25E9%2583%25A8%25E5%2588%2586.PNG)

## Karamba3D で解析

モデル化ができましたので、ここから Karamba3D を使用して解析をしていきます。

境界条件は単純梁を想定しウェブの 4 隅に支点を設け、右下端のみをピン支点、他点をローラー支点とします。
荷重条件は以下を想定します。
- CASE1: 長期を想定して梁端中央の節点に 200kNm のモーメント荷重
- CASE2: 地震を想定し梁端中央の節点に逆対称モーメント 200kNm が発生するような荷重

Karamba3D がオートメッシュなこともあり、貫通径が変わるとメッシュの切れ方が変わり単純に結果は貫通孔に比例する形でないのは注意が必要です。特に丸なのどのメッシュの切り方が難しいものは誤差が大きくなることが今回の結果からもわかると思います。  

　今回補強なしの結果を示した理由もこれに起因し、補強部だけすごくメッシュが細かくなりうまく解析が回らない点が出てきていました。  
　結果として端部にあるほど、径が大きいほど変形や応力が大きくなるが出ると思いましたが、径が小さい方が変位が大きくなったりしてしまいました。  
　荷重が節点荷重だからなのか、フランジのみ大きく変形するなども見て取れます。

結論として、有限要素としての当たり前の帰結ですが、要素分割と荷重のかけ方に注意しましょう。
