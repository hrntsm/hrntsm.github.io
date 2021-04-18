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

```bash
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

ここで作成したコンポーネントを別記事で CI することを書いているので、ここでは VisualStudio を使わず、dotnet.exe を使ってコンポーネントとの作成のテンプレートを作成します。
VisualStudio のテンプレートでの作成でも構いません。

はじめに PowerSell で以下を実行すると dotnet に Grasshopper のテンプレートが入ります。

```powershell
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

```powershell
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
