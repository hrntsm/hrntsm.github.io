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

GitHub を見ると最初のプレリリースが 20/9/14 になっており、そこからじわじわ開発が進んできています。
2021/2/7 現在で最新版のプレリリースは [Karamba3D 2.0.0_210123 WIP](https://github.com/karamba3d/K3D_NightlyBuilds/releases/tag/2.0.0_210123) です。

## 配信しながら触りました。

[![NightlyBuild の Karamba3D が良い話（記事作成作業配信）](https://img.youtube.com/vi/qNkgK0RbfbQ/0.jpg)](https://www.youtube.com/watch?v=qNkgK0RbfbQ))

## GitHub のリリースで更新内容を確認

[K3D_NightlyBuilds/releases](https://github.com/karamba3d/K3D_NightlyBuilds/releases)

## 設定項目が増えた karamba.ini ファイル

### 単位の設定

以下のような感じで、単位指定の部分が増えました。

```ini
# UnitsSystem = "imperial"
UnitsSystem = "SI"

# internal length unit; assumed for geometry input from Rhino - possible values: "m", "cm", "mm", "µ", "ft", "in"; No consistency checks are performed!
UnitLength = "mm"
# internal force unit - possible values: "MN", "kN", "daN", "N", "cN", "kip"; No consistency checks are performed!
UnitForce = "kN"
# internal mass unit - possible values: "t", "kg", "dag", "g", "µg", "lbm"; No consistency checks are performed!
UnitMass = "t"
```

単位の指定は、Grasshopper 上でもできるようになっています。
これによって、後から Karamba3D の単位が変えられるようになったので、モデリングした後の単位間違えに簡単に対応できます。

![SettingComponent](https://hiron.dev/article-images/about-karamba3d-v2-nightlybuild/SettingComponent.jpg)

### デフォルトの材料の指定

もともと内部的に自動で割り当てられていた、材質を設定できるようになった。
```ini
#---
# default materials:
#---
# Em[kN/cm2], Gm(inplane)[kN/cm2], G(transverse)[kN/cm2], gamma[kN/m3], alphaT[], ftk[kN/cm2], k[kN/cm2]
#---
Steel = 21000, 8076, 8076, 78.5, 1.2E-05, 23.5, -23.5 
Concrete = 3000, 1375, 1375, 25, 1.00E-05, 0.135, -3.0
ReinforcementSteel = 21000, 10500, 10500, 78.5, 1.2E-05, 50.0, -50
```

### 板要素の断面力の色指定

Karamba3D v2 から板要素の断面力の図化ができるようになったので、その色指定が追加。

```ini
#---
# colors for coloring positive values of the shell section results
#---
shellsec_color_pos_N_tt  = LightBlue
shellsec_color_pos_N_nn  = LightGreen
shellsec_color_pos_N_tn  = LightSkyBlue
shellsec_color_pos_M_tt  = Red
shellsec_color_pos_M_nn  = SeaGreen
shellsec_color_pos_M_tn  = CadetBlue
shellsec_color_pos_V_t   = LightBlue
shellsec_color_pos_V_n   = LightGreen
```

## Grasshopper 上で材料設定できる項目が増えた

検定に対しての細かく設定できるようになりました。

これまで ft の 1 つだけだったので、引張の耐力として ft、圧縮の耐力として fc が設定できるようになりました。

また、検定の応力の求め方も、以下の 3 つから選べるようになりました。

1. Mises
1. Tresca
1. Rankine

![MaterialSettings](https://hiron.dev/article-images/about-karamba3d-v2-nightlybuild/MaterialSetting.jpg)


---
**この設定がいつ有効になるかわからなかったので、調査して追記**
---


## ポリラインから断面諸元を計算

CrossSection Property コンポーネントが新たに追加されて、閉じたポリラインを入力することでその断面の断面諸元が計算されます。

注意点としては、YZ 平面に書かれたポリラインが対象なので、ほかの平面にあるものはエラーになります。

![CrossSection Property](https://hiron.dev/article-images/about-karamba3d-v2-nightlybuild/CSProp.jpg)

## Line-Joint が追加

メッシュの辺に対して接合条件が指定できるようになりました。

接合条件を与えたいポリラインを入力にしてそこに接合条件が与えられるようになります。
剛性の与え方としては、各自由度に対して変位剛性（Ct）と回転剛性（Cr）が指定できます。
対象の自由度は、境界条件などと同じようにラジオボタンで設定できます。

Rhino 上の可視化としては、対象の辺がマゼンタ色になり、剛性を与えるために指定したローカル座標系のベクトルが図化されます。

![Line Joint](https://hiron.dev/article-images/about-karamba3d-v2-nightlybuild/LineJoint.jpg)

## Support のコンポーネントがデータツリーに対応

もともとはラジオボタンで全てを指定しなければならず、1 つのコンポーネントで、1 つの条件しか指定できませんでした。
今回のバージョンで、Dofs の入力が追加され、境界条件を数字のリストで入力できるようになりました。
数字に対応する自由度は以下です。

- 0: TX
- 1: TY
- 2: TZ
- 3: RX
- 4: RY
- 5: RZ

以下の画像では、Support コンポーネントのラジオボタンを使ってすべてに共通で TY を固定しています。
それに加えて、ツリーで {0;0} には 3:RX の固定、{0;1} には 5: RZ の固定が 1 つのコンポーネントで設定できるようになりました。

![Support](https://hiron.dev/article-images/about-karamba3d-v2-nightlybuild/Support.jpg)

## 荷重ケース名が文字列になった

これまで整数での設定だったが、文字列で指定するようになった。2 バイト文字も使えるので日本語にもやさしいです。

![LCName](https://hiron.dev/article-images/about-karamba3d-v2-nightlybuild/LCName.jpg)

## 取得する変形結果に方向ベクトルが指定できるようになった

例えば Z 方向ベクトルを入れると、BeamView コンポーネントでカラーコンター化される値が Z 方向変位の値になり対象の方向のみの結果を取得できます。

![DispDir](https://hiron.dev/article-images/about-karamba3d-v2-nightlybuild/DispDir.jpg)

## シェル要素の改善

### 膜要素の追加

梁要素（LineToBeam など）にはあった Bending の設定が板要素（MeshToShell）にも追加され曲げの成分を持たない板要素（膜要素）が解析で使えるようになりました。

![Membrane](https://hiron.dev/article-images/about-karamba3d-v2-nightlybuild/Membrane.jpg)

### Shell View での CrossSection 表示が追加

ShellView で CrossSection を選択すると厚さだけの表示がされるようになりました。

![ShellCroSec](https://hiron.dev/article-images/about-karamba3d-v2-nightlybuild/ShellCroSec.jpg)

### シェルの断面の応力の図化表示が追加

確認したいシェルの切断線をポリラインとして入力すると、その位置での応力が以下のように図化されるようになりました。

切断線の位置を NumberSlider などで動かせるようにすれば、板の各位置の応力を簡単に確認できます。

![ShellForce](https://hiron.dev/article-images/about-karamba3d-v2-nightlybuild/ShellForce.jpg)

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
