---
path: "/blog/2019/03/ReleaseMise"
title: "Mise のリリースのお知らせ"
date: "19/03/01"
originalUrl: "https://rgkr-memo.blogspot.com/2019/03/ReleaseMise.html"
slug: "/blog/2019/03/ReleaseMise"
tags:
    - grasshopper
    - Mise
    - C#
---
　これまでに動画やこのblogで紹介してきた単純梁の計算を行うコンポーネントをFood4Rhinoでリリースしました。  
<div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-gIj-CYFqAFQ/XHkidPNLynI/AAAAAAAABl4/3coBfhoozEIzElqdYOp6q8WZd7UVJ_j-QCLcBGAs/s200/Icon.png)](https://1.bp.blogspot.com/-gIj-CYFqAFQ/XHkidPNLynI/AAAAAAAABl4/3coBfhoozEIzElqdYOp6q8WZd7UVJ_j-QCLcBGAs/s1600/Icon.png)</div>  
　作成したコンポーネント名は「Mise」です。基本的にはこれまで作成してきたものから、出力関係を強化したものになっています。ダウンロードは [food4rhino](https://www.food4rhino.com/app/mise) からどうぞ。  
　機能はこれまでに紹介してきた物と同様に以下のようになっています。  

対象  

*   片端ピン、他端ピンローラー支点の単純梁
*   片持ち梁<div>対応形状</div><div>

*   H型
*   L型
*   角型<div>対応荷重形状</div></div><div>

*   片持ち梁の先端集中荷重
*   単純梁の中央集中荷重
*   単純梁の台形等分布荷重
*   任意のモーメント入力<div>出力</div><div>

*   曲げモーメント分布の図化出力と数値の出力
*   部材断面の図化出力<div>  
</div></div><div>　曲げモーメントの計算、たわみの計算、告示の基準により断面検定を行うコンポーネントになっています。許容曲げモーメントは、座屈を考慮して計算するようになっています。</div></div><div>　これまで同様に [github](https://github.com/hiro-n-rgkr/BeamAnalysis) 側にもアップしているので、中身が気になる方はそちらを参照してください。  

2019/03/16追記 --------------  

 [food4rhino](https://www.food4rhino.com/app/mise) にVer 1.0.1 公開しました。主な変更点は以下です。  

・反力と荷重が表示されるようになりました。ただしモーメントの反力は出力していないので、片持ち梁は少し変に感じます。  
<div class="separator" style="clear: both; text-align: center;"></div><div class="separator" style="clear: both; text-align: center;"></div><div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-XkuLlhrQQrE/XIz-0KC56BI/AAAAAAAABnU/upmSY0U1inIcezl7bNErXSVFh9jmS5V3QCLcBGAs/s320/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)](https://1.bp.blogspot.com/-XkuLlhrQQrE/XIz-0KC56BI/AAAAAAAABnU/upmSY0U1inIcezl7bNErXSVFh9jmS5V3QCLcBGAs/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)</div>・BeamAnalysisのサブカテゴリ内にセパレータを表示させ、荷重の形に合わせてを整理しました。  
<div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-whMUgDnMlIE/XIzvEwk8R_I/AAAAAAAABmk/VMn7-hmvZO8R4Ydy9M1cwNVYbKGe3E4YgCLcBGAs/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)](https://1.bp.blogspot.com/-whMUgDnMlIE/XIzvEwk8R_I/AAAAAAAABmk/VMn7-hmvZO8R4Ydy9M1cwNVYbKGe3E4YgCLcBGAs/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)</div>・サブカテゴリ BeamAnalysis内 のコンポーネントの説明がすべて "Stress Analysis of the Beam"だったので、それぞれの内容に合わせて修正しました。  
<div class="separator" style="clear: both; text-align: center;">[![](https://4.bp.blogspot.com/-7S49Hyeu6eU/XIz-m1M92dI/AAAAAAAABnQ/3kainY9zZ3EtxD2HBSIMyUcRRr9bZiXsACLcBGAs/s320/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)](https://4.bp.blogspot.com/-7S49Hyeu6eU/XIz-m1M92dI/AAAAAAAABnQ/3kainY9zZ3EtxD2HBSIMyUcRRr9bZiXsACLcBGAs/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)</div>・以下の画像のようにコンポーネントになにも繋げておらず、必要な値が入力されていないときに出るエラーが出力されないようにしました。  
<div class="separator" style="clear: both; text-align: center;">[![](https://3.bp.blogspot.com/-rtbXRQKqTQc/XIzv_n2go6I/AAAAAAAABmw/AsXeyDCinWc-_-ELKW1lZ9O95j5TeFF7ACLcBGAs/s320/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)](https://3.bp.blogspot.com/-rtbXRQKqTQc/XIzv_n2go6I/AAAAAAAABmw/AsXeyDCinWc-_-ELKW1lZ9O95j5TeFF7ACLcBGAs/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)</div><div class="separator" style="clear: both; text-align: left;">・わかっているバグとして、再描画の設定をしていないため、いったん入力した後、梁の長さを変えるなどしても、反力、荷重、応力などを出力したものはrhino上での表示は変わらないことがあります。</div></div>