---
title: "RhinoCompute を Docker を使って実行する"
date: "2021-03-13"
draft: false
path: "/articles/run-rhinocompute-on-docker"
article-tags: ["RhinoCompute", "Docker"]
---

## はじめに

Docker を使って RhinoCompute を実行してみます。

クラウドで、CI を使って RhinoCompute を実行できれば、例えば開発した Grasshopper コンポーネントを Rhino を使ってテストできるので良いのではと考えて試してみました。

## Docker の支度

### インストール

Docker は [Docker のホームページ](https://www.docker.com/) からインストールしてください。

Rhino は Windows (.netFrameWork) で動くので Windows Container を対象とした状態にしておいてください。

### Dockerfile の入手

Dockerfile は RhinoCompute の公式リポジトリにあるので、そのままそのリポジトリをクローンしてください。

- [mcneel/compute.rhino3d](https://github.com/mcneel/compute.rhino3d)

```bash
git clone http://github.com/mcneel/compute.rhino3d.git
```

### build する

クローンしたフォルダで docker bulid します。

```bash
docker build --isolation process -t rhino-compute .
```

多分そのままでは動かないので、Dockerfile を必要に応じて書き換えます。

### 使用する Windows のバージョンをそろえる

デフォルトだと Windows 10 version 1809 がインストールされますが、自分が使っている Windows のバージョンとそろえる必要があります。

2021/03/13 時点で最新の Windows は 20H2 なので、最新にしている方は以下に直します。

```Dockerfile
FROM mcr.microsoft.com/windows:20H2
```


### インストールする Rhino バージョンの変更

2021/03/13 時点での Dockerfile そのままですと ver 7.2.21021.07001 がインストールされますので、別のバージョンにしたい場合は以下の部分を書き換えてください。
コメントで書かれている URL にすると最新版に自動でリダイレクトされるそうです。

```dockerfile
# install rhino (with “-package -quiet” args)
# NOTE: edit this if you use a different version of rhino!
# the url below will always redirect to the latest rhino 7 (email required)
# https://www.rhino3d.com/download/rhino-for-windows/7/latest/direct?email=EMAIL
RUN curl -fSLo rhino_installer.exe https://files.mcneel.com/dujour/exe/20210121/rhino_en-us_7.2.21021.07001.exe `
    && .\rhino_installer.exe -package -quiet `
    && del .\rhino_installer.exe
```

### Rhino へのプラグインのインストール

そのままだと Rhino がインストールされるだけで、プラグインはインストールされないので、必要なものがある場合は Yak の実行も追加します。
デフォルトではコメントアウトされています。

以下では jswan というプラグインをインストールしています。

```Dockerfile
RUN ""C:\Program Files\Rhino 7\System\Yak.exe"" install jswan
```

### TOKEN の入力

Docker で動かすためには RhinoCompute の課金設定をする必要があります。
課金は以下でできます。

1. [Rhino Accounts](https://accounts.rhino3d.com/) にアクセスする
2. ライセンスのページに行く
3. 新規チームを作成する
4. "チームの管理"から"コア時間課金の管理…"を選ぶ
5. コア時間課金を有効にして保存する
6. 再度コア課金の管理のページに行き、操作 ▼ から Get Auth Token を選ぶ
   - この AuthToken を Dockerfile に入れる

6 で取得した Token を Dockerfile の以下の TOKEN の位置に入れます。

```Dockerfile
ENV RHINO_TOKEN="TOKEN"
```

## RhinoCompute を実行する

ビルドできたら以下で Docker で RhinoCompute が実行できます。

```bash
docker run -p 8080:80 rhino-compute
```

実行に問題がなければ以下のように表示されます。
タイムスタンプは実行した時間によりますので、環境次第です。

```bash
[18:19:12 INF] Compute 1.0.0.0, Rhino 7.4.21067.13001
[18:19:12 INF] Configuration Result:  
[Success] Name compute.geometry       
[Success] DisplayName rhino.compute   
[Success] Description rhino.compute   
[Success] ServiceName compute.geometry
[18:19:12 INF] Topshelf v4.1.0.172, .NET Framework v4.0.30319.42000
[18:19:13 INF] Launching RhinoCore library as ContainerAdministrator
[18:19:26 INF] Starting listener(s): ["http://+:80"]
[18:19:28 INF] (1/2) Loading grasshopper
[18:19:31 INF] Grasshopper has started loading all component libraries
[18:19:31 INF] * Loading Grasshopper core assembly...
[18:19:31 INF] * Loading CurveComponents assembly...
[18:19:31 INF] * Loading FieldComponents assembly...
[18:19:31 INF] * Loading GalapagosComponents assembly...
[18:19:31 INF] * Loading IOComponents assembly...
[18:19:31 INF] * Loading Kangaroo2Component assembly...
[18:19:31 INF] * Loading MathComponents assembly...
[18:19:31 INF] * Loading ScriptComponents assembly...
[18:19:31 INF] * Loading SurfaceComponents assembly...
[18:19:31 INF] * Loading TriangulationComponents assembly...
[18:19:31 INF] * Loading VectorComponents assembly...
[18:19:31 INF] * Loading XformComponents assembly...
[18:19:31 INF] * Loading GhPython assembly...
[18:19:31 INF] (2/2) Loading compute plug-ins
[18:19:31 INF] Listening on ["http://+:80"]
[18:19:31 INF] The compute.geometry service is now running, press Control+C to exit.
```

ブラウザで "localhost:8080/version" を入れて、以下のようにバージョンが帰ってくれば問題なく動いています。
値は環境により異なります。

```json
{
  "rhino": "7.0.20259.15365",
  "compute": "1.0.0.493",
  "git_sha": "a612c257"
}
```

上記で Control＋C で終了できると書いてありますが、多分それを行っても Docker の表示が閉じられるだけで、RhinoCompute 自体は動いています。

以下のコマンドで状態が確認できます。

ここでは STATUS の欄にあるように 55 秒前に起動された状態で、RhinoCompute は動いたままなので、**RhinoCompute の課金もアクティブなまま（注意）** です。
CONTAINER ID と NAMES は環境によって異なる値になります。

```bash
docker ps
```

```bash
CONTAINER ID   IMAGE           COMMAND                  CREATED              STATUS          PORTS                  NAMES
0b3733eee521   rhino-compute   "compute.geometry.exe"   About a minute ago   Up 55 seconds   0.0.0.0:8080->80/tcp   quirky_elgamal
```

以下のコマンドで停止できます。
{NAMES} の箇所は ps コマンドで出てくる NAMES を入れてください。

停止していると ps コマンドでは表示されなくなりますが、明示的に確認したい場合は、-a オプションで確認できます。

```bash
docker stop {NAMES}
docker ps -a
```

-a オプションでの表示は以下です。
STATUS が Exit になっていてちゃんと終了していることがわかります。

```bash
CONTAINER ID   IMAGE           COMMAND                  CREATED         STATUS                              PORTS     NAMES
0b3733eee521   rhino-compute   "compute.geometry.exe"   4 minutes ago   Exited (3221225786) 3 minutes ago             quirky_elgamal
```

これで Docker を使って簡単に RhinoCompute ができるようになりました！

## ちなみに

始めた後に気づきましたが、GitHub Actions では Windows Container を使えないっぽいので、別のサービスを使う必要があるみたいでした。

Azure ならできるんでしょうか。

## 使った Dockerfile

私が使った Dockerfile の全文を以下に上げます。
TOKEN は自分のものに書き換えてください。

```Dockerfile
### builder image
FROM mcr.microsoft.com/dotnet/framework/sdk:4.8 as builder

# copy everything, restore nuget packages and build app
COPY src/ ./src/
RUN msbuild /p:Configuration=Release /restore /v:Minimal src/compute.sln

### main image
FROM mcr.microsoft.com/windows:20H2

# install .net 4.8 
RUN curl -fSLo dotnet-framework-installer.exe https://download.visualstudio.microsoft.com/download/pr/7afca223-55d2-470a-8edc-6a1739ae3252/abd170b4b0ec15ad0222a809b761a036/ndp48-x86-x64-allos-enu.exe `
    && .\dotnet-framework-installer.exe /q `
    && del .\dotnet-framework-installer.exe `
    && powershell Remove-Item -Force -Recurse ${Env:TEMP}\*

# install rhino (with “-package -quiet” args)
RUN curl -fSLo rhino_installer.exe https://www.rhino3d.com/download/rhino-for-windows/7/latest/direct?email=EMAIL `
    && .\rhino_installer.exe -package -quiet `
    && del .\rhino_installer.exe

# copy compute app to image
COPY --from=builder ["/src/bin/Release/compute", "/app"]
WORKDIR /app

# bind compute.geometry to port 80
ENV RHINO_COMPUTE_URLS="http://+:80"
EXPOSE 80
ENV RHINO_TOKEN="TOKEN"

CMD ["compute.geometry.exe"]
```
