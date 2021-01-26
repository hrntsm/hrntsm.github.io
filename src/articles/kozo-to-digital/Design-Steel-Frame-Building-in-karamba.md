---
title: "Karamba3D で鉄骨造オフィスの断面最適化による設計にチャレンジ"
date: "2016-02-13"
draft: false
path: "/articles/Design-Steel-Frame-Building-in-karamba"
article-tags: ["Karamba3D", "StructureDesign", "構造とデジタル"]
---

これまでの記事で、Karamba3D の各コンポーネントに関して検証してきたので、今回はそれらをもとに簡単な鉄骨造オフィスの設計にチャレンジします。

では、対象とする建物は以下のようなものを考えます。

- RC に関する断面検定機能はないので、構造形式は鉄骨造  
　　- 鉄骨は断面検定をするといっても、座屈を考慮した fc、fb の低減はないので、設計というよりかは、構造形式が成り立っているかの確認、基本計画のようなものを考える。  
　　- Grasshopper の特徴をいかし、断面は最適化を使用して決定  
　　- 一般的な建物を考え、鉄骨造 7 階建、オフィスビル を想定  
　　- 平面形状は、12m x 24m 　となる長方形の形状  
　　- 短手は 1 スパン、長手は 4 スパンのラーメンとし、事務所空間には柱は落とさない  
　　- 階高 4m、7 階建て  
　　- 部材断面形状は、柱：冷間成型角型鋼管、梁：外法一定 H

[![](https://2.bp.blogspot.com/-n3NxJVYJPP8/Vrda8jp_1zI/AAAAAAAABMo/oCgjLGJL4Ik/s640/%25E3%2582%25B5%25E3%2583%25A0%25E3%2583%258D%25E3%2582%25A4%25E3%2583%25AB.JPG)](https://2.bp.blogspot.com/-n3NxJVYJPP8/Vrda8jp_1zI/AAAAAAAABMo/oCgjLGJL4Ik/s1600/%25E3%2582%25B5%25E3%2583%25A0%25E3%2583%258D%25E3%2582%25A4%25E3%2583%25AB.JPG)

Karamba3D を使用する前に、まずはビルのモデル化を行います。
方針としては、1F をモデル化して、それを Move コンポーネントで回数分だけコピーしていく形とします。  

1F は長手の梁を Line SDL コンポーネントで 1 本のラインとして作成し、それを Move コンポーネントで短手の長さ分だけ移動した先に複製します。  
短手の梁は、長手の梁を DivideCurve コンポーネントでスパン分だけ分割した点を作成し、それをつなげることで作成します。  
長手の梁は 1 本のラインでは Karamba3D に取り込む際、節点がうまく設けられないので、Shatter コンポーネントで分割したラインとしています。  

[![](https://1.bp.blogspot.com/-nKPuc3WbrLs/Vriy6cWaqkI/AAAAAAAABM4/IaBSf-TQtRA/s640/1%25E9%259A%258E%25E3%2581%25AE%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E5%258C%2596.JPG)](https://1.bp.blogspot.com/-nKPuc3WbrLs/Vriy6cWaqkI/AAAAAAAABM4/IaBSf-TQtRA/s1600/1%25E9%259A%258E%25E3%2581%25AE%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E5%258C%2596.JPG)

作成した 1 階のデータに対して階高の情報をを作成し、階数分だけ Move コンポ―ネントで複製していきます。ここでは X 方向梁の部分を下に示します。

[![](https://4.bp.blogspot.com/-xImt_mw8ju0/Vri1QKnRa4I/AAAAAAAABNA/gJvfimCGukU/s640/%25E9%259A%258E%25E6%2595%25B0%25E5%2588%2586%25E8%25A4%2587%25E8%25A3%25BD.JPG)](https://4.bp.blogspot.com/-xImt_mw8ju0/Vri1QKnRa4I/AAAAAAAABNA/gJvfimCGukU/s1600/%25E9%259A%258E%25E6%2595%25B0%25E5%2588%2586%25E8%25A4%2587%25E8%25A3%25BD.JPG)

作成した各階の柱・梁を karamba の LineToBeam コンポーネントに入力して、梁要素の作成完了です。鉄骨造を対象とするとしましたが、実際の鉄骨造でも基礎は RC 造になるので、1 階の梁だけは分けて梁要素にモデル化します。後に梁の ID ごとに断面を与えるので、BeamID に名前を付けておきます。X 方向の梁に beam_x、基礎梁に F_beam_X、Y 方向の梁に beam_Y、基礎梁に F_beam_Y、柱に column 　としています。

[![](https://4.bp.blogspot.com/-V97iA10rGd4/Vri29lmyFUI/AAAAAAAABNM/4_JrUDbpsbY/s640/%25E6%25A2%2581%25E8%25A6%2581%25E7%25B4%25A0%25E4%25BD%259C%25E6%2588%2590.JPG)](https://4.bp.blogspot.com/-V97iA10rGd4/Vri29lmyFUI/AAAAAAAABNM/4_JrUDbpsbY/s1600/%25E6%25A2%2581%25E8%25A6%2581%25E7%25B4%25A0%25E4%25BD%259C%25E6%2588%2590.JPG)

境界条件は露出柱脚を想定して、ピンとしています。1 階を作成するときに作ったポイントのデータを使用して、各節点に境界条件を与えるようにしています。

[![](https://2.bp.blogspot.com/-S2EVQ6ekFH8/Vr6qFCENVcI/AAAAAAAABNg/JNcTxnNO-xk/s640/%25E5%25A2%2583%25E7%2595%258C%25E6%259D%25A1%25E4%25BB%25B6.JPG)](https://2.bp.blogspot.com/-S2EVQ6ekFH8/Vr6qFCENVcI/AAAAAAAABNg/JNcTxnNO-xk/s1600/%25E5%25A2%2583%25E7%2595%258C%25E6%259D%25A1%25E4%25BB%25B6.JPG)

断面は後から最適化を行うので、ここでは形状の区分だけ与えます。断面の設定には３つのコンポーネントを使用しています。  
まず CrossSectionSelector コンポーネントで、BeamID と断面を関連づけます。一番上の例でいえば、column を Elem|Ids につないでいるところになります。  
　次に使用する断面ファミリを選択します。ここでは CrossSectionRengeSelector コンポーネントを使用します。日本で設計するので Country は Japan 、柱は角型鋼管なので Shape は \[\] 、その中から選べばいいので、Family は ---all--- としておきます。  
　二つができたらそれを CrossSectionMatcher コンポーネントにつなぐことで、名前の通り対象とする要素に、断面が与えられます。ここでは条件は指定していないので、もっとも小さい断面 BCP400x12 が与えられていると思います。　梁に対しても同様に行っています。  
　基礎梁は、RC を想定しているので、断面サイズを指定することで作成しています。CrossSectios コンポーネントを使用することで、各パラメータを入力することで断面を作成することができます。　  
　 Karamba3D の断面形状の中には、中実矩形断面がないので、ここでは I 型断面を指定し、ウェブ厚を厚くすることで矩形としています。これでいいのかと若干思いますが、RC は断面検定出来ないこと、基本計画としていることから、これでいいことにしています。

[![](https://1.bp.blogspot.com/-hTvKYR3AvCw/Vr6rJ25EdXI/AAAAAAAABNw/PfgZg2tSZvc/s640/%25E6%2596%25AD%25E9%259D%25A2%25E8%25A8%25AD%25E5%25AE%259A.JPG)](https://1.bp.blogspot.com/-hTvKYR3AvCw/Vr6rJ25EdXI/AAAAAAAABNw/PfgZg2tSZvc/s1600/%25E6%2596%25AD%25E9%259D%25A2%25E8%25A8%25AD%25E5%25AE%259A.JPG)

次に荷重の設定を行います。荷重ケースは、長期荷重、X 方向荷重、Y 方向荷重を設定します。まずは躯体の自重は、荷重タイプを Gravity として設定します。長期荷重は、-Z 方向に 1g、水平荷重は 0.2g として設定しています。  
　固定荷重と積載荷重は、部材の支配面積を計算して、その値を使用して荷重を設定しています。簡単に荷重をかけるために重心にかけることは行っておらず、節点に荷重をかけています。  
　対象とする面積は、Area コンポーネントを使用して算出し、3 本の梁によって床が分けられているので４で割り、一つの床は 4 つの節点から成り立っているのでさらに４で割ることでざっくりとした 1 節点あたりの支配面積を算出しています。  
　面積当たりの荷重は事務所を想定しているので、積載荷重には建築基準法施行令第 85 条に記載の事務所の値を使用して、骨組み用に 1800N/m2、地震用に 800N/m2 　を設定しています。固定荷重は、仕上げ、スラブの重さを含めてざっくりと 4000N/m2 を設定しています。  
　支配面積と単位面積当たりの荷重を算出したので、節点荷重として荷重を設定します。

[![](https://1.bp.blogspot.com/-nyVGh0TPg0g/Vr6yfPoPtEI/AAAAAAAABOQ/ezw3OCp1Vho/s640/%25E8%258D%25B7%25E9%2587%258D%25E3%2581%25AE%25E8%25A8%25AD%25E5%25AE%259A.JPG)](https://1.bp.blogspot.com/-nyVGh0TPg0g/Vr6yfPoPtEI/AAAAAAAABOQ/ezw3OCp1Vho/s1600/%25E8%258D%25B7%25E9%2587%258D%25E3%2581%25AE%25E8%25A8%25AD%25E5%25AE%259A.JPG)

次に材料の設定をします。基礎以外は鉄骨造なので、ここでは SN490B を設定しています。基礎は RC 想定なので、コンクリートを設定します。材料のデータは作成していないので、デフォルトのものを使用している関係で角型鋼管でも BCP 材ではなく、SN 材を選択しています。  
　コンクリート材料は、Karamba3D の作成元のボリンジャーグローマンがドイツの事務所だからなのか、ドイツ規格のコンクリート材料しかなかったので、ここでは C20/25 を選択しています。呼び強度で 20N/mm2 相当らしいですが、ここでは RC 部材は主眼としていないので、このままとします。

[![](https://4.bp.blogspot.com/-3dsaeURL5Fg/Vr63ABekoMI/AAAAAAAABOg/TfkOkLu12VA/s640/%25E6%259D%2590%25E6%2596%2599%25E3%2581%25AE%25E8%25A8%25AD%25E5%25AE%259A.JPG)](https://4.bp.blogspot.com/-3dsaeURL5Fg/Vr63ABekoMI/AAAAAAAABOg/TfkOkLu12VA/s1600/%25E6%259D%2590%25E6%2596%2599%25E3%2581%25AE%25E8%25A8%25AD%25E5%25AE%259A.JPG)

すべてのデータを AssembleModel コンポーネントを使用して一体化してモデル化の完了です。では解析を行います。解析には OptimizeCrossSection コンポーネントを使用します。このコンポーネントは karamba フリー版では使用できないので気を付けてください。  
　このコンポーネントは、設定した断面範囲内で、設定したクライテリアに合致する断面を最適化により設定してくれるものです。  
　ここでは断面は Japan を選択しておくことでその範囲内で断面を選択してくれます。また断面は上記断面の設定で選んだファミリの中から選ばれます。  
　設計クライテリアは最大の utilization と 最大変形を設定できます。  
　荷重の設定がざっくりであるので、utilization はかなり小さめですが、0.4 を設定しています。これはこの後に鋼材料量の検討を行う際にこの設定がちょうどよかったのでこの値にしているってこともあります。  
　変位の制限は、階高 4m で 7 階建てなので、層間変形角 1/200 を考えて　 4/200×6= 0.12m を設定しています。

[![](https://2.bp.blogspot.com/-4PWafkxy90M/Vr66TdTbQYI/AAAAAAAABO4/XIPTqVt6bTQ/s640/%25E8%25A7%25A3%25E6%259E%2590%25E5%25AE%259F%25E8%25A1%258C.JPG)](https://2.bp.blogspot.com/-4PWafkxy90M/Vr66TdTbQYI/AAAAAAAABO4/XIPTqVt6bTQ/s1600/%25E8%25A7%25A3%25E6%259E%2590%25E5%25AE%259F%25E8%25A1%258C.JPG)

では解析結果です。図示は水平荷重時の結果となります。  
　 Grasshopper 上の右上のコンターが変位、右下が utilization 分布になっています。最大変位は 9.36cm なので設定した変位のクライテリアの 12cm を下回っていますが、utilization は 76.3%となっており、設定の値を超えてしまっているため、どこか設定が間違っているのかもしれません。  
　応力分布をみるとおかしな点はないので、最適化の設定の問題のようですね。

[![](https://3.bp.blogspot.com/-HrsF5Zk1dU4/Vr693xXk6_I/AAAAAAAABPM/JhFuy_UfISE/s640/%25E8%25A7%25A3%25E6%259E%2590%25E7%25B5%2590%25E6%259E%259C.JPG)](https://3.bp.blogspot.com/-HrsF5Zk1dU4/Vr693xXk6_I/AAAAAAAABPM/JhFuy_UfISE/s1600/%25E8%25A7%25A3%25E6%259E%2590%25E7%25B5%2590%25E6%259E%259C.JPG)

変位等高線図

[![](https://3.bp.blogspot.com/-YMGq93qXQ5Q/Vr699p00uDI/AAAAAAAABPQ/PRyQtKBs_EU/s640/%25E6%259B%25B2%25E3%2581%2592%25E3%2583%25A2%25E3%2583%25BC%25E3%2583%25A1%25E3%2583%25B3%25E3%2583%2588.JPG)](https://3.bp.blogspot.com/-YMGq93qXQ5Q/Vr699p00uDI/AAAAAAAABPQ/PRyQtKBs_EU/s1600/%25E6%259B%25B2%25E3%2581%2592%25E3%2583%25A2%25E3%2583%25BC%25E3%2583%25A1%25E3%2583%25B3%25E3%2583%2588.JPG)

utilization と モーメント分布

結果で出ていた断面は以下のようになります。最適化は行われているようで、階や箇所ごとに断面が異なるようになっています。単純に応力や変位で決めているだけなので、柱梁の仕口は考えたものにするためにはより細かい設定が必要になります。

[![](https://3.bp.blogspot.com/-lw1YdIDQYw4/Vr7AD6TyizI/AAAAAAAABPg/ExICiWxKuLs/s640/%25E6%2596%25AD%25E9%259D%25A2.JPG)](https://3.bp.blogspot.com/-lw1YdIDQYw4/Vr7AD6TyizI/AAAAAAAABPg/ExICiWxKuLs/s1600/%25E6%2596%25AD%25E9%259D%25A2.JPG)

単純に断面を見ていても適切さがあまり分からないので、単位面積当たりの鋼材量を確認してみます。鋼材量は解析から出てく Mass の値から、基礎部材の自重 364.5t を引いた値に対して、延べ床面積で割ったもの値を確認しています。  
　結果は 112.7kg/m2 　となっていますので、少しすくない感じがありますが、基本計画であること、解析の NumberSlider コンポーネントを動かせばいくらでも変わることがから、それなりの鉄骨架構の検討が karamba でもできるということが分かったということでいいのではないでしょうか。

[![](https://2.bp.blogspot.com/-gI2baTvh2Qg/Vr7A_I3Ec6I/AAAAAAAABPs/O114xCaEXwQ/s640/%25E9%258B%25BC%25E6%259D%2590%25E9%2587%258F.JPG)](https://2.bp.blogspot.com/-gI2baTvh2Qg/Vr7A_I3Ec6I/AAAAAAAABPs/O114xCaEXwQ/s1600/%25E9%258B%25BC%25E6%259D%2590%25E9%2587%258F.JPG)

最適化ツールが充実しているとはいえ、クライテリアの設定や解の妥当性を判断する必要があるため、単純にソフトだけで設定して設計をすすめていくっていうことはやはり難しいですね。  
　簡単にパラメトリックに形状を変更できることをりようして、全体の傾向を大まかにつかむことに使用していくことが有効なのかもしれません。
