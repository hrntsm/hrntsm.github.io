---
path: "/blog/2018/02/karamba-ConfirmationOfTheElementDivision"
title: "karambaの要素分割の出力法"
date: "18/02/22"
originalUrl: "https://rgkr-memo.blogspot.com/2018/02/karamba-ConfirmationOfTheElementDivision.html"
slug: "/blog/2018/02/karamba-ConfirmationOfTheElementDivision"
tags:
    - karamba
---
　karambaでの要素の分割について確認したので簡単ですがまとめます。  
<div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-7zFHVLMZU8I/Wo2DBhSQU1I/AAAAAAAABfs/lEK54qOkZj0FN670pBoIu1aGvq_VcLp0ACLcBGAs/s320/%25E3%2582%25BF%25E3%2582%25A4%25E3%2583%2588%25E3%2583%25AB.PNG)](https://1.bp.blogspot.com/-7zFHVLMZU8I/Wo2DBhSQU1I/AAAAAAAABfs/lEK54qOkZj0FN670pBoIu1aGvq_VcLp0ACLcBGAs/s1600/%25E3%2582%25BF%25E3%2582%25A4%25E3%2583%2588%25E3%2583%25AB.PNG)</div>  

　有限要素法は要素（メッシュ）の分割の塩梅で結果がかなり変わりますので、karambaはどのような形でメッシュ分割されているか簡単な確認法を紹介します。<div>　確認法はとても簡単で、下記にある GrasshopperでDisplay→Preview Mesh Edges をオンにするだけです。これをオンにした状態でkarambaのModelViewコンポーネント等の出力を確認するとメッシュ分割されたモデルの絵が出力されています。</div><div>　では実際のモデルで確認してみます。</div><div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-e4Y29hl_SF0/Wo2FEMnPzpI/AAAAAAAABf4/F3EEYPZru9sfJx8Rsj8pTbwxlN06vofKACLcBGAs/s640/%25E3%2583%25A1%25E3%2583%2583%25E3%2582%25B7%25E3%2583%25A5%25E7%25A2%25BA%25E8%25AA%258D%25E4%25BD%258D%25E7%25BD%25AE.PNG)](https://1.bp.blogspot.com/-e4Y29hl_SF0/Wo2FEMnPzpI/AAAAAAAABf4/F3EEYPZru9sfJx8Rsj8pTbwxlN06vofKACLcBGAs/s1600/%25E3%2583%25A1%25E3%2583%2583%25E3%2582%25B7%25E3%2583%25A5%25E7%25A2%25BA%25E8%25AA%258D%25E4%25BD%258D%25E7%25BD%25AE.PNG)</div><div>  
</div><div>　初めに、どのようなアルゴリズムかはわかりませんが、karambaは与えられたラインまたはメッシュをオートでメッシュ分割を行っています。特にshell要素については、karambaは三角形要素しか扱えないため四角形のメッシュを入力しても必ず三角形に分割されます。簡単なただの四角形のシェルで確認してみます。</div><div>  
</div><div class="separator" style="clear: both; text-align: center;">[![](https://4.bp.blogspot.com/-e020iYlqMIw/Wo2IjBxl9xI/AAAAAAAABgQ/Bkx70dL5FsIZvLT8RLXhX1K6hVwhCHR8ACLcBGAs/s640/%25E5%2588%2586%25E5%2589%25B2%25E7%25A2%25BA%25E8%25AA%258D.PNG)](https://4.bp.blogspot.com/-e020iYlqMIw/Wo2IjBxl9xI/AAAAAAAABgQ/Bkx70dL5FsIZvLT8RLXhX1K6hVwhCHR8ACLcBGAs/s1600/%25E5%2588%2586%25E5%2589%25B2%25E7%25A2%25BA%25E8%25AA%258D.PNG)</div><div class="separator" style="clear: both; text-align: center;"></div><div>  
</div><div>　要素と重複していてわかりづらいかもしれませんが、Node tagsで各頂点に節点が振られていて各頂点を節点とする要素であることがわかります。</div><div>　解析を行った結果のShellViewコンポーネントの表示を使用するとどの要素が使用されているかわかります。ここでは例として主応力のベクトル(Princ.Stress1-2)を出力していますが、各三角形の中心からベクトルが描かれており、出力された三角形で解析が行われていることが確認できます。</div><div>　梁要素も同様にBeamVeiwコンポーネントを使用して解析結果を確認するとRhino上に出力されているメッシュ単位で解析結果が表示されているのが確認できます。</div><div>　オートメッシュなのでたとえば冒頭の画像であげた孔あきの板などは孔の周りで非常に細かく分割されてしまします。また、プラグインのLunchBoxなどでそもそもの入力のメッシュを細かく切ってしまうとそれをKarambaがさらに分割していまい解析が重くなる可能性があるので注意が必要です。</div><div>　</div><div>　上で書きましたが分割のアルゴリズムについてはどのようにやっているかわからないので、また機会があれば調べてみます。</div>
## Comments

いつも参考にさせてもらってます。  
単純なスラブモデルで4辺それぞれ異なる境界条件を設定するのは簡単でしょうか。by _匿名noreply@blogger.com_ on 2020年1月23日