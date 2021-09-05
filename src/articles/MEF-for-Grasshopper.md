---
title: "Managed Extensibility Framework を使った Grasshopperコンポーネント開発"
date: "2021-09-05"
draft: false
path: "/articles/MEF-for-Grasshopper"
article-tags: ["CSharp", "Grasshopper", "DI"]
---

## はじめに

Grasshopper コンポーネント開発をするとき、ビルドするたびに Rhino を再起動するのが面倒に感じたことはありませんか。

Rhino を再起動することなくビルドし直した内容を反映する方法として、Managed Extensibility Framework (MEF)を使った Grasshopper コンポーネントの開発について紹介します。

## MEF について

以下 MicroSoft の [ドキュメント](https://docs.microsoft.com/ja-jp/dotnet/framework/mef/) より引用。

> *Managed Extensibility Framework (MEF) は、軽量で拡張可能なアプリケーションを作成するためのライブラリです。*
> *これにより、アプリケーション開発者は、拡張機能を見つけたら、それをそのまま使用できます。*
> *構成は必要ありません。*
> *拡張機能の開発者は、コードを簡単にカプセル化できるため、ハードコーディングによる脆弱な依存関係を回避できます。*
> *MEF により、アプリケーション内だけでなく、アプリケーション間でも拡張機能を再利用できます。*

例えば Excel や Word などの製品は全てアドオンを使って機能拡張を行うことができるようになっています。
こういった拡張性のあるアプリケーションを作ろうとしたときに必要となるであろう機能セットを提供しているものが MEF になります。
実際どのような機能を提供しているかというと、一般的に DI コンテナと呼ばれる機能になります。

細かい詳細は以下の記事が詳しいので参考にしてください。

- [Managed Extensibility Framework 入門 まとめ](https://blog.okazuki.jp/entry/20110507/1304772329)

この内容を始める前に、上記記事のその１「はじめに」をやることをおすすめします。

## Grasshopper での MEF の利用

ここで紹介する方法は、Rhino コマンドで MEF を使っている以下の記事を Grasshopper 向けにしたものとなります。参照している記事が 5 年前のものなので、最新の .NET 向けへの書き換えも含まれています。

- [Managed Extensibility Framework (MEF) Plugin for Rhinoceros RhinoCommon](https://www.codeproject.com/Articles/1091178/Managed-Extensibility-Framework-MEF-Plugin-for-Rhi)

本内容と若干異なりますが、作成例として以下にデータをあげていますので必要に応じて参照してください。

- [hrntsm/MEF-for-Grasshopper-Plugin](https://github.com/hrntsm/MEF-for-Grasshopper-Plugin)

### 通常の Grasshopper コンポーネントの作成

まずはもととなる単純に文字列を出力する Grasshopper コンポーネントを作成します。
VisualStudio の Grasshopper コンポーネントのテンプレートなどを試用して作成してください。

後に MEF 関連のコードを追加するので以下のようなフォルダ構成にすることをおすすめします。

```
GrasshopperMEF
  │ GrasshopperMEF.sln
  └─PluginLoader
      PluginLoader.csproj
      PluginLoaderComponent.cs
      PluginLoaderInfo.cs
```

PluginLoaderComponent.cs の中身は以下のように入力されたテキストを逆順にして返すだけのものにします。

```cs
using System;
using System.Linq;
using Grasshopper.Kernel;

namespace PluginLoader
{
    public class PluginLoaderComponent : GH_Component
    {
        public PluginLoaderComponent()
          : base("PluginLoader", "Loader", "PluginLoader", "TAEC", "MEF")
        {
        }

        protected override void RegisterInputParams(GH_InputParamManager pManager)
        {
            pManager.AddTextParameter("text", "t", "text", GH_ParamAccess.item);
        }

        protected override void RegisterOutputParams(GH_OutputParamManager pManager)
        {
            pManager.AddTextParameter("rev", "r", "rev text", GH_ParamAccess.item);
        }

        protected override void SolveInstance(IGH_DataAccess DA)
        {
            string text = string.Empty;
            if (!DA.GetData(0, ref text)) { return; }

            var util = new Util();
            var rev = util.RevText(text);
            DA.SetData(0, rev);
        }

        protected override System.Drawing.Bitmap Icon => null;
        public override Guid ComponentGuid => new Guid("PLEASE SET GUID");
    }

    public class Util
    {
        public string RevText(string text)
        {
            return new string(text.Reverse().ToArray());
        }
    }
}
```

当然ですが、Rhino が起動している中でこのコンポーネントをビルドし直しても、それが反映されません。  
Util クラスへの依存性を後から注入にできるようにこれから書き換えていきます。

### 別プロジェクトとして書き換え

別のビルドとして上記 Util クラスを扱えるようにするため、別のプロジェクトに分離します。クラスライブラリとして作成してください。ターゲットフレームワークは Grasshopper のものと合わせて .NET Framework 4.8 にしてください。

フォルダ構成としては以下になります。

```
GrasshopperMEF
  │ GrasshopperMEF.sln
  ├─PluginLoader
  │   PluginLoader.csproj
  │   PluginLoaderComponent.cs
  │   PluginLoaderInfo.cs
  └─PluginUtil  ← 追加
      PluginUtil.csproj
      PluginUtil.cs
```

この PluginUtil の内容をコンポーネントで使えるようにするため、PluginLoader が PluginUtil.csproj をプロジェクト参照するようにしてください。

プロジェクト参照できていれば、PluginLoaderComponent.cs は冒頭に以下を追加すれば PluginUtil が使えるようになります。

**PluginLoaderComponent.cs**

```cs
using System;
using Grasshopper.Kernel;

// 追加
using PluginUtil;

namespace PluginLoader
{
    public class PluginLoaderComponent : GH_Component
    {
        public PluginLoaderComponent()
          : base("PluginLoader", "Loader", "PluginLoader", "TAEC", "MEF")
        {
        }
    // 省略
    }

    // 以下は PluginUtil のものを使うため、コメントアウトする
    // public class Util
    // {
    //     public string RevText(string text)
    //     {
    //         return new string(text.Reverse().ToArray());
    //     }
    // }
}
```

**PluginUtil.cs**

```cs
using System.Linq;

namespace PluginUtil
{
    public class Util
    {
        public string RevText(string text)
        {
            return new string(text.Reverse().ToArray());
        }
    }
}
```

これで、Grasshopper コンポーネントとテキストを逆転させる関数の依存関係が変化しました。

PluginLoader/bin のフォルダを確認すると以下のような構成になっており、PluginUtil.dll が含まれていることがわかります。
最初は gha ファイル単体で完結していたものが、PluginUtil.dll を読み込みその中の RevText メソッドを使う形に変わっています。

```
PluginLoader
└─bin
   └─Debug
      └─net48
         PluginLoader.gha
         PluginUtil.dll
```

### MEF を使う形へ書き換え

依存性を注入する際に共通のインターフェースの必要があるため、まずインターフェース用のプロジェクトを作成します。内容はインターフェースを定義するだけです。

フォルダの構成は以下のようになります。

```
GrasshopperMEF
  │ GrasshopperMEF.sln
  ├─PluginContract ← 追加
  │   PluginContract.cs
  │   PluginContract.csproj
  ├─PluginLoader
  └─PluginUtil
```

**PluginContract.cs**

```cs
using System;

namespace PluginContract
{
    public interface IPlugin
    {
        string RevText(string text);
    }
}
```

インターフェースを使うために、PluginContract.csproj を PluginLoader.csproj と PluginUtil.csproj がプロジェクト参照するようにしましょう。

また、今後 MEF を使って PluginLoader と PluginUtil を関連付けるため、この PluginLoader の PluginUtil へのプロジェクト参照を解除してください。

MEF は System.ComponentModel.Composition を使用します。Nuget を使って使用できるようにしておいてください。

- [nuget/System.ComponentModel.Composition](https://www.nuget.org/packages/System.ComponentModel.Composition/)

まず、DI の対象としてエクスポートされるように、PluginUtil を以下のように変更します。

**PluginUtil.cs**

```cs
using System.Linq;

// 追加
using PluginContract;
using System.ComponentModel.Composition;

namespace PluginUtil
{
    [Export(typeof(IPlugin))] // IPlugin 型として Export するように属性を追加
    public class Util : IPlugin // IPlugin を継承する
    {
        public string RevText(string text)
        {
            return new string(text.Reverse().ToArray());
        }
    }
}
```

次にこのクラスを MEF を使って Grasshopper コンポーネントに依存性を注入できるようにします。

**PluginLoader.cs**

```cs
using System;
using Grasshopper.Kernel;

// 追加
using PluginContract;
using System.Reflection;
using System.ComponentModel.Composition;
using System.ComponentModel.Composition.Hosting;

namespace PluginLoader
{
    public class PluginLoaderComponent : GH_Component
    {
        // DI で注入できるように IPlugin 型でインポートするように設定
        [Import(typeof(IPlugin))]
        public IPlugin plugin;

        public PluginLoaderComponent()
          : base("PluginLoader", "Loader", "PluginLoader", "TAEC", "MEF")
        {
        }

        protected override void RegisterInputParams(GH_InputParamManager pManager)
        {
            // dll の path を入れる InputParams を追加
            pManager.AddTextParameter("path", "p", "DLL path", GH_ParamAccess.item);
            pManager.AddTextParameter("text", "t", "text", GH_ParamAccess.item);
        }

        protected override void RegisterOutputParams(GH_OutputParamManager pManager)
        {
            pManager.AddTextParameter("rev", "r", "rev text", GH_ParamAccess.item);
        }

        protected override void SolveInstance(IGH_DataAccess DA)
        {
            string path = string.Empty;
            string text = string.Empty;
            if (!DA.GetData(0, ref path)) { return; }
            if (!DA.GetData(1, ref text)) { return; }

            // DI 用にカタログ、コンテナを作って、plugin に依存性を注入
            var catalog = new AggregateCatalog(
                new AssemblyCatalog(Assembly.Load(System.IO.File.ReadAllBytes(path)))
            );
            var container = new CompositionContainer(catalog);
            container.ComposeParts(this);

            // plugin を使って RevText メソッドが使える
            var rev = plugin.RevText(text);
            catalog.Dispose();
            container.Dispose();

            DA.SetData(0, rev);
        }

        protected override System.Drawing.Bitmap Icon => null;
        public override Guid ComponentGuid => new Guid("PLEASE SET GUID");
    }
}
```

これで、Grasshopper を起動して Path のインプットにビルドした PluginUtil.dll へのパスを入れると dll の内容を読み取って依存性を注入してくれます。

Rhino を起動したままにした状態で、PluginUtil.cs の内容を書き換えます。
そして、PluginUtil.csproj を再ビルドし、Grasshopper を再実行すると変更した内容が反映されます。

ソリューション全体をビルドし直してしまうと、 .gha ファイルは Rhino で使われているのでエラーになります。PluginUtil.csproj のみビルドしてください。

ちなみに MEF で注入した DLL ファイルはデバッグビルドしていれば VisualStudio を使ったデバッグの対象になります。デバッグが必要な場合は適宜ブレークポイントを設置して確認してください。


これで MEF を使って Grasshopper コンポーネント開発の紹介は終わりです。
