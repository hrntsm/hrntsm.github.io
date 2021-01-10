---
title: "DynamoとReact Structures を使った単純梁の解析"
date: "2016-01-24"
draft: false
path: "/articles/analyze-beam-using-dynamo-and-react-structures"
article-tags: ["BIM", "Dynamo", "ReactStructures"]
---

Autodesk の Dynamo BIM と最近開発されている ReactStructures を使用して単純梁のモデル化から解析までの一連の解説を行います。  
　[ReactStructures](http://react.autodesk.com/)のホームページをみると、

「_構造解析について考え直すときなんじゃない？（Time to Rethink Structural analysis?）_」

と題されており、今後開発に期待しています。

[![](https://2.bp.blogspot.com/-FrbrjO65KRA/VqRNDbLXIQI/AAAAAAAABK0/hBUvDikczak/s640/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25A8%25E7%2594%25BB%25E5%2583%258F.JPG)](http://2.bp.blogspot.com/-FrbrjO65KRA/VqRNDbLXIQI/AAAAAAAABK0/hBUvDikczak/s1600/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25A8%25E7%2594%25BB%25E5%2583%258F.JPG)

では、React Structures についてから説明します。このソフトは、Autodesk が現在開発している構造解析用のソフトで、同じく Autodesk の BIM ソフトの Revit との連携性を高めたソフトになっています。  
　また VisualPrograming ソフトの DynamoBIM ともネイティブで対応しているため、パラメトリックな構造解析を簡単に行えるようになっています。  
　この２点が、Autodesk が「構造解析について考え直すときなんじゃない？」と言っている所以のようで、これまであった解析の手戻り（意匠との不整合、モデルの変更）を解決する機能ということのようです。  
　現在はテクニカルプレビュー 2 となっており、フリーで使用することができます。2015 年の 5 月まであった Autodesk の Vasari のように、いずれ有料版になっていくことが考えられます。

ソフトに関しての説明は以上として、さっそくソフトの使いかたとモデル化を行っていきます。まずは ReactStructures を起動します。

[![](https://3.bp.blogspot.com/-NLuWCl5wlM0/VqRKcIJDnCI/AAAAAAAABKg/51trtkuu0e0/s640/%25E3%2582%25BD%25E3%2583%2595%25E3%2583%2588%25E3%2581%25AE%25E8%25B5%25B7%25E5%258B%2595.JPG)](http://3.bp.blogspot.com/-NLuWCl5wlM0/VqRKcIJDnCI/AAAAAAAABKg/51trtkuu0e0/s1600/%25E3%2582%25BD%25E3%2583%2595%25E3%2583%2588%25E3%2581%25AE%25E8%25B5%25B7%25E5%258B%2595.JPG)

右から 2 番目の Dynamo を起動します。Dynamo は grasshopper とおなじ VisualPrograming のソフトです。大きく異なることが、Dynamo は独立したソフトなので grasshopper がモデル化したものを rhino 上で図示するものに対し、Dynamo はノード（grasshopper のコンポーネントにあたるもの）を配置する空間の後ろに、モデルのビューアーが存在します。  
　まずは、Dynamo に ReactStructures と連携するためにパッケージをインストールします。Dynamo の Packages から Search for a Package を選択し、「Structural Analysis for Dynamo」を検索しインストールします。



[![](https://1.bp.blogspot.com/-kmkwG_LlOEQ/VqRMjEGyfZI/AAAAAAAABKs/cPT7t41W61Y/s640/react%25E3%2581%25AE%25E3%2582%25A4%25E3%2583%25B3%25E3%2582%25B9%25E3%2583%2588%25E3%2583%25BC%25E3%2583%25AB.JPG)](http://1.bp.blogspot.com/-kmkwG_LlOEQ/VqRMjEGyfZI/AAAAAAAABKs/cPT7t41W61Y/s1600/react%25E3%2581%25AE%25E3%2582%25A4%25E3%2583%25B3%25E3%2582%25B9%25E3%2583%2588%25E3%2583%25BC%25E3%2583%25AB.JPG)

インストールが完了したら、モデル化を行います。今回は単純梁の解析を目的にしているので、ラインの作成を行います。number slider と Point.ByCoordinates を使用してポイントを作成します。インターフェースの違いや操作法、名称の違いはあるものの、おおよそ grasshopper と同じような形でラインは作成できます。

[![](https://1.bp.blogspot.com/-MYY994ghQow/VqTUgiKO4WI/AAAAAAAABLE/0sP-rp4XtgQ/s640/%25E3%2583%25A9%25E3%2582%25A4%25E3%2583%25B3%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)](http://1.bp.blogspot.com/-MYY994ghQow/VqTUgiKO4WI/AAAAAAAABLE/0sP-rp4XtgQ/s1600/%25E3%2583%25A9%25E3%2582%25A4%25E3%2583%25B3%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)

作成したポイントは Line.ByStartPointEndPoint を使用します。始点と終点を接続することによってラインが作成できます。  
　作成したラインは AnalyticalBar.ByLine につなげることで、解析用の梁要素を作成します。karamba でいうところの Line to Beam コンポーネントに該当する部分です。  
　次に梁要素に断面を与えます。断面は AnalyticalBar.SetSectionByName を使用します。analyticalBar には作成した梁要素を、name には梁の断面名を入力します。ここで Section ノードを使用することでドロワー形式で断面を選ぶことができます。このドロワーの中身は ReactStructures の中で定義した断面なので、ReactStructures 上で断面の定義を増やせば、こちらも即時に反映されます。

[![](https://4.bp.blogspot.com/-WhwUHyt7sec/VqTWhAN7WXI/AAAAAAAABLQ/ACnfPHLywbY/s640/%25E6%25A2%2581%25E8%25A6%2581%25E7%25B4%25A0%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)](http://4.bp.blogspot.com/-WhwUHyt7sec/VqTWhAN7WXI/AAAAAAAABLQ/ACnfPHLywbY/s1600/%25E6%25A2%2581%25E8%25A6%2581%25E7%25B4%25A0%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)

次に境界条件の作成を行います。境界条件は AnalyticalNode.SetSupportByName を使用して定義します。境界条件は節点に対して定義するので、解析用の節点（AnalyticalNode）を作成する必要があります。AnalyticalNode.ByPoint を使用して、梁の端部にあたる２点に節点を作成します。境界条件は Support ノードを使用して設定します。

[![](https://3.bp.blogspot.com/-7d60wkocij8/VqTYJO-6v7I/AAAAAAAABLc/kBUV4f87aDM/s640/%25E5%25A2%2583%25E7%2595%258C%25E6%259D%25A1%25E4%25BB%25B6%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)](http://3.bp.blogspot.com/-7d60wkocij8/VqTYJO-6v7I/AAAAAAAABLc/kBUV4f87aDM/s1600/%25E5%25A2%2583%25E7%2595%258C%25E6%259D%25A1%25E4%25BB%25B6%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)

次に荷重を作成します。今回は梁に対して等分布荷重を与えることとします。等分布荷重は UniformMemberLoad.ByBar を使用します。analyticalBars には先程作成した梁要素を入れます。ここでは、二つの要素をまとめて扱うために一度 List ノードでひとまとめにしてから入力しています。  
　荷重は設定するに当たり、荷重ケースを設定する必要があります。ケースの設定は LoadCase.ByNatureAndType を使用して設定します。今回は固定荷重（Dead）、タイプはシンプル、荷重ケースの名前はそのまま"Dead"としています。

[![](https://4.bp.blogspot.com/-y60f00vNbkM/VqTZa-YMxhI/AAAAAAAABLo/C7FsY_kYZnI/s640/%25E8%258D%25B7%25E9%2587%258D%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)](http://4.bp.blogspot.com/-y60f00vNbkM/VqTZa-YMxhI/AAAAAAAABLo/C7FsY_kYZnI/s1600/%25E8%258D%25B7%25E9%2587%258D%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.JPG)

これでモデルの作成が終わったので、解析を行います。karamba での Assemble Model コンポーネントのようなものはないため、List ノードを使用してひとまとめにします。まとめた後は、データの階層が分かれていると同一のデータとみなさないので、karamba でもよく使用する Flatten ノードを使用します。そして作成したデータを Analysis.Calculate に接続します。これで Dynamo での作業は終りです。Dynamo の左下にある部分が作成したものを実行する方法を示しており、もし Auto ではなく Manual になっていたら Run（実行）しておきましょう。

[![](https://4.bp.blogspot.com/-v4w9QZ9_kbs/VqTaykW1SjI/AAAAAAAABL0/YeqARwf25I4/s640/%25E8%25A7%25A3%25E6%259E%2590.JPG)](http://4.bp.blogspot.com/-v4w9QZ9_kbs/VqTaykW1SjI/AAAAAAAABL0/YeqARwf25I4/s1600/%25E8%25A7%25A3%25E6%259E%2590.JPG)

モデル化がうまくいっていいれば ReactStructures の３ D View のタブには以下のようなモデルができているはずです。

[![](https://4.bp.blogspot.com/-pPOBT4iveus/VqTbO9j-S9I/AAAAAAAABL8/4xajH478P9c/s640/%25E4%25BD%259C%25E6%2588%2590%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB.JPG)](http://4.bp.blogspot.com/-pPOBT4iveus/VqTbO9j-S9I/AAAAAAAABL8/4xajH478P9c/s1600/%25E4%25BD%259C%25E6%2588%2590%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB.JPG)

Dyanamo で解析は実行してあるので、こちらで解析実行ボタンのようなものを押す必要はありません。上のリボンの中にある Results タブを選択することで解析結果をみることができます。曲げモーメントを出力する場合は、Result タブの中の BeamDiagrams を選択し、BendingMoment を選択することで、解析結果が出力されます。

[![](https://2.bp.blogspot.com/-j2vq86wTw28/VqTcOFx_aUI/AAAAAAAABMI/s26b_6U9rPQ/s640/%25E8%25A7%25A3%25E6%259E%2590%25E7%25B5%2590%25E6%259E%259C.JPG)](http://2.bp.blogspot.com/-j2vq86wTw28/VqTcOFx_aUI/AAAAAAAABMI/s26b_6U9rPQ/s1600/%25E8%25A7%25A3%25E6%259E%2590%25E7%25B5%2590%25E6%259E%259C.JPG)

ReactStructures と Dynamo を使用した単純梁のモデル化と解析は以上となります。  
　今回は ReactStructures 上で解析結果を確認しましたが、もちろん Dynamo 上でも結果を取得することが可能です。また ReactStructures の Model タブの中には RevitLink ボタンがあり、これを使用することで、今後 Revit ともシームレスにつながっていくようになるのだと考えられます。

BIM は今後設計に大きな影響を与えるツールですので、今後も定期的に Dynamo と React Structures の記事を作成していきたいと思います。
