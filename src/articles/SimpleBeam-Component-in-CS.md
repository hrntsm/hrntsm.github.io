---
title: 'C# で 単純梁を計算するコンポーネントを作成'
date: "2016-11-09"
draft: false
path: "/articles/SimpleBeam-Component-in-CS"
tags : ["grasshopper", "C#"]
---

　今回はgrasshopperで動作する コンポーネントをC#を用いて作成する方法についての記事です。food4rhino などでダウンロードするデータに必ず含まれている"アイツ"を作成してみます。

  

[![](https://3.bp.blogspot.com/-iO9Vpy7aDOA/WCCStK2SCKI/AAAAAAAABQ8/c9uSDa4w_s4XMEpTl0TXfQeleMr574A4gCLcB/s1600/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)](https://3.bp.blogspot.com/-iO9Vpy7aDOA/WCCStK2SCKI/AAAAAAAABQ8/c9uSDa4w_s4XMEpTl0TXfQeleMr574A4gCLcB/s1600/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)

[](https://draft.blogger.com/null)　開発に使用する言語は、C#としています。[以前](http://rgkr-memo.blogspot.com/2015/10/arduinofft.html)は個人的に好きという理由でpythonで fft できるものを作成しましたが、今回はC#で、ghpythonのようにGrasshopper上で作成するものではなくghaファイルの作成をします。  
  
　作成するものは、中央集中荷重の単純梁を計算するコンポーネントとします。  
　では順番に説明して行きます。  
  
  
1、開発環境を整える。  
  
　これはなんでもいいんですが、VisualStudio は制限があるものの個人開発者は無料で使用でき便利なため、VisualStudio （以下VS）を使用します。ちなみに、開発のヘルプとなる[grasshopperSDK](http://developer.rhino3d.com/api/grasshopper/html/723c01da-9986-4db2-8f53-6f3a7494df75.htm)も例として利用しています。  
  
  
2、VisualStudioの設定をする。  
  
　そもそものソフトの使い方は、ほかのサイトが詳しいと思いますので割愛します。Grasshopperを対象とした開発をするために、ライブラリの参照をする必要があります。参照元は、上記GrasshopperSDKでは以下の３つのライブラリと場所が書いてあります。  
　　・GH\_IO.dll  
　　　　<Program Files>\\Rhinoceros 4.0\\Plug-ins\\Grasshopper\\  
　  ・Grasshopper.dll  

　　　　<Program Files>\\Rhinoceros 4.0\\Plug-ins\\Grasshopper\\

　　・RhinoCommon.dll

　　　　<Program Files>\\Rhinoceros 4.0\\Plug-ins\\Grasshopper\\rh\_common

ですが、たぶんここにはないと思います。私のPCがWindows10だからなのか、Rhinoが5 だからなのかわかりませんが、ありませんでした。私の各ファイルがあった場所は以下です。

　　・GH\_IO.dll

　　　　<AppData>\\Roaming\\McNeel\\Rhinoceros\\5.0\\Plug-ins\\Grasshopper\\

　  ・Grasshopper.dll  
　　　　<AppData>\\Roaming\\McNeel\\Rhinoceros\\5.0\\Plug-ins\\Grasshopper\\  

　　・RhinoCommon.dll

　　　　<Program Files>\\Rhinoceros 5 (64-bit)\\System\\

  

[![](https://1.bp.blogspot.com/-PgEzJYqVxSc/WCMNLLvgkBI/AAAAAAAABRQ/scS4pQ0Fd0cQ2GwXYr7blTzj-QkhNm9WwCLcB/s320/%25E5%258F%2582%25E7%2585%25A7%25E8%25BF%25BD%25E5%258A%25A0.PNG)](https://1.bp.blogspot.com/-PgEzJYqVxSc/WCMNLLvgkBI/AAAAAAAABRQ/scS4pQ0Fd0cQ2GwXYr7blTzj-QkhNm9WwCLcB/s1600/%25E5%258F%2582%25E7%2585%25A7%25E8%25BF%25BD%25E5%258A%25A0.PNG)

  

　ビルトを実行した際にVSではデフォルトで dllファイルを作成しますが、grasshopperで使用するためには拡張子を.dllではなく、.gha にする必要があります。手で変えてもいいんですが、設定によって自動で変えれるので、その設定を行います。

　設定は、「ビルトイベント」の「ビルト後イベントのコマンドライン」に以下を追加することで行います。

  

[![](https://1.bp.blogspot.com/-N80Y0bSJDvM/WCMQyG9AOjI/AAAAAAAABRc/JfpJJSObNtkZ9D8OtFFzvwbkAsWvP_L1QCLcB/s1600/%25E6%258B%25A1%25E5%25BC%25B5%25E5%25AD%2590%25E5%25A4%2589%25E6%258F%259B.PNG)](https://1.bp.blogspot.com/-N80Y0bSJDvM/WCMQyG9AOjI/AAAAAAAABRc/JfpJJSObNtkZ9D8OtFFzvwbkAsWvP_L1QCLcB/s1600/%25E6%258B%25A1%25E5%25BC%25B5%25E5%25AD%2590%25E5%25A4%2589%25E6%258F%259B.PNG)

  

　これでVSの設定は終わりです。

  

  

3、コンポーネントの中身を作成する。

　プログラムの中身の基本的な構造は、GrasshopperSDKにある[My First Component](http://developer.rhino3d.com/api/grasshopper/html/730f0792-7bfb-4310-a416-239e8c315645.htm) をもとに作成しているので、説明を端折っている箇所はそちらを参照してください。また、一番最後に作成したコードの全部をつけてあるので、そちらも参照してください。

　以下では「My First Component」から主に書き換えた箇所の説明をします。クラスの名前等は適宜変えています。

  

　ではまずはコンポーネントに名前をつけるところから

　　　public SBComponent() : base(①,②,③,④,⑤）

  

　①が名前、②が略称、③がコンポーネントの説明、④がカテゴリ、⑤がサブカテゴリです。

　①～③がコンポーネントそのものに表示されるもの、④、⑤がGrasshopper上部のタブバーに表示されるものです。

  

  

　次に、インプット項目の設定です。単純梁を計算するために必要な、

　　　・部材長さ

　　　・断面二次モーメント

　　　・断面係数

　　　・荷重

　　　・ヤング率

を入力項目として設定ます。例として部材長さの入力が以下です。

       protected override void RegisterInputParams(GH\_InputParamManager pManager)

        {

       pManager.AddNumberParameter("Length", "L", "The length of the element (mm)", GH\_ParamAccess.item);

  

　ここの個所では、RegisterInputParams → インプットするパラメーターの登録　をするということです。AddNumberParameter で 具体的なパラメーターを追加しています。"Length"は名前、"L"は略称、"The length .... " の個所は内容の説明です。こんな感じで表示されます。

  

[![](https://2.bp.blogspot.com/-OllQbjArLAs/WCMf8aWB58I/AAAAAAAABRs/iZu3eTmAecMVIHmFQbjY3SUmbsWX889lwCLcB/s320/%25E3%2582%25A4%25E3%2583%25B3%25E3%2583%2597%25E3%2583%2583%25E3%2583%2588.PNG)](https://2.bp.blogspot.com/-OllQbjArLAs/WCMf8aWB58I/AAAAAAAABRs/iZu3eTmAecMVIHmFQbjY3SUmbsWX889lwCLcB/s1600/%25E3%2582%25A4%25E3%2583%25B3%25E3%2583%2597%25E3%2583%2583%25E3%2583%2588.PNG)

  

  

　次に、アウトプット項目の設定です。小梁の設計ができるようにすることを想定して

　　　・最大曲げ

　　　・最大曲げ応力度

　　　・変位

の３項目を設定します。例として曲げモーメントの出力設定が以下です。

 　　　protected override void RegisterOutputParams(GH\_OutputParamManager pManager)

        {

        pManager.AddNumberParameter("Bending Moment", "M", "output max bending moment(kNm)", GH\_ParamAccess.item);

  

　ここの個所では、RegisterOutputParams → アウトプットするパラメーターの登録　をするということです。AddNumberParameter で 具体的なパラメーターを追加しています。"Bending Moment"は名前、"M"は略称、"output max .... " の個所は内容の説明です。インプット項目と同じ感じです。こんな感じで表示されます。

  

[![](https://2.bp.blogspot.com/-kICfjXHVaL4/WCMi3aDXv1I/AAAAAAAABR4/rHO7sWCDdMw3YT2lOFEFzotUsKbB1adXwCLcB/s320/%25E3%2582%25A2%25E3%2582%25A6%25E3%2583%2588%25E3%2583%2597%25E3%2583%2583%25E3%2583%2588.PNG)](https://2.bp.blogspot.com/-kICfjXHVaL4/WCMi3aDXv1I/AAAAAAAABR4/rHO7sWCDdMw3YT2lOFEFzotUsKbB1adXwCLcB/s1600/%25E3%2582%25A2%25E3%2582%25A6%25E3%2583%2588%25E3%2583%2597%25E3%2583%2583%25E3%2583%2588.PNG)

  

　次に計算用に、引数を定義します。

       double L = double.NaN;

　　　if (!DA.GetData(0, ref L)) { return; }

  

　とりあえずここではdouble型にしています。GetDataの個所の最初の 0 はインプットの最初の項目（0番目） の値という意味です。

　次に実際の計算を行う箇所を作成しています。M=PL/4 などのごく普通の式などで、コードに書いてある通りです。

  

　最後に計算結果とコンポーネントの出力を関連付けます。

　　　　DA.SetData(0, M);

  

　SetDataの個所で、アウトプットの最初の項目(0番目)に曲げモーメントの計算結果 M をセットするとしています。

  

　これで完成です。完成したものをビルトしエラーがなければプロジェクトの bin フォルダに \*\*\*.gha ファイルが作成されていると思います。それをGrasshopper の以下からいけるコンポーネントのフォルダにコピペし、rhino、Grasshopperを再起動すれば、作成したコンポーネントが表示されるようになるはずです。

  

[![](https://3.bp.blogspot.com/-ZIQo9emiGPE/WCMpa1NElQI/AAAAAAAABSI/q9UOVyZjs-USOEj24x6JXy3ASD9K2WcXwCLcB/s320/%25E3%2582%25B3%25E3%2583%25B3%25E3%2583%259D%25E3%2583%25BC%25E3%2583%258D%25E3%2583%25B3%25E3%2583%2588%25E3%2583%2595%25E3%2582%25A9%25E3%2583%25AB%25E3%2583%2580.PNG)](https://3.bp.blogspot.com/-ZIQo9emiGPE/WCMpa1NElQI/AAAAAAAABSI/q9UOVyZjs-USOEj24x6JXy3ASD9K2WcXwCLcB/s1600/%25E3%2582%25B3%25E3%2583%25B3%25E3%2583%259D%25E3%2583%25BC%25E3%2583%258D%25E3%2583%25B3%25E3%2583%2588%25E3%2583%2595%25E3%2582%25A9%25E3%2583%25AB%25E3%2583%2580.PNG)

  

　実際に使ってみるとこんな感じでした。パラメーターは、10mスパンのH-300x150の中央に10kNかけたモデルです。ちゃんとした答えが得られているようです。

  

[![](https://3.bp.blogspot.com/-3VK546_gsts/WCMsFBjlUZI/AAAAAAAABSY/5HXSFriE07wRDwDxIV3WyMndAEzHZ_7IQCLcB/s400/%25E4%25BD%25BF%25E3%2581%25A3%25E3%2581%25A6%25E3%2581%25BF%25E3%2581%259F.PNG)](https://3.bp.blogspot.com/-3VK546_gsts/WCMsFBjlUZI/AAAAAAAABSY/5HXSFriE07wRDwDxIV3WyMndAEzHZ_7IQCLcB/s1600/%25E4%25BD%25BF%25E3%2581%25A3%25E3%2581%25A6%25E3%2581%25BF%25E3%2581%259F.PNG)

  

　内容としては、Grasshopperでやる必要が全くない内容のコンポーネントではありますが、今後はrhino上に結果を表示するとか、ラインを取り込めるようにするとか考えていきたいですね。

  

　以下がコードの全文です。内容と関係ないですが、github使ってみたかったので、コードの表示に使ってみました。