---
path: "/blog/2020/04/GpuPrograming-in-GH-with-AleaGp"
title: "Alea GPU を使って GrasshopperでGPU並列プログラミング"
date: "20/04/30"
originalUrl: "https://rgkr-memo.blogspot.com/2020/04/GpuPrograming-in-GH-with-AleaGp.html"
slug: "/blog/2020/04/GpuPrograming-in-GH-with-AleaGp"
tags:
    - grasshopper
    - C#
---
<div>GPUプログラミングが面白そうだったので、Grasshopperで実装して動作の感じを確認してみました。実装した方法について説明していきます。</div><div>  
</div><table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto;"><tbody><tr><td style="text-align: center;">[![](https://1.bp.blogspot.com/-0Fs5Nd-oCzc/XqrCTImNSCI/AAAAAAAAB2Q/JBMrTBcHsPYsqQhFMAPTsAxeUlayYX5mgCK4BGAsYHg/w640-h482/gpu.gif)](https://1.bp.blogspot.com/-0Fs5Nd-oCzc/XqrCTImNSCI/AAAAAAAAB2Q/JBMrTBcHsPYsqQhFMAPTsAxeUlayYX5mgCK4BGAsYHg/gpu.gif)</td></tr><tr><td class="tr-caption" style="text-align: center;">  
</td></tr></tbody></table><div>　使用するライブラリは[AleaGPU](http://www.aleagpu.com/release/3_0_4/doc/)です。</div><div>　公式のドキュメントによると、AleaGPUは、早く、使いやすく、高い生産性となっており、コンパイルされたコードはCUDA C、C++と同程度の速さで実行されるとのことです。上記で書きましたが、CUDAを使用しているため、NVIDIAのGTX1050以上GPUを積んでいないと動作しないため注意してください。</div><div>　基本的な内容はこちらのQiitaの記事がわかりやすかったので紹介します。[Alea GPUで簡単C# GPUプログラミング](https://qiita.com/y_miyoshi/items/921903e3499abf18abdd)  
</div><div>　まずVisualStudioでAleaライブラリを使えるようするため、NuGetを使ってインストールしてください。合わせてFSharp.Coreも必要になるので、インストールしてください。ここら辺のやり方はこちらの記事がわかりやすかったので合わせて紹介します。[Alea GPUライブラリを使ってC#で簡単GPU並列プログラミング](https://kzmmtmt.pgw.jp/?p=1170)</div><div>　Aleaが使えるようになったら、Grasshopperでの実装を行っていきます。上で紹介したサイトでは例えば</div><div>

Gpu.Default.for(0, 100, i => hogehoge)  

のようにやる並列計算の例が書かれていますが、簡単に試すためにAleaのあるメソッドを使って今回はやりました。使用したのは平均を求める[GpuExtension.Average メソッド](http://www.aleagpu.com/release/3_0_4/api/html/92879577-0e02-e2e4-7fea-b9777d20505a.htm) と合計を求める[GpuExtension.Sum メソッド](http://www.aleagpu.com/release/3_0_4/api/html/1d45ba9a-3b5f-b4a0-7d1b-a67ccfcad9a1.htm) です。</div><div>　入力を計算したい値のリストとして、SolveInstanceを以下のようにしました。GHの入力はリストですが、並列計算は配列でないとできないため、20行目で入力されたリストを配列に変換しています。その後GpuExtension.Average メソッドを使用してGPUで計算して値を返しています。12行目でGpuManaged のアトリビュートをつけていますが、これはAlea側でGPUのメモリの管理を自動で行ってくれる設定で、これをつけると速度が上がります。  

using System;  
using System.Collections.Generic;  

using Grasshopper.Kernel;  
using Rhino.Geometry;  

using Alea;  
using Alea.Parallel;  

・・・省略・・・  

[GpuManaged]  
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

合計もほぼ同じ書き方で書くことができます。詳細は、最後につけた私のGitHubのリポにソースを上げているので見てください。これでコードは終わりです。</div><div>　これをビルドしただけでは動かないので、次にRhinoに必要なライブラリを入れます。上で作ったコードをビルドをすると以下のように binフォルダの中にAlea関連のファイルがいくつか作成されます。</div><div>  
</div><div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-eAdjBT1FKpg/XqrOjjqxwZI/AAAAAAAAB24/nnMn2asubrQj_oFRfUlwfaLIwCIQF9IXwCK4BGAsYHg/w400-h354/%25E3%2582%25B3%25E3%2583%25A1%25E3%2583%25B3%25E3%2583%2588%2B2020-04-30%2B221105.png)](https://1.bp.blogspot.com/-eAdjBT1FKpg/XqrOjjqxwZI/AAAAAAAAB24/nnMn2asubrQj_oFRfUlwfaLIwCIQF9IXwCK4BGAsYHg/%25E3%2582%25B3%25E3%2583%25A1%25E3%2583%25B3%25E3%2583%2588%2B2020-04-30%2B221105.png)</div><div>  
</div><div>　この中で Alea.CUDA.CT.LibDevice から FSharp.Core.xml までを C:\Program Files\Rhino 6\System 内に入れます。</div><div>　これで動くようになったので、Grasshopperを起動して作成したコンポーネントを使用して比較してみると以下のようになりました。比較としては、合計は、GHのMassAdditionコンポーネントとの比較、平均はGHのAverageコンポーネントとImpalaのQuickAvrコンポーネントとの比較を行っています。</div><div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-Z0CBm7OujaA/XqrRHIXLVOI/AAAAAAAAB3g/lgPgOPav8HM5YVo8haW0ExyZe1MUUVj-gCK4BGAsYHg/w640-h541/EWxUvI9X0AIaZc6.png)](https://1.bp.blogspot.com/-Z0CBm7OujaA/XqrRHIXLVOI/AAAAAAAAB3g/lgPgOPav8HM5YVo8haW0ExyZe1MUUVj-gCK4BGAsYHg/EWxUvI9X0AIaZc6.png)</div><div>　結果としては合計はGPUの方が早く、平均はImpalaが早い結果になりました。計算するデータ数を増やすためにEntwineを使って枝分かれさせて入力してみた結果が以下です。</div><div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-UvrRXc4T1Vs/XqrVJnTBBwI/AAAAAAAAB4I/vxlNQBEbVaIR4I27Xr1SFoWItaQNSafPACK4BGAsYHg/w640-h442/%25E3%2582%25B3%25E3%2583%25A1%25E3%2583%25B3%25E3%2583%2588%2B2020-04-30%2B223814.png)](https://1.bp.blogspot.com/-UvrRXc4T1Vs/XqrVJnTBBwI/AAAAAAAAB4I/vxlNQBEbVaIR4I27Xr1SFoWItaQNSafPACK4BGAsYHg/%25E3%2582%25B3%25E3%2583%25A1%25E3%2583%25B3%25E3%2583%2588%2B2020-04-30%2B223814.png)</div><div>  
</div><div>　並列化処理とか、GPUとのデータのやり取りに時間がかかるので、やっぱり必ずしも早くなるわけではないですね。実装は簡単だけどどんな時それが適切なのかよくわからないので、ここら辺は真面目にコンピューターサイエンスとか勉強してみたい範囲です。</div><div>  
</div><div>　実際に自分でビルドして使ってみたいからはGitHubのリポを参照してください。[https://github.com/hrntsm/GHGpuComputingTest](https://github.com/hrntsm/GHGpuComputingTest)</div>