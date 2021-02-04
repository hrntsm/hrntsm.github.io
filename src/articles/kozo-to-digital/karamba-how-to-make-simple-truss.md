---
title: "Karamba3D での簡単なトラスのモデルを作成"
date: "2016-01-16"
draft: false
path: "/articles/karamba-how-to-make-simple-truss"
article-tags: ["Karamba3D", "構造とデジタル"]
---

簡単なトラスのモデルの作成法を１から説明しています。  
　以下のようなモデルを作成し、その横に解析結果のコンター図を設置するまでを説明していきます。

[![](http://1.bp.blogspot.com/-qYg3pRR6y9U/VpnS5yYQM7I/AAAAAAAABIE/UsRNv5JZ_mI/s640/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2582%25B7%25E3%2583%25A7%25E3%2583%25B3%25E7%2594%25A8.JPG)](http://1.bp.blogspot.com/-qYg3pRR6y9U/VpnS5yYQM7I/AAAAAAAABIE/UsRNv5JZ_mI/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2582%25B7%25E3%2583%25A7%25E3%2583%25B3%25E7%2594%25A8.JPG)

Karamba3D を使用する前に、トラスのモデル化を行います。

はじめにトラスの上弦材、下弦材を作成します。
Construction Point コンポーネントでポイントを作成し、それを Move コンポーネントで X 方向に移動させます。この 2 点を Line コンポーネントに入力することで、まずは下弦材を作成します。
ポイントを移動させたことと同様に、Move コンポーネントで下弦材を Z 方向に移動させることで上弦材を作成します。

Grasshopper の画面をダブルクリックして、キーワード検索するときに単独の数字を入れるとその値を持った NumberSlider コンポーネントが作成されます。

Tips として、その際に「1.0<6.0<9.0」と入力すると値が 6.0、スライダーの範囲が 1.0 ～ 9.0 の NumberSlider コンポーネントを作成できます。

[![](http://2.bp.blogspot.com/-Tr6EGrFhCJg/VpnW84ltX3I/AAAAAAAABIQ/VBTKvB5Cb84/s640/%25E4%25B8%258A%25E4%25B8%258B%25E3%2583%25A9%25E3%2582%25A4%25E3%2583%25B3%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)](http://2.bp.blogspot.com/-Tr6EGrFhCJg/VpnW84ltX3I/AAAAAAAABIQ/VBTKvB5Cb84/s1600/%25E4%25B8%258A%25E4%25B8%258B%25E3%2583%25A9%25E3%2582%25A4%25E3%2583%25B3%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)

では次に斜材を作成していきます。

まず、斜材が取り付く位置にポイントを作成します。
Divide Curve コンポーネントを使用します。
入力する分割数は、トラス中央にまっすぐな部材を設置したいので、偶数(Even)を選択しています。

次に上弦材と下弦材でデータツリーを分けるために ExplodeTree コンポーネントでそれぞれを分けます。
DivideCurve コンポーネントにつなげたものが｛0;0｝に入ります。

斜材は右半分と左半分で斜材の向きが違うので、片側半分のポイントだけを取得するため、SplitList コンポーネントで、半分にリストを分解します。
半分の長さは、ListLength コンポーネントを使用して判断します。

ListLength はリストの長さを出力するので、SplitList コンポーネントの index へ入力する際に expression とし「(x-1)/2+1」を入力することで、入力値の半分＋１がコンポーネントに反映させます。
このことで、上弦材、下弦材の左半分のポイントを取得します。

[![](http://1.bp.blogspot.com/-C3E4c5B93nI/VpnjuV_z4vI/AAAAAAAABIg/0n2D7N7tWp8/s640/%25E5%25B7%25A6%25E5%258D%258A%25E5%2588%2586%25E3%2581%25AE%25E3%2583%259D%25E3%2582%25A4%25E3%2583%25B3%25E3%2583%2588%25E5%258F%2596%25E5%25BE%2597.JPG)](http://1.bp.blogspot.com/-C3E4c5B93nI/VpnjuV_z4vI/AAAAAAAABIg/0n2D7N7tWp8/s1600/%25E5%25B7%25A6%25E5%258D%258A%25E5%2588%2586%25E3%2581%25AE%25E3%2583%259D%25E3%2582%25A4%25E3%2583%25B3%25E3%2583%2588%25E5%258F%2596%25E5%25BE%2597.JPG)

抽出したポイントをそのまま Line コンポーネントにつなげると縦のラインができてしまうので、ShiftList コンポーネントで下弦材のリストのポイントを 1 つずらします。
この時 Wrap の Boolean を False にすることで、最後のポイントを除外できます。

下弦材のポイントをずらすことができたら、上弦材と下弦材のデータツリーの長さをそろえるため、ShortestList コンポーネントを使用して短いリストに長さを合わせます。

以上を Line コンポーネントにつなげることで、左側半分の斜材を作成できます。
同様にして右側半分も作成します。鉛直にまっすぐな部材は ExplodeTree コンポーネントからでてくるポイントをそのまま Line コンポーネントにつなげることで作成します。

[![](http://1.bp.blogspot.com/-GDpCkiwi7Xk/VpnOeA6xGI/AAAAAAAABI4/Gr2M86hQYl0/s640/%25E6%2596%259C%25E6%259D%2590%25E5%25AE%258C%25E6%2588%2590.JPG)](http://1.bp.blogspot.com/-GDpCkiwi7Xk/VpnpOeA6xGI/AAAAAAAABI4/Gr2M86hQYl0/s1600/%25E6%2596%259C%25E6%259D%2590%25E5%25AE%258C%25E6%2588%2590.JPG)

次に弦材の分割します。

上弦材、下弦材はそれぞれ 1 本のラインなので、斜材がとりつく部分で分割します。

分割には Shatter コンポーネントを使用します。

Curve へ上弦材と下弦材を入力し、Parameter には分割点となる DivideCurve コンポーネントで作成した点を入力します。
これで分割できますが、このままだと重複したラインができてしまいます。
そのため重複したラインを削除するため、RemoveDuplicateLines コンポーネントを使用します。
これによって重複分が削除され、そのことが Panal コンポーネントに表示されている内容からわります。

後の工程で上弦材と下弦材には、弦材としてひとまとめに断面を与える関係で Flatten を使用して RemoveDuplicateLines コンポーネントに入力しています。

これでトラスの作成が完了です。

[![](http://4.bp.blogspot.com/-V91AKnp8emo/VpnriO5_J4I/AAAAAAAABJE/aek5nfD2Lyo/s640/%25E5%25BC%25A6%25E6%259D%2590%25E5%2588%2586%25E5%2589%25B2.JPG)](http://4.bp.blogspot.com/-V91AKnp8emo/VpnriO5_J4I/AAAAAAAABJE/aek5nfD2Lyo/s1600/%25E5%25BC%25A6%25E6%259D%2590%25E5%2588%2586%25E5%2589%25B2.JPG)

では Karamba3D へ入力していきます。

作成したトラスを LineToBeam コンポーネントを使用して梁要素を作成します。
断面を分けるために各部位へ、弦材：Chord、斜材：Web、鉛直材：Post と BeamID を設定します。

[![](http://1.bp.blogspot.com/-eVoA9VCXltQ/VpnwHdl9nAI/AAAAAAAABJQ/UMhWNcWd1iI/s640/%25E8%25A6%2581%25E7%25B4%25A0%25E4%25BD%259C%25E6%2588%2590.JPG)](http://1.bp.blogspot.com/-eVoA9VCXltQ/VpnwHdl9nAI/AAAAAAAABJQ/UMhWNcWd1iI/s1600/%25E8%25A6%2581%25E7%25B4%25A0%25E4%25BD%259C%25E6%2588%2590.JPG)

境界条件は、Support コンポーネントを使用して右下と左下の端部にピン支点を設定します。

荷重は、Load コンポーネントを使用して -Z 方向に 1g、梁要素荷重として 1kN/m を設定します。

梁要素荷重（Type of Load が UniformLine）は、荷重方向が 3 パターンありますが、部材長さ分に全体座標系で指定された方向に荷重をかける global を選択しています。
他のものには要素座標系で指定された方向に荷重をかける local to element、水平投影された部材長さに対して全体座標系で荷重をかける global proj があります。

[![](http://4.bp.blogspot.com/-b6H8IGe7Wpo/Vpn0AhZ2dVI/AAAAAAAABJk/EBgm2n5k2B8/s640/%25E8%258D%25B7%25E9%2587%258D%25E3%2581%25A8%25E5%25A2%2583%25E7%2595%258C%25E6%259D%25A1%25E4%25BB%25B6.JPG)](http://4.bp.blogspot.com/-b6H8IGe7Wpo/Vpn0AhZ2dVI/AAAAAAAABJk/EBgm2n5k2B8/s1600/%25E8%258D%25B7%25E9%2587%258D%25E3%2581%25A8%25E5%25A2%2583%25E7%2595%258C%25E6%259D%25A1%25E4%25BB%25B6.JPG)

弦材の部材断面は CrossSction コンポーネントを使用して決定します。

ここでは Elems|Ids には弦材で指定した Chord を入力します。
Height には 30(cm)、Width には 4.0(cm)を入力します。
CrossSction には、H 型鋼を使用したいことから I を選択します。

このまますべての項目を入力すれば入力した断面をもつ断面の指定ができます。
ですが、ここでは CrossSctionMatcher コンポーネントを使用して、この条件に合致する断面を Karamba3D 側に選択させます。
選択させるためには、選択させる元となるデータが必要なので、CrossSectionRengeSelector コンポーネントを使用します。このコンポーネントで Japan、I を選択することで Karamba3D に始めから設定されている JIS-H が選択されます。
これらを CrossSctionMatcher コンポーネントに入力することで、条件に一番合致する形状が選択されます。

ほかの部材の断面は CrossSctionSelector コンポーネントを使用して設定します。
これは使用したい断面の名称が分かっているときに使用します。斜材を JIS-H の H100x100x6x8 にしたいとすれば、Elems|Ids に Web、Name|Ids に H100x100x6x8 を入力することで、断面が選択されます。

[![](http://4.bp.blogspot.com/-W6LM70DpB3I/Vpn6mB1P5UI/AAAAAAAABJ0/78grDCcojTg/s640/%25E6%2596%25AD%25E9%259D%25A2%25E3%2581%25AE%25E8%25A8%25AD%25E5%25AE%259A.JPG)](http://4.bp.blogspot.com/-W6LM70DpB3I/Vpn6mB1P5UI/AAAAAAAABJ0/78grDCcojTg/s1600/%25E6%2596%25AD%25E9%259D%25A2%25E3%2581%25AE%25E8%25A8%25AD%25E5%25AE%259A.JPG)

モデルの構成をわかりやすくするために、作成した各設定は、Element、Support、Load、CrossSction の各コンポーネントに一度まとめます。
その後、AssembleModel コンポーネントに接続します。Karamba3D はデータツリーが分かれていると別のモデルとして認識するので、Flatten を入れることでそれを防いでいます。

AssmbleModel コンポーネントで作成したモデルを Analyze1 に入力することで解析します。

ModelVeiw コンポーネントに入力することで、モデルの断面の名前や、解析結果でのモデルの変形の図示の倍率などが設定できます。
このコンポーネントで、荷重で設定した LoadCase のどれを図示するかを設定するので、解析結果をみるときは今図示しているものの荷重ケースが何に該当するか気をつけましょう。

解析結果は Analyze1 で出力されたモデル情報を BeamView コンポーネントに入力することで確認できます。
SectionForce の項目で応力の図示できます。

Legend C、Legend T を Legend コンポーネントに入力することで解析結果の判例をみることができます。
Legend コンポーネントの入力箇所の Rectangle で Set One Rectangle を選び、Rhino 上の長方形を作成することで Rhino 上にも判例を作成できます。

[![](http://1.bp.blogspot.com/-BZafiPM-LaY/VpoA7OkmQ1I/AAAAAAAABKE/SA6giMJ0KKI/s640/%25E5%25AE%258C%25E6%2588%2590.JPG)](http://1.bp.blogspot.com/-BZafiPM-LaY/VpoA7OkmQ1I/AAAAAAAABKE/SA6giMJ0KKI/s1600/%25E5%25AE%258C%25E6%2588%2590.JPG)

以上で、Karamba3D での簡単なトラスのモデルを作成は終りです。
