---
title: "3分でちょっとだけわかる CMA-ES"
date: "2022-10-08"
draft: true
path: "/articles/learn-a-little-bit-about-cmaes-in-3-minutes"
article-tags: ["Grasshopper", "Tunny"]
---

## はじめに

Grasshopper で使用できる最適化コンポーネント Tunny を開発しています。

- [food 4 Rhino - Tunny](https://www.food4rhino.com/en/app/tunny)

その中でベイズ最適化や進化戦略、準モンテカルロなどこれまでの Grasshopper の最適化コンポーネントでなじみのないアルゴリズムがあります。
それらを使うにあたってざっくりとしたアルゴリズムへの理解があるとより使いやすくなるため、簡単な紹介をします。

ここでの内容は Tunny の公式ドキュメントの [Technical Info](https://tunny-docs.deno.dev/docs/technical-info) を翻訳したものがベースになります。

この記事では CMA-ES という手法について紹介します。
アルゴリズムのざっくりとした理解を目的にしており、正確でない可能性があります。
詳細は最後に掲載している参考文献を確認してください。

## Covariance Matrix Adaptation Evolution Strategy(CMA-ES)

日本語では「共分散行列適応進化戦略」と呼ばれます。
進化戦略は言葉の通りで、過去の情報をもとに次の良いものを求めるという「進化」を行っていく手法です。

進化の対象となっている共分散行列について紹介します。

### 共分散行列について

正規分布を考えます。

上記は 1 次元の正規分布でしたが、2 次元の正規分布を考えます。

上記図のように、値の分散を表す行列 C を共分散行列と言い、この共分散行列を過去の情報をもとに進化させていくのが CMA-ES になります。

### アルゴリズム概要

ざっくりとしたアルゴリズムの概要は参考文献の 1 より以下のようになります。

> 1. 多変量正規分布 σN(m, C) に従って λ 個体を生成し、各個体の適合度(目的関数の値)を算出する
> 1. 生成した λ 個体のうち目的関数の値が上位 μ 個体を抽出する
> 1. μ 個体のパラメータと進化パス pσ, pc に基づいて多変量正規分布のパラメータ m、σ、C を更新する
> 1. 値が収束するまで 1-3 を繰り返す

遺伝的アルゴリズムの場合は、前世代の中で上位数％の個体を使って次の世代を探索します。
つまり良い個体の近傍を探していると考えることができます。  
それに対して CMA-ES の場合は、前世代の中で上位数％の個体から求まる多変量正規分布を使い、その範囲から探していると考えることができます。

挙動としては以下のようになります。(画像は参考文献 1 より)
解を探索する範囲（多変量正規分布）を結果に適応させながら、最適地に向かって進化していくことが見て取れます。

<img width="600" alt="cma-es" src="https://hiron.dev/article-images/learn-a-little-bit-about-cmaes-in-3-minutes/cmaes.gif">

細かな挙動については参考文献の 1 や 2 が日本語資料としてわかりやすいです。
より詳細は参考文献 6 の元論文を参照してください。

## 参考文献

1. [CMA-ES（共分散行列適応進化戦略）の Python 実装](https://horomary.hatenablog.com/entry/2021/01/23/013508)
1. [#.05 CMA-ES (共分散行列適応進化戦略) アルゴリズム解説【VR アカデミア論文解説リレー】](https://www.youtube.com/watch?v=DR73g66sdUc)
1. [Evolution Strategies による連続最適化 CMA-ES の設計原理と理論的基盤](https://www.jstage.jst.go.jp/article/isciesci/60/7/60_292/_pdf/-char/ja)
1. [CyberAgentAILab/cmaes](https://github.com/CyberAgentAILab/cmaes)
   - Tunny が内部で使用しているライブラリ
1. [Introduction to CMA-ES sampler.](https://medium.com/optuna/introduction-to-cma-es-sampler-ee68194c8f88)
1. [N. Hansen, The CMA Evolution Strategy: A Tutorial. arXiv:1604.00772, 2016.](https://arxiv.org/abs/1604.00772)
   - CMA-ES の論文著者による解説
1. [A Visual Guide to Evolution Strategies](https://blog.otoro.net/2017/10/29/visual-evolution-strategies/)
1. [HP: Nikolaus Hansen](http://www.cmap.polytechnique.fr/~nikolaus.hansen/)
