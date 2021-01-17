---
title: "Unity で RhinoInside を使って VR アプリを作ってみる"
date: "2019-08-04"
draft: false
path: "/articles/unity-rhinoinside-vr-app"
article-tags: ["CSharp", "Unity", "Rhinoceros", "SteamVR", "Qiita"]
---

## はじめに

この記事は Rhino7(2019/7 現在 WIP 版)に向けて開発されている、RhinoInside をつかって、Unity から Rhino の機能を呼び出して VR の中で形をいじることができるアプリの作り方について説明していきます。
　そもそも Rhino とは何かというと、NURBS モデリングに特化した商用の製造業向け 3 次元 CAD ソフトウェア（3D サーフェスモデラー）で、その中のジオメトリの計算機能を SDK から呼び出して Rhino 以外のソフトからでも使えるようになったのが RhinoInside です。

## 完成品

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">RhinoInsideを使ったVRアプリできました～<br>exeファイルを起動してUnityのロゴが出た後、一瞬でる画面が裏のRhinoを起動している瞬間です。<br>機能はこれまでと同じで球で曲面を動かすだけです…<br>RhinoWIPとSteamVRが使用できる環境にある数少ない人たちしか使えない誰得アプリ<a href="https://twitter.com/hashtag/rhinoinside?src=hash&amp;ref_src=twsrc%5Etfw">#rhinoinside</a> <a href="https://twitter.com/hashtag/Unity?src=hash&amp;ref_src=twsrc%5Etfw">#Unity</a> <a href="https://t.co/a0w6ZVYpCQ">pic.twitter.com/a0w6ZVYpCQ</a></p>&mdash; hiron (@hiron_rgkr) <a href="https://twitter.com/hiron_rgkr/status/1154027787067351040?ref_src=twsrc%5Etfw">July 24, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## RhinoInside Unity のサンプルさわるまでのやり方

まず RhinoInside を Unity で使えるようにします。やり方は公式の GitHub に掲載の通りですが、README の内容をざっくり説明します。

### 必要なもの

1. GIT のクライアント([ダウンロード](https://git-scm.com/downloads))
2. RhinoWIP([ダウンロード](https://www.rhino3d.com/download/rhino/wip))(Rhino のライセンスを持っていないと使えません)
3. Unity([ダウンロード](https://unity3d.com/jp/get-unity/download))

### 公式 GitHub を参考にやり方

公式 GitHub の README では Unity のバージョンは 2018.3 ですが、私の Unity の環境は後述の steamVR の使い方がよくわかなかったので、2017.4 です。
 
RhinoInside は GitHub にあるので、コマンドラインから

```
git clone --recursive https://GitHub.com/mcneel/rhino.inside.git rhino.inside`
```

をして、GitHub のものをクローンするか、以下のように GitHub からそのまま ZIP ファイルでダウンロードして下さい。

![GitHubからそのままZIPファイルでダウンロード](https://1.bp.blogspot.com/-6FrJTWdsyhY/XT2k2N0L9kI/AAAAAAAABqE/_Egd3lT3aLwAbBKyENKsKrIMBUNmKCPXwCLcBGAs/s640/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

その後、Unity からダウンロードしたフォルダの中の Rhino.Inside/Unity/Sample1 のプロジェクトを開きます。サンプルの操作は、GitHub の README の説明が動画になっているいてわかりやすいと思いますのでそちらをどうぞ。  
 Unity の menubar の Sample1 から CreateLoftSurface をやると Unity の Scene の画面に Loft された Surface が表示されます。この LoftSurface の作成に RhinoInside が使われています。

## VR でアバターを動かす環境整理

次に VR 側の話です。こちらはあきら(@sh_akira)さんの Qiita の記事を を参考にやりました。詳細はそちらを見てください。

- [UniVRM + SteamVR+Final IK で始める ](https://qiita.com/sh_akira/items/81fca69d6f34a42d261c)

### 必要なもの

1. HTC Vive
1. VR Ready PC
1. UniVRM
1. SteamVR plugin 2.0.1（リンク先のあきらさんの記事にあるように私の環境でもうまくいかなかったので、ver2.0.1 を使っています）
1. Final IK （こちらは有料なので、注意）
1. OVRLipSync（リップシンクはうまくいかなかったので、使ってないです）
1. AniLipSync-VRM（リップシンクはうまくいかなかったので、使ってないです）
1. VRM モデル（今回は[アリシアソリッドちゃん](https://3d.nicovideo.jp/alicia/)を使ってます。）

## RhinoInside を VR でいじれるようにしていく

まず現状の Unity の状態の確認です。上記に 2 つをやると以下の画像のような感じの Scene になっているはずです。左下があきらさんの記事をもとにやった VR の環境、右上が RhinoInside の Sample1 をやって、LoftSurface を作ったものになっています。（LoftSurface は自分でデバックしやすいように場所を少しうつしています。）

![一通りやった感じ](https://1.bp.blogspot.com/-QMEm9FExfUo/XT2zuChpCRI/AAAAAAAABqQ/3l_s5UfYjjQ2pUCVgbpHwnRzVyKNXQQiACLcBGAs/s640/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

後はあきらさんの記事から変えた点について説明していきます。基本的にはそのままで、リップシンクだけエラーがでてうまくいかなかったので、使っていないです。

### VR で制御点をいじれるようにする

ここから VR でインタラクションするための設定についてです。SteamVR plugin にはインタラクションするための機能がついています。例えば物をつかむとか、対象先にテレポートするとかです。
　今回は Rhino の LoftSurface の制御点（画面中青い球）を VR からインタラクトすることを考えます。やり方は簡単で、対象とする sphere に Add Component で Throwable を追加します。

![Throwable を追加](https://1.bp.blogspot.com/-IzwnKcbdV1A/XT22Fk-qjgI/AAAAAAAABqc/TgtL-vrdu70t0J6Xg4P7B9_W4nf4_4iMgCLcBGAs/s640/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

Throwable を追加すると必要なコンポーネントも同時に追加されます。

![必要なコンポーネントも同時に追加](https://1.bp.blogspot.com/-odxpR4blBRo/XT24u4FXpcI/AAAAAAAABq8/Njmrl7tx3sglHpDdk9d9gjYel69JPIYnQCLcBGAs/s640/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

Rigidbody の中で、UseGravity の項目（画像の赤線部）がありますが false にしています。True にしておくと物理演算で重力適用されるので、Play モードにするとそのまま球が落ちていきます。
　次につかんで離した後の挙動ですが、Throwable の名前の通りデフォルトでは投げる（はなした時の手の速度で飛んでいく）設定になっています。（青下線部）これを選択で「NoChange」にすると話した点で止まるようになります。
　これらの設定をすれば、VR 内で設定した球がつかめるようになります。

### 親子関係の維持

Sphere をつかめるようになりましたが、このままだと RhinoInside でうまくジオメトリの計算をしてくれません。
　この Sample1 で作成される LoftSurface は、親（オブジェクト名 LoftSurface）の、子になっているオブジェクト（ここでは Sphere）を制御点として形状をコントロールしています。しかし今の設定のままでは、Play モード中に物をつかむとこの親子関係が崩れてしまい、つかんだものが親から離れてしまいます。
　そこで、親子関係を維持するコンポーネントを追加します。Asset を右クリックして Create→C#Script で新たに C#のスクリプトを作成します。

![Create→C#Script](https://1.bp.blogspot.com/-cgEBDno9520/XT27ngbsaJI/AAAAAAAABrI/01uHaFvCjjAp-Cxe90r06cDKS7rQWZgYgCLcBGAs/s400/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

作成した C#スクリプトは以下です。Unity で作った C#スクリプトの Updata のところに以下を追加してください。ただ毎フレームごとに Loft Surface というオブジェクトの子にしているだけです。

```cs
public class Parent : MonoBehaviour
{
  void Update ()
  {
    transform.parent = GameObject.Find ("Loft Surface").transform;
  }
}
```

これを対象の Sphere に追加すれば、つかんで親子関係が外れても、すぐに LoftSurface の子に戻ります。とりあえず動くものにしているだけなので、このままだと実は問題がありますが許してください。ちなみに問題点は以下です。

- 親に対して子として一番下に追加されるだけなので、子の中の順番が維持されない。（制御点の順番にも意味があるのでこの順番がずれると形がおかしくなる）
- 1 フレームごとに呼び出される void Update() の部分にそのまま書いているので、つかんでも 1 フレームごとに手から離れてしまう。

解決策はわかっていて、1 つ目であれば、親子関係の順番を記録してその順番で子にすればよく、2 つ目であればつかんでいる状態を判定してそれが True なら親子関係をもどすスクリプトを動かさなければよいだけです。そのうち作ります…
　記事の一番の動画で私が操作しているものは、親子関係で最初から一番下のもの投げているだけなので、サーフェスの形状が崩れず一見手に追従して形状が変化しているように見えてます。

## VR アプリとして出力する

次にアプリとして出力する方法についてです。初めに、以下の作業をする前に、これより上の作業を完了しておいてください。出力用にいくつかの C#のスクリプトをいじったりするので、上の操作が終わっていないとうまく動かなくなる可能性があります。

### とりあえず Build してみる

Unity の File メニューから Build Settings...を選び Build を行います。ですがこのままだとエラーで出力がされません。Build するものの中で、Unity のエディタの UI そのものをいじるものがあるとエラーになります。（出力するアプリは Unity ではないので、Unity の UI をいじるものがあるのはおかしい）

### UnityEditor 関連をなくしていく

そこで、UnityEditor に関係するものを修正してい行きます。まずは Standard Assets/RhinoInside の Unity のファイルを以下のように

- Using UnityEditor
- [InitializeOnLoad]

の二つをコメントアウトします。

![Assets/RhinoInside/Unity](https://1.bp.blogspot.com/-k8JEJk3uAHE/XT2_pd5OgTI/AAAAAAAABrU/EMwGchD7Ii4N1AZYL2WZB7tJGUeZnKpkQCLcBGAs/s400/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

```cs
using System;
using System.Reflection;
using System.IO;

using UnityEngine;
// using UnityEditor;

using Rhino;
using Rhino.Runtime.InProcess;

namespace RhinoInside.Unity
{
  // [InitializeOnLoad]
  static class Startup
```

同じく Standard Assets/RhinoInside の中にある UI ファイルを Assets の下に Editor というフォルダを作ってそちらに移します。直下の Editor のフォルダにあるものは Build の際に読み込まれない個所になっているそうです。ちなみにこの UI は Unity の menubar に Grasshopper を追加したりしているだけで本当に UI を操作しているだけのものです。

![UIファイル移動](https://1.bp.blogspot.com/-Lro828i1vs4/XT3GXCbuWPI/AAAAAAAABrg/k-h8DHTZN0sEvijUYiEF6_ZZdrM9Mo1IQCLcBGAs/s400/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

次に実際に LoftSurface を操作している LoftSurfaces.cs ファイルをいじります。変更点は以下

1. UnityEditor にかかわるものをコメントアウト
1. void Start() 内に Rhino を起動させ、ウインドウを最小化させる部分を追加

変更した個所を抜粋した C#スクリプトは以下です。

```cs
using Rhino;
using Rhino.Runtime.InProcess;

using System;
using System.Reflection;
using System.IO;
using System.Collections;
using System.Collections.Generic;

using UnityEngine;
// using UnityEditor;

namespace RhinoInside.Unity.Sample1
{

  // [InitializeOnLoad]
  // [ExecuteInEditMode]
  public class LoftSurface : MonoBehaviour
  {
    // [MenuItem("RhinoInside/Create Loft Surface")]
    public static void Create()
    {
      var surface = new GameObject("Loft Surface");
      surface.AddComponent<LoftSurface>() ;
    }
```

```cs
   const int VCount = 3;

    void Start()
    {
      //ここを追加 ---------------------
      string RhinoSystemDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Rhino WIP", "System");
      bool isLoaded = Environment.GetEnvironmentVariable("PATH").Contains(RhinoSystemDir);
      var PATH = Environment.GetEnvironmentVariable("PATH");
      Environment.SetEnvironmentVariable("PATH", PATH + ";" + RhinoSystemDir);
      GC.SuppressFinalize(new RhinoCore(new string[] { "/scheme=Unity", "/nosplash" }, WindowStyle.Minimized));
      //ここを追加 ---------------------

      gameObject.AddComponent<MeshFilter>();

      var material = new Material(Shader.Find("Standard"))
      {
        color = new Color(1.0f, 0.0f, 0.0f, 1f)
      };

      gameObject.AddComponent<MeshRenderer>().material = material;
```

これで Build すれば UnityEditor に関するエラーが出なくなるはずです。
　無事 Build が完了して出力先の.exe ファイルを起動すれば RhinoInside を使った VR アプリが起動するはずです。

## 完成！

冒頭の完成品を再掲です。

![RIUApp.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/270439/ec5c4e11-d4aa-81e9-1765-c72aa3460f1b.gif)

今後は、中でもうちょっと動けるようにしたりだとか、上記であったつかんだ際の親子関係の問題とかを直していければと思ってます。

# ライセンス

この記事内でいじっている RhinoInside 関係のコードは[MIT ライセンス](https://GitHub.com/mcneel/rhino.inside/blob/master/LICENSE)です。プラグインについては各ライセンスに従ってください。
