---
title: "C# で 単純梁を計算するコンポーネントを作成"
date: "2016-11-09"
draft: false
path: "/articles/SimpleBeam-Component-in-CS"
article-tags: ["Grasshopper", "CSharp", "構造とデジタル"]
---

今回は grasshopper で動作する コンポーネントを C#を用いて作成する方法についての記事です。food4rhino などでダウンロードするデータに必ず含まれている"アイツ"を作成してみます。

[![](https://3.bp.blogspot.com/-iO9Vpy7aDOA/WCCStK2SCKI/AAAAAAAABQ8/c9uSDa4w_s4XMEpTl0TXfQeleMr574A4gCLcB/s1600/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)](https://3.bp.blogspot.com/-iO9Vpy7aDOA/WCCStK2SCKI/AAAAAAAABQ8/c9uSDa4w_s4XMEpTl0TXfQeleMr574A4gCLcB/s1600/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)

[](https://draft.blogger.com/null)　開発に使用する言語は、C#としています。[以前](http://rgkr-memo.blogspot.com/2015/10/arduinofft.html)は個人的に好きという理由で python で fft できるものを作成しましたが、今回は C#で、ghpython のように Grasshopper 上で作成するものではなく gha ファイルの作成をします。

作成するものは、中央集中荷重の単純梁を計算するコンポーネントとします。  
　では順番に説明して行きます。

1、開発環境を整える。

これはなんでもいいんですが、VisualStudio は制限があるものの個人開発者は無料で使用でき便利なため、VisualStudio （以下 VS）を使用します。ちなみに、開発のヘルプとなる[grasshopperSDK](http://developer.rhino3d.com/api/grasshopper/html/723c01da-9986-4db2-8f53-6f3a7494df75.htm)も例として利用しています。

2、VisualStudio の設定をする。

そもそものソフトの使い方は、ほかのサイトが詳しいと思いますので割愛します。Grasshopper を対象とした開発をするために、ライブラリの参照をする必要があります。参照元は、上記 GrasshopperSDK では以下の３つのライブラリと場所が書いてあります。  
　　・GH_IO.dll  
　　　　<Program Files>\\Rhinoceros 4.0\\Plug-ins\\Grasshopper\\  
　  ・Grasshopper.dll

<Program Files>\\Rhinoceros 4.0\\Plug-ins\\Grasshopper\\

・RhinoCommon.dll

<Program Files>\\Rhinoceros 4.0\\Plug-ins\\Grasshopper\\rh_common

ですが、たぶんここにはないと思います。私の PC が Windows10 だからなのか、Rhino が 5 だからなのかわかりませんが、ありませんでした。私の各ファイルがあった場所は以下です。

・GH_IO.dll

<AppData>\\Roaming\\McNeel\\Rhinoceros\\5.0\\Plug-ins\\Grasshopper\\

・Grasshopper.dll  
　　　　<AppData>\\Roaming\\McNeel\\Rhinoceros\\5.0\\Plug-ins\\Grasshopper\\

・RhinoCommon.dll

<Program Files>\\Rhinoceros 5 (64-bit)\\System\\

[![](https://1.bp.blogspot.com/-PgEzJYqVxSc/WCMNLLvgkBI/AAAAAAAABRQ/scS4pQ0Fd0cQ2GwXYr7blTzj-QkhNm9WwCLcB/s320/%25E5%258F%2582%25E7%2585%25A7%25E8%25BF%25BD%25E5%258A%25A0.PNG)](https://1.bp.blogspot.com/-PgEzJYqVxSc/WCMNLLvgkBI/AAAAAAAABRQ/scS4pQ0Fd0cQ2GwXYr7blTzj-QkhNm9WwCLcB/s1600/%25E5%258F%2582%25E7%2585%25A7%25E8%25BF%25BD%25E5%258A%25A0.PNG)

ビルトを実行した際に VS ではデフォルトで dll ファイルを作成しますが、grasshopper で使用するためには拡張子を.dll ではなく、.gha にする必要があります。手で変えてもいいんですが、設定によって自動で変えれるので、その設定を行います。

設定は、「ビルトイベント」の「ビルト後イベントのコマンドライン」に以下を追加することで行います。

[![](https://1.bp.blogspot.com/-N80Y0bSJDvM/WCMQyG9AOjI/AAAAAAAABRc/JfpJJSObNtkZ9D8OtFFzvwbkAsWvP_L1QCLcB/s1600/%25E6%258B%25A1%25E5%25BC%25B5%25E5%25AD%2590%25E5%25A4%2589%25E6%258F%259B.PNG)](https://1.bp.blogspot.com/-N80Y0bSJDvM/WCMQyG9AOjI/AAAAAAAABRc/JfpJJSObNtkZ9D8OtFFzvwbkAsWvP_L1QCLcB/s1600/%25E6%258B%25A1%25E5%25BC%25B5%25E5%25AD%2590%25E5%25A4%2589%25E6%258F%259B.PNG)

これで VS の設定は終わりです。

3、コンポーネントの中身を作成する。

プログラムの中身の基本的な構造は、GrasshopperSDK にある[My First Component](http://developer.rhino3d.com/api/grasshopper/html/730f0792-7bfb-4310-a416-239e8c315645.htm)  をもとに作成しているので、説明を端折っている箇所はそちらを参照してください。また、一番最後に作成したコードの全部をつけてあるので、そちらも参照してください。

以下では「My First Component」から主に書き換えた箇所の説明をします。クラスの名前等は適宜変えています。

ではまずはコンポーネントに名前をつけるところから

public SBComponent() : base(①,②,③,④,⑤）

① が名前、② が略称、③ がコンポーネントの説明、④ がカテゴリ、⑤ がサブカテゴリです。

① ～ ③ がコンポーネントそのものに表示されるもの、④、⑤ が Grasshopper 上部のタブバーに表示されるものです。

次に、インプット項目の設定です。単純梁を計算するために必要な、

・部材長さ

・断面二次モーメント

・断面係数

・荷重

・ヤング率

を入力項目として設定ます。例として部材長さの入力が以下です。
```cs
protected override void RegisterInputParams(GH_InputParamManager pManager)
{
   pManager.AddNumberParameter("Length", "L", "The length of the element (mm)", GH_ParamAccess.item);
}
```

ここの個所では、RegisterInputParams → インプットするパラメーターの登録　をするということです。AddNumberParameter で 具体的なパラメーターを追加しています。"Length"は名前、"L"は略称、"The length .... " の個所は内容の説明です。こんな感じで表示されます。

[![](https://2.bp.blogspot.com/-OllQbjArLAs/WCMf8aWB58I/AAAAAAAABRs/iZu3eTmAecMVIHmFQbjY3SUmbsWX889lwCLcB/s320/%25E3%2582%25A4%25E3%2583%25B3%25E3%2583%2597%25E3%2583%2583%25E3%2583%2588.PNG)](https://2.bp.blogspot.com/-OllQbjArLAs/WCMf8aWB58I/AAAAAAAABRs/iZu3eTmAecMVIHmFQbjY3SUmbsWX889lwCLcB/s1600/%25E3%2582%25A4%25E3%2583%25B3%25E3%2583%2597%25E3%2583%2583%25E3%2583%2588.PNG)

次に、アウトプット項目の設定です。小梁の設計ができるようにすることを想定して

・最大曲げ

・最大曲げ応力度

・変位

の３項目を設定します。例として曲げモーメントの出力設定が以下です。
```cs
protected override void RegisterOutputParams(GH_OutputParamManager pManager)
{
    pManager.AddNumberParameter("Bending Moment", "M", "output max bending moment(kNm)", GH_ParamAccess.item);
}
```
ここの個所では、RegisterOutputParams → アウトプットするパラメーターの登録　をするということです。AddNumberParameter で 具体的なパラメーターを追加しています。"Bending Moment"は名前、"M"は略称、"output max .... " の個所は内容の説明です。インプット項目と同じ感じです。こんな感じで表示されます。

[![](https://2.bp.blogspot.com/-kICfjXHVaL4/WCMi3aDXv1I/AAAAAAAABR4/rHO7sWCDdMw3YT2lOFEFzotUsKbB1adXwCLcB/s320/%25E3%2582%25A2%25E3%2582%25A6%25E3%2583%2588%25E3%2583%2597%25E3%2583%2583%25E3%2583%2588.PNG)](https://2.bp.blogspot.com/-kICfjXHVaL4/WCMi3aDXv1I/AAAAAAAABR4/rHO7sWCDdMw3YT2lOFEFzotUsKbB1adXwCLcB/s1600/%25E3%2582%25A2%25E3%2582%25A6%25E3%2583%2588%25E3%2583%2597%25E3%2583%2583%25E3%2583%2588.PNG)

次に計算用に、引数を定義します。

```cs
double L = double.NaN;

if (!DA.GetData(0, ref L)) { return; }
```

とりあえずここでは double 型にしています。GetData の個所の最初の 0 はインプットの最初の項目（0 番目） の値という意味です。

次に実際の計算を行う箇所を作成しています。M=PL/4 などのごく普通の式などで、コードに書いてある通りです。

最後に計算結果とコンポーネントの出力を関連付けます。

```cs
DA.SetData(0, M);
```

SetData の個所で、アウトプットの最初の項目(0 番目)に曲げモーメントの計算結果 M をセットするとしています。

これで完成です。完成したものをビルトしエラーがなければプロジェクトの bin フォルダに \*\*\*.gha ファイルが作成されていると思います。それを Grasshopper の以下からいけるコンポーネントのフォルダにコピペし、rhino、Grasshopper を再起動すれば、作成したコンポーネントが表示されるようになるはずです。

[![](https://3.bp.blogspot.com/-ZIQo9emiGPE/WCMpa1NElQI/AAAAAAAABSI/q9UOVyZjs-USOEj24x6JXy3ASD9K2WcXwCLcB/s320/%25E3%2582%25B3%25E3%2583%25B3%25E3%2583%259D%25E3%2583%25BC%25E3%2583%258D%25E3%2583%25B3%25E3%2583%2588%25E3%2583%2595%25E3%2582%25A9%25E3%2583%25AB%25E3%2583%2580.PNG)](https://3.bp.blogspot.com/-ZIQo9emiGPE/WCMpa1NElQI/AAAAAAAABSI/q9UOVyZjs-USOEj24x6JXy3ASD9K2WcXwCLcB/s1600/%25E3%2582%25B3%25E3%2583%25B3%25E3%2583%259D%25E3%2583%25BC%25E3%2583%258D%25E3%2583%25B3%25E3%2583%2588%25E3%2583%2595%25E3%2582%25A9%25E3%2583%25AB%25E3%2583%2580.PNG)

実際に使ってみるとこんな感じでした。パラメーターは、10m スパンの H-300x150 の中央に 10kN かけたモデルです。ちゃんとした答えが得られているようです。

[![](https://3.bp.blogspot.com/-3VK546_gsts/WCMsFBjlUZI/AAAAAAAABSY/5HXSFriE07wRDwDxIV3WyMndAEzHZ_7IQCLcB/s400/%25E4%25BD%25BF%25E3%2581%25A3%25E3%2581%25A6%25E3%2581%25BF%25E3%2581%259F.PNG)](https://3.bp.blogspot.com/-3VK546_gsts/WCMsFBjlUZI/AAAAAAAABSY/5HXSFriE07wRDwDxIV3WyMndAEzHZ_7IQCLcB/s1600/%25E4%25BD%25BF%25E3%2581%25A3%25E3%2581%25A6%25E3%2581%25BF%25E3%2581%259F.PNG)

内容としては、Grasshopper でやる必要が全くない内容のコンポーネントではありますが、今後は rhino 上に結果を表示するとか、ラインを取り込めるようにするとか考えていきたいですね。

以下がコードの全文です。内容と関係ないですが、github 使ってみたかったので、コードの表示に使ってみました。

```cs
using System;
using Grasshopper.Kernel;

namespace SBAnalysis
{
    public class SBComponent : GH_Component
    {
        public SBComponent() : base("SimpleBeamAnalysis", "SB Analysis","calculate simple beam", "Extra", "Simple-beam")
        {
        }
        protected override void RegisterInputParams(GH_InputParamManager pManager)
        {
            pManager.AddNumberParameter("Length", "L", "The length of the element (mm)", GH_ParamAccess.item);
            pManager.AddNumberParameter("Moment of Inertia", "I", "Moment of Inertia (mm^4)", GH_ParamAccess.item);
            pManager.AddNumberParameter("Modulus of section", "Z", "Modulus of section (mm^3)", GH_ParamAccess.item);
            pManager.AddNumberParameter("Load", "P", "Centralized load (kN)", GH_ParamAccess.item);
            pManager.AddNumberParameter("Young's modulus", "E", "Young's modulus (N/mm^2)", GH_ParamAccess.item);
        }
        protected override void RegisterOutputParams(GH_OutputParamManager pManager)
        {
            pManager.AddNumberParameter("Bending Moment", "M", "output max bending moment(kNm)", GH_ParamAccess.item);
            pManager.AddNumberParameter("Bending Stress", "Sig", "output max bending stress (N/mm^2)", GH_ParamAccess.item);
            pManager.AddNumberParameter("Deformation", "D", "output max deformation(mm)", GH_ParamAccess.item);
        }
        protected override void SolveInstance(IGH_DataAccess DA)
        {
            // input
            double L = double.NaN;
            double I = double.NaN;
            double Z = double.NaN;
            double P = double.NaN;
            double E = double.NaN;
            // output
            double M = double.NaN;
            double Sig = double.NaN;
            double D = double.NaN;
            // Use the DA object to retrieve the data inside the input parameters.
            if (!DA.GetData(0, ref L)) { return; }
            if (!DA.GetData(1, ref I)) { return; }
            if (!DA.GetData(2, ref Z)) { return; }
            if (!DA.GetData(3, ref P)) { return; }
            if (!DA.GetData(4, ref E)) { return; }
　          // analyze
            M = P * (L/1000) / 4;
            Sig = M * 1000000 / Z;
            D = P*1000*L*L*L/(48*E*I);
            //output
            DA.SetData(0, M);
            DA.SetData(1, Sig);
            DA.SetData(2, D);
        }
        public override Guid ComponentGuid
        {
            get { return new Guid("419c3a3a-cc48-4717-8cef-5f5647a5ecfc"); }
        }
    }
}
```