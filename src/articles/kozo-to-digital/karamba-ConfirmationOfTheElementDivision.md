---
title: "Karamba3Dの要素分割の出力法"
date: "2018-02-22"
draft: false
path: "/articles/karamba-ConfirmationOfTheElementDivision"
article-tags: ["Karamba3D", "構造とデジタル"]
---

Karamba3D での要素の分割について確認したので簡単ですがまとめます。

[![](https://1.bp.blogspot.com/-7zFHVLMZU8I/Wo2DBhSQU1I/AAAAAAAABfs/lEK54qOkZj0FN670pBoIu1aGvq_VcLp0ACLcBGAs/s320/%25E3%2582%25BF%25E3%2582%25A4%25E3%2583%2588%25E3%2583%25AB.PNG)](https://1.bp.blogspot.com/-7zFHVLMZU8I/Wo2DBhSQU1I/AAAAAAAABfs/lEK54qOkZj0FN670pBoIu1aGvq_VcLp0ACLcBGAs/s1600/%25E3%2582%25BF%25E3%2582%25A4%25E3%2583%2588%25E3%2583%25AB.PNG)

有限要素法は要素（メッシュ）の分割の塩梅で結果がかなり変わりますので、Karamba3D はどのような形でメッシュ分割されているか簡単な確認法を紹介します。

確認法はとても簡単で、下記にある Grasshopper で Display→Preview Mesh Edges をオンにするだけです。これをオンにした状態で Karamba3D の ModelView コンポーネント等の出力を確認するとメッシュ分割されたモデルの絵が出力されています。

では実際のモデルで確認してみます。

[![](https://1.bp.blogspot.com/-e4Y29hl_SF0/Wo2FEMnPzpI/AAAAAAAABf4/F3EEYPZru9sfJx8Rsj8pTbwxlN06vofKACLcBGAs/s640/%25E3%2583%25A1%25E3%2583%2583%25E3%2582%25B7%25E3%2583%25A5%25E7%25A2%25BA%25E8%25AA%258D%25E4%25BD%258D%25E7%25BD%25AE.PNG)](https://1.bp.blogspot.com/-e4Y29hl_SF0/Wo2FEMnPzpI/AAAAAAAABf4/F3EEYPZru9sfJx8Rsj8pTbwxlN06vofKACLcBGAs/s1600/%25E3%2583%25A1%25E3%2583%2583%25E3%2582%25B7%25E3%2583%25A5%25E7%25A2%25BA%25E8%25AA%258D%25E4%25BD%258D%25E7%25BD%25AE.PNG)

初めに、どのようなアルゴリズムかはわかりませんが、Karamba3D は与えられたラインまたはメッシュをオートでメッシュ分割しています。

特に Shell 要素については、Karamba3D は三角形要素しか扱えないため四角形のメッシュを入力しても必ず三角形に分割されます。簡単なただの四角形のシェルで確認してみます。

[![](https://4.bp.blogspot.com/-e020iYlqMIw/Wo2IjBxl9xI/AAAAAAAABgQ/Bkx70dL5FsIZvLT8RLXhX1K6hVwhCHR8ACLcBGAs/s640/%25E5%2588%2586%25E5%2589%25B2%25E7%25A2%25BA%25E8%25AA%258D.PNG)](https://4.bp.blogspot.com/-e020iYlqMIw/Wo2IjBxl9xI/AAAAAAAABgQ/Bkx70dL5FsIZvLT8RLXhX1K6hVwhCHR8ACLcBGAs/s1600/%25E5%2588%2586%25E5%2589%25B2%25E7%25A2%25BA%25E8%25AA%258D.PNG)

要素と重複していてわかりづらいですが、Node tags で各頂点に節点が振られていて各頂点を節点とする要素であることがわかります。

解析した結果の ShellView コンポーネントの表示を使用するとどの要素が使用されているかわかります。
ここでは例として主応力のベクトル(Princ.Stress1-2)を出力していますが、各三角形の中心からベクトルが描かれており、出力された三角形で解析が行われていることが確認できます。

梁要素も同様に BeamVeiw コンポーネントを使用して解析結果を確認すると Rhino 上に出力されているメッシュ単位で解析結果が表示されているのが確認できます。

オートメッシュなのでたとえば冒頭の画像であげた孔あきの板などは孔の周りで非常に細かく分割されてしまします。

また、プラグインの LunchBox や WeaverBird などでそもそもの入力のメッシュを細かく切ってしまうと、そのメッシュを Karamba3D がさらに分割していまいます。
そのため解析コストが高くなることに注意が必要です。

上で書きましたが分割のアルゴリズムについてはどのようにやっているかわからないので、また機会があれば調べてみます。
