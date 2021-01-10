---
path: "/blog/2017/07/CS-IconSetting"
title: "コンポーネントへのアイコンのつけ方"
date: "17/07/27"
originalUrl: "https://rgkr-memo.blogspot.com/2017/07/CS-IconSetting.html"
slug: "/blog/2017/07/CS-IconSetting"
tags:
    - grasshopper
    - C#
---
　grasshopperのコンポーネントの中身を作ってきましたが、外観については変えてきませんでしたので、今回はアイコンをつけてみます。だんだんとちゃんとしてコンポーネントらしくなってきました。  
<div class="separator" style="clear: both; text-align: center;">[![](https://4.bp.blogspot.com/-aPmG3_6RXf0/WXkfDPyxdyI/AAAAAAAABak/bYEs1tZauGUd8FZyy4mR6Q4BDmEork-RQCLcBGAs/s320/%25E8%25A8%25AD%25E5%25AE%259A%25E3%2581%2597%25E3%2581%259F%25E7%2594%25BB%25E5%2583%258F.PNG)](https://4.bp.blogspot.com/-aPmG3_6RXf0/WXkfDPyxdyI/AAAAAAAABak/bYEs1tZauGUd8FZyy4mR6Q4BDmEork-RQCLcBGAs/s1600/%25E8%25A8%25AD%25E5%25AE%259A%25E3%2581%2597%25E3%2581%259F%25E7%2594%25BB%25E5%2583%258F.PNG)</div>  
<div>　まずアイコンとする画像を用意します。サイズは24x24pixels程度がちょうどいい大きさですが、ほかのサイズでもデータのサイズなりに表示されます。bitmapのデータであれば何でもよいので、WindowsのペイントでもPhotoshopのようなものでも作成できます。画像からアイコンを作るウェブのサービスをしてるサイトもありますので、画像自体は比較的簡単に作成できます。</div><div>　作成する際の注意点は、当たり前ですが背景は特に意図しなければ透明にしておかないと背景色も表示されることです。参考までに私が試しに作った不格好なアイコンを下に貼っておきます。背景色が出てしまい、かつ大きなサイズの画像を適当に縮小して作ったのでピンボケです。</div><div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-lv-u4LTghNk/WXaCZ_7fSSI/AAAAAAAABaQ/OtJwLHye7LAnRG2Awjpx0z5qPOP-cZr4QCLcBGAs/s200/DFdO19iUIAARrH4.jpg)](https://1.bp.blogspot.com/-lv-u4LTghNk/WXaCZ_7fSSI/AAAAAAAABaQ/OtJwLHye7LAnRG2Awjpx0z5qPOP-cZr4QCLcBGAs/s1600/DFdO19iUIAARrH4.jpg)</div><div>  
</div><div>　アイコンの作成は個人のセンスによるところが大きいので、ここでは簡単にいわゆるフリーのアイコンデータを使用して、設定法の説明をします。アイコンは[ICOOON-MONO](http://icooon-mono.com/)のデータを使用しました。  
　アイコンの設定はRegisterInputParamsやSolveInstanceなどのあるコンポーネントの設定をしているクラスの中に以下のコードを追加して、画像の場所を指定するだけです。画像の場所を指定する箇所は、Cの直下にあるhogehoge.icoを指定する形としてあるので、適宜変更してください。</div><div>  
</div>