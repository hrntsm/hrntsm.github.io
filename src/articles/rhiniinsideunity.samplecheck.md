---
title: "RhinoInside Unity の公式サンプルで遊ぶ"
date: "2020-02-29"
draft: false
path: "/articles/rhiniinsideunity.samplecheck"
article-tags: ["Unity", "grasshopper", "RhinoInside", "C#", "rhinoceros"]
---

公式の RhinoInside Unity をちょっといじって遊んでみます。最終的には以下のようなものを目指します。

Unity 側のゲームオブジェクトの座標を取得して Grasshopper に送り、その情報をもとに Rhino 側でジオメトリを計算しメッシュを返し、Unity でゲームオブジェクトとして表示することをやっています。  
　なおこの記事は、Unity、Rhino、C#を基本的な操作を理解していることを前提にしています。

![](https://1.bp.blogspot.com/-6V7f-V45f6I/XlnF_6_cg1I/AAAAAAAABxE/LcQkqiRw7z4OEDSck8fkjb1PDhm4DJ7TACLcBGAsYHQ/s640/rhinoinsideunity_vshoudini.gif)

RhinoInside は 2020/02/29 現在開発中の機能なので、RhinoWIP（Rhino7）を使えるかたにしか使えない機能です。RhinoInside でなにができるか気になる方は[こちらの Qiita の記事](https://qiita.com/hiron_rgkr/items/ba00b7ae75068a54ff20)をどうぞ

RhinoInside Unity を使うためには[mcneel の GitHub](https://github.com/mcneel/rhino.inside/tree/master/Unity)を参照してください。概要を説明します。

1.  リポジトリをクローンしてください。コマンドプロンプトからやる場合は以下のコマンドを入れてください。
    ```
    git clone --recursive https://github.com/mcneel/rhino.inside.git rhino.inside
    ```
2.  RhinoCommon をアップデートするため  rhino.inside\\Unity\\Sample1\\Assets\\Standard Assets\\RhinoInside のフォルダに行き  RhinoCommon.Update.bat をダブルクリックしてください。

これで使えるようになります。

遊んでいくベースとするのは  rhino.inside\\Unity\\Sample2 のフォルダのデータなので UnityHub などを使っているならば、上記フォルダを追加して開きましょう。

[![](https://1.bp.blogspot.com/-Qvc95M49gfg/Xlnzwbq90-I/AAAAAAAABxg/vpwdxb-nO4Aw7beMmi5skYsOfoPcABihgCLcBGAsYHQ/s400/%25E7%2594%25BB%25E5%2583%258F1.png)](https://1.bp.blogspot.com/-Qvc95M49gfg/Xlnzwbq90-I/AAAAAAAABxg/vpwdxb-nO4Aw7beMmi5skYsOfoPcABihgCLcBGAsYHQ/s1600/%25E7%2594%25BB%25E5%2583%258F1.png)

Unity を開くと上の画像のように Grasshopper があるので Show を押すと Unity の裏で Rhino と Grasshopper が起動し、ゲームオブジェクトの”Grasshopper Geometry”が作られます。

Grasshopper では”callunity2.gh”ファイルを開くと、Unity の MainCamera の座標を gh に送りその点に対して gh 上でジオメトリの操作をして作られたメッシュを Unity に返す中身になっています。Unity とやり取りする部分だけ C#スクリプトのコンポーネントで作成されています。

gh の中身の概要としては Box で領域を作ってその中に Populate3D で点をランダムにうち、その点と Unity の MainCamera の座標の Distance をとってその関係から Remap してその点に sphere を作る挙動になっています。

動作はこんな感じです。

[![](https://1.bp.blogspot.com/-V-Tl-UzRpPQ/Xln3pHcvPqI/AAAAAAAABx4/K9HCqdQ1WnUpNgSycLpN58RLSyTj3SbRQCLcBGAsYHQ/s400/RIU_Sampl2.gif)](https://1.bp.blogspot.com/-V-Tl-UzRpPQ/Xln3pHcvPqI/AAAAAAAABx4/K9HCqdQ1WnUpNgSycLpN58RLSyTj3SbRQCLcBGAsYHQ/s1600/RIU_Sampl2.gif)

これだけだと sample そのままで面白くないので、gh の中で点をうつ基準になっている Box のサイズも Unity 側から操作できるようにしてみます。

まず unity に Box のサイズをコントロールするものを作ります。gh 内で Box を作成するためには Box の xyz 座標があればいいので、unity のゲームオブジェクトの transform を送ればいいとして、Unity で CreateEmpty でゲームオブジェクトを作って”ControlPoint”と名前を付けます。

[![](https://1.bp.blogspot.com/-2DC4FQFBF9A/Xln6lF-KkFI/AAAAAAAAByQ/FcELw49TsgA_MIca2IZqXrr0hw_Kn0n3ACLcBGAsYHQ/s400/%25E7%2594%25BB%25E5%2583%258F2.png)](https://1.bp.blogspot.com/-2DC4FQFBF9A/Xln6lF-KkFI/AAAAAAAAByQ/FcELw49TsgA_MIca2IZqXrr0hw_Kn0n3ACLcBGAsYHQ/s1600/%25E7%2594%25BB%25E5%2583%258F2.png)

この”ControlPoint”を gh 側に送るために GrasshopperInUnity.cs をいじります。このファイルでは最初の方は MenuItem での操作の部分が書いてあり一番下の Update の部分に追記していきます。

Update の初めの部分を読むと
```
var pt = Camera.main.gameObject.transform.position.ToRhino()
```

となっていて、MainCamera のポジションを ToRhino しています。

ToRhino でやっていることは、transform.position で取得できるのは Vector3 なので、ToRhino で Rhino.Geometry.Point3d に変換しています。その後 args に”point”という名前で pt をセットし、
```
Rhino.Runtime.HostUtils.ExecuteNamedCallback("ToGrasshopper", args)
```
で送ってます。

なので、”ControlPoint”の transform.position を ToRhino すれば良さそうなので同じように書いて以下のように追記します。

これで Unity 側での作業は終わりです。  
　次に gh 側です。Unity から受け取るのは MainCamera のものと同じなので既にある receive のコンポーネントをコピーします。中身を以下のように書き換えます。

書き換えた点は、9 行目で、Unity から届く登録された名前は”ToGrasshopper1”なのでその点を修正しています。同様に 20 行目も TryGetGeometry するものの名前を”controlpoint”に変えています。これで C#コンポーネントが完成したのでその出力であるポイントの情報を Deconstruct して Box の入力に入れます。  
　以上で作業は終わりです。これでうまくいっていれば Unity 側から操作できるようになっていると思います。よくわかりませんが書きたての時はうまく動かなかったり Unity が落ちたりするので、ダメなときは unity 再起動するとうまくいく場合があるかもしれません。  
　あなたもこれで RhinoInsideUnity で遊んでみてください。

[![](https://1.bp.blogspot.com/-pukbJjiUEF4/XloEg7XZk1I/AAAAAAAAByo/62SY-yQ1E1AqtS3ROQ9rb88w0WiMd3SpACLcBGAsYHQ/s640/RIU_Sampl2-2.gif)](https://1.bp.blogspot.com/-pukbJjiUEF4/XloEg7XZk1I/AAAAAAAAByo/62SY-yQ1E1AqtS3ROQ9rb88w0WiMd3SpACLcBGAsYHQ/s1600/RIU_Sampl2-2.gif)
