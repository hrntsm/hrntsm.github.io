---
title: "Rhino 向けに書いた C# を Unity 向けに書き換えるときの注意点"
date: "2019-12-02"
draft: false
path: "/articles/rhino-cs-to-unity"
article-tags: ["Rhinoceros", "Unity", "CSharp", "Qiita"]
---

## はじめに

Rhinoceros と Unity、どちらも C#を使って開発できますが、自分が作成していた Rhino の grasshopper で動作するコンポーネントを Unity で動作するように書き換えたので、その際の注意点を備忘録的に残します。

## 注意点

### 頂点を表すときに使うものに入れられる型が違う

- Rhino だと Point3d だが、これは double
  - これについては、Point3f(float 型)もあるので、Rhino 側をそれで作っておけばいいのでは？ って話もあるが、Rhino は基本 double で Line とか Surface とかつくるので、Rhino で毎回キャストし直す必要がでてきてめんどくさい
- Unity だと Vector3 だが、これは float
  - double で処理するように *2.0 のように書いたところを float になるように *2 に直した
  - もともとの戻り値が double なのを float にキャストしなす部分をちまちま追加したりした

### 座標のプロパティ名が少し違う

- Rhino だと Point3d.X で X 座標（大文字）
- Unity だと Vector3.x で X 座標（小文字）

### 扱えるメッシュのタイプが違う

- Rhino は 3 頂点と 4 頂点のメッシュが使える
- Unity は 3 頂点のみ

### 座標系が違う

- Rhino は Y-Up
- Unity は Z-Up

### SDK が違う

- これは当たり前だが、どこまで C#の共通の機能で書いて、どこからがそれぞれの固有の SDK を使うか考えないと後から直すのがめんどくさい
- 今回 Rhino 側は Surface で面を作成していたので、Surface から Brep を作成して部材としていた
  - ↑ これだと Rhino 固有の Surface と Brep の 2 つのものを使ってしまう。
  - Unity に Surface はないので、Surface と Brep の 2 つを Mesh に統一するよう書き方を変えないといけなかった

### 単位が違う

- Unity は基本的に 1 が 1m なのに対して、Rhino は初期の設定で変わるので単位を気を付けないとかなり大きいものができる
  - Rhino 側は単位を mm で作っていたので、最初想定の 1000 倍の大きさになってしまった。

### 作成したデータの扱い

- Grasshopper はデータツリーが膨れていくだけなので、適当に作ってもすぐには気にならない
- 一方 Unity はすべてが Inspector に表示されるので、特にデータの構造を気にしないで作ると Inspector が溢れかえる
  - Unity では適宜親の GameObject を作ってそこに子として入れるようにした。

## まとめ

今後また Rhino から Unity に書き直すこと前提で C#で何かを作ることがあるかわからないし、そんなことやる人がいるかもよくわからないけれども、上記を簡単に書き換えられるようにコードをまとめとくと後から楽です。
