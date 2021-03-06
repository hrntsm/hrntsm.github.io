---
title: "grasshopperからアニメーションの出力法"
date: "2017-04-02"
draft: false
path: "/articles/grasshopper-HowToMakeAnimation"
article-tags: ["Grasshopper", "構造とデジタル"]
---

Number Slider を使用してパラスタした結果を動画に出力する方法について、久しぶりにやろうとしたら忘れていたので、[以前の記事](../Karamba-ConfirmEffectOfRingGarter) で作成したものを例にまとめます。

[![](https://3.bp.blogspot.com/-ddXarb_dHtU/WOCOAfUB21I/AAAAAAAABWg/ND5KRylVLxQssEotFO_wbIgw_9DnJxOCACLcB/s1600/avi.PNG)](https://3.bp.blogspot.com/-ddXarb_dHtU/WOCOAfUB21I/AAAAAAAABWg/ND5KRylVLxQssEotFO_wbIgw_9DnJxOCACLcB/s1600/avi.PNG)

では [以前の記事](../Karamba-ConfirmEffectOfRingGarter) で作成したアニメーションの保存法について説明していきます。
Number Slider を右クリックすると以下のように「Animate....」という選択肢がありますので選択します。

[![](https://2.bp.blogspot.com/-5WvXuLoRucM/WNBgiNVKFSI/AAAAAAAABVw/DpGt3s2zFjQ-cNQ-kymddm0mNVEmnNsdwCLcB/s320/%25E3%2582%25A2%25E3%2583%258B%25E3%2583%25A1%25E8%25A8%25AD%25E5%25AE%259A.PNG)](https://2.bp.blogspot.com/-5WvXuLoRucM/WNBgiNVKFSI/AAAAAAAABVw/DpGt3s2zFjQ-cNQ-kymddm0mNVEmnNsdwCLcB/s1600/%25E3%2582%25A2%25E3%2583%258B%25E3%2583%25A1%25E8%25A8%25AD%25E5%25AE%259A.PNG)

すると以下のようなウィンドウが出てきます。

最初の個所（C:\\Users と表示されている箇所）は出力先です。

次の Filename template は出力する画像ファイルの命名規則です。ここでは、3 桁（000 ～ 999）で名前を付けるようにしています。拡張子は .png となっていますが、ここを変えると名前上拡張子も変わります。例えば.jpg など。

次の Sorce and Resolution は Rhino 上のどの画面を出力するかと解像度、出力のフレーム数です。ここでは Perspective、解像度は 692 x 809、フレーム数は 100 枚としています。

フレーム数を増やすことでこの後の動画化でより滑らかな動画が作れます。

一番下の Frame tag は出力した画像の下にタグを表示する機能です。ここではオンにしていませんが、設定すると画像の下に帯状で、デフォルトではフレーム番号と変化させている number slider の値が出力されます。

[![](https://2.bp.blogspot.com/-8_N-akpaJEY/WNBhVJWnJJI/AAAAAAAABWA/OdW4qx-yz0oXCyHqGQW-7EWd_DfqIV5VwCLcB/s320/%25E3%2582%25A2%25E3%2583%258B%25E3%2583%25A1%25E5%2587%25BA%25E5%258A%259B%25E8%25A8%25AD%25E5%25AE%259A.PNG)](https://2.bp.blogspot.com/-8_N-akpaJEY/WNBhVJWnJJI/AAAAAAAABWA/OdW4qx-yz0oXCyHqGQW-7EWd_DfqIV5VwCLcB/s1600/%25E3%2582%25A2%25E3%2583%258B%25E3%2583%25A1%25E5%2587%25BA%25E5%258A%259B%25E8%25A8%25AD%25E5%25AE%259A.PNG)

設定が完了したら一番下の「OK」を押すことで指定した場所に画像ファイルが出力されます。このままでは、番号が振られた大量の画像データのままですので、これを一体化して、動画（avi ファイル）の作成を行います。

png ファイルをまとめて動画にするプログラムはいくつかありますが、ここではフリーである程度知名度もあることから「aviutl」を使用します。aviutl については、[公式](http://spring-fragrance.mints.ne.jp/aviutl/) や [wiki](https://ja.wikipedia.org/wiki/AviUtl) やそれ専門のブログ等多くあるので詳細はそちらを見てください。

では動画の作り方です。やり方はとても簡単です。対象の画像ファイルがあるフォルダ内の 000 番を選び開くだけです。

[![](https://4.bp.blogspot.com/-37pSOTf0X1Q/WOCY0y06yAI/AAAAAAAABWw/Cr_nHI0QUV8a9Qxyglyxs3YzwsYbo5GUACLcB/s320/aviutl.PNG)](https://4.bp.blogspot.com/-37pSOTf0X1Q/WOCY0y06yAI/AAAAAAAABWw/Cr_nHI0QUV8a9Qxyglyxs3YzwsYbo5GUACLcB/s1600/aviutl.PNG)

そうすることで aviutl 側で自動で連番で読み込み動画形式にしてくれます。読み込んだあと、ファイル－AVI 出力 を選択することで画像と同じフォルダに動画が保存されます。

[![](https://3.bp.blogspot.com/-VW_s6Q0F0QI/WOCZQffQ3BI/AAAAAAAABW0/zWUdnRlkpbs0EAi2Mra6RFSMbt-8n_8AgCLcB/s320/aviutl%25E5%2587%25BA%25E5%258A%259B.PNG)](https://3.bp.blogspot.com/-VW_s6Q0F0QI/WOCZQffQ3BI/AAAAAAAABW0/zWUdnRlkpbs0EAi2Mra6RFSMbt-8n_8AgCLcB/s1600/aviutl%25E5%2587%25BA%25E5%258A%259B.PNG)

動画の出力法は以上となります。
