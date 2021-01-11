---
title: "簡単な時刻歴応答解析コンポーネントの開発"
date: "2017-07-17"
draft: false
path: "/articles/CS-MakeNewmarkBetaComponent"
article-tags: ["grasshopper", "C#"]
---

これまでのコンポーネント作成を踏まえて、単質点系の時刻歴応答解析を行うコンポーネントを作成します。グラスホッパーのパラスタしやすい特性を活かせば、時間のかかる時刻歴のパラスタが簡単になるのでは？と思って作成しましたが、単質点、弾性なので、疑似速度応答スペクトル作ったほうが早いですね。非線形、多質点化はまたそのうち実装します。

[![](https://4.bp.blogspot.com/-sTXUGEn1tUw/WWxOYWbsNOI/AAAAAAAABYw/WsuYr1f8rf0vXJeygvpZsvDDVX7I71L5QCLcBGAs/s640/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)](https://4.bp.blogspot.com/-sTXUGEn1tUw/WWxOYWbsNOI/AAAAAAAABYw/WsuYr1f8rf0vXJeygvpZsvDDVX7I71L5QCLcBGAs/s1600/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)

振動解析の手法については、たくさんの本が出ていることと、このブログの目的ではないので、下記の gist からコードの中身を見てください。作成したコンポーネントはデータ置き場に置いておきますが、解の確からしさはコードも公開しているので、使用する際は、確認してください。簡単な諸元は

- Newmark β 法で解析（β の値は直接指定）
- 減衰は初期剛性比例減衰
- 1 自由度の単質点系
- 線形解析
- 地震波は直接指定（カンマ区切りで連続したデータ）
- 入力は、質量、剛性、減衰係数、時間刻み、β の値、入力波の長さ、入力波
- 出力は、加速度、速度、変位

といった形です。  
　以下では作成したコンポーネントを使用して加速度応答スペクトルを作成してみます。地震波は El Centro NS を使用しています。対象の減衰定数は 0%、2%、10%としています。  
　計算は作成したコンポーネントの質量の入力を固有周期から計算するようにし、おおむねそれらしい解が得られる 0.15 秒から 5 秒まで固有周期を変えていき、応答の最大値を取得することで作成します。解の最大値は、出てくる解を SortList コンポーネントを使い並べかえることで取得しています。解析は平均加速度法(β ＝ 1/4)で行っています。

[![](https://1.bp.blogspot.com/-wQi50YCK9fY/WWxRDSJMXbI/AAAAAAAABY0/QQH06WR_eg8FOCq3MF-dZDZzgOs9ZVUyQCLcBGAs/s640/%25E3%2582%25B9%25E3%2583%259A%25E3%2582%25AF%25E3%2583%2588%25E3%2583%25AB%25E4%25BD%259C%25E6%2588%2590.PNG)](https://1.bp.blogspot.com/-wQi50YCK9fY/WWxRDSJMXbI/AAAAAAAABY0/QQH06WR_eg8FOCq3MF-dZDZzgOs9ZVUyQCLcBGAs/s1600/%25E3%2582%25B9%25E3%2583%259A%25E3%2582%25AF%25E3%2583%2588%25E3%2583%25AB%25E4%25BD%259C%25E6%2588%2590.PNG)

[![](https://4.bp.blogspot.com/-wW-VJS_WaSU/WWxRPcPWMyI/AAAAAAAABY4/e9uoTWcjOY0aPTE-__aWqxaCeA5HhRHBQCLcBGAs/s400/%25E7%25B5%2590%25E6%259E%259C.PNG)](https://4.bp.blogspot.com/-wW-VJS_WaSU/WWxRPcPWMyI/AAAAAAAABY4/e9uoTWcjOY0aPTE-__aWqxaCeA5HhRHBQCLcBGAs/s1600/%25E7%25B5%2590%25E6%259E%259C.PNG)

応答スペクトルを見るとあっていそうな形になっています。  
　応答の加速度波形を動画で以下に張り付けておきます。グラフの縦軸を固定していないので若干わかりづらいですが、固有周期が変わるため応答の位相がちょっとづつ動いていくことがわかります。意味があるかはわかりませんが、こういう図はなかなか見ないので新しい感はあります。
