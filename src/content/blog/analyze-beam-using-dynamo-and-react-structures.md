　AutodeskのDynamo BIMと最近開発されているReactStructuresを使用して単純梁のモデル化から解析までの一連の解説を行います。
　[ReactStructures](http://react.autodesk.com/)のホームページをみると、

「<i>構造解析について考え直すときなんじゃない？（Time to Rethink Structural analysis?）</i>」 
と題されており、今後開発に期待しています。

![Image](/media/blog/analyze-beam-using-dynamo-and-react-structures/-25E3-2583-2588-25E3-2583-2583-25E3-2583-2597-25E7-2594-25A8-25E7-2594-25BB-25E5-2583-258F.JPG)


　では、React Structuresについてから説明します。このソフトは、Autodeskが現在開発している構造解析用のソフトで、同じくAutodeskのBIMソフトのRevitとの連携性を高めたソフトになっています。
　またVisualProgramingソフトのDynamoBIMともネイティブで対応しているため、パラメトリックな構造解析を簡単に行えるようになっています。
　この２点が、Autodeskが「構造解析について考え直すときなんじゃない？」と言っている所以のようで、これまであった解析の手戻り（意匠との不整合、モデルの変更）を解決する機能ということのようです。
　現在はテクニカルプレビュー2となっており、フリーで使用することができます。2015年の5月まであったAutodeskのVasariのように、いずれ有料版になっていくことが考えられます。

　ソフトに関しての説明は以上として、さっそくソフトの使いかたとモデル化を行っていきます。まずはReactStructuresを起動します。

![Image](/media/blog/analyze-beam-using-dynamo-and-react-structures/-25E3-2582-25BD-25E3-2583-2595-25E3-2583-2588-25E3-2581-25AE-25E8-25B5-25B7-25E5-258B-2595.JPG)

右から2番目のDynamoを起動します。DynamoはgrasshopperとおなじVisualProgramingのソフトです。大きく異なることが、Dynamoは独立したソフトなのでgrasshopperがモデル化したものをrhino上で図示するものに対し、Dynamoはノード（grasshopperのコンポーネントにあたるもの）を配置する空間の後ろに、モデルのビューアーが存在します。
　まずは、DynamoにReactStructuresと連携するためにパッケージをインストールします。DynamoのPackagesからSearch for a Package を選択し、「Structural Analysis for Dynamo」を検索しインストールします。
　
![Image](/media/blog/analyze-beam-using-dynamo-and-react-structures/react-25E3-2581-25AE-25E3-2582-25A4-25E3-2583-25B3-25E3-2582-25B9-25E3-2583-2588-25E3-2583-25BC-25E3-2583-25AB.JPG)


　インストールが完了したら、モデル化を行います。今回は単純梁の解析を目的にしているので、ラインの作成を行います。number slider とPoint.ByCoordinatesを使用してポイントを作成します。インターフェースの違いや操作法、名称の違いはあるものの、おおよそgrasshopperと同じような形でラインは作成できます。

![Image](/media/blog/analyze-beam-using-dynamo-and-react-structures/-25E3-2583-25A9-25E3-2582-25A4-25E3-2583-25B3-25E3-2581-25AE-25E4-25BD-259C-25E6-2588-2590.JPG)

　作成したポイントは Line.ByStartPointEndPoint を使用します。始点と終点を接続することによってラインが作成できます。
　作成したラインは AnalyticalBar.ByLine につなげることで、解析用の梁要素を作成します。karambaでいうところのLine to Beamコンポーネントに該当する部分です。
　次に梁要素に断面を与えます。断面は AnalyticalBar.SetSectionByName を使用します。analyticalBar には作成した梁要素を、name には梁の断面名を入力します。ここでSection ノードを使用することでドロワー形式で断面を選ぶことができます。このドロワーの中身はReactStructuresの中で定義した断面なので、ReactStructures上で断面の定義を増やせば、こちらも即時に反映されます。

![Image](/media/blog/analyze-beam-using-dynamo-and-react-structures/-25E6-25A2-2581-25E8-25A6-2581-25E7-25B4-25A0-25E3-2581-25AE-25E4-25BD-259C-25E6-2588-2590.JPG)

　次に境界条件の作成を行います。境界条件は AnalyticalNode.SetSupportByName を使用して定義します。境界条件は節点に対して定義するので、解析用の節点（AnalyticalNode）を作成する必要があります。AnalyticalNode.ByPoint を使用して、梁の端部にあたる２点に節点を作成します。境界条件はSupportノードを使用して設定します。

![Image](/media/blog/analyze-beam-using-dynamo-and-react-structures/-25E5-25A2-2583-25E7-2595-258C-25E6-259D-25A1-25E4-25BB-25B6-25E3-2581-25AE-25E4-25BD-259C-25E6-2588-2590.JPG)

　次に荷重を作成します。今回は梁に対して等分布荷重を与えることとします。等分布荷重はUniformMemberLoad.ByBar を使用します。analyticalBars には先程作成した梁要素を入れます。ここでは、二つの要素をまとめて扱うために一度 Listノードでひとまとめにしてから入力しています。
　荷重は設定するに当たり、荷重ケースを設定する必要があります。ケースの設定はLoadCase.ByNatureAndType を使用して設定します。今回は固定荷重（Dead）、タイプはシンプル、荷重ケースの名前はそのまま"Dead"としています。

![Image](/media/blog/analyze-beam-using-dynamo-and-react-structures/-25E8-258D-25B7-25E9-2587-258D-25E3-2581-25AE-25E4-25BD-259C-25E6-2588-2590.JPG)

　これでモデルの作成が終わったので、解析を行います。karambaでのAssemble Modelコンポーネントのようなものはないため、Listノードを使用してひとまとめにします。まとめた後は、データの階層が分かれていると同一のデータとみなさないので、karambaでもよく使用するFlattenノードを使用します。そして作成したデータを Analysis.Calculate に接続します。これでDynamoでの作業は終りです。Dynamoの左下にある部分が作成したものを実行する方法を示しており、もしAutoではなくManualになっていたら Run（実行）しておきましょう。

![Image](/media/blog/analyze-beam-using-dynamo-and-react-structures/-25E8-25A7-25A3-25E6-259E-2590.JPG)

　モデル化がうまくいっていいればReactStructures の３D View のタブには以下のようなモデルができているはずです。

![Image](/media/blog/analyze-beam-using-dynamo-and-react-structures/-25E4-25BD-259C-25E6-2588-2590-25E3-2583-25A2-25E3-2583-2587-25E3-2583-25AB.JPG)

　Dyanamoで解析は実行してあるので、こちらで解析実行ボタンのようなものを押す必要はありません。上のリボンの中にあるResults タブを選択することで解析結果をみることができます。曲げモーメントを出力する場合は、Resultタブの中の BeamDiagrams を選択し、BendingMomentを選択することで、解析結果が出力されます。

![Image](/media/blog/analyze-beam-using-dynamo-and-react-structures/-25E8-25A7-25A3-25E6-259E-2590-25E7-25B5-2590-25E6-259E-259C.JPG)

　ReactStructuresとDynamoを使用した単純梁のモデル化と解析は以上となります。
　今回はReactStructures上で解析結果を確認しましたが、もちろんDynamo上でも結果を取得することが可能です。またReactStructuresのModelタブの中にはRevitLink ボタンがあり、これを使用することで、今後Revitともシームレスにつながっていくようになるのだと考えられます。

　BIMは今後設計に大きな影響を与えるツールですので、今後も定期的にDynamoとReact Structuresの記事を作成していきたいと思います。