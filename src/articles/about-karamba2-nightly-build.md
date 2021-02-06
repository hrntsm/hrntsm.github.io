---
title: "NightlyBuild の Karamba3D が良い話"
date: "2021-02-07"
draft: false
path: "/articles/about-karamba3d-v2-nightlybuild"
article-tags: ["Karamba3D"]
---

## はじめに

Karamba3D は開発中のバージョンが NightlyBuilds として公開されているので、それを試してみます。
ダウンロードは[公式のGitHub](https://github.com/karamba3d/K3D_NightlyBuilds) からできます。

GitHub を見ると最初のプレリリースが 20/9/14 になっていて、そこからじわじわ開発が進んできています。
2021/2/7 現在で最新版のプレリリースは [Karamba3D 2.0.0_210123 WIP](https://github.com/karamba3d/K3D_NightlyBuilds/releases/tag/2.0.0_210123) です。

## GitHub のリリースを確認してみる

[K3D_NightlyBuilds/releases](https://github.com/karamba3d/K3D_NightlyBuilds/releases)

## リッチになった ini ファイルを確認してみる

- 単位の話とか
- デフォルトの材料の設定とか
- コンポーネントからいじれる

## 材料設定が細かくできるようになっている

- ft,fc のはなし
- 検定する応力が決められる話

## 断面のプロパティが取得できるようになった

## line-Joint が追加された

## 荷重ケースに名前が付けられるようになった

## 解析結果の変形の図化するベクトル表示ができるようになった

## シェル要素の改善

- メンブレン要素の追加
- shell View でシェルの断面が brep 表示されるようになった
- 断面の応力表示

## Karamba3D のメッシャーが C# から使えるようになった

最近使ってみていい感じにメッシングされていたんでうれしい。

RhinocerosForums の [ここ](https://discourse.mcneel.com/t/using-karamba-meshing-tool-in-c/109054) 参照。
