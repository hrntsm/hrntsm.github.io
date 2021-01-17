---
title: "Grasshopper コンポーネントをダブルクリックした際に WindowsForm を呼ぶ方法"
date: "2019-12-10"
draft: false
path: "/articles/call-winform-from-gh"
article-tags: ["CSharp", "Grasshopper", "Qiita"]
---

# はじめに

[この記事](./colouring-gh-wire)と同様に Galápagos のようなコンポーネントを作ろうとした際に、Grasshopper のコンポーネントから WindowsForm で作ったものを表示させたかったので、やり方を示します。

ちなみに、Rhino は Mac 版もあるので、どちらも対応したものを作成したい場合は、WindowsForm ではなく Rhino が対応しているクロスプラットフォームインターフェースの[Eto](https://github.com/mcneel/Eto)を使ってください。

なおこの記事は、RhinocerosForum の[この質問](https://discourse.mcneel.com/t/optimization-plug-in-for-grasshopper-how-to-use-galapagos-interface-and-gene-pool/27267/18)の内容を参考に作っています。

# 完成品のイメージ

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">今日のもくもく会の成果<br>GrasshopperのNumberSliderを、コンポーネントをダブルクリックして呼び出せるWindowsフォームのsliderから操作できました～ <a href="https://t.co/tDEtHmxPA1">pic.twitter.com/tDEtHmxPA1</a></p>&mdash; hiron/6cores (@hiron_rgkr) <a href="https://twitter.com/hiron_rgkr/status/1144930156747751424?ref_src=twsrc%5Etfw">June 29, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

# 作り方

作成には [GH_ComponentAttributes クラス](https://developer.rhino3d.com/api/grasshopper/html/T_Grasshopper_Kernel_Attributes_GH_ComponentAttributes.htm)を作り、コンポーネントをダブルクリックした際にウインドウが出てきて欲しいので、
GH_Attributes の RespondToMouseDoubleClick メソッド

- [RespondToMouseDoubleClick メソッド](https://developer.rhino3d.com/api/grasshopper/html/M_Grasshopper_Kernel_GH_Attributes_1_RespondToMouseDoubleClick.htm)

を使います。これを使うことで、ダブルクリックした際に DisplayForm（別途作成している WinForm）を呼び出しています。

```CS
public class Attributes_Custom : GH_ComponentAttributes 
{
    public Attributes_Custom(IGH_Component ChangeNumSlider)
      : base(ChangeNumSlider) { }

    public override GH_ObjectResponse RespondToMouseDoubleClick(GH_Canvas sender, GH_CanvasMouseEvent e)
    {
        (Owner as ChangeNumSlider)?.DisplayForm();
        return GH_ObjectResponse.Handled;
    }
}
```

上で作成したアトリビュートをコンポーネントに適用したいので、[GH_Component クラス](https://developer.rhino3d.com/api/grasshopper/html/Methods_T_Grasshopper_Kernel_GH_Component.htm) の [CreateAttributes メソッド](https://developer.rhino3d.com/api/grasshopper/html/M_Grasshopper_Kernel_GH_Component_CreateAttributes.htm)を[オーバーライド](https://docs.microsoft.com/ja-jp/dotnet/csharp/language-reference/keywords/override)します。

```CS
public override void CreateAttributes()
{
    m_attributes = new Attributes_Custom(this);
}
```

WindowsForm の使い方などはほかの記事の方が詳しいと思うので、ここでは割愛します。

## ビルトした動くものを作りたい場合

ここで説明した内容は[ホタルアルゴリズム](https://ja.wikipedia.org/wiki/%E3%83%9B%E3%82%BF%E3%83%AB%E3%82%A2%E3%83%AB%E3%82%B4%E3%83%AA%E3%82%BA%E3%83%A0)による最適化コンポーネントを目指して作り出した[ホタルコンポーネント](https://github.com/hrntsm/HotaruComponent/tree/develop)の一部です（モチベーションなくなってエタッてしまいました…）。

ホタルコンポーネントのリンク先の github の Develope ブランチをクローンしてビルトしてもらえば動く gh コンポーネントが作成されると思います。直接の部分は[ChangeNumSlider.cs](https://github.com/hrntsm/HotaruComponent/blob/develop/HotaruComponent/ChangeNumSlider.cs) の部分で、他はホタルアルゴリズムの実装を行っている箇所です。

Grasshopper 内の C#スクリプトコンポーネントでは WindowsForm を作るのが面倒なので、Visual Studio Community 2019 を使っています。

## ちなみに

カスタムアトリビュートについては、[公式の説明](https://developer.rhino3d.com/api/grasshopper/html/8a7974ab-7b2b-4f48-84d0-6e81b184e6b0.htm)もあるので詳しく知りたい方はそちらも参照どうぞ。
