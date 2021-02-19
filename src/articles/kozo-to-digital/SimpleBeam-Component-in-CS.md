---
title: "C# で 単純梁を計算するコンポーネントを作成"
date: "2016-11-09"
draft: false
path: "/articles/SimpleBeam-Component-in-CS"
article-tags: ["Grasshopper", "CSharp", "構造とデジタル"]
---

今回は Grasshopper で動作するコンポーネントを C# を用いて作成する方法についての記事です。food4rhino などでダウンロードするデータに必ず含まれている"アイツ"を作成してみます。

[![](https://3.bp.blogspot.com/-iO9Vpy7aDOA/WCCStK2SCKI/AAAAAAAABQ8/c9uSDa4w_s4XMEpTl0TXfQeleMr574A4gCLcB/s1600/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)](https://3.bp.blogspot.com/-iO9Vpy7aDOA/WCCStK2SCKI/AAAAAAAABQ8/c9uSDa4w_s4XMEpTl0TXfQeleMr574A4gCLcB/s1600/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)

## はじめに

開発に使用する言語は、C# としています。

[以前](./arduinofft) は個人的に好きという理由で Python で FFT できるものを作成しましたが、今回は C#で、ghpython のように Grasshopper 上で作成するものではなく コンパイルされた gha ファイルの作成をします。

作成するものは、中央集中荷重の単純梁を計算するコンポーネントとします。  

では順番に説明して行きます。

## 開発環境を整える

これはなんでもいいんですが、VisualStudio は制限があるものの個人開発者は無料で使用でき便利なため、VisualStudio(以下 VS)を使用します。

開発のヘルプとなる [GrasshopperSDK](http://developer.rhino3d.com/api/grasshopper/html/723c01da-9986-4db2-8f53-6f3a7494df75.htm) も例として利用しています。

## VisualStudio の設定をする

そもそものソフトの使い方は、ほかのサイトが詳しいので割愛します。

Grasshopper を対象とした開発をするために、ライブラリの参照をする必要があります。参照元は、上記 GrasshopperSDK では以下の３つのライブラリと場所が書いてあります。

ですが今は例えば NuGet パッケージとして公開されていたりするので、そちらを使った方が楽です。

- GH_IO.dll：Program Files\Rhinoceros 4.0\Plug-ins\Grasshopper\
- Grasshopper.dll：Program Files\Rhinoceros 4.0\Plug-ins\Grasshopper\
- RhinoCommon.dll：Program Files>\Rhinoceros 4.0\Plug-ins\Grasshopper\rh_common

[![](https://1.bp.blogspot.com/-PgEzJYqVxSc/WCMNLLvgkBI/AAAAAAAABRQ/scS4pQ0Fd0cQ2GwXYr7blTzj-QkhNm9WwCLcB/s320/%25E5%258F%2582%25E7%2585%25A7%25E8%25BF%25BD%25E5%258A%25A0.PNG)](https://1.bp.blogspot.com/-PgEzJYqVxSc/WCMNLLvgkBI/AAAAAAAABRQ/scS4pQ0Fd0cQ2GwXYr7blTzj-QkhNm9WwCLcB/s1600/%25E5%258F%2582%25E7%2585%25A7%25E8%25BF%25BD%25E5%258A%25A0.PNG)

ビルトを実行した際に VS ではデフォルトで dll ファイルを作成しますが、Grasshopper で使用するためには拡張子を .dll ではなく .gha にする必要があります。

手でも変えられますが、設定によって自動で変えられるので、設定します。

設定は、「ビルトイベント」の「ビルト後イベントのコマンドライン」に以下を追加することで行います。

[![](https://1.bp.blogspot.com/-N80Y0bSJDvM/WCMQyG9AOjI/AAAAAAAABRc/JfpJJSObNtkZ9D8OtFFzvwbkAsWvP_L1QCLcB/s1600/%25E6%258B%25A1%25E5%25BC%25B5%25E5%25AD%2590%25E5%25A4%2589%25E6%258F%259B.PNG)](https://1.bp.blogspot.com/-N80Y0bSJDvM/WCMQyG9AOjI/AAAAAAAABRc/JfpJJSObNtkZ9D8OtFFzvwbkAsWvP_L1QCLcB/s1600/%25E6%258B%25A1%25E5%25BC%25B5%25E5%25AD%2590%25E5%25A4%2589%25E6%258F%259B.PNG)

これで VS の設定は終わりです。

## コンポーネントの中身を作成する

プログラムの中身の基本的な構造は、GrasshopperSDK にある [My First Component](http://developer.rhino3d.com/api/grasshopper/html/730f0792-7bfb-4310-a416-239e8c315645.htm) をもとに作成しているので、説明を端折っている箇所はそちらを参照してください。
また、一番最後に作成したコードの全部をつけてあるので、そちらも参照してください。

以下では「My First Component」から主に書き換えた箇所の説明をします。クラスの名前等は適宜変えています。

### コンポーネントに名前を付ける

ではまずはコンポーネントに名前をつけるところです。

```cs
public SBComponent() : base(1, 2, 3, 4, 5）
```
base の後の数字の箇所が以下の内容に対応しています。

1. 名前
1. 略称
1. コンポーネントの説明
1. カテゴリ
1. サブカテゴリ

1~3 がコンポーネントそのものに表示されるもの、4,5 が Grasshopper 上部のタブバーに表示されるものです。

### インプット項目の作成

次に、インプット項目の設定です。単純梁を計算するために必要な以下の項目を設定します。

- 部材長さ
- 断面二次モーメント
- 断面係数
- 荷重
- ヤング率

例として部材長さの入力が以下です。


```cs
protected override void RegisterInputParams(GH_InputParamManager pManager)
{
   pManager.AddNumberParameter("Length", "L", "The length of the element (mm)", GH_ParamAccess.item);
}
```

ここの個所では、RegisterInputParams つまりインプットするパラメーターの登録をするということです。

AddNumberParameter で具体的なパラメーターを追加しています。"Length" は名前、"L" は略称、"The length .... " の個所は内容の説明です。以下の画像のように表示されます。

[![](https://2.bp.blogspot.com/-OllQbjArLAs/WCMf8aWB58I/AAAAAAAABRs/iZu3eTmAecMVIHmFQbjY3SUmbsWX889lwCLcB/s320/%25E3%2582%25A4%25E3%2583%25B3%25E3%2583%2597%25E3%2583%2583%25E3%2583%2588.PNG)](https://2.bp.blogspot.com/-OllQbjArLAs/WCMf8aWB58I/AAAAAAAABRs/iZu3eTmAecMVIHmFQbjY3SUmbsWX889lwCLcB/s1600/%25E3%2582%25A4%25E3%2583%25B3%25E3%2583%2597%25E3%2583%2583%25E3%2583%2588.PNG)

### アウトプット項目の設定

次に、アウトプット項目の設定です。

小梁の設計ができるようにすることを想定して以下を設定します。

- 最大曲げ
- 最大曲げ応力度
- 変位

の３項目を設定します。例として曲げモーメントの出力設定が以下です。

```cs
protected override void RegisterOutputParams(GH_OutputParamManager pManager)
{
    pManager.AddNumberParameter("Bending Moment", "M", "output max bending moment(kNm)", GH_ParamAccess.item);
}
```

ここの個所では、RegisterOutputParams つまりアウトプットするパラメーターの登録をするということです。

AddNumberParameter で具体的なパラメーターを追加しています。
"Bending Moment" は名前、"M" は略称、"output max .... " の個所は内容の説明です。インプット項目と同じ以下のように表示されます。

[![](https://2.bp.blogspot.com/-kICfjXHVaL4/WCMi3aDXv1I/AAAAAAAABR4/rHO7sWCDdMw3YT2lOFEFzotUsKbB1adXwCLcB/s320/%25E3%2582%25A2%25E3%2582%25A6%25E3%2583%2588%25E3%2583%2597%25E3%2583%2583%25E3%2583%2588.PNG)](https://2.bp.blogspot.com/-kICfjXHVaL4/WCMi3aDXv1I/AAAAAAAABR4/rHO7sWCDdMw3YT2lOFEFzotUsKbB1adXwCLcB/s1600/%25E3%2582%25A2%25E3%2582%25A6%25E3%2583%2588%25E3%2583%2597%25E3%2583%2583%25E3%2583%2588.PNG)

### 引数の設定

次に計算用に、引数を定義します。

```cs
double L = 0;
if (!DA.GetData(0, ref L)) { return; }
```

とりあえずここでは double 型にしています。GetData の個所の最初の 0 はインプットの最初の項目（0 番目） の値という意味です。

### 計算の実行部の作成

次に実際の計算箇所を作成します。

M=PL/4 などのごく普通の式などで、コードに書いてある通りです。

```cs
M = P * (L/1000) / 4;
Sig = M * 1000_000 / Z;
D = P * 1000 * Math.Pow(L, 3) / (48 * E * I);
```
### 解析結果の出力設定

最後に計算結果とコンポーネントの出力を関連付けます。

```cs
DA.SetData(0, M);
```

SetData の個所で、アウトプットの最初の項目(0 番目)に曲げモーメントの計算結果 M をセットするとしています。

## 完成!!

これで完成です。

完成したものをビルトしエラーがなければプロジェクトの bin フォルダに .gha ファイルが作成されています。

それを Grasshopper の以下からとべるコンポーネントのフォルダにコピー&ペーストし、Rhino、Grasshopper を再起動すれば、作成したコンポーネントが表示されるようになるはずです。

[![](https://3.bp.blogspot.com/-ZIQo9emiGPE/WCMpa1NElQI/AAAAAAAABSI/q9UOVyZjs-USOEj24x6JXy3ASD9K2WcXwCLcB/s320/%25E3%2582%25B3%25E3%2583%25B3%25E3%2583%259D%25E3%2583%25BC%25E3%2583%258D%25E3%2583%25B3%25E3%2583%2588%25E3%2583%2595%25E3%2582%25A9%25E3%2583%25AB%25E3%2583%2580.PNG)](https://3.bp.blogspot.com/-ZIQo9emiGPE/WCMpa1NElQI/AAAAAAAABSI/q9UOVyZjs-USOEj24x6JXy3ASD9K2WcXwCLcB/s1600/%25E3%2582%25B3%25E3%2583%25B3%25E3%2583%259D%25E3%2583%25BC%25E3%2583%258D%25E3%2583%25B3%25E3%2583%2588%25E3%2583%2595%25E3%2582%25A9%25E3%2583%25AB%25E3%2583%2580.PNG)

## 動作確認

実際に使ってみるとこんな感じでした。

パラメーターは、10m スパンの H-300x150 の中央に 10kN かけたモデルです。ちゃんとした答えが得られているようです。

[![](https://3.bp.blogspot.com/-3VK546_gsts/WCMsFBjlUZI/AAAAAAAABSY/5HXSFriE07wRDwDxIV3WyMndAEzHZ_7IQCLcB/s400/%25E4%25BD%25BF%25E3%2581%25A3%25E3%2581%25A6%25E3%2581%25BF%25E3%2581%259F.PNG)](https://3.bp.blogspot.com/-3VK546_gsts/WCMsFBjlUZI/AAAAAAAABSY/5HXSFriE07wRDwDxIV3WyMndAEzHZ_7IQCLcB/s1600/%25E4%25BD%25BF%25E3%2581%25A3%25E3%2581%25A6%25E3%2581%25BF%25E3%2581%259F.PNG)

内容としては、Grasshopper でやる必要が全くない内容のコンポーネントではあります。
ですが、今後は Rhino 上に結果を表示することや、ラインを取り込めるようにするとか考えていきたいですね。

## 完成したコード全文

以下がコードの全文です。

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
            Sig = M * 1000_000 / Z;
            D = P * 1000 * Math.Pow(L, 3) / (48 * E * I);

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
