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

## 配信しながら触りました。

[![NightlyBuild の Karamba3D が良い話（記事作成作業配信）](https://img.youtube.com/vi/qNkgK0RbfbQ/0.jpg)](https://www.youtube.com/watch?v=qNkgK0RbfbQ))

## GitHub のリリースを確認してみる

[K3D_NightlyBuilds/releases](https://github.com/karamba3d/K3D_NightlyBuilds/releases)

## リッチになった ini ファイルを確認してみる

- 単位の話とか
- デフォルトの材料の設定とか
- 長さの単位は GH 上でコンポーネントから簡単に変えられる

![aaaa](https://hiron.dev/article-images/about-karamba3d-v2-nightlybuild/)

## 材料設定が細かくできるようになっている

- ft,fc のはなし
- 検定する応力が決められる話

## ポリラインから断面諸元を計算するようになった

- CrossSection Property コンポーネント

## line-Joint が追加された

- メッシュの辺に対して接合条件がしてできる

## Support のコンポーネントがデータツリーに対応した

- Dofs の入力

## 荷重ケースに名前が付けられるようになった

- 2 バイト文字も行けるので日本語にやさしい

## 解析の変形結果を図化する際に、方向ベクトルが指定できるようになった

- 例えば Z 方向だけの変位表示ができる

## シェル要素の改善

- メンブレン要素の追加
- shell View でシェルの断面が brep 表示されるようになった
- 断面の応力表示

## Karamba3D のメッシャーが C# から使えるようになった

最近使ってみていい感じにメッシングされていたんでうれしい。

RhinocerosForums の [ここ](https://discourse.mcneel.com/t/using-karamba-meshing-tool-in-c/109054) 参照。

上記より引用。

> the K3D mesher can be envoked via Karamba.GHopper.Utilities.MeshBreps.solve:

```cs
// meshes a list of breps such that their vertices coincide on common edges. The minimum mesh-size is hard-coded to 5mm. This is due to tolerance checks and will be removed in future.
// list of breps to be meshed
// points to be added to the mesh as vertices if their distance from the breps is not too large
// characteristic length of the resulting face edges
// case 0: No Point Reduction (check Cull Mode),
// case 1: Point Reduction is set to ‘Leave One’; Culling Points at distance < 0.5 * Mesh Resolution
// case 2: Point Reduction is set to ‘Average’; Culling Points at distance < 0.5 * Mesh Resolution
// Edges are refined with: Math.Round(refineEdgeResFactor, 2) x Mesh Resolution
// Vertices closer than cullDist get removed
// tolerance *0.1 = tolerance for delauney triangulation
// must be between 0 and 1; smoothes the mesh
// number of steps for smoothing the mesh
// warning encountered during mesh generation
// information regarding the meshing process
// resulting meshes
public static void solve
(
    List inputBrep, List inclusionPoints,
    double mResolution, int m_mode, double refineEdgeResFactor,
    double cullDist, double tolerance, double smooth, int steps,
    out string warning, out string info, out List remappedMeshes
)
```

> Use “Mesh3 mesh3 = mesh.Convert() from ‘Karamba.GHopper.Geometry’” to convert a Rhino Mesh to Mesh3.
