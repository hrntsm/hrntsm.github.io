---
title: "Karamba3D の utilization の検証"
date: "2015-12-05"
draft: false
path: "/articles/karamba.verify.utilization"
article-tags: ["Karamba3D", "構造とデジタル"]
---

Karamba3D で単純梁をモデル化し、Axial Stress と Utilization の振る舞いについて検証します。
梁の中央に集中荷重をかけ、発生する応力から検証していきます。

[![](http://3.bp.blogspot.com/-lxwjAdTgIzA/VmKR4KU3LdI/AAAAAAAABAg/61unY1th5mI/s400/%25E8%25A7%25A3%25E6%259E%2590%25E7%25B5%2590%25E6%259E%259C.JPG)](http://3.bp.blogspot.com/-lxwjAdTgIzA/VmKR4KU3LdI/AAAAAAAABAg/61unY1th5mI/s1600/%25E8%25A7%25A3%25E6%259E%2590%25E7%25B5%2590%25E6%259E%259C.JPG)

モデル化は以下のようにしています。

10m の単純梁とし、中央に 10kN の集中荷重をかけています。
部材の断面は H-300x300x10x15 です。
材料は SN400B です。

[![](http://2.bp.blogspot.com/-Jvs1nOYHn-8/VmKcBlG2AfI/AAAAAAAABA8/2XmZ-GYpOmk/s640/%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E5%258C%2596.JPG)](http://2.bp.blogspot.com/-Jvs1nOYHn-8/VmKcBlG2AfI/AAAAAAAABA8/2XmZ-GYpOmk/s1600/%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB%25E5%258C%2596.JPG)

解析の Axial Stress の結果と曲げモーメント図とその数値が下図となります。

[![](http://2.bp.blogspot.com/-cQsX2dqXmPY/VmKdPDVHZAI/AAAAAAAABBI/PMzWAo2_vhY/s400/My.JPG)](http://2.bp.blogspot.com/-cQsX2dqXmPY/VmKdPDVHZAI/AAAAAAAABBI/PMzWAo2_vhY/s1600/My.JPG)

一応確認ですが、中央のモーメントの理論値は以下となり解析と一致します。
```
PL/4 ＝ 25kNm
```

部材の断面係数は 1350 cm^3 であるので、応力度の理論値は以下になり一致しています。

```
M/Z ＝ 25000 / 1350 ＝ 18.51 kN/cm2
```
（少数第一位が異なるのは、Karamba3D の設定を切り上げにしてあるためです。詳しくは[karamba の初期設定](../karamba.Initial.setting)参照）

では次に utilization です。
SN400B を使用しているので、F 値は 235 となるので、検定比は以下です。
```
σ/F = 0.079  
```
となることから、パーセント表記となっている解析結果 7.9％ ＝ 0.079 　と一致します。

つまり utilization はせん断による応力度は考慮されておらず、直応力度（axial stress）のみに対して検定していることが分かります。
また、梁の横座屈を考慮した許容曲げ応力度 fb の低減も行われていません。
これは許容圧縮応力度 fc も同様です。

以上のことから、

>「utilization は F 値で軸応力を割った結果が出力される」

ということがわかりました。

材料の F 値は、自分で変更できるので、例えば F 値/1.5 とした材料を定義しておけば長期荷重検定ができるようになります。
