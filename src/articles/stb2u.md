---
title: "st-bridgeのunity読み込みツール「Stb2U」について"
date: "2020-02-05"
draft: false
path: "/articles/stb2u"
article-tags: ["Unity", "CSharp"]
---

Unity で建築構造設計の一貫計算ソフトと BIM の連携等に使用されている ST-Bridge データを読み込むアセットを作成したので公開します。

動作の様子は以下のような感じです。ここで使っている建物の ST-Bridge データは、規格を作成している一般社団法人 building SMART Japan さんで公開されている「[ST-Bridge Viewer](https://www.building-smart.or.jp/old/download/files/20171030_st.zip)」のなかのサンプルデータを使用させていただいています。

[![](https://1.bp.blogspot.com/-IIo29ddUg58/Xjoap7b_a9I/AAAAAAAABvg/KFJGHy6UBhE2tWtAPuN57ctc7PxLnLz4gCLcBGAsYHQ/s640/stb2u.gif)](https://1.bp.blogspot.com/-IIo29ddUg58/Xjoap7b_a9I/AAAAAAAABvg/KFJGHy6UBhE2tWtAPuN57ctc7PxLnLz4gCLcBGAsYHQ/s1600/stb2u.gif)

[](https://draft.blogger.com/null)　そもそも ST-Bridge とは何か？というのは、bSJ さんのサイトより確認ください。

[https://www.building-smart.or.jp/meeting/buildall/structural-design/](https://www.building-smart.or.jp/meeting/buildall/structural-design/)

## アセットの対応状況（Stb2U v.0.1）


- 入力されたデータから部材ごとにメッシュを作ります。
- 基本的なタグのデータには対応（柱、梁、間柱、小梁、ブレース、スラブ）
- 耐震壁、基礎、杭ほかパラペット等は非対応です。
- S、RC、SRC、CFT に対応していますが、そんなに多くのデータでデバッグしているわけではないので、全部がうまく出るかはよくわかりません。
- ST-Bridge の Version1.x 系が対象で、Version2.x 系は非対応です。
- 部材のハンチには対応していません。中央断面で出力します。
- 対応している鉄骨断面は、ロール H、ビルト H、ロール BOX、ビルト BOX、L です。T、C、LipC、FB、Pipe は非対応です。
- 部材のオフセット、回転には非対応なので、例えば H 柱は常に X 軸方向が強軸で出力されます。
- アセット読み込み後、メニューバーに表示される Stb2U から stb ファイルを読み込むことでモデルが作成されます。

非対応なのは実装が難しいわけではなく、自分の手元にあるサンプルではおおむね出力できるようになって満足したので実装していないだけで、需要とやる気があればそのうち実装するかもしれません。

## ダウンロードについて

AssetStore に出していないので、アセットのダウンロードは私の GitHub から README、LICENSE を確認の上、どうぞ。

ダウンロードリンク：[https://github.com/hiro-n-rgkr/Stb2Unity/releases](https://github.com/hiro-n-rgkr/Stb2Unity/releases)

コードが気になる方は同じく[Github のリポジトリ](https://github.com/hiro-n-rgkr/Stb2Unity)もしくはダウンロードしたアセットに入っている.cs ファイルを参照ください。ぐちゃぐちゃですが、C#の LINQ を使って XML を読み込んでいるだけです。

中身は以前開発した stbhopper とほぼ同様ですが、こちらの方があとなので、コードはこちらの方が整理されています。基本的な違いは、データの持ち方が違うのでそこを変更しているだけです。（gh 版は double で処理している箇所を、unity では float で処理するように変更している）

今後は、unity 上で動作する環境はできているので、UI を整理し Unity なしでも動作するスタンドアロン版の開発を考えています。
