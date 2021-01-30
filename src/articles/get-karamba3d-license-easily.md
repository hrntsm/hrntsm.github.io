---
title: "Cloud Zoo から Karamba3D のライセンスを楽に取得する方法"
date: "2021-01-30"
draft: false
path: "/articles/get-karamba3d-license-easily"
article-tags: ["Karamba3D"]
---

最近 Karamba3D のライセンスを Cloud Zoo から取得するようにしました。  
クラウドにライセンスがあって便利なんですが、ライセンス取得前に Karamba3D のモデルが含まれるデータを開いてしまって、解析部分でエラーが出てめんどくさいことが増えたので自動化した話です。

## やり方

1. Rhino を起動します。
1. コマンドで "Options" を実行するか、左上の File から Properties... を選択する
1. Rhino Options の中の General を開く
1. Commend Lists の中の Run these commands..... に Karamba3D のライセンスを取得するコマンド "Karamba3dGetLicense" を入れる
1. OK を選択

これで Rhino 起動時に Karamba3dGetLicense が実行されて Cloud Zoo から Karamba3D のライセンスが取得されます。

![Rhino Options Image](https://hiron.dev/article-images/get-karamba3d-license-easily/RhinoOptions.png)

### ちなみに

上記画像にもあるように、Grasshopper も自動で起動するようにしています。