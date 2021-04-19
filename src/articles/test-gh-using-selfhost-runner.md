---
title: "GitHub のセルフホストランナーを使って Grasshopper コンポーネントをテストする"
date: "2021-04-24"
draft: false
path: "/articles/test-gh-using-selfhost-runner"
article-tags: ["Grasshopper", "GitHub", "CI"]
---

## はじめに

以下の記事で作成したコンポーネントと RhinoCompute を使ったユニットテストを、GitHub のセルフホストランナーを使った CI 化します。

- [RhinoCompute を使った Grasshopper コンポーネントのユニットテストの作成](./test-gh-component-using-rhinocompute)

なぜセルフホストランナーを使用するかというと、Rhino のライセンスを解決するためです。
GitHub Actions では GitHub の仮想環境で実行されるため、自身のライセンスを持った Rhino 環境を構築できないためです。

セルフホストランナーではなく GitHub が提供するサーバーでコンポーネントのビルドやコードクオリティのチェックを CI 行う方法は、以下の記事で扱っているのでそちらを参照してください。

- [GitHub Actions で Grasshopper コンポーネントをビルドする](./grasshopper-ci)

こちらの内容は以下の GitHub にデータがおいてあるので適宜参照してください。

- [hrntsm/GH-UnitTest-by-RhinoCompute](https://github.com/hrntsm/GH-UnitTest-by-RhinoCompute)

## セルフホストランナーの環境構築

セルフホストランナーの公式のドキュメントは以下です。必要に応じて参照してください。

- [セルフホストランナーについて
  ](https://docs.github.com/ja/actions/hosting-your-own-runners/about-self-hosted-runners)

セルフホストランナーを使用したリポジトリで Settings の Actions の下段にある Add Runner を押してしてください。

![Add runner](https://hiron.dev/article-images/test-gh-using-selfhost-runner/add-runner.jpg)

そうすると以下が表示されるのでリポジトリの URL やトークンを適宜取得して PowerShell などで実行してください。

```ps
# Create a folder under the drive root
$ mkdir actions-runner; cd actions-runner# Download the latest runner package
$ Invoke-WebRequest -Uri https://github.com/actions/runner/releases/download/v2.277.1/actions-runner-win-x64-2.277.1.zip -OutFile actions-runner-win-x64-2.277.1.zip# Extract the installer
$ Add-Type -AssemblyName System.IO.Compression.FileSystem ; [System.IO.Compression.ZipFile]::ExtractToDirectory("$PWD/actions-runner-win-x64-2.277.1.zip", "$PWD")

# Create the runner and start the configuration experience
$ ./config.cmd --url {YOUR_REPO_URL} --token {YOUR_TOKEN}
```

環境の構築に成功していれば以下のように表示されいくつかの設定を求められます。
設定はデフォルトのままで問題ありません。

```
--------------------------------------------------------------------------------
|        ____ _ _   _   _       _          _        _   _                      |
|       / ___(_) |_| | | |_   _| |__      / \   ___| |_(_) ___  _ __  ___      |
|      | |  _| | __| |_| | | | | '_ \    / _ \ / __| __| |/ _ \| '_ \/ __|     |
|      | |_| | | |_|  _  | |_| | |_) |  / ___ \ (__| |_| | (_) | | | \__ \     |
|       \____|_|\__|_| |_|\__,_|_.__/  /_/   \_\___|\__|_|\___/|_| |_|___/     |
|                                                                              |
|                       Self-hosted runner registration                        |
|                                                                              |
--------------------------------------------------------------------------------
```

なお今回は Rhino のライセンスの関係で Docker などの仮想環境を使用しないで Windows 環境の PowerShell を直接呼ぶようにしています。

**基本的にはこれをパブリックのリポジトリではやらないでください。**

誰でもプルリクを送れる状態であるということは、あなたの PC で任意のコードを実行できる状態になっているという意味です。
ハッキングどころの騒ぎじゃないです。
注意してください。

## GitHub Actions の yml 作成

GitHub Actions を設定する yml ファイルは以下のように設定します。

```yml
name: Run Unit Test
on: push

jobs:
  run-test:
    # ここを self-hosted にすることで自分の PC が実行対象になる
    runs-on: self-hosted

    steps:
      # git を checkout
      - uses: actions/checkout@v2
      # RhinoCompute を起動。完全に起動するまで待つため Start-Sleep で５秒待機
      - name: Setup RhinoCompute
        run: |
          Start-Process -FilePath ../../../compute.geometry/compute.geometry.exe
          Start-Sleep -Seconds 5
      # テストの実行
      - name: Run Unit Test
        run: dotnet test
```

FilePath はご自身の RhinoCompute のファイルへのパスを指定してください。

作成した actions-runner のフォルダの直下に compute.geometry のフォルダを置くとパスは上記のようになります。

## 実行

actions-runnner のフォルダで以下を実行すると自分の PC のセルフホストランナーと GitHub が接続します。

```ps
./run.cmd

√ Connected to GitHub

2021-04-19 13:51:11Z: Listening for Jobs
# ↑ GitHub 側から呼ばれるまで待機状態

# GitHub で CI が呼ばれると以下のように表示され、job の結果が表示される
2021-04-19 14:00:21Z: Running job: run-test
2021-04-19 14:01:21Z: Job run-test completed with result: Succeeded
```

プッシュ時に CI が実行され GitHub 側は通常の GitHub Actions を実行した時と同じように表示されます。

![CI Result](https://hiron.dev/article-images/test-gh-using-selfhost-runner/ci-result.jpg)

Run Unit Test の欄を確認するとユニットテストがちゃんと実行され、テストに合格していることがわかります。

## おわりに

前記事で書いたローカル環境でのユニットテストと、今回の CI 化を合わせることで Grasshopper コンポーネントの開発をだいぶ効率化できるのではないでしょうか。

効率化してよりクリエイティブなことに時間を使っていきましょう。
