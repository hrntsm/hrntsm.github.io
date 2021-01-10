---
title: 'RhinoInside Unity の公式サンプルで遊ぶ'
date: 2020-02-29T15:31:00.002+09:00
draft: false
aliases: [ "/2020/02/rhiniinsideunity.samplecheck.html" ]
tags : [Unity, grasshopper, RhinoInside, C#, rhinoceros]
---

　公式のRhinoInside Unityをちょっといじって遊んでみます。最終的には以下のようなものを目指します。  

　Unity側のゲームオブジェクトの座標を取得してGrasshopperに送り、その情報をもとにRhino側でジオメトリを計算しメッシュを返し、Unityでゲームオブジェクトとして表示することをやっています。  
　なおこの記事は、Unity、Rhino、C#を基本的な操作を理解していることを前提にしています。

  

![](https://1.bp.blogspot.com/-6V7f-V45f6I/XlnF_6_cg1I/AAAAAAAABxE/LcQkqiRw7z4OEDSck8fkjb1PDhm4DJ7TACLcBGAsYHQ/s640/rhinoinsideunity_vshoudini.gif)

  

　RhinoInside は2020/02/29現在開発中の機能なので、RhinoWIP（Rhino7）を使えるかたにしか使えない機能です。RhinoInside でなにができるか気になる方は[こちらのQiitaの記事](https://qiita.com/hiron_rgkr/items/ba00b7ae75068a54ff20)をどうぞ

　RhinoInside Unityを使うためには[mcneelのGitHub](https://github.com/mcneel/rhino.inside/tree/master/Unity)を参照してください。概要を説明します。  
  

1.  リポジトリをクローンしてください。コマンドプロンプトからやる場合は以下のコマンドを入れてください。  
    ```
    git clone --recursive https://github.com/mcneel/rhino.inside.git rhino.inside
    ```
2.  RhinoCommonをアップデートするため rhino.inside\\Unity\\Sample1\\Assets\\Standard Assets\\RhinoInside のフォルダに行き RhinoCommon.Update.bat をダブルクリックしてください。

　これで使えるようになります。

　遊んでいくベースとするのは rhino.inside\\Unity\\Sample2 のフォルダのデータなのでUnityHubなどを使っているならば、上記フォルダを追加して開きましょう。

  

[![](https://1.bp.blogspot.com/-Qvc95M49gfg/Xlnzwbq90-I/AAAAAAAABxg/vpwdxb-nO4Aw7beMmi5skYsOfoPcABihgCLcBGAsYHQ/s400/%25E7%2594%25BB%25E5%2583%258F1.png)](https://1.bp.blogspot.com/-Qvc95M49gfg/Xlnzwbq90-I/AAAAAAAABxg/vpwdxb-nO4Aw7beMmi5skYsOfoPcABihgCLcBGAsYHQ/s1600/%25E7%2594%25BB%25E5%2583%258F1.png)

  

　Unityを開くと上の画像のようにGrasshopperがあるのでShowを押すとUnityの裏でRhinoとGrasshopperが起動し、ゲームオブジェクトの”Grasshopper Geometry”が作られます。

　Grasshopperでは”callunity2.gh”ファイルを開くと、UnityのMainCameraの座標をghに送りその点に対してgh上でジオメトリの操作をして作られたメッシュをUnityに返す中身になっています。Unityとやり取りする部分だけC#スクリプトのコンポーネントで作成されています。

　ghの中身の概要としてはBoxで領域を作ってその中にPopulate3Dで点をランダムにうち、その点とUnityのMainCameraの座標のDistanceをとってその関係からRemapしてその点にsphereを作る挙動になっています。

　動作はこんな感じです。

  

[![](https://1.bp.blogspot.com/-V-Tl-UzRpPQ/Xln3pHcvPqI/AAAAAAAABx4/K9HCqdQ1WnUpNgSycLpN58RLSyTj3SbRQCLcBGAsYHQ/s400/RIU_Sampl2.gif)](https://1.bp.blogspot.com/-V-Tl-UzRpPQ/Xln3pHcvPqI/AAAAAAAABx4/K9HCqdQ1WnUpNgSycLpN58RLSyTj3SbRQCLcBGAsYHQ/s1600/RIU_Sampl2.gif)

  

　これだけだとsampleそのままで面白くないので、ghの中で点をうつ基準になっているBoxのサイズもUnity側から操作できるようにしてみます。

　まずunityにBoxのサイズをコントロールするものを作ります。gh内でBoxを作成するためにはBoxのxyz座標があればいいので、unityのゲームオブジェクトのtransformを送ればいいとして、UnityでCreateEmptyでゲームオブジェクトを作って”ControlPoint”と名前を付けます。

[![](https://1.bp.blogspot.com/-2DC4FQFBF9A/Xln6lF-KkFI/AAAAAAAAByQ/FcELw49TsgA_MIca2IZqXrr0hw_Kn0n3ACLcBGAsYHQ/s400/%25E7%2594%25BB%25E5%2583%258F2.png)](https://1.bp.blogspot.com/-2DC4FQFBF9A/Xln6lF-KkFI/AAAAAAAAByQ/FcELw49TsgA_MIca2IZqXrr0hw_Kn0n3ACLcBGAsYHQ/s1600/%25E7%2594%25BB%25E5%2583%258F2.png)

  

　この”ControlPoint”をgh側に送るためにGrasshopperInUnity.csをいじります。このファイルでは最初の方はMenuItemでの操作の部分が書いてあり一番下のUpdateの部分に追記していきます。

　Updateの初めの部分を読むと 

　　var pt = Camera.main.gameObject.transform.position.ToRhino()

となっていて、MainCameraのポジションをToRhinoしています。

　ToRhinoでやっていることは、transform.positionで取得できるのはVector3なので、ToRhinoでRhino.Geometry.Point3d に変換しています。その後argsに”point”という名前で pt をセットし、

　　Rhino.Runtime.HostUtils.ExecuteNamedCallback("ToGrasshopper", args)

で送ってます。

　なので、”ControlPoint”のtransform.positionをToRhinoすれば良さそうなので同じように書いて以下のように追記します。  

  
  
　これでUnity側での作業は終わりです。  
　次にgh側です。Unityから受け取るのはMainCameraのものと同じなので既にあるreceiveのコンポーネントをコピーします。中身を以下のように書き換えます。  
  
  
　書き換えた点は、9行目で、Unityから届く登録された名前は”ToGrasshopper1”なのでその点を修正しています。同様に20行目もTryGetGeometryするものの名前を”controlpoint”に変えています。これでC#コンポーネントが完成したのでその出力であるポイントの情報をDeconstructしてBoxの入力に入れます。  
　以上で作業は終わりです。これでうまくいっていればUnity側から操作できるようになっていると思います。よくわかりませんが書きたての時はうまく動かなかったりUnityが落ちたりするので、ダメなときはunity再起動するとうまくいく場合があるかもしれません。  
　あなたもこれでRhinoInsideUnityで遊んでみてください。  
  

[![](https://1.bp.blogspot.com/-pukbJjiUEF4/XloEg7XZk1I/AAAAAAAAByo/62SY-yQ1E1AqtS3ROQ9rb88w0WiMd3SpACLcBGAsYHQ/s640/RIU_Sampl2-2.gif)](https://1.bp.blogspot.com/-pukbJjiUEF4/XloEg7XZk1I/AAAAAAAAByo/62SY-yQ1E1AqtS3ROQ9rb88w0WiMd3SpACLcBGAsYHQ/s1600/RIU_Sampl2-2.gif)