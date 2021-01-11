---
title: "UDPを使ってUnityにghのMeshを送る方法"
date: "2019-04-21"
draft: false
path: "/articles/MethodToSendSurfaceToUnityUsingUDP"
article-tags: ["Unity", "Grasshopper", "CSharp"]
---

UDP で通信ができる gHowl というコンポーネントを使用して、ゲームエンジンの Unity と grasshopper を接続する方法について説明します。今回が初の Unity 関連の記事です。

基本的な Unity の使い方はほかのサイトの方が詳しいので、そちらをググってください。今回やったことを解説していきます。

実際に接続してメッシュを送っている様子が以下です。

[![](https://3.bp.blogspot.com/-JOQY2UbklfQ/XLv1YDUcymI/AAAAAAAABn8/KnFXduxbYJIIJB2PiRUt7_a1uUJY9VxwQCLcBGAs/s640/test.gif)](https://3.bp.blogspot.com/-JOQY2UbklfQ/XLv1YDUcymI/AAAAAAAABn8/KnFXduxbYJIIJB2PiRUt7_a1uUJY9VxwQCLcBGAs/s1600/test.gif)

今回の内容は基本的には以下の動画を参考に作成しています。こちらの動画は細かい解説をしていないため、実際はどうかわかりませんが様子を見る限りたぶん同じことをやっています。

基本的な流れは以下です。

1．Rhino または grasshopper でサーフェスをモデル化  
2．作成したサーフェスを TriangularPanelsA コンポーネントで全て三角形のサーフェスに変換  
3．DeconstructBrep で作成したサーフェスを分解し、頂点情報の Vertices を UDP で送信用に適当に編集する。  
4．ghowl で Unity へ UDP で送信  
5．Unity 側で UDP 受信する C#スクリプトを作成して gh 側からのデータを受け取る  
6．受けった頂点情報から Unity 内で mesh を作成する

Rhino または grasshopper での操作について  
　送りたいデータはなんでもよいですが、最終的には[Lunchbox](https://www.food4rhino.com/app/lunchbox)の TriangularPanelsA コンポーネントですべて三角形のサーフェスにするのでそれを念頭にモデル化してください。  
　作成したサーフェスを DeconstructBrep で頂点情報を取得し Flatten して出力していますが、最終的には 1 行の頂点座標が羅列された文字列にしたいのでこうしています。出力はリスト形式になっているので、Join コンポーネントで一体化して一つの文字列にしています。  
　一つの文字列になった頂点情報を gHowl を使用して UDP で送信しています。ポートは 3333 していますが、Unity の受信側で設定しているポートと一致していれば何でもよいです。

gHowl の使い方は AMD lab さんが書いているのでそちらをどうぞ（[gHowl の使い方 ①](https://amdlaboratory.com/amdblog/grasshopperghowl%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9%E2%91%A0/)）

実際にやってみた感じはこんな感じです。

[![](https://2.bp.blogspot.com/-BXztLgMM4IY/XLv-X12LIjI/AAAAAAAABoc/b8aorXbARWM2px5dLCJiOQylAnaihNCCQCLcBGAs/s640/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)](https://2.bp.blogspot.com/-BXztLgMM4IY/XLv-X12LIjI/AAAAAAAABoc/b8aorXbARWM2px5dLCJiOQylAnaihNCCQCLcBGAs/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

Unity 側での操作

Unity 側では UDP で受信して受信した 1 つの文字データを必要な状態に加工する UDPMesh.cs と 加工したデータから Unity 上にメッシュを作成する GHMesh.cs の 2 つの C#スクリプトを作成しています。  
　初めに UDPMesh.cs の中身について。基本的にはすべて UDP の受信の設定です。[Qiita の Unity で UDP を受信してみる](https://qiita.com/nenjiru/items/8fa8dfb27f55c0205651)  を参考に作っています。ここの LOCAL＿PORT の値を gh 側のポートの番号と合わせてください。  
　最後の部分の messege = text;  以下の部分で gh から受信したデータをこの後のために加工しています。やっていることはデータは例えば ｛0,0,0｝｛1,0,0｝..... といった形で送られてくるので 、以下のようにカッコを削除して単なる数字の羅列にしてます。  
｛0,0,0｝｛1,0,0｝　 → 　 0,0,0,1,0,0  
　この作業は gh 側でやっても問題ありません。  
　以下コードの中身

次に GHMesh.cs の中身について。最初は引数とかいろいろ。void Start のところで Mesh を扱う準備。void Update のところから実際のメッシュの作成を行っています。  
　まず加工した UDP で受信した文字列データをカンマごと区切ってに float 型にして FloatArray に入れています。  
　 Vector3 型を作成して FloatArray のデータを 3 つずつ入れていきます。これ｛0,0,0｝を 0 これ 0,0,0 に加工しているだけなので、3 つずつ入れていけば自然と(x 座標, y 座標, z 座標)になるはずです。  
　この後頂点の番号を振っていきます。頂点が同一座標でも、番号が異なる場合と同じ場合で unity 側での表示が異なりますが、頂点の番号情報は gh から持ってきていないので、ここでは気にせず頂点の数だけ for 文で番号を作成しているだけです。  
　最後に CreateMesh に頂点座標と番号を渡して三角形のメッシュを作成して完成です。  
　以下コードの中身

作った C#スクリプトを Unity 側で CreateEmpty とかで GameObject を作成して AddComponent して play したら gh 側からデータが送られてきます。  
　かなり力技の方法でやっていてあまりスマートではないですが、とりあえずできたのでまとめました。gh 側で作っているものはサーフェスなのに、Unity 側はメッシュなので、そのせいでうまくいっていない個所があったりします。  
　内容を見てわかると思いますが、このコードは三角形のみを対象にしているので四角形のサーフェスやメッシュが含まれるとうまくデータを Unity 側でメッシュを作成できませんので、気を付けてください。  
　作ったものは[github](https://github.com/hrntsm/UnityGH)にもあげているのでそちらもどうぞ
