---
title: "Mice のリリースのお知らせ"
date: "2019-03-01"
draft: false
path: "/articles/ReleaseMise"
article-tags: ["Grasshopper", "Mice", "CSharp", "構造とデジタル"]
---

これまでに動画やこの blog で紹介してきた単純梁の計算するコンポーネントを Food4Rhino でリリースしました。

[![](https://1.bp.blogspot.com/-gIj-CYFqAFQ/XHkidPNLynI/AAAAAAAABl4/3coBfhoozEIzElqdYOp6q8WZd7UVJ_j-QCLcBGAs/s200/Icon.png)](https://1.bp.blogspot.com/-gIj-CYFqAFQ/XHkidPNLynI/AAAAAAAABl4/3coBfhoozEIzElqdYOp6q8WZd7UVJ_j-QCLcBGAs/s1600/Icon.png)

作成したコンポーネント名は「Mice」です。基本的にはこれまで作成してきたものから、出力関係を強化したものになっています。
ダウンロードは [food4rhino](https://www.food4rhino.com/app/mice) からどうぞ。

機能はこれまでに紹介してきた物と同様に以下のようになっています。

## 対象

- 片端ピン、他端ピンローラー支点の単純梁
- 片持ち梁

## 対応形状

- H 型
- L 型
- 角型

## 対応荷重形状

- 片持ち梁の先端集中荷重
- 単純梁の中央集中荷重
- 単純梁の台形等分布荷重
- 任意のモーメント入力

## 出力

- 曲げモーメント分布の図化出力と数値の出力
- 部材断面の図化出力

曲げモーメントの計算、たわみの計算、告示の基準により断面検定するコンポーネントになっています。許容曲げモーメントは、座屈を考慮して計算するようになっています。

これまで同様に [github](https://github.com/hrntsm/mice) 側にもアップしているので、中身が気になる方はそちらを参照してください。

---

## 2019/03/16 追記 --------------

[food4rhino](https://www.food4rhino.com/app/mice)  に Ver 1.0.1 公開しました。主な変更点は以下です。

・反力と荷重が表示されるようになりました。ただしモーメントの反力は出力していないので、片持ち梁は少し変に感じます。

[![](https://1.bp.blogspot.com/-XkuLlhrQQrE/XIz-0KC56BI/AAAAAAAABnU/upmSY0U1inIcezl7bNErXSVFh9jmS5V3QCLcBGAs/s320/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)](https://1.bp.blogspot.com/-XkuLlhrQQrE/XIz-0KC56BI/AAAAAAAABnU/upmSY0U1inIcezl7bNErXSVFh9jmS5V3QCLcBGAs/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

・BeamAnalysis のサブカテゴリ内にセパレータを表示させ、荷重の形に合わせてを整理しました。

[![](https://1.bp.blogspot.com/-whMUgDnMlIE/XIzvEwk8R_I/AAAAAAAABmk/VMn7-hmvZO8R4Ydy9M1cwNVYbKGe3E4YgCLcBGAs/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)](https://1.bp.blogspot.com/-whMUgDnMlIE/XIzvEwk8R_I/AAAAAAAABmk/VMn7-hmvZO8R4Ydy9M1cwNVYbKGe3E4YgCLcBGAs/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

・サブカテゴリ BeamAnalysis 内のコンポーネントの説明がすべて "Stress Analysis of the Beam"だったので、それぞれの内容に合わせて修正しました。

[![](https://4.bp.blogspot.com/-7S49Hyeu6eU/XIz-m1M92dI/AAAAAAAABnQ/3kainY9zZ3EtxD2HBSIMyUcRRr9bZiXsACLcBGAs/s320/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)](https://4.bp.blogspot.com/-7S49Hyeu6eU/XIz-m1M92dI/AAAAAAAABnQ/3kainY9zZ3EtxD2HBSIMyUcRRr9bZiXsACLcBGAs/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

・以下の画像のようにコンポーネントになにも繋げておらず、必要な値が入力されていないときに出るエラーが出力されないようにしました。

[![](https://3.bp.blogspot.com/-rtbXRQKqTQc/XIzv_n2go6I/AAAAAAAABmw/AsXeyDCinWc-_-ELKW1lZ9O95j5TeFF7ACLcBGAs/s320/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)](https://3.bp.blogspot.com/-rtbXRQKqTQc/XIzv_n2go6I/AAAAAAAABmw/AsXeyDCinWc-_-ELKW1lZ9O95j5TeFF7ACLcBGAs/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

・わかっているバグとして、再描画の設定をしていないため、いったん入力した後、梁の長さを変えるなどしても、反力、荷重、応力などを出力したものは rhino 上での表示は変わらないことがあります。
