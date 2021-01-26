---
title: "Dynamo でも Firefly"
date: "2015-09-26"
draft: false
path: "/articles/dynamofirefly"
article-tags: ["BIM", "Dynamo", "Firefly", "構造とデジタル"]
---

今回の記事では、これまで使用してきた Rhino + Grasshopper 　ではなく、Dynamo を使用します。
  
Dynamo とは、Grasshopper と同様のヴィジュアルプログラミングツールに分類されるものですが、開発しているところが違います。Dynamo の開発は、Autodesk 社が行っており、Revit 等の３ DBIM ソフトとダイレクトに関連付けてモデリングできるよう開発が進んでおり、現状では ver0.8.2 となっています。  

Rhino + Grasshopper はモデリングが基本のソフトであるので、建築に強いバックグランドをもつ Autodesk 社が開発する Dynamo は今後 Grasshopper 以上に「建築設計」分野にかかわってくると私は考えています。たとえば、[日本設計とオートデスク、3D と情報を融合した「Integrated BIM」を実用化](http://news.mynavi.jp/news/2015/08/06/493/) のように既に実用化を目指している会社も存在します。

そこで、今回は試しに、Dynamo を使用してみます。以前に記事で、[Arduino と Firefly で加速度を取得](../aruduino-firefly)として加速度の取得を行いました。加速度の取得は出来ましたが、対象物の剛性を同定するためには、固有周期だけでなく質量も必要です。  

実際の建物での計測を考えたとき、Grasshopper では質量は与えなくてはいけませんが、BIM であれば、質量に関する情報も含まれているはずです。ですので、簡単に建物の剛性を設計後にフィードバックできるようになるはずです。日本の BIM はまだその段階ではないので、そうはいきませんが、近い未来これが実現されるでしょう。

ということで、長々と私の感じている可能性について書きましたが、ここからが連携し加速度を測定する方法についてです。ですが、これは非常に簡単です。記事タイトルにあるように、Grasshopper で使用した Firefly の Dynamo 版が開発されているので、それを使用するだけです。
開発元が同じであるため、コンポーネント（Dynamo ではノードと呼びます。）も全く同じ形となっています。 
 
この記事を書いている 2015/09/26 現在で最新の Dynamo は 0.8.2 ですが、Firefly は 0.8.1 のみに対応なので注意が必要です。  

Firefly の取得方法は、まず Dynamo を起動します。Grasshopper と違い、Dynamo 内のパッケージボタンからパッケージを検索することで、Firefly をインストールします。

[![](http://1.bp.blogspot.com/-WiyXE-ofGhE/VgagGp6oiUI/AAAAAAAAA58/vQNbPb6P4Dc/s640/%25E5%258F%2596%25E5%25BE%2597%25E6%25B3%2595.JPG)](http://1.bp.blogspot.com/-WiyXE-ofGhE/VgagGp6oiUI/AAAAAAAAA58/vQNbPb6P4Dc/s1600/%25E5%258F%2596%25E5%25BE%2597%25E6%25B3%2595.JPG)

インストール後、ライブラリをみると、Grasshopper での firefly と同じようなものがあることが分かります。
そして、Grasshopper の時と同様に、配置します。

[![](http://3.bp.blogspot.com/-C7dHlHs4hn8/VgahjxBy7SI/AAAAAAAAA6I/p4q1v0zMTQc/s400/%25E3%2583%25A9%25E3%2582%25A4%25E3%2583%2596%25E3%2583%25A9%25E3%2583%25AA.JPG)](http://3.bp.blogspot.com/-C7dHlHs4hn8/VgahjxBy7SI/AAAAAAAAA6I/p4q1v0zMTQc/s1600/%25E3%2583%25A9%25E3%2582%25A4%25E3%2583%2596%25E3%2583%25A9%25E3%2583%25AA.JPG)

そして、同じように COM のポートを設定してあげればこのように加速度が取得できました。

[![](http://4.bp.blogspot.com/-EoSeRFizIYw/Vgai4sVklhI/AAAAAAAAA6Q/585jvO2cwvc/s320/%25E9%2585%258D%25E7%25BD%25AE.JPG)](http://4.bp.blogspot.com/-EoSeRFizIYw/Vgai4sVklhI/AAAAAAAAA6Q/585jvO2cwvc/s1600/%25E9%2585%258D%25E7%25BD%25AE.JPG)

Grasshopper のパネルコンポーネントに相当するものに、watch というノードが Dynamo にはあり、それにつなげることによって中身の確認ができますが、それ以外にも、上記画像中にあるように、配置したノードの下についている □ を押すことによって中身を表示することができます。  

連続して更新する timer コンポーネントに対応するものが、左にある下図の赤マルの部分です。初期は自動で実行されるようになっていますが、実行法を「手動」「自動」「周期的」の中から選択することができます。連続して更新するためには、周期的を選択して更新時間を Arduino で設定している時間とすることで、値を取得することができます。

[![](http://4.bp.blogspot.com/-ScC41IwAq0Q/VgakNS-gqsI/AAAAAAAAA6o/qbRLfbXWjGY/s320/%25E5%25AE%259F%25E8%25A1%258C%25E6%25B3%2595.JPG)](http://4.bp.blogspot.com/-ScC41IwAq0Q/VgakNS-gqsI/AAAAAAAAA6o/qbRLfbXWjGY/s1600/%25E5%25AE%259F%25E8%25A1%258C%25E6%25B3%2595.JPG)

これで加速度の取得ができました。いずれ BIM との連携、剛性同定にチャレンジしたいと思いますが、まだ先になりそうです。
