---
title: 'karambaの初期設定'
date: "2015-11-21"
draft: false
path: "/articles/karamba.Initial.setting"
tags : ["karamba"]
---

　karambaの初期設定の変更法について説明します。karambaの初期設定は、karamba.ini　というファイルに記述されています。データの場所は、デフォルトでは  

　"rhinoがインストールされているフォルダ \\Plug-ins\\Karamba\\karamba.ini"

となっていると思います。編集はテキストエディタで行います。では開いて見ましょう。

  
  

　開くと始めに以下のようなことが書かれていると思います。ここから先は、内容を確認しながら何の設定なのかみていきます。

  

#---

\# this is the karamba ini-file

#---

\# written by Clemens Preisinger

\# 15.08.2011

#---

\# - comments start with '#' or ';'

\# - string-formatting of numbers follows the C# formating conventions

\#   here some examples:

\#      just two decimal places

\#          "{0:0.00}";    123.4567 -> "123.46"

\#          "{0:0.00}";    123.4    -> "123.40"

\#      max. two decimal places

\#          "{0:0.##}";    123.4567 -> "123.46"

\#          "{0:0.##}";    123.4    -> "123.4"

\#          "{0:0.##}";    123.0    -> "123"

\#      align numbers

\#          "{0,10:0.0}";  123.4567 -> "     123.5"

\#          "{0,-10:0.0}"; 123.4567 -> "123.5     "

\#      ouput number in percent

\#          "%";             0.1    -> "10%"

\# - colors are named following the C# naming convention ()

\# - for properties not found here default values will be chosen 

\# - strings need to be enclosed in '"'

\# - values and property names are case-sensitive

#---

  

内容は、以下のようになっています。

  

・このファイルでは、文頭が”＃”または”；”の行はコメント（読み込まない）行になる

・数字のフォーマットはC＃にならう

　たとえば

　小数点以下2位ちょうどで表示したい場合

          "{0:0.00}";    123.4567 -> "123.46"

          "{0:0.00}";    123.4   　 -> "123.40"

　最大で小数点以下2位としたい場合

          "{0:0.##}";    123.4567 -> "123.46"

          "{0:0.##}";    123.4　    -> "123.4"

          "{0:0.##}";    123.0  　  -> "123"# 

　結果の右揃えや左揃えにしたい場合

          "{0,10:0.0}";  123.4567 -> "     123.5"

          "{0,-10:0.0}"; 123.4567 -> "123.5     "

   パーセントで結果を表示する場合

          "%";             0.1    -> "10%"

・色はC#での名前にならう

・ここで設定しなかったものは、プログラム上でのデフォルト設定になる

・文字列は　”　で囲われる必要がある

・値や設定の名前は、大文字、小文字の区別がある

　では次の段落へ

  

#---

\# units to be used in Karamba. Do not mix Grasshopper definitions that

\# use different units.

#---

  

UnitsSytem = "SI"

\# UnitsSytem = "imperial"

  

　これは単位系の設定です。始めに、karambaはgrasshopperとは単位が関連付けられているわけではないので注意しましょうとなっています。その下の内容が単位の設定です。現在私の設定ではSI単位系となっているため、UnitsSytem　は”SI”のほうが選択されており、”imperial”はコメント行として読み込まれないようになっています。

　では次の段落へ

  

#--- 

\# default path of the license directory

\# uncomment the entry by removing the '#' and set it to a custom value in case the default does not work for some reason

#---

\# license\_path = "C:\\Program Files (x86)\\Rhinoceros 4.0\\Plug-ins\\Grasshopper\\Karamba\\License"

  

　ここは、karambaのライセンスファイルの参照先についてです。基本は直接参照されるので、コメント行になっている license\_path はコメントのままにしておきます。参照がうまくいかなかった場合に使用しましょう。

　では次の段落へ

  

#---

\# number format of the 'Legend T' output of the ModelView-component for

\#    stresses, strains and utilization

#---

legend\_stress\_number\_fmt = "{0,9:0.00e+00}"

legend\_strain\_number\_fmt = "{0,9:0.00e+00}"

legend\_utilization\_number\_fmt = "{0,9:0.0}%"

  

　ここではModelView-componetの出力であるLegend Tの出力数値の形式を指定する箇所です。最初の{0,9:は表示の文字の位置を調節します。そのあとの部分は、stress(応力)とstrain(ひずみ)は小数点以下２桁まで表示した指数表記、utilization(使用率)は小数点以下１桁まで表示するパーセント表記となっています。  
　では次の段落へ

  

#---

\# number of colors for visualizing stresses, strains in positive and negative range

#---

legend\_num\_colors = 16

  

　ここでは、応力とひずみの値を色のコンターで表示する際の、階調の色数を設定しています。初期設定は16色となっています。

　では次の段落へ

  

#---

\# if true and zero lies in the range of results then the colour range will be centred on zero

#---

center\_color\_range\_on\_zero = true

  

　ここでは先程に続き、出力時の色のコンターの中央値の設定です。ブーリアン形式で記述し、trueであれば最大値、最小値に関わらず色の中央が 0 となるように色の設定をします。初期設定は true となっています。余談ですが、なぜかここのカラーのつづりだけイギリス英語(colour)です。

　では次の段落へ

  

#---

\# coloring of legends

\# color names can either be given by name or RGB value: (red, green, blue)

\# the first color signifies values below the result range

\# the last color signifies values above the result range

#---

legend\_colors = yellow|red|white|blue|LimeGreen

resultant\_disp\_legend\_colors = yellow|white|magenta|LimeGreen

thickness\_legend\_colors = Wheat|white|Gold|Plum

beam\_stress\_legend\_colors = yellow|red|(255,255,255)|blue|LimeGreen

beam\_utilization\_legend\_colors = yellow|red|white|blue|LimeGreen

shell\_utilization\_legend\_colors = yellow|red|white|blue|LimeGreen

shell\_sig1\_legend\_colors = yellow|red|white|blue|LimeGreen

shell\_sig2\_legend\_colors = yellow|red|white|blue|LimeGreen

shell\_sigV\_legend\_colors = yellow|red|white|(0,0,255)|LimeGreen

  

　ここでは結果をコンターで表示する際の色を設定します。色は、C#においてデフォルトで設定されている色の名前、またはRGB(赤,緑,青)で設定することができます。最初の色が一番下の色、最後の色が一番上の色となり、コンターには含まれない色になります。コンター上で表示されるのは最初と最後の色を抜いた範囲で設定されます。  
　設定する色は表示順に、凡例のコンター、変位のコンター、板厚のコンター、梁要素の応力のコンター、梁要素の使用率のコンター、シェル要素の使用率のコンター、シェル要素の主応力1のコンター、シェル要素の主応力2のコンター、シェル要素のフォンミーゼス応力のコンター、となっています。  
　例えば変位のコンターの箇所を  
　　　resultant\_disp\_legend\_colors = white|blue|lightBlue|LimeGreen|yellow|red|white  
と変えると、下図のようにMi○asのようなコンターとすることができます。私はこちらの色合いのほうがなじみがあるので、結果が見てわかりやすく安心感があります。また、上で述べたように、最初と最後に設定した色（ここではWhite）がコンターに含まれていないこともわかります。  
  

[![](http://1.bp.blogspot.com/-ovC2iDsrtig/VlBLVMZsP-I/AAAAAAAABAQ/jbD_SF9wBRk/s640/%25E3%2582%25AB%25E3%2583%25A9%25E3%2583%25BC%25E3%2582%25B3%25E3%2583%25B3%25E3%2582%25BF%25E3%2583%25BC.JPG)](http://1.bp.blogspot.com/-ovC2iDsrtig/VlBLVMZsP-I/AAAAAAAABAQ/jbD_SF9wBRk/s1600/%25E3%2582%25AB%25E3%2583%25A9%25E3%2583%25BC%25E3%2582%25B3%25E3%2583%25B3%25E3%2582%25BF%25E3%2583%25BC.JPG)

　  
　では次の段落へ

  

#---

\# default cross section color of beams and shells

#---

beam\_cross\_section\_color = Blue

shell\_cross\_section\_color = LightBlue

  

　ここではデフォルトの断面の色を設定します。初期設定では、梁要素は青色、シェル要素は水色となっています。

　では次の段落へ

  

#---

\# colors for coloring the cross section forces curves

#---

crosec\_force\_color\_Nx = LightSalmon

crosec\_force\_color\_Vy = LightGreen

crosec\_force\_color\_Vz = LightSkyBlue

crosec\_force\_color\_Mx = Red

crosec\_force\_color\_My = SeaGreen

crosec\_force\_color\_Mz = CadetBlue

  

　ここでは梁要素の断面力を図示する際の色の設定をします。設定の順番は、軸力Nx、せん断Vy、せん断Vz、ねじりMx、曲げMy、曲げMz　です。

　では次の段落へ

  

#---

\# color and number format for output of cross section forces

#---

crosec\_number\_fmt = "{0:f}"

crosec\_number\_color = "Black"

  

　ここでは断面力の出力の値の数字のフォーマットと、色を設定しています。初期設定は、値は小数点以下２桁までで黒色の文字で出力です。

　では次の段落へ

  

#---

\# text color, height and offset of element identifiers

#---

elemID\_text\_height = 20

elemID\_text\_offset = 20

elemID\_text\_color = "Black"

  

　ここでは要素のIDを表示するときの文字の高さとオフセットする距離、色を設定します。初期設定は高さ20、オフセット20、黒色となっています。

　では次の段落へ

  

#---

\# text height and offset of cross section names

#---

crosec\_text\_height = 20

crosec\_text\_offset =-20

crosec\_text\_color = "Black"

  

　ここでは断面の名前を表示するときの文字の高さとオフセットする距離、色を設定します。初期設定は高さ20、オフセット-20、黒色となっています。  

　では次の段落へ

  

#---

\# text height and offset of cross material names

#---

material\_text\_height = 20

material\_text\_offset =-20

material\_text\_color = "Black"

  

　ここでは材料名を表示するときの文字の高さとオフセットする距離、色を設定します。初期設定は高さ20、オフセット-20、黒色となっています。  

　では次の段落へ

  

#---

\# text height and offset of node tags

#---

node\_text\_height = 20

node\_text\_offset =-20

node\_text\_color = "Black"

  

　ここでは節点のタグを表示するときの文字の高さとオフセットする距離、色を設定します。初期設定は高さ20、オフセット-20、黒色となっています。

では次の段落へ

  

#---

\# text height and offset of NII values at elements

#---

NII\_text\_height = 20

NII\_text\_offset =-20

NII\_text\_color = "Black"

NII\_number\_fmt = "{0:f}"

  

  

  

　ここではAnalyzeTHⅡで解析したときの結果を表示するときの文字の高さとオフセットする距離、色、数字のフォーマットを設定します。初期設定は高さ20、オフセット-20、黒色、小数点以下2位まで表示となっています。

　では次の段落へ

  

#---

\# maximum number of beam sections for mesh display

#---

maximum\_ncrosec=500

  

　ここではメッシュ表示するための梁要素断面の最大数を設定しています。初期設定では500となっています。

　では次の段落へ

  

#---

\# factor for number of faces for rendering circular cross sections

#---

circular\_cross\_sections\_n\_faces\_factor=6

  

　ここでは円形の断面を表示するために、円を多角形に置換する際の多角形の角数を設定しています。初期設定では、6となっています。

　では次の段落へ

  

#---

\# maximum number of line segments per element when drawing stress- or force-flow-lines on meshes

#---

maximum\_mesh\_lines\_per\_element=500

  

　ここではメッシュで応力や荷重や力の流れを線表示する際の線の最大分割数

を設定しています。初期設定では、500となっています。  
　では次の段落へ

  

#---

\# offset between symbols and annotations

#---

annotation\_offset=20

  

　ここでは符号と注記間の間隔を設定します。初期設定では20となっています。

  

　初期設定の項目は以上となります。結構細かく設定していくことができるようですね。これらを変更して、自分の使いやすいkarambaとしていきましょう。