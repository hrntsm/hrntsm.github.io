---
title: 'RhinoInside UnityでRhinoへメッシュを送るやり方'
date: "2020-03-05"
draft: false
path: "/articles/rhino.inside.unity-sendmesh"
tags : ["Unity", "RhinoInside", "C#", "rhinoceros"]
---

　Rhino.Inside.UnityでUnityからRhinoにメッシュを送る部分を作成したので、送り方を説明します。なお作った結果として、メッシュはデータ量が多いからか動作が非常に重くなるので、リアルタイムでメッシュのやり取りをしない限りはFBXなどを介して送ったほうがよさそうです。  
  

[![](https://1.bp.blogspot.com/-VYfATyeLD_k/XmERX5ZA1cI/AAAAAAAABzU/TazirU_T4GUczJpEcmT1UYhCq7GWtczuACLcBGAsYHQ/s640/RIUmesh.gif)](https://1.bp.blogspot.com/-VYfATyeLD_k/XmERX5ZA1cI/AAAAAAAABzU/TazirU_T4GUczJpEcmT1UYhCq7GWtczuACLcBGAsYHQ/s1600/RIUmesh.gif)

  

mcneelのGitHubにRhinoからUnityにメッシュを送る部分があるのですが、UnityからRhinoに送る部分がなかったためその部分を作成しました。  
　ただし今回作成したのは、Unityでゲームオブジェクトにアタッチされているメッシュそのもの（MeshFilterの中のMesh）を送っているだけなため、transformで設定するposition、rotation、scaleは送っていません。このこともあって冒頭でFBXなどのものを進めています。  
　作成したベースは[Rhino.Inside.Unityのsample2](https://github.com/mcneel/rhino.inside/tree/master/Unity/Sample2)を使っています。  
　Rhinoに送るためにはUnityのメッシュ(UnityEngine.Mesh)をRhinoのメッシュ(Rhino.Geometry.Mesh)に変換する必要があるので、そこを作成します。上記サンプルの中ではConvert.csの中でその変換をやっているので、そこに追記します。追記した内容は以下です。  
  
　UnityのMesh(\_mesh)を受け取って、そこからBrepを作り、そのBrepからRhinoのMeshを作っています。  
　Brepのつくり方は、まずUnityのメッシュのverticesとtrianglesを使って構成する3点を取得します。この点はUnityのVector3なので、ToRhinoでRhinoのPoint3dに変換し、CreateFromCornerPointsでBrepを作ります。最後の引数は、toleranceなので、想定する精度をもとに決めればよいですが、Unityの1は1m相当なので、ここでtoleranceを1mmと思って1にすると細かいモデルはうまく送れないのでここでは0.0001にしています。必要な精度で適宜設定してください。  
　MeshはBrepからCreateFromBrepでつくりAppendすることでひとまとまりのメッシュにしています。  
　送るメッシュは別途RhinoInsideController.csを作ってそれを適当なゲームオブジェクトにアタッチして、そこに\_sendObjectとして受け取るようにしてます。  
  
  
　Grasshopperで受け取る側は以下です。  
  
  
　受け取り方は、ポイントの受け取り方と同じでNameCallbackを使ってやっています。  
　  
　ここで作ったものはUnityのプロジェクトごと[ここのSample3](https://github.com/hrntsm/rhino.inside/tree/master/Unity)にあげました。Unity 2018.4で作っています。参考にしてください。