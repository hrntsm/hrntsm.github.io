---
title: "AWS でできる！ クラウドでのジオメトリ計算サービス Compute.Rhino3d の始め方"
date: "2020-10-02"
draft: false
path: "/articles/start-compute-rhino-in-aws"
article-tags: ["AWS", "RhinoCompute", "Zenn"]
---

## はじめに

Amazon Elastic Compute Cloud(EC2)で Compute.Rhino3d の始める方法についての記事です。RhinoCompute ともいうみたいで、何が Compute.Rhino3d で何が RhinoCompute なのかよくわからないです。

Compute.Rhino3d は開発中なため、2020/9/30 時点での情報です。公式のドキュメントの更新も頻繁なため、参照しているリンクが切れている可能性があります。もしリンクが切れていたら公式の GitHub のリポのトップページは以下になりますので、そこから最新の情報を探してみてください。

[Rhino Compute Server](https://github.com/mcneel/compute.rhino3d)

### そもそも Compute.Rhino3d って？

以下公式より引用です。[Rhino Compute Service (ワークインプログレス)](https://www.rhino3d.com/compute)

> McNeel クラウドを介してステートレス REST API を通じて Rhino のジオメトリライブラリへアクセスできるようにする実験的なプロジェクトです。Compute は、 Rhino Inside™ のテクノロジをベースに、Rhino の高度なジオメトリ計算をオンラインのウェブサービスに埋め込みます。

Rhinoceros という 3DCAD のジオメトリ計算機能をオンラインのウェブサービスとして埋め込むことができます。公式が参考として Heroku を使ってとげとげな形状をスライダーで変更させるものを公開しています。

https://compute-rhino3d-appserver.herokuapp.com/example/

## AWS の支度

### 作成するインスタンスの種類

環境としては最低でも Windows Server2016、推奨では Windows Server 2019 となっています。ここでは AWS の Windows Server 2019 Base を使うことを想定します。無料枠で使用可能な t2.micro (1vCPU, 1GB RAM) のインスタンスでも可能ですが、メモリが 1GB でつらいです。公式のドキュメントでは、t2.medium (2vCPU, 4GB RAM) がスタートするには良いと書かれています。
わたしも最初は t2.micro でやっていましたが、動作が重すぎて t2.medium に変えました。

### インスタンスの作成

AWS EC2 での Windows Server 2019 のインスタンスの作り方はいろいろなサイトで紹介されているのでここでは割愛します。以下とかを参考にしました。”2.EC2 インスタンに接続する” までやればよいです。

[AWS で EC2(WindowsServer2019)を作成し一般公開するまで方法](https://qiita.com/og_omochi/items/c85bfd61fd4bd9e5baab)

## Compute.Rhino3d の支度

### ライセンスの価格

公式のドキュメント [Pricing - Rhino 7 on Servers](https://www.rhino3d.com/compute-pricing)

通常のシングルコンピューターライセンスでは認証ではじかれてしまいます。サーバーインスタンスでの Rhino の実行には専用のライセンスが必要で、このライセンスはコア時間での課金になっています。現在 WIP 版なのでこの価格が正式版になるかわかりませんが、2020 年 9 月 30 日現在では 0.10 米ドル/core-hour です。

Core-Hour なので課金形態は以下のようになります。

1. 1 台の 32 コアのサーバーで 1 時間実行した場合
   - 1 台 × 32 コア × 1 時間 × 0.10/core-hour = 3.20 米ドル
2. 200 台の 4 コアのサーバーで 6 分実行した場合
   - 200 台 × 4 コア × 0.1 時間 × 0.10/core-hour = 8.00 米ドル

### ライセンスの作成方法

上記で書いたように Windows Server 向けには専用のライセンスが必要になります。作り方としては自分の Rhino のアカウント内に専用のチームを作成します。

1. [Rhino Accounts](https://accounts.rhino3d.com/) にアクセスする
2. ライセンスのページに行く
3. 新規チームを作成する
4. "チームの管理"から"コア時間課金の管理…"を選ぶ
5. コア時間課金を有効にして保存する
6. 再度コア課金の管理のページに行き、操作 ▼ から Get Auth Token を選ぶ
   - この AuthToken を Rhino をインストールする際にライセンス認証するために使います。

### 実行環境構築

公式のドキュメント [Deploying Rhino Compute](https://github.com/mcneel/compute.rhino3d/blob/master/docs/deploy.md)

対象の環境で以下を行います。AWS でやるならばその Windows Server 内で行ってください。

1. PowerShell を起動して以下を入力する
   ```bash
   iwr -useb https://raw.githubusercontent.com/mcneel/compute.rhino3d/master/script/bootstrap-server.ps1 -outfile bootstrap.ps1; .\bootstrap.ps1 -install
   ```
2. 1.を実行すると必要なものがダウンロードされる。途中で以下の入力を求められるためそれぞれを入力する
   - EmailAdress : RhinoWIP をダウンロードするために使用する
   - ApiKey : API のキーで API アクセスする際に使うため
   - RhinoToken : ”ライセンスの作成方法”の部分で取得した AuthToken
3. ダウンロードした Compute のフォルダ内の compute.geometry.exe を実行して、以下のように "The compute.geometry service is now running" が表示されるまで待つ

   ```
   [00:00:00 INF] Compute 1.0.0.493, Rhino 7.0.20266.15205
   [00:00:00 INF] Configuration Result:
   [Success] Name compute.geometry
   [Success] ServiceName compute.geometry
   [00:00:00 INF] Topshelf v4.1.0.172, .NET Framework v4.0.30319.42000
   [00:00:00 INF] Launching RhinoCore library as "USERNAME"
   [00:00:00 INF] Starting listener(s): ["http://+:80"]
   [00:00:00 INF] Listening on ["http://+:80"]
   [00:00:00 INF] The compute.geometry service is now running, press Control+C to exit.
   ```

4. ブラウザーで http://YOUR-PUBLIC-DNS-or-IP/version にアクセスして、例えば以下のようなバージョン情報が表示されれば問題なく実行されています

   ```json
   {
     "rhino": "7.0.20259.15365",
     "compute": "1.0.0.493",
     "git_sha": "a612c257"
   }
   ```

## Compute.Rhino3d を実行する

### サンプルファイルを取得

mcneel の GitHub からサンプルファイルをクローンして使います。

- [compute.rhino3d-samples](https://github.com/mcneel/compute.rhino3d-samples)

```bash
git clone https://github.com/mcneel/compute.rhino3d-samples.git
```

### API キーと WebAdress の設定

Visual Studio などで Sample フォルダ内の RhinoComputeSamples.sln を開いて設定した API キーと compute.rhino のアドレスを compute.rhino3d-samples/samples/RhinoCompute フォルダ内にある RhinoCompute.cs の以下の位置に入れてください。

Header の追記箇所については近いうち追記しなくてもよいようにリポのデータを更新するとのことです。

```cs
namespace Rhino.Compute
{
    public static class ComputeServer
    {
        public static string WebAddress { get; set; } = " http://public-dns-or-ip/"; # ここに入れる
        public static string AuthToken { get; set; }

        public static T Post<T>(string function, params object[] postData)
        {
          .......
          request.Headers.Add("Authorization", "Bearer " + AuthToken);
          // ↓追記(25行目あたり)
          request.Headers.Add("RhinoComputeKey", "実行環境構築で設定したApiKeyを入れる");
          // ↑追記
          request.Method = "POST";
          .......
        }
    }
}
```

### AuthToken の設定

”実行環境構築”の個所で入力した RhinoToken を compute.rhino3d-samples/samples/RhinoCompute フォルダ内にある AuthToken.cs の以下の位置に入れてください。

```cs
namespace Rhino.Compute {
    public static class AuthToken {
        public static string Get () {
          ....
          if (!String.IsNullOrEmpty (tokenFromEnv))
          {
            return tokenFromEnv;
          } else
          {
            return "ここにRhinoTokenいれる";
          }
          ....
```

### 実行！

Sample フォルダ内の各サンプルを実行し、うまく動作しているならば bin/Debug フォルダ内に各サンプルに応じたファイルが作成されます。
例えば BrepBooleanOperation では、cube_sphere_difference.obj、cube_sphere_intersection.obj、cube_sphere_union.obj の三つが作成されます。

cube_sphere_difference.obj では brep のメッシュ化とブーリアン演算をおこなった結果として以下のようなになっています。この機能のどちらも高級な関数を使うため Compute.Rhino3d でないとできない処理です。

![](https://storage.googleapis.com/zenn-user-upload/q4908ig96mxxu4es1yy3k95lm2ee)

## ちなみに

結局ローカルの RhinoAPI と RhinoCompute 何が違うの？というのはここを見るとわかるかもしれません。

[Please Explain Local Rhino API vs Rhino Compute](https://discourse.mcneel.com/t/please-explain-local-rhino-api-vs-rhino-compute/108991?u=hiron)

## Next Step

今回は C#環境での実行でしたが、Python や JavaScript の Compute.Rhino3d もあるので自分のやりたいことに合った言語を使って、Compute.Rhino3d を満喫しましょう。

js は 冒頭で紹介した参考例を作成する以下のチュートリアルがおすすめです。

[compute.rhino3d.appserver](https://github.com/mcneel/compute.rhino3d.appserver)

[2020 Digital Evolution Pre-Lab Workshop: Hosted by Steve Baer of McNeel](https://vimeo.com/442079095)

## まとめ

この記事では、AWS での Compute.Rhino3d の使い方について解説しました。AWS 上で Rhino の高級な関数が実行できることはとても魅力的ではないでしょうか。
計算自体はサーバーで行うため、スマフォのような端末でも Rhino の幾何計算の結果を取得できるのが面白いところだと思っています。

あなたも AWS、そして Compute.Rhino3d への重課金でのパケ死に気を付けてクラウドな Rhinoceros を楽しみましょう！！！
