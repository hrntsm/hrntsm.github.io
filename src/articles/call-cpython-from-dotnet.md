---
title: "C# から CPython のライブラリをコンポーネントの作成"
date: "2022-04-16"
draft: false
path: "/articles/call-cpython-from-dotnet"
article-tags: ["Grasshopper", "Python", "CSharp"]
---

## はじめに

C# に対して、Python は機械学習や数値計算などのライブラリが充実しているので、それを C# でも扱いたいですよね。
そこで、C# から Python を呼べる Pythonnet の使い方について紹介します。

なお、この技術は先日公開した最適化コンポーネント [Tunny](https://www.food4rhino.com/en/app/tunny) を実現するコア技術の 1 つとなっています。

今回のコードの内容は以下に公開していますので、適宜参照してください。

- https://github.com/hrntsm/GH-Pythonnet

### 必要な環境

1. Windows
1. Rhino 7.4 以上
1. CPython 3.8 以上
1. .NET 環境
1. Visual Studio Code(任意の Python と C# を書きやすいテキストエディタ)

## Pythonnet の使い方

### Pythonnet について

Pythonnet は GitHub で公開されています。

- https://github.com/pythonnet/pythonnet

README には以下のように書かれています。

> Python.NET is a package that gives Python programmers nearly seamless integration with the .NET Common Language Runtime (CLR) and provides a powerful application scripting tool for .NET developers.
> It allows Python code to interact with the CLR, and may also be used to embed Python into a .NET application.

DeepL で翻訳すると以下です。

> Python.NET は、Python プログラマに.NET 共通言語ランタイム（CLR）とほぼシームレスに統合し、.NET 開発者向けに強力なアプリケーションスクリプティングツールを提供するパッケージです。
> Python のコードが CLR と対話することを可能にし、Python を.NET アプリケーションに組み込むために使用されることもあります。

書かれているようにシームレスにつなげることを目的にしており、実際にそのことが実現されているライブラリになります。
RhinoInside CPython、RhinoCode、Dynamo の Python スクリプト機能などにもこのライブラリが使われています。

特徴として疑似的なものではなく、本物の Python を実行しています。
そのためこのライブラリが機能するためには Pythonnet 単体では動かず、Python のランタイムそのものも必要となりますので注意してください。

### Python の取得

自身の環境の Python を使うことができますが、ここでは作成したものを人に配布することを想定します。
配布を容易にするものとして embeddable python があり本記事ではこちらを使います。

導入方法などについては以下の記事が詳しいので、本記事では割愛します。
pip が実行可能な状態にしてください。

- [超軽量、超高速な配布用 Python「embeddable python」](https://qiita.com/mm_sys/items/1fd3a50a930dac3db299)

### Numpy の実行

Pythonnet の README で例として Numpy の実行が書かれているのそれが実行できるか確認します。

まずは embeddable Python に numpy をインストールします。
間違えてパスが通っている Python にインストールしないようにちゃんと使いたい Python のパスを指定してインストールしてください。

```Python
Path/to/embeddable python.exe -m pip install numpy
```

Python 環境の支度ができたら、C# のコンソールアプリを作成してください。

dotnet cli を使う場合は以下です。

```
dotnet new console
```

csproj が作成できたら、Pythonnet の nuget パッケージをインストールしてください。
ここではプレリリース版を使うのでバージョンには気を付けてください。
この記事では `3.0.0-preview2022-04-11` を使っています。

初めに使いたい Python へパスを通します。pythonXXX.dll の XXX は Python のバージョンが入ります。
Python3.10 なら Python310.dll になります。

```cs
using System;

class Program
{
    static void Main()
    {
        string envPath = @"Path\to\pythonXXX.dll";
        Environment.SetEnvironmentVariable("PYTHONNET_PYDLL", envPath, EnvironmentVariableTarget.Process);
    }
}
```

ここの内容は実行プロセス中のみ環境変数 `PYTHONNET_PYDLL` にパスを設定しています。
自分の環境だけで使うなら自身の環境変数を直接設定しても問題ありません。

続いて Numpy を実行する部分を書いていきます。

```cs
PythonEngine.Initialize();
using (Py.GIL())
{
    dynamic np = Py.Import("numpy");
    Console.WriteLine(np.cos(np.pi * 2));

    dynamic sin = np.sin;
    Console.WriteLine(sin(5));

    double c = (double)(np.cos(5) + sin(5));
    Console.WriteLine(c);

    dynamic a = np.array(new List<float> { 1, 2, 3 });
    Console.WriteLine(a.dtype);

    dynamic b = np.array(new List<float> { 6, 5, 4 }, dtype: np.int32);
    Console.WriteLine(b.dtype);

    Console.WriteLine(a * b);
}
PythonEngine.Shutdown();
```

これが問題なく実行できると以下のようにコンソールに出力されます。

```
1.0
-0.9589242746631385
-0.6752620891999122
float64
int32
[ 6. 10. 12.]
```

これが簡単な Pythonnet の実行の例です。
とてもシームレスに C# から Python のライブラリを呼ぶことができたのではないでしょうか。  
なお当然な感じもありますが、コードヒントは聞かないので注意してください。

### 任意 Python コードの実行例

上記では、比較的コードのような形で Python を実行しましたが、Python コンソールのようにも実行できます。

例えば以下です。
スコープを作成してその中で `a` という変数を作成しそれに 2 を足す計算を評価しておりコンソールには 3 と表示されます。

```cs
using (Py.GIL())
{
    PyModule ps = Py.CreateScope();
    ps.Set("a", 1);
    var result = ps.Eval<int>("a + 2");
    Console.WriteLine(result);
}
// 3
```

以下は 2 つの変数を定義して、それらを使った計算をしている例です。
結果は 113 になります。

```cs
using (Py.GIL())
{
    PyModule ps = Py.CreateScope();
    ps.Set("bb", 100);
    ps.Set("cc", 10);
    ps.Exec("aa = bb + cc + 3");
    var result2 = ps.Get<int>("aa");
    Console.WriteLine(result2);
}
// 113
```

関数を定義したり、スコープを入れ子にしたりできます。

```cs
using (Py.GIL())
{
    PyModule ps = Py.CreateScope();
    ps.Set("bb", 100);
    ps.Set("cc", 10);
    ps.Exec(
        "def func1():\n" +
        "    return cc + bb\n"
    );

    using (PyModule scope = ps.NewScope())
    {
        scope.Exec(
            "def func2():\n" +
            "    return func1() - cc - bb\n"
        );
        dynamic func2 = scope.Get("func2");

        var result31 = func2().As<int>();
        Console.WriteLine(result31); // 0

        scope.Set("cc", 20);
        var result32 = func2().As<int>();
        Console.WriteLine(result32); //-10
        scope.Set("cc", 10);

        ps.Set("cc", 20);
        var result33 = func2().As<int>();
        Console.WriteLine(result33); //10
    }
}
```

クラスの定義もできます。

```cs
using (Py.GIL())
{
    PyModule ps = Py.CreateScope();
    dynamic ps2 = ps;
    ps2.bb = 100;
    ps.Exec(
        "class Class1():\n" +
        "    def __init__(self, value):\n" +
        "        self.value = value\n" +
        "    def call(self, arg):\n" +
        "        return self.value + bb + arg\n" +
        "    def update(self, arg):\n" +
        "        global bb\n" +
        "        bb = self.value + arg\n"
    );
    dynamic obj1 = ps2.Class1(20);
    var result41 = obj1.call(10).As<int>();
    Console.WriteLine(result41); //130

    obj1.update(10);
    var result42 = ps.Get<int>("bb");
    Console.WriteLine(result42); //30
}
```

これを見るとわかるように、ちゃんとした Python のコードとしての文字列を入力すると Pythonnet によってその処理が実行されるということがわかります。
これを踏まえ Python コードのテキストを入力にした Grasshopper コンポーネントを作ってみましょう。

## Python 実行コンポーネントの作成

これまでの内容から、簡単に作れるでしょう。
Grasshopper コンポーネント作成の基礎的な部分は省略して必要な部分だけ紹介します。

まず入力は Python のコード、つまりテキストにしたいので以下になります。

```cs
protected override void RegisterInputParams(GH_InputParamManager pManager)
{
    pManager.AddTextParameter("Python Code", "Python Code", "Python Code", GH_ParamAccess.item);
}
```

出力は数値計算結果にしたいので Number とします。

```cs
protected override void RegisterOutputParams(GH_OutputParamManager pManager)
{
    pManager.AddNumberParameter("Output", "Output", "Output", GH_ParamAccess.item);
}
```

SolveInstance は上でやったことを考慮して以下になります。

```cs
protected override void SolveInstance(IGH_DataAccess DA)
{
    string pythonCode = string.Empty;
    double result = 0;
    if(!DA.GetData(0, ref pythonCode)) { return; }

    string envPath = "Path/to/PythonXXX.dll";
    Environment.SetEnvironmentVariable("PYTHONNET_PYDLL", envPath, EnvironmentVariableTarget.Process);

    PythonEngine.Initialize();
    using (Py.GIL())
    {
        PyModule ps = Py.CreateScope();
        ps.Exec(pythonCode);
        result = ps.Get<double>("result");
    }
    PythonEngine.Shutdown();

    DA.SetData(0, result);
}
```

ここでは `result` という変数名を double で出力するようにしているので、入力する Python のコードにも必ず `result` という変数を含む必要があります。

こちらでビルドすれば以下のように入力したコードを実行するコンポーネントが作成できたのではないでしょうか。
(動画がうまく表示されない場合はリロードしてください。)

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">最近 C# で CPython を実行する方法を調べてたけど副次的に任意の Python コード実行する Grasshopper コンポーネント作れて、また Grasshopper への理解が深まった。 <a href="https://t.co/qnwqlKO3a4">pic.twitter.com/qnwqlKO3a4</a></p>&mdash; hiron (@hiron_rgkr) <a href="https://twitter.com/hiron_rgkr/status/1507538203846213634?ref_src=twsrc%5Etfw">March 26, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
