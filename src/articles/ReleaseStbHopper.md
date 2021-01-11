---
title: "ST-Bridgeからデータを取得してモデルを表示するgrasshopperコンポーネントの公開"
date: "2019-10-06"
draft: false
path: "/articles/ReleaseStbHopper"
article-tags: ["Grasshopper", "CSharp", "Rhinoceros"]
---

Grasshopper で建築構造設計の一貫計算ソフトと BIM の連携等に使用されている ST-Bridge データを読み込むコンポーネント ”HoaryFox” を作成したので公開します。  
　動作の様子は以下のような感じです。ここで使っている建物の ST-Bridge データは、規格を作成している一般社団法人 building SMART Japan さんで公開されている「[ST-Bridge Viewer](https://www.building-smart.or.jp/old/download/files/20171030_st.zip)」のなかのサンプルデータを使用させていただいています。

[![](https://1.bp.blogspot.com/-DMiRpf-rZ-M/XZmA2QVtvDI/AAAAAAAABtM/2r3do4q-J_Izt1T2nYXGR6RL88Giw_DQACLcBGAsYHQ/s640/stb.gif)](https://1.bp.blogspot.com/-DMiRpf-rZ-M/XZmA2QVtvDI/AAAAAAAABtM/2r3do4q-J_Izt1T2nYXGR6RL88Giw_DQACLcBGAsYHQ/s1600/stb.gif)

そもそも ST-Bridge とは何か？というのは、bSJ さんのサイトより確認ください。

[https://www.building-smart.or.jp/meeting/buildall/structural-design/](https://www.building-smart.or.jp/meeting/buildall/structural-design/)

## コンポーネントの構成と使い方

ドキュメントページを作成したのでそちらをご確認ください。

[ HoaryFox ドキュメントページ](http://hrntsm.github.io/hoaryfox/)

## ダウンロードについて

[food4rhino](https://www.food4rhino.com/app/hoaryfox) にてダウンロードできます

中身が気になる方は同じく[Github のリポジトリ](https://github.com/hrntsm/HoaryFox)を参照ください。

## Karamba との連携

実験的な機能として ST-Bridge ファイルの構造解析コンポーネント Karamba への入出力をサポートしています。興味のある方は上記ドキュメントページを参照してください。

## VR 表示

本コンポーネントと RhinoVR と連携することで構造架構を簡単に VR で確認することができます。

詳細はこちらの動画で
