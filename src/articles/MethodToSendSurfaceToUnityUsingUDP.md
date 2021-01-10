---
title: 'UDPを使ってUnityにghのMeshを送る方法'
date: "2019-04-21"
draft: false
path: "/articles/MethodToSendSurfaceToUnityUsingUDP"
article-tags : ["Unity", "grasshopper", "C#"]
---

　UDPで通信ができるgHowlというコンポーネントを使用して、ゲームエンジンのUnityとgrasshopperを接続する方法について説明します。今回が初のUnity関連の記事です。

　基本的なUnityの使い方はほかのサイトの方が詳しいので、そちらをググってください。今回やったことを解説していきます。

　実際に接続してメッシュを送っている様子が以下です。

  

[![](https://3.bp.blogspot.com/-JOQY2UbklfQ/XLv1YDUcymI/AAAAAAAABn8/KnFXduxbYJIIJB2PiRUt7_a1uUJY9VxwQCLcBGAs/s640/test.gif)](https://3.bp.blogspot.com/-JOQY2UbklfQ/XLv1YDUcymI/AAAAAAAABn8/KnFXduxbYJIIJB2PiRUt7_a1uUJY9VxwQCLcBGAs/s1600/test.gif)

  
　今回の内容は基本的には以下の動画を参考に作成しています。こちらの動画は細かい解説をしていないため、実際はどうかわかりませんが様子を見る限りたぶん同じことをやっています。  
  

  
基本的な流れは以下です。  
  
1．Rhinoまたはgrasshopperでサーフェスをモデル化  
2．作成したサーフェスをTriangularPanelsAコンポーネントで全て三角形のサーフェスに変換  
3．DeconstructBrepで作成したサーフェスを分解し、頂点情報のVerticesをUDPで送信用に適当に編集する。  
4．ghowlでUnityへUDPで送信  
5．Unity側でUDP受信するC#スクリプトを作成してgh側からのデータを受け取る  
6．受けった頂点情報からUnity内でmeshを作成する  
  
  
Rhinoまたはgrasshopperでの操作について  
　送りたいデータはなんでもよいですが、最終的には[Lunchbox](https://www.food4rhino.com/app/lunchbox)のTriangularPanelsAコンポーネントですべて三角形のサーフェスにするのでそれを念頭にモデル化してください。  
　作成したサーフェスをDeconstructBrepで頂点情報を取得しFlattenして出力していますが、最終的には1行の頂点座標が羅列された文字列にしたいのでこうしています。出力はリスト形式になっているので、Joinコンポーネントで一体化して一つの文字列にしています。  
　一つの文字列になった頂点情報をgHowlを使用してUDPで送信しています。ポートは3333していますが、Unityの受信側で設定しているポートと一致していれば何でもよいです。  

　gHowlの使い方はAMD labさんが書いているのでそちらをどうぞ（[gHowlの使い方①](https://amdlaboratory.com/amdblog/grasshopperghowl%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9%E2%91%A0/)）

　実際にやってみた感じはこんな感じです。  

[![](https://2.bp.blogspot.com/-BXztLgMM4IY/XLv-X12LIjI/AAAAAAAABoc/b8aorXbARWM2px5dLCJiOQylAnaihNCCQCLcBGAs/s640/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)](https://2.bp.blogspot.com/-BXztLgMM4IY/XLv-X12LIjI/AAAAAAAABoc/b8aorXbARWM2px5dLCJiOQylAnaihNCCQCLcBGAs/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

  
Unity側での操作  

　Unity側ではUDPで受信して受信した1つの文字データを必要な状態に加工するUDPMesh.cs と 加工したデータからUnity上にメッシュを作成するGHMesh.cs の2つのC#スクリプトを作成しています。  
　初めに UDPMesh.cs の中身について。基本的にはすべてUDPの受信の設定です。[Qiita のUnityでUDPを受信してみる](https://qiita.com/nenjiru/items/8fa8dfb27f55c0205651) を参考に作っています。ここの LOCAL＿PORTの値をgh側のポートの番号と合わせてください。  
　最後の部分のmessege = text;  以下の部分でghから受信したデータをこの後のために加工しています。やっていることはデータは例えば ｛0,0,0｝｛1,0,0｝..... といった形で送られてくるので 、以下のようにカッコを削除して単なる数字の羅列にしてます。  
｛0,0,0｝｛1,0,0｝　→　0,0,0,1,0,0  
　この作業はgh側でやっても問題ありません。  
　以下コードの中身  
  

　次にGHMesh.cs の中身について。最初は引数とかいろいろ。void StartのところでMeshを扱う準備。void Updateのところから実際のメッシュの作成を行っています。  
　まず加工したUDPで受信した文字列データをカンマごと区切ってにfloat型にしてFloatArrayに入れています。  
　Vector3型を作成してFloatArrayのデータを3つずつ入れていきます。これ｛0,0,0｝を0これ 0,0,0 に加工しているだけなので、3つずつ入れていけば自然と(x座標, y座標, z座標)になるはずです。  
　この後頂点の番号を振っていきます。頂点が同一座標でも、番号が異なる場合と同じ場合でunity側での表示が異なりますが、頂点の番号情報はghから持ってきていないので、ここでは気にせず頂点の数だけ for文で番号を作成しているだけです。  
　最後にCreateMeshに頂点座標と番号を渡して三角形のメッシュを作成して完成です。  
　以下コードの中身  
  

  

　作ったC#スクリプトをUnity側でCreateEmptyとかでGameObjectを作成してAddComponentしてplayしたらgh側からデータが送られてきます。  
　かなり力技の方法でやっていてあまりスマートではないですが、とりあえずできたのでまとめました。gh側で作っているものはサーフェスなのに、Unity側はメッシュなので、そのせいでうまくいっていない個所があったりします。  
　内容を見てわかると思いますが、このコードは三角形のみを対象にしているので四角形のサーフェスやメッシュが含まれるとうまくデータをUnity側でメッシュを作成できませんので、気を付けてください。  
　作ったものは[github](https://github.com/hrntsm/UnityGH)にもあげているのでそちらもどうぞ