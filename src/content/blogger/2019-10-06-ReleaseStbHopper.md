---
path: "/blog/2019/10/ReleaseStbHopper"
title: "ST-Bridgeからデータを取得してモデルを表示するgrasshopperコンポーネントの公開"
date: "19/10/06"
originalUrl: "https://rgkr-memo.blogspot.com/2019/10/ReleaseStbHopper.html"
slug: "/blog/2019/10/ReleaseStbHopper"
tags:
    - grasshopper
    - C#
    - rhinoceros
---
　Grasshopperで建築構造設計の一貫計算ソフトとBIMの連携等に使用されているST-Bridgeデータを読み込むコンポーネント ”HoaryFox” を作成したので公開します。  
　動作の様子は以下のような感じです。ここで使っている建物のST-Bridgeデータは、規格を作成している一般社団法人 building SMART Japan さんで公開されている「[ST-Bridge Viewer](https://www.building-smart.or.jp/old/download/files/20171030_st.zip)」のなかのサンプルデータを使用させていただいています。  

<div class="separator" style="clear: both; text-align: center;">[![](https://1.bp.blogspot.com/-DMiRpf-rZ-M/XZmA2QVtvDI/AAAAAAAABtM/2r3do4q-J_Izt1T2nYXGR6RL88Giw_DQACLcBGAsYHQ/s640/stb.gif)](https://1.bp.blogspot.com/-DMiRpf-rZ-M/XZmA2QVtvDI/AAAAAAAABtM/2r3do4q-J_Izt1T2nYXGR6RL88Giw_DQACLcBGAsYHQ/s1600/stb.gif)</div><div class="separator" style="clear: both; text-align: center;">  
</div>  
　そもそもST-Bridgeとは何か？というのは、bSJ さんのサイトより確認ください。  
<div>[https://www.building-smart.or.jp/meeting/buildall/structural-design/](https://www.building-smart.or.jp/meeting/buildall/structural-design/)</div><div><div>**  
**</div><div>**  
**</div><div>**コンポーネントの構成と使い方**</div><div>　ドキュメントページを作成したのでそちらをご確認ください。</div><div>  [ HoaryFox ドキュメントページ](http://hrntsm.github.io/hoaryfox/)</div><div><div><div>  
</div><div>**ダウンロードについて**</div><div>　[food4rhino](https://www.food4rhino.com/app/hoaryfox) にてダウンロードできます</div><div>　中身が気になる方は同じく[Githubのリポジトリ](https://github.com/hrntsm/HoaryFox)を参照ください。</div><div>  
</div><div>**Karambaとの連携**</div><div>**　**実験的な機能として ST-Bridge ファイルの構造解析コンポーネント Karamba への入出力をサポートしています。興味のある方は上記ドキュメントページを参照してください。</div><div>  
</div><div>**VR表示**</div><div>　本コンポーネントとRhinoVRと連携することで構造架構を簡単にVRで確認することができます。</div><div>詳細はこちらの動画で<div class="separator" style="clear: both; text-align: center;"><iframe allowfullscreen="" class="BLOG_video_class" height="334" src="https://www.youtube.com/embed/v0ofu_adMIg" width="479" youtube-src-id="v0ofu_adMIg"></iframe></div>  
</div></div></div></div>