---
path: "/blog/2018/02/karamba-ShellwithaHole"
title: "孔の空いたシェル要素の解析"
date: "18/02/25"
originalUrl: "https://rgkr-memo.blogspot.com/2018/02/karamba-ShellwithaHole.html"
slug: "/blog/2018/02/karamba-ShellwithaHole"
tags:
    - karamba
    - grasshopper
---
　板に孔があくと応力がどうなるか気になっていたので、karambaを使用して孔の開いたシェルの解析を行いたいと思います。  
　結果としては安定した解が得られず、karambaのシェル要素の注意点がわかりました。  

<div class="separator" style="clear: both; text-align: center;">[![](https://2.bp.blogspot.com/-6gh2ZRiadoI/Wo1_4STK5kI/AAAAAAAABfg/bWGlTtS7jEAvC3_rqvBRYv4Yc_XmrG8TwCLcBGAs/s640/%25E3%2582%25BF%25E3%2582%25A4%25E3%2583%2588%25E3%2583%25AB.PNG)](https://2.bp.blogspot.com/-6gh2ZRiadoI/Wo1_4STK5kI/AAAAAAAABfg/bWGlTtS7jEAvC3_rqvBRYv4Yc_XmrG8TwCLcBGAs/s1600/%25E3%2582%25BF%25E3%2582%25A4%25E3%2583%2588%25E3%2583%25AB.PNG)</div><div class="separator" style="clear: both; text-align: center;"></div>　初めにモデル化について説明します。曲げの影響が支配的になる梁として、スパン8m、梁せい800mmとします。断面形状はH型としシェル要素でモデル化します。  
<div>　モデル化の概要は以下のようになっています。初めにウェブのモデル化をします。ただの板(Srf4Pt)と円のジオメトリ(Cir)を作成し、その境界からBoundarySurfaceコンポーネントを使用して孔の開いたサーフェスを作成します。  
　孔の位置は初めにAreaコンポーネントで板の中央の点を参照しそこからMoveコンポーネントとMD Sliderコンポーネントを使用することで孔の位置を自由に動かせるようにしています。また、鋼管での梁貫通補強を考えて貫通孔の円をExtrudeコンポーネントを使用して押し出してパイプをつけています。  
<div class="separator" style="clear: both; text-align: center;">[![](https://2.bp.blogspot.com/-3XGu1yJDEw0/WotZAoskwGI/AAAAAAAABe0/e7LLwQM9gN8jWegmaoNEeezxTBRq5cpPwCLcBGAs/s640/%25E3%2582%25A6%25E3%2582%25A7%25E3%2583%2596%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E5%258C%2596%25E9%2583%25A8%25E5%2588%2586.PNG)](https://2.bp.blogspot.com/-3XGu1yJDEw0/WotZAoskwGI/AAAAAAAABe0/e7LLwQM9gN8jWegmaoNEeezxTBRq5cpPwCLcBGAs/s1600/%25E3%2582%25A6%25E3%2582%25A7%25E3%2583%2596%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E5%258C%2596%25E9%2583%25A8%25E5%2588%2586.PNG)</div>  
　次にフランジのモデル化についてです。作成法はウェブのサーフェスをDeconstructionBrepコンポーネントを使用してフランジ位置のエッジのカーブを取得しフランジ幅分Extrudeコンポーネントで押し出して作成します。その後BrepJoinコンポーネントで一体化しH型の梁が完成です。  
<div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-vNZr-v5SqxY/Woyq4ZSeQ1I/AAAAAAAABfQ/KTieP3GMLpUVa1Q-8UozqwAMOqtlNonWACLcBGAs/s640/%25E3%2583%2595%25E3%2583%25A9%25E3%2583%25B3%25E3%2582%25B8%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E5%258C%2596%25E9%2583%25A8%25E5%2588%2586.PNG)](https://1.bp.blogspot.com/-vNZr-v5SqxY/Woyq4ZSeQ1I/AAAAAAAABfQ/KTieP3GMLpUVa1Q-8UozqwAMOqtlNonWACLcBGAs/s1600/%25E3%2583%2595%25E3%2583%25A9%25E3%2583%25B3%25E3%2582%25B8%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E5%258C%2596%25E9%2583%25A8%25E5%2588%2586.PNG)</div><div class="separator" style="clear: both; text-align: center;"></div>  
<div class="separator" style="clear: both; text-align: center;"></div>モデル化ができましたので、ここからkarambaを使用して解析をしていきます。境界条件は単純梁を想定しウェブの4隅に支点を設け、右下端のみをピン支点、他点をローラー支点とします。荷重条件はケース1:長期を想定して梁端中央の節点に200kNmのモーメント荷重、ケース2:地震を想定し梁端中央の節点に逆対称モーメント200kNmが発生するよう荷重をかけています。  
　いくつか試しに解析し結果を以下に示します。すべて補強なしでの結果です。  
モデルはフォンミーゼス応力のコンターを出力、上部のカラーバーは左からフォンミーゼス応力、変位、使用率（utilization）です。  
パラメータは貫通径で梁成の1/1.5～1/5まで変化させています。  

■パターン1  
梁端から1/3の位置  
<div class="separator" style="clear: both; text-align: center;"><iframe width="320" height="266" class="YOUTUBE-iframe-video" data-thumbnail-src="https://i9.ytimg.com/vi/XjejNp__TRA/default.jpg?sqp=CNywytQF&rs=AOn4CLDoqtMtt1sX-0piGKm54F1_y_fT6g" src="https://www.youtube.com/embed/XjejNp__TRA?feature=player_embedded" frameborder="0" allowfullscreen=""></iframe></div><div class="separator" style="clear: both; text-align: center;">ケース1</div><div class="separator" style="clear: both; text-align: center;">  
</div><div class="separator" style="clear: both; text-align: center;"><iframe width="320" height="266" class="YOUTUBE-iframe-video" data-thumbnail-src="https://i9.ytimg.com/vi/WHGdUC6YUds/default.jpg?sqp=CIizytQF&rs=AOn4CLDN0acut0I_7Mr5mdTLJfaKwsqeUA" src="https://www.youtube.com/embed/WHGdUC6YUds?feature=player_embedded" frameborder="0" allowfullscreen=""></iframe></div><div class="separator" style="clear: both; text-align: center;">ケース2</div>■パターン2  
梁端から梁せいの1/2の位置  
<div class="separator" style="clear: both; text-align: center;"><iframe width="320" height="266" class="YOUTUBE-iframe-video" data-thumbnail-src="https://i9.ytimg.com/vi/RfnF3vLXqms/default.jpg?sqp=CISsytQF&rs=AOn4CLCbcwUkclAr8pxezuTDRF_UuuiZbw" src="https://www.youtube.com/embed/RfnF3vLXqms?feature=player_embedded" frameborder="0" allowfullscreen=""></iframe></div><div class="separator" style="clear: both; text-align: center;">ケース1</div><div class="separator" style="clear: both; text-align: center;">  
</div><div class="separator" style="clear: both; text-align: center;"><iframe width="320" height="266" class="YOUTUBE-iframe-video" data-thumbnail-src="https://i9.ytimg.com/vi/yC3tFSHsiFM/default.jpg?sqp=CLCuytQF&rs=AOn4CLBErWpDy0CvFl85kmt7CVrFPtcuHw" src="https://www.youtube.com/embed/yC3tFSHsiFM?feature=player_embedded" frameborder="0" allowfullscreen=""></iframe></div><div class="separator" style="clear: both; text-align: center;">ケース2</div>■パターン3  
梁端から梁せいの1/2の位置で孔芯間800mm  
<div class="separator" style="clear: both; text-align: center;"><iframe width="320" height="266" class="YOUTUBE-iframe-video" data-thumbnail-src="https://i9.ytimg.com/vi/sUnCsj6tpUc/default.jpg?sqp=CNipytQF&rs=AOn4CLAiL-HTk4ZWZHjdbq5-KVO3oVps5w" src="https://www.youtube.com/embed/sUnCsj6tpUc?feature=player_embedded" frameborder="0" allowfullscreen=""></iframe></div><div class="separator" style="clear: both; text-align: center;">ケース1</div><div class="separator" style="clear: both; text-align: center;">  
</div><div class="separator" style="clear: both; text-align: center;"><iframe width="320" height="266" class="YOUTUBE-iframe-video" data-thumbnail-src="https://i9.ytimg.com/vi/Ddks1jkrjVQ/default.jpg?sqp=CISsytQF&rs=AOn4CLDhOJMl7szS8zfWFRGAqfi8I50omw" src="https://www.youtube.com/embed/Ddks1jkrjVQ?feature=player_embedded" frameborder="0" allowfullscreen=""></iframe></div><div class="separator" style="clear: both; text-align: center;">ケース2</div><div class="separator" style="clear: both; text-align: center;">  
</div>karambaがオートメッシュなこともあり、貫通径が変わるとメッシュの切れ方が変わり単純に結果は貫通孔に比例する形でないのは注意が必要です。特に丸なのどのメッシュの切り方が難しいものは誤差が大きくなることが今回の結果からもわかると思います。  
　今回補強なしの結果を示した理由もこれに起因し、補強部だけすごくメッシュが細かくなりうまく解析が回らない点が出てきていました。  
　結果として端部にあるほど、径が大きいほど変形や応力が大きくなるが出ると思いましたが、径が小さい方が変位が大きくなったりしてしまいました。  
　荷重が節点荷重だからなのか、フランジのみ大きく変形するなども見て取れます。  

　結論として、有限要素としての当たり前の帰結ですが、要素分割と荷重のかけ方に注意しましょう。  

　作成したgrassshopperのデータはデータ置き場に置いておきますので、興味のある方はいろんなパターンで試してみてください。</div>