---
path: "/blog/2020/02/rhiniinsideunity.samplecheck"
title: "RhinoInside Unity の公式サンプルで遊ぶ"
date: "20/02/29"
originalUrl: "https://rgkr-memo.blogspot.com/2020/02/rhiniinsideunity.samplecheck.html"
slug: "/blog/2020/02/rhiniinsideunity.samplecheck"
tags:
    - Unity
    - grasshopper
    - RhinoInside
    - C#
    - rhinoceros
---
　公式のRhinoInside Unityをちょっといじって遊んでみます。最終的には以下のようなものを目指します。  
<div>　Unity側のゲームオブジェクトの座標を取得してGrasshopperに送り、その情報をもとにRhino側でジオメトリを計算しメッシュを返し、Unityでゲームオブジェクトとして表示することをやっています。  
　なおこの記事は、Unity、Rhino、C#を基本的な操作を理解していることを前提にしています。</div><div>  
<div class="separator" style="clear: both; text-align: center;">![](https://1.bp.blogspot.com/-6V7f-V45f6I/XlnF_6_cg1I/AAAAAAAABxE/LcQkqiRw7z4OEDSck8fkjb1PDhm4DJ7TACLcBGAsYHQ/s640/rhinoinsideunity_vshoudini.gif)</div><div class="separator" style="clear: both; text-align: center;">  
</div><div style="text-align: left;">　RhinoInside は2020/02/29現在開発中の機能なので、RhinoWIP（Rhino7）を使えるかたにしか使えない機能です。RhinoInside でなにができるか気になる方は[こちらのQiitaの記事](https://qiita.com/hiron_rgkr/items/ba00b7ae75068a54ff20)をどうぞ</div><div style="text-align: left;">　RhinoInside Unityを使うためには[mcneelのGitHub](https://github.com/mcneel/rhino.inside/tree/master/Unity)を参照してください。概要を説明します。  

1.  リポジトリをクローンしてください。コマンドプロンプトからやる場合は以下のコマンドを入れてください。  

<code style="background: initial; border-radius: 3px; border: 0px; box-sizing: border-box; display: inline; font-family: SFMono-Regular, Consolas, " liberation="" mono",="" menlo,="" monospace;="" font-size:="" 13.6px;="" line-height:="" inherit;="" margin:="" 0px;="" overflow-wrap:="" normal;="" overflow:="" visible;="" padding:="" 0px;="" word-break:="" normal;"="">git clone --recursive https://github.com/mcneel/rhino.inside.git rhino.inside</code>

2.  RhinoCommonをアップデートするため <span style="background-color: white; box-sizing: border-box; color: #24292e; font-family: , " blinkmacsystemfont"="" ,="" "segoe="" ui"="" ,="" "helvetica"="" ,="" "arial"="" ,="" sans-serif="" ,="" "apple="" color="" emoji"="" ,="" "segoe="" ui="" emoji";="" font-size:="" 16px;"="">rhino.inside\Unity\Sample1\Assets\Standard Assets\RhinoInside のフォルダに行き </span><span style="background-color: white; box-sizing: border-box; color: #24292e; font-family: -apple-system, BlinkMacSystemFont, " segoe="" ui",="" helvetica,="" arial,="" sans-serif,="" "apple="" color="" emoji",="" "segoe="" ui="" emoji";="" font-size:="" 16px;"="">RhinoCommon.Update.bat をダブルクリックしてください。</span><div><span style="color: #24292e; font-family: , " blinkmacsystemfont"="" ,="" "segoe="" ui"="" ,="" "helvetica"="" ,="" "arial"="" ,="" sans-serif="" ,="" "apple="" color="" emoji"="" ,="" "segoe="" ui="" emoji";"="">　これで使えるようになります。</span></div><div><span style="color: #24292e; font-family: , " blinkmacsystemfont"="" ,="" "segoe="" ui"="" ,="" "helvetica"="" ,="" "arial"="" ,="" sans-serif="" ,="" "apple="" color="" emoji"="" ,="" "segoe="" ui="" emoji";"="">　遊んでいくベースとするのは</span> <span style="background-color: white; box-sizing: border-box; color: #24292e; font-family: , " blinkmacsystemfont"="" ,="" "segoe="" ui"="" ,="" "helvetica"="" ,="" "arial"="" ,="" sans-serif="" ,="" "apple="" color="" emoji"="" ,="" "segoe="" ui="" emoji";="" font-size:="" 16px;"="">rhino.inside\Unity\Sample2 のフォルダのデータなのでUnityHubなどを使っているならば、上記フォルダを追加して開きましょう。</span></div><div><span style="background-color: white; box-sizing: border-box; color: #24292e; font-family: , " blinkmacsystemfont"="" ,="" "segoe="" ui"="" ,="" "helvetica"="" ,="" "arial"="" ,="" sans-serif="" ,="" "apple="" color="" emoji"="" ,="" "segoe="" ui="" emoji";="" font-size:="" 16px;"="">  
</span></div><div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-Qvc95M49gfg/Xlnzwbq90-I/AAAAAAAABxg/vpwdxb-nO4Aw7beMmi5skYsOfoPcABihgCLcBGAsYHQ/s400/%25E7%2594%25BB%25E5%2583%258F1.png)](https://1.bp.blogspot.com/-Qvc95M49gfg/Xlnzwbq90-I/AAAAAAAABxg/vpwdxb-nO4Aw7beMmi5skYsOfoPcABihgCLcBGAsYHQ/s1600/%25E7%2594%25BB%25E5%2583%258F1.png)</div><div class="separator" style="clear: both; text-align: center;"></div><div><span style="background-color: white; box-sizing: border-box; color: #24292e; font-family: , " blinkmacsystemfont"="" ,="" "segoe="" ui"="" ,="" "helvetica"="" ,="" "arial"="" ,="" sans-serif="" ,="" "apple="" color="" emoji"="" ,="" "segoe="" ui="" emoji";="" font-size:="" 16px;"="">  
</span></div><div>　Unityを開くと上の画像のようにGrasshopperがあるのでShowを押すとUnityの裏でRhinoとGrasshopperが起動し、ゲームオブジェクトの”Grasshopper Geometry”が作られます。</div><div>　Grasshopperでは”callunity2.gh”ファイルを開くと、UnityのMainCameraの座標をghに送りその点に対してgh上でジオメトリの操作をして作られたメッシュをUnityに返す中身になっています。Unityとやり取りする部分だけC#スクリプトのコンポーネントで作成されています。</div><div>　ghの中身の概要としてはBoxで領域を作ってその中にPopulate3Dで点をランダムにうち、その点とUnityのMainCameraの座標のDistanceをとってその関係からRemapしてその点にsphereを作る挙動になっています。</div><div>　動作はこんな感じです。</div><div>  
</div><div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-V-Tl-UzRpPQ/Xln3pHcvPqI/AAAAAAAABx4/K9HCqdQ1WnUpNgSycLpN58RLSyTj3SbRQCLcBGAsYHQ/s400/RIU_Sampl2.gif)](https://1.bp.blogspot.com/-V-Tl-UzRpPQ/Xln3pHcvPqI/AAAAAAAABx4/K9HCqdQ1WnUpNgSycLpN58RLSyTj3SbRQCLcBGAsYHQ/s1600/RIU_Sampl2.gif)</div><div>  
</div><div>　これだけだとsampleそのままで面白くないので、ghの中で点をうつ基準になっているBoxのサイズもUnity側から操作できるようにしてみます。</div><div>　まずunityにBoxのサイズをコントロールするものを作ります。gh内でBoxを作成するためにはBoxのxyz座標があればいいので、unityのゲームオブジェクトのtransformを送ればいいとして、UnityでCreateEmptyでゲームオブジェクトを作って”ControlPoint”と名前を付けます。</div><div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-2DC4FQFBF9A/Xln6lF-KkFI/AAAAAAAAByQ/FcELw49TsgA_MIca2IZqXrr0hw_Kn0n3ACLcBGAsYHQ/s400/%25E7%2594%25BB%25E5%2583%258F2.png)](https://1.bp.blogspot.com/-2DC4FQFBF9A/Xln6lF-KkFI/AAAAAAAAByQ/FcELw49TsgA_MIca2IZqXrr0hw_Kn0n3ACLcBGAsYHQ/s1600/%25E7%2594%25BB%25E5%2583%258F2.png)</div><div>  
</div><div>　この”ControlPoint”をgh側に送るためにGrasshopperInUnity.csをいじります。このファイルでは最初の方はMenuItemでの操作の部分が書いてあり一番下のUpdateの部分に追記していきます。</div><div>　Updateの初めの部分を読むと </div><div>　　var pt = Camera.main.gameObject.transform.position.ToRhino()</div><div>となっていて、MainCameraのポジションをToRhinoしています。</div><div>　ToRhinoでやっていることは、transform.positionで取得できるのはVector3なので、ToRhinoでRhino.Geometry.Point3d に変換しています。その後argsに”point”という名前で pt をセットし、</div><div>　　Rhino.Runtime.HostUtils.ExecuteNamedCallback("ToGrasshopper", args)</div><div>で送ってます。</div><div>　なので、”ControlPoint”のtransform.positionをToRhinoすれば良さそうなので同じように書いて以下のように追記します。  
</div>  

　これでUnity側での作業は終わりです。  
　次にgh側です。Unityから受け取るのはMainCameraのものと同じなので既にあるreceiveのコンポーネントをコピーします。中身を以下のように書き換えます。  

　書き換えた点は、9行目で、Unityから届く登録された名前は”ToGrasshopper1”なのでその点を修正しています。同様に20行目もTryGetGeometryするものの名前を”controlpoint”に変えています。これでC#コンポーネントが完成したのでその出力であるポイントの情報をDeconstructしてBoxの入力に入れます。  
　以上で作業は終わりです。これでうまくいっていればUnity側から操作できるようになっていると思います。よくわかりませんが書きたての時はうまく動かなかったりUnityが落ちたりするので、ダメなときはunity再起動するとうまくいく場合があるかもしれません。  
　あなたもこれでRhinoInsideUnityで遊んでみてください。  

<div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-pukbJjiUEF4/XloEg7XZk1I/AAAAAAAAByo/62SY-yQ1E1AqtS3ROQ9rb88w0WiMd3SpACLcBGAsYHQ/s640/RIU_Sampl2-2.gif)](https://1.bp.blogspot.com/-pukbJjiUEF4/XloEg7XZk1I/AAAAAAAAByo/62SY-yQ1E1AqtS3ROQ9rb88w0WiMd3SpACLcBGAsYHQ/s1600/RIU_Sampl2-2.gif)</div>  
</div></div>