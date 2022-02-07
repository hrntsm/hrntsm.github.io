---
title: "Deep dive into RhinoCompute through Rust"
date: "2022-02-12"
draft: false
path: "/articles/deep-dive-into-rhinocompute-through-rust"
article-tags: ["Rust", "RhinoCompute", "Grasshopper"]
---

## はじめに

最近流行りの言語として Rust があり、触ってみたいと思っている方も多いのではないでしょうか。
ただ、建築系ソフトをみるとその多くが Python や C# で SDK が提供されており、仕事で使わない Rust のような言語に触れることはほぼありません。

ならば Rust で建築系のソフトのなにかを操作できるようになれば、Rust を触れる機会が生まれるはずです。
ということで、本記事では Rhinoceros と HTTP 通信を行うことで Rhinoceros の機能を使うことができる RhinoCompute を Rust で使う方法について紹介します。

本記事でははじめに Rust に触る前にどのように実装するべきか確認するため、RhinoCompute と通信を行うことへの理解を深めます。
その後、その内容に基づいて Rust で実行環境を作成します。

技術的には Rhino のデータを取得し rhino3dm 相当の操作をすることが可能ですがそのための実装は時間がかかるため、Grasshopper データを Post して RhinoCompute を使いその結果を取得することを目標とします。

### 必要な環境

- Rhinoceros 7以降
- Grasshopper の Hops コンポーネント v0.11以降
- Rust

## RhinoCompute との通信内容について

## Rust について

## Rust を使った RhinoCompute との通信の実装