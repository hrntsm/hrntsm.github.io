---
title: "ランダムに柱梁が入ったような構造を解析"
date: "2017-09-17"
draft: false
path: "/articles/Karamba-RandomRigidFrame"
article-tags: ["Karamba3D", "構造とデジタル"]
---

GA Japan 147 号に記載の夏野ビルのようなランダムに柱梁が入っているようなモデルを作成し Karamba3D で応力解析してみます。

[![](https://1.bp.blogspot.com/-n7BQmma49SE/Wb4ALd-XrqI/AAAAAAAABb0/yfKn1RDNa2EV_cw0fwXPOiWiuaDgdtN0wCLcBGAs/s640/twitter.PNG)](https://1.bp.blogspot.com/-n7BQmma49SE/Wb4ALd-XrqI/AAAAAAAABb0/yfKn1RDNa2EV_cw0fwXPOiWiuaDgdtN0wCLcBGAs/s1600/twitter.PNG)

架構は柱勝ちを想定して柱は下から上まで通っているとします。柱間隔と梁配置をランダムにして作成してみます。

## 柱の作成

作り方は柱脚の点を作成し、LineSDL コンポーネントで立ち上げます。
今回は形のモデル化を目的にしているので、縦横の比率を 1:2 として Z 方向に 30、Y 方向に 15 の範囲で作成します。

柱脚の点は Random コンポーネントを使用して作成し ConstructDomain コンポーネントで点を作成する範囲を決めています。最初の点は原点に来るため、ランダムとは別で設定しています。

作成した数値を Number コンポーネントで一体化ます。次に、SortList コンポーネントで順番を揃え ConstructPoint コンポーネントで柱脚となる点を作成し、LineSDL コンポーネントで柱となる線を作成しています。

[![](https://4.bp.blogspot.com/-SlQVwGqksts/Wb4Dxs5XvBI/AAAAAAAABcA/MY2RkjdIGggjQmOvryk-GhhTi09BgtKxQCLcBGAs/s640/%25E6%259F%25B1%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.PNG)](https://4.bp.blogspot.com/-SlQVwGqksts/Wb4Dxs5XvBI/AAAAAAAABcA/MY2RkjdIGggjQmOvryk-GhhTi09BgtKxQCLcBGAs/s1600/%25E6%259F%25B1%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.PNG)

## 梁の作成

次に梁のとりつく点を作成します。作成法は先程作成した柱のラインを各柱ごとに DivideCirve コンポーネントで異なる分割数にしその点を梁を取り付けるとすることを考えます。

　まず梁をかけるために隣接する柱が分割数を等しくしなければならないため、以下のように ListItem コンポーネントを使用して 1 本 1 本を Line コンポーネントに入れていきます。

[![](https://4.bp.blogspot.com/-zeRs6vHK6jw/Wb4GF0sI1RI/AAAAAAAABcM/2C-HwiDr7GAUgaP4AI-s4kWkgg8BsC1JACLcBGAs/s640/%25E6%259F%25B1%25E3%2581%25AE%25E5%258F%2596%25E3%2582%258A%25E5%2587%25BA%25E3%2581%2597.PNG)](https://4.bp.blogspot.com/-zeRs6vHK6jw/Wb4GF0sI1RI/AAAAAAAABcM/2C-HwiDr7GAUgaP4AI-s4kWkgg8BsC1JACLcBGAs/s1600/%25E6%259F%25B1%25E3%2581%25AE%25E5%258F%2596%25E3%2582%258A%25E5%2587%25BA%25E3%2581%2597.PNG)

取り出した柱に対して DivideCirve コンポーネントで分割していきます。

ここでは分割数は最大 10 とし、隣接する梁の数と同じにならないよう適当な値を入れていきます。例として以下に一番端の柱についての部分を示しています。

隣接する柱ごとにまとめ同一の分割数にすることで、梁が水平にかかるよう設定しています。

[![](https://4.bp.blogspot.com/-0s4BxAyNX4I/Wb4KF6lZqiI/AAAAAAAABcY/-ctFTdmvMUw_eBmypi0fo20np3ltRzi3wCLcBGAs/s640/%25E6%25A2%2581%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.PNG)](https://4.bp.blogspot.com/-0s4BxAyNX4I/Wb4KF6lZqiI/AAAAAAAABcY/-ctFTdmvMUw_eBmypi0fo20np3ltRzi3wCLcBGAs/s1600/%25E6%25A2%2581%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.PNG)

## Karamba3D でのモデル化

これで柱梁の線のモデル化ができたので、Karamba3D に取り込んでいきます。

ここで、柱のラインは分割点で分けていないので、そのまま Karamba3D に取り込むと梁の位置で節点が切られないため、モデル化がうまくいきません。

今回は Karamba3D の機能である Line-Line InterSection コンポーネントを使用します。
このコンポーネントを使用することで、与えられたラインとラインから交点とそれからなるラインを出力してくれます。
これを使うことで柱が梁との交点で分割されるので、Karamba3D でモデル化できるようになります。

[![](https://2.bp.blogspot.com/-Rw8Vq689uT8/Wb4NvjTsEXI/AAAAAAAABck/K38UELjxY90hlwwI_VdXImkaFTX32v5HQCLcBGAs/s400/%25E3%2583%25A9%25E3%2582%25A4%25E3%2583%25B3%25E3%2582%25A4%25E3%2583%25B3%25E3%2582%25BF%25E3%2583%25A9%25E3%2582%25AF%25E3%2582%25B7%25E3%2583%25A7%25E3%2583%25B3.PNG)](https://2.bp.blogspot.com/-Rw8Vq689uT8/Wb4NvjTsEXI/AAAAAAAABck/K38UELjxY90hlwwI_VdXImkaFTX32v5HQCLcBGAs/s1600/%25E3%2583%25A9%25E3%2582%25A4%25E3%2583%25B3%25E3%2582%25A4%25E3%2583%25B3%25E3%2582%25BF%25E3%2583%25A9%25E3%2582%25AF%25E3%2582%25B7%25E3%2583%25A7%25E3%2583%25B3.PNG)

次に Karamba3D 側で解析設定をします。

ここでは柱脚位置にピン支点、荷重は水平に 0.2g かけて解析しています。

曲げモーメント図を以下には出していますが、やはり単スパン箇所は曲げが大きく入っており、最上部では逆せん断のようになっていることがわかります。

[![](https://1.bp.blogspot.com/-3AktbMZluQ4/Wb4PK2mfs-I/AAAAAAAABcw/I8dP2_-Pamgpumiyu-3bcq4BoM0fn0kIwCLcBGAs/s640/karamba.PNG)](https://1.bp.blogspot.com/-3AktbMZluQ4/Wb4PK2mfs-I/AAAAAAAABcw/I8dP2_-Pamgpumiyu-3bcq4BoM0fn0kIwCLcBGAs/s1600/karamba.PNG)

あとは最初にランダムで設定した柱間隔の seed の値を変更と梁間隔を適宜設定することで、ランダムに柱梁が入った構造の解析を行えます。

開口箇所で梁を抜くなどは、出力される梁の List を適宜 CullIndex コンポーネント等で抜いてあげれば対応できます。
