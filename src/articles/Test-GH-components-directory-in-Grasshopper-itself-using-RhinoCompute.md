---
title: "RhinoCompute を使ったGrasshopperコンポーネントのユニットテストの作成"
date: "2021-04-24"
draft: false
path: "/articles/test-gh-component-using-rhinocompute"
article-tags: ["Grasshopper", "RhinoCompute"]
---

## はじめに

通常開発した Grasshopper コンポーネントは Rhino の GUI を使用して動作確認、テストを行います。
ですがこれでは軽微な変更であっても挙動を変更した時、毎回デバッグを実行して Rhino、そして Grasshopper の起動を待って、さらに GH ファイルを読み込む手順を踏むことになります。
これは、作業効率を落とす原因になっていないでしょうか。

Rhino7 の新機能 RhinoCompute を使うことで、MsTest などから Grasshopper コンポーネントのテストを実行することが可能になったのでその方法について紹介します。

## 環境構築

RhinoCompute を実行できる環境を構築してください。mcneel の GitHub などからダウンローでできます。
一番簡単な方法は Hops をインストールすることです。

以下の記事を参考に Hops をインストールしてください。

- [Grasshopper の Hops の始め方](./Try-Hops-component)

インストールされた Hops は例えば ver0.4.7 ならば以下のフォルダにデータが入っています。

> %APPDATA%/McNeel/Rhinoceros/packages/7.0/Hops/0.4.7/compute.geometry

上記フォルダ内の compute.geometry.exe を実行し、以下の最後にあるように running になれば RhinoCompute が動いています。

```ps
[20:43:46 INF] Compute 1.0.0.0, Rhino 7.5.21100.3001
[20:43:46 INF] Configuration Result:
[Success] Name compute.geometry
[Success] DisplayName rhino.compute
[Success] Description rhino.compute
[Success] ServiceName compute.geometry
[20:43:46 INF] Topshelf v4.1.0.172, .NET Framework v4.0.30319.42000
[20:43:46 INF] Launching RhinoCore library as hiron
[20:43:48 INF] Starting listener(s): ["http://localhost:8081"]
[20:43:50 INF] (1/2) Loading grasshopper
[20:43:56 INF] (2/2) Loading compute plug-ins
[20:43:57 INF] Listening on ["http://localhost:8081"]
[20:43:57 INF] The compute.geometry service is now running, press Control+C to exit.
```

## コンポーネントの作成

### テンプレートの作成

ここで作成したコンポーネントを別記事で CI することを書いているので、ここでは VisualStudio を使わず、dotnet.exe を使ってコンポーネントとの作成のテンプレートを作成します。
VisualStudio のテンプレートでの作成でも構いません。

はじめに PowerSell で以下を実行すると dotnet に Grasshopper のテンプレートが入ります。

```ps
dotnet new --install Rhino.Templates
```

問題なくインストールされると以下のようになり、Templates の中に Grasshopper Component が含まれます。

```
dotnet new

Templates                                     Short Name           Language    Tags
--------------------------------------------  -------------------  ----------  ----------------------
Grasshopper Component                         ghcomponent          [C#],VB     Rhino/Grasshopper
Grasshopper Assembly                          grasshopper          [C#],VB     Rhino/Grasshopper
RhinoCommon Command                           rhinocommand         [C#],VB     Rhino/RhinoCommon
RhinoCommon Plug-In                           rhino                [C#],VB     Rhino/RhinoCommon
Zoo Plug-In for Rhinoceros                    zooplugin            [C#],VB     Rhino/Zoo
```

コンポーネントを作成したいフォルダに移動して、以下を実行してソリューションファイルとその中身を作成など初期の支度をします。

```ps
# sln ファイルと csproj の作成
mkdir GHCITest
cd GHCITest
dotnet new sln
mkdir GHCITest
dotnet new ./GHCITest/grasshopper
dotnet sln ./GHCITest.sln add ./GHCITest/GHCITest.csproj
dotnet restore
# git の初期化
dotnet new gitignore
git init
```

`dotnet new grasshopper --help` でヘルプを見ることができます。
引数を指定することでコンポーネントの名前やカテゴリの初期値を指定できます。

環境が構築できたので作成した sln ファイルを VisualStudio で開きます。

### コンポーネントの作成

コンポーネントの作成はここの本題ではないので、以下のように A と B の和を出力する単純なコンポーネントを作成します。

```cs
protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
{
    pManager.AddNumberParameter("A", "A", "A", GH_ParamAccess.item);
    pManager.AddNumberParameter("B", "B", "B", GH_ParamAccess.item);
}

protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
{
    pManager.AddNumberParameter("Result", "Result", "Result", GH_ParamAccess.item);
}

protected override void SolveInstance(IGH_DataAccess DA)
{
    double A = 0;
    double B = 0;
    if (!DA.GetData("A", ref A)) { return; }
    if (!DA.GetData("B", ref B)) { return; }

    DA.SetData("Result", A + B);
}
```

## テストの作成

### テンプレートの作成

CLI から作成します。
作る際はルートディレクトリで以下を行ってください。

```ps
mkdir GHCITestTests
dotnet new mstest -o ./GHCITestTests
dotnet sln ./GHCITest.sln add ./GHCITestTests/GHCITestTests.csproj
cd ./GHCITestTests
dotnet add package Newtonsoft.Json --version 13.0.1
dotnet add package Rhino3dm --version 0.3.0
```

もちろん以下のように VisualStudio の機能を使って作成しても問題ありません。

![Create Test](https://hiron.dev/article-images/test-gh-component-using-rhinocompute/createTest.jpg)

### テスト用 GH ファイルの作成

以下のように 2 つの値を入れて結果を取得します。
RhinoCompute を使用するので、入出力はそれ用に設定しています。

![GH Definition](https://hiron.dev/article-images/test-gh-component-using-rhinocompute/ghDefinition.jpg)

作成したファイルは GHCITestTests のフォルダに入れ、VisualStudio から出力ディレクトリに常にコピーするように以下の設定をしてください。

![Copy File](https://hiron.dev/article-images/test-gh-component-using-rhinocompute/copyFile.jpg)

または GHCITestTests.csproj に以下を追加してください。

```xml
<ItemGroup>
  <None Update="SumComponentTest.gh">
    <CopyToOutputDirectory>Always</CopyToOutputDirectory>
  </None>
</ItemGroup>
```

RhinoCompute で問題なく値を扱えるかは Hops を使うことで確認できます。

この後のテストでうまくいかなかった場合は Hops で gh ファイルが問題ないか確認することをおすすめします。

### テストコードの作成

はじめに RhinoCompute を使用するための SDK を取得します。ブラウザで以下を入力するとダウンロードされます。

> https://localhost:8081/sdk/csharp

ダウンロードされたファイルをテストの csproj ファイルと同じ場所へ置き参照できるようにします。

実際にテストを実行するコードを書いていきます。
内容は以下です。

```cs
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Rhino.Compute;

namespace GHCITest.Tests
{
    [TestClass]
    public class GHCITestComponentTests
    {
        [TestMethod]
        public void GHCITestComponentTest()
        {
            // RhinoCompute のアドレス
            ComputeServer.WebAddress = "http://localhost:8081/";

            // GH ファイルパス指定
            const string definitionName = "SumComponentTest.gh";
            string definitionPath = Assembly.GetExecutingAssembly().Location;
            definitionPath = Path.GetDirectoryName(definitionPath);
            definitionPath = Path.Combine(definitionPath, definitionName);

            var trees = new List<GrasshopperDataTree>();

            // A に 10 の値を入れる
            var value1 = new GrasshopperObject(10);
            var param1 = new GrasshopperDataTree("A");
            param1.Add("0", new List<GrasshopperObject> { value1 });
            trees.Add(param1);

            // B に 35 の値を入れる
            var value2 = new GrasshopperObject(35);
            var param2 = new GrasshopperDataTree("B");
            param2.Add("0", new List<GrasshopperObject> { value2 });
            trees.Add(param2);


            List<GrasshopperDataTree> result = GrasshopperCompute.EvaluateDefinition(definitionPath, trees);
            string data = result[0].InnerTree.First().Value[0].Data;

            // 結果の確認
            Assert.AreEqual(45, double.Parse(data));
        }
    }
}

```

RhinoCompute が実行されている状態でテストを実行すると RhinoCompute で作成した Grasshopper ファイルの計算結果が帰って来ます。
その値を使って Assert.AreEqual を行って結果を評価します。

CLI からテストを実行する場合は以下です。

```ps
dotnet test
```

問題なく RhinoCompute と通信していれば rhino.compute に以下のように表示されます。
ステータスコードが 200 なので通信の成功を確認できます。

```
::1 - [2021-04-19T00:15:20.1053330+09:00] "POST /grasshopper HTTP/1.1" 200 -
```

## 次のステップ

Grasshopper の GUI を使うことなく開発したコンポーネントのテストできることが確認できました。
これを CI 化することでテストの自動化を行います。

CI の記事は以下になります。
- [aaa]()
