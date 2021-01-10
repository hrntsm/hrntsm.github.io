---
title: "Alea GPU を使って GrasshopperでGPU並列プログラミング"
date: "2020-04-30"
draft: false
path: "/articles/GpuPrograming-in-GH-with-AleaGp"
article-tags: ["grasshopper", "C#"]
---

GPU プログラミングが面白そうだったので、Grasshopper で実装して動作の感じを確認してみました。実装した方法について説明していきます。

[![](https://1.bp.blogspot.com/-0Fs5Nd-oCzc/XqrCTImNSCI/AAAAAAAAB2Q/JBMrTBcHsPYsqQhFMAPTsAxeUlayYX5mgCK4BGAsYHg/w640-h482/gpu.gif)](https://1.bp.blogspot.com/-0Fs5Nd-oCzc/XqrCTImNSCI/AAAAAAAAB2Q/JBMrTBcHsPYsqQhFMAPTsAxeUlayYX5mgCK4BGAsYHg/gpu.gif)

使用するライブラリは[AleaGPU](http://www.aleagpu.com/release/3_0_4/doc/)です。

公式のドキュメントによると、AleaGPU は、早く使いやすく高い生産性となっており、コンパイルされたコードは CUDA C、C++と同程度の速さで実行されるとのことです。上記で書きましたが、CUDA を使用しているため、NVIDIA の GTX1050 以上 GPU を積んでいないと動作しないため注意してください。

基本的な内容はこちらの Qiita の記事がわかりやすかったので紹介します。[Alea GPU で簡単 C# GPU プログラミング](https://qiita.com/y_miyoshi/items/921903e3499abf18abdd)

まず VisualStudio で Alea ライブラリを使えるようするため、NuGet を使ってインストールしてください。合わせて FSharp.Core も必要になるので、インストールしてください。ここら辺のやり方はこちらの記事がわかりやすかったので合わせて紹介します。[Alea GPU ライブラリを使って C#で簡単 GPU 並列プログラミング](https://kzmmtmt.pgw.jp/?p=1170)

Alea が使えるようになったら、Grasshopper での実装します。上で紹介したサイトでは例えば

```cs
Gpu.Default.for(0, 100, i => hogehoge)
```

のようにやる並列計算の例が書かれていますが、簡単に試すために Alea のあるメソッドを使って今回はやりました。使用したのは平均を求める[GpuExtension.Average メソッド](http://www.aleagpu.com/release/3_0_4/api/html/92879577-0e02-e2e4-7fea-b9777d20505a.htm)  と合計を求める[GpuExtension.Sum メソッド](http://www.aleagpu.com/release/3_0_4/api/html/1d45ba9a-3b5f-b4a0-7d1b-a67ccfcad9a1.htm)  です。

入力を計算したい値のリストとして、SolveInstance を以下のようにしました。GH の入力はリストですが、並列計算は配列でないとできないため、20 行目で入力されたリストを配列に変換しています。その後 GpuExtension.Average メソッドを使用して GPU で計算して値を返しています。12 行目で GpuManaged のアトリビュートをつけていますが、これは Alea 側で GPU のメモリの管理を自動で行ってくれる設定で、これをつけると速度が上がります。

```cs
using System;
using System.Collections.Generic;

using Grasshopper.Kernel;
using Rhino.Geometry;

using Alea;
using Alea.Parallel;

・・・省略・・・

\[GpuManaged\]
protected override void SolveInstance(IGH_DataAccess DA)
{
 var gpu = Gpu.Default;
 double average;
 var inputList = new List<double>();

    if (!DA.GetDataList(0, inputList)) { return; }
    var inputArray = inputList.ToArray();

    average = GpuExtension.Average(gpu, inputArray);

    DA.SetData(0, average);

}
```

合計もほぼ同じ書き方で書くことができます。詳細は、最後につけた私の GitHub のリポにソースを上げているので見てください。これでコードは終わりです。

これをビルドしただけでは動かないので、Rhino に必要なライブラリを入れます。上で作ったコードをビルドをすると以下のように bin フォルダの中に Alea 関連のファイルがいくつか作成されます。

[![](https://1.bp.blogspot.com/-eAdjBT1FKpg/XqrOjjqxwZI/AAAAAAAAB24/nnMn2asubrQj_oFRfUlwfaLIwCIQF9IXwCK4BGAsYHg/w400-h354/%25E3%2582%25B3%25E3%2583%25A1%25E3%2583%25B3%25E3%2583%2588%2B2020-04-30%2B221105.png)](https://1.bp.blogspot.com/-eAdjBT1FKpg/XqrOjjqxwZI/AAAAAAAAB24/nnMn2asubrQj_oFRfUlwfaLIwCIQF9IXwCK4BGAsYHg/%25E3%2582%25B3%25E3%2583%25A1%25E3%2583%25B3%25E3%2583%2588%2B2020-04-30%2B221105.png)

この中で Alea.CUDA.CT.LibDevice から  FSharp.Core.xml までを C:\\Program Files\\Rhino 6\\System 内に入れます。

これで動くようになったので、Grasshopper を起動して作成したコンポーネントを使用して比較してみると以下のようになりました。比較としては、合計は、GH の MassAddition コンポーネントとの比較、平均は GH の Average コンポーネントと Impala の QuickAvr コンポーネントとの比較を行っています。

[![](https://1.bp.blogspot.com/-Z0CBm7OujaA/XqrRHIXLVOI/AAAAAAAAB3g/lgPgOPav8HM5YVo8haW0ExyZe1MUUVj-gCK4BGAsYHg/w640-h541/EWxUvI9X0AIaZc6.png)](https://1.bp.blogspot.com/-Z0CBm7OujaA/XqrRHIXLVOI/AAAAAAAAB3g/lgPgOPav8HM5YVo8haW0ExyZe1MUUVj-gCK4BGAsYHg/EWxUvI9X0AIaZc6.png)

結果としては合計は GPU の方が早く、平均は Impala が早い結果になりました。計算するデータ数を増やすために Entwine を使って枝分かれさせて入力してみた結果が以下です。

[![](https://1.bp.blogspot.com/-UvrRXc4T1Vs/XqrVJnTBBwI/AAAAAAAAB4I/vxlNQBEbVaIR4I27Xr1SFoWItaQNSafPACK4BGAsYHg/w640-h442/%25E3%2582%25B3%25E3%2583%25A1%25E3%2583%25B3%25E3%2583%2588%2B2020-04-30%2B223814.png)](https://1.bp.blogspot.com/-UvrRXc4T1Vs/XqrVJnTBBwI/AAAAAAAAB4I/vxlNQBEbVaIR4I27Xr1SFoWItaQNSafPACK4BGAsYHg/%25E3%2582%25B3%25E3%2583%25A1%25E3%2583%25B3%25E3%2583%2588%2B2020-04-30%2B223814.png)

並列化処理とか、GPU とのデータのやり取りに時間がかかるので、やっぱり必ずしも早くなるわけではないですね。実装は簡単だけどどんな時それが適切なのかよくわからないので、ここら辺は真面目にコンピューターサイエンスとか勉強してみたい範囲です。

実際に自分でビルドして使ってみたいからは GitHub のリポを参照してください。[https://github.com/hrntsm/GHGpuComputingTest](https://github.com/hrntsm/GHGpuComputingTest)
