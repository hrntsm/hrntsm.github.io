---
title: "Karamba3D を利用してリングガーターの効果を確認する"
date: "2017-01-15"
draft: false
path: "/articles/Karamba-ConfirmEffectOfRingGarter"
article-tags: ["Karamba3D", "Grasshopper", "構造とデジタル"]
---

新建築 2017 年１月号に掲載のキャノピーが非常にかっこよかったので、調べたところリングガーターの効果を期待しているということでした。

リングガーダーは、アーチなどと同じように構造体の幾何学的な形状抵抗を期待するものです。
形状操作は、Grasshopper の得意とするところですので、Grasshopper と Karamba3D を利用してリングガーダーの効果を確認してみます。  

リングガーターについては、[コチラ](http://www.archstructure.net/asmt/topics/2015/05/weinberg.html) や[コチラ](http://www.archstructure.net/asmt/topics/2015/02/lecture.html) を参照してください。

[![](https://2.bp.blogspot.com/-2jziJwIoq_M/WHtM2V-N3WI/AAAAAAAABUQ/LLCnuykP8qwOZydjsB52__V1IodB8PqigCLcB/s320/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)](https://2.bp.blogspot.com/-2jziJwIoq_M/WHtM2V-N3WI/AAAAAAAABUQ/LLCnuykP8qwOZydjsB52__V1IodB8PqigCLcB/s1600/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)

## モデル化

初めにモデル化です。円弧を作成し、柱の本数分だけ分割します。分割した点を屋根の高さにコピーし、この二点をつなげることで柱となるラインを作成します。

[![](https://2.bp.blogspot.com/-RkYlMt5rhA4/WHtxQyKEn4I/AAAAAAAABUg/UjN6x7l8QHIzsAgIqAClAAlvQoUfrnVTQCLcB/s400/%25E6%259F%25B1%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.PNG)](https://2.bp.blogspot.com/-RkYlMt5rhA4/WHtxQyKEn4I/AAAAAAAABUg/UjN6x7l8QHIzsAgIqAClAAlvQoUfrnVTQCLcB/s1600/%25E6%259F%25B1%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.PNG)

柱頭をつなぐ円弧状の梁は、ShiftList コンポーネントを使って隣り合うポイント間をつなぐことで作成します。屋根を支える片持ち梁は、DivideCurve コンポーネントから出力される接線方向のベクトルを 90 度回転させることで法線方向のベクトルを取得して作成します。

[![](https://4.bp.blogspot.com/-FsVZjhI2dQo/WHty-9J8ffI/AAAAAAAABUk/2XGh92i1rf0QcFpwYTG0EjdqcAoreC82ACLcB/s400/%25E6%25A2%2581%25E3%2581%25AE%25E3%2581%258B%25E3%2581%2591%25E6%2596%25B9.PNG)](https://4.bp.blogspot.com/-FsVZjhI2dQo/WHty-9J8ffI/AAAAAAAABUk/2XGh92i1rf0QcFpwYTG0EjdqcAoreC82ACLcB/s1600/%25E6%25A2%2581%25E3%2581%25AE%25E3%2581%258B%25E3%2581%2591%25E6%2596%25B9.PNG)

屋根面は隣り合う片持ち梁を構成する始点と終点の 4 点を取得することで作成しています。

[![](https://1.bp.blogspot.com/-hwNXDpClpP0/WHt0dMN0pBI/AAAAAAAABUo/ajGrDVhmQeoQggWriT45GglZnC_bUdL3gCLcB/s400/%25E3%2583%2591%25E3%2583%258D%25E3%2583%25AB%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.PNG)](https://1.bp.blogspot.com/-hwNXDpClpP0/WHt0dMN0pBI/AAAAAAAABUo/ajGrDVhmQeoQggWriT45GglZnC_bUdL3gCLcB/s1600/%25E3%2583%2591%25E3%2583%258D%25E3%2583%25AB%25E3%2581%25AE%25E4%25BD%259C%25E6%2588%2590.PNG)

リングガーター効果をわかりやすくするためには、ツーフランジ断面となる鋼板のサンドイッチパネルのようなもののほうがわかりやすいですが、外周部に梁を通してあるのでここでは良しとしています。

## Karamba3D での解析

Karamba3D でのモデル化はそれぞれのライン、メッシュを取り込み梁要素、シェル要素に変換して完成です。

もとのキャノピーは柱頭ピンですが、フリーの Karamba3D では梁端の回転剛性を指定できないため、ModifyElement コンポーネントを使ってトラス要素として両端ピンにしています。
このせいでなんだかちょっと違う気がしますが、取り合えずということで。

[![](https://3.bp.blogspot.com/-RGOLE0zUH9U/WHt5xpIRGJI/AAAAAAAABUw/qfYUcMY_FzEOzo-6kFcVEoQBnhdNOXJMgCLcB/s400/%25E6%259F%25B1%25E3%2583%2588%25E3%2583%25A9%25E3%2582%25B9%25E5%258C%2596.PNG)](https://3.bp.blogspot.com/-RGOLE0zUH9U/WHt5xpIRGJI/AAAAAAAABUw/qfYUcMY_FzEOzo-6kFcVEoQBnhdNOXJMgCLcB/s1600/%25E6%259F%25B1%25E3%2583%2588%25E3%2583%25A9%25E3%2582%25B9%25E5%258C%2596.PNG)

完成したモデルは以下のようになります。

[![](https://4.bp.blogspot.com/-z7KvZ3WD_AQ/WHt7HtGvcYI/AAAAAAAABU0/Lkyr2BUQ_ckXlmz9iQpJs8eooKaP9K_ggCLcB/s400/%25E5%25AE%258C%25E6%2588%2590%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB.PNG)](https://4.bp.blogspot.com/-z7KvZ3WD_AQ/WHt7HtGvcYI/AAAAAAAABU0/Lkyr2BUQ_ckXlmz9iQpJs8eooKaP9K_ggCLcB/s1600/%25E5%25AE%258C%25E6%2588%2590%25E3%2583%25A2%25E3%2583%2587%25E3%2583%25AB.PNG)

曲げモーメント図を出力することで、リングガーターの効果を確認してみます。

効果があれば上面引張、下面圧縮、すなわち梁要素の上面にモーメント図が描かれるはずです。
だんだんと円を大きくしながら確認していきます。初めに、R をつけない直線にすると、片持ち梁先端に応力が入るだけです。

[![](https://3.bp.blogspot.com/-v16ln_4MwqE/WHt-cKogZXI/AAAAAAAABVI/gbMMmf1sj9YgJbqdleXrWEnUA0VCoI4lwCEw/s400/%25E7%259B%25B4%25E7%25B7%259A.PNG)](https://3.bp.blogspot.com/-v16ln_4MwqE/WHt-cKogZXI/AAAAAAAABVI/gbMMmf1sj9YgJbqdleXrWEnUA0VCoI4lwCEw/s1600/%25E7%259B%25B4%25E7%25B7%259A.PNG)

半円とすると内側と外側の梁が比較的均一な上端引張の結果となっており、リングガーターのような効果が確認できます。

[![](https://2.bp.blogspot.com/-cIeOy_-uG18/WHt-bsMxIeI/AAAAAAAABU8/VDtcb3yB9X4HoysAHVuB_d7IKuYeby78QCEw/s400/%25E5%258D%258A%25E5%2586%2586.PNG)](https://2.bp.blogspot.com/-cIeOy_-uG18/WHt-bsMxIeI/AAAAAAAABU8/VDtcb3yB9X4HoysAHVuB_d7IKuYeby78QCEw/s1600/%25E5%258D%258A%25E5%2586%2586.PNG)

さらにだんだんと円を大きくしていくとスパンが長くなっていくためスパン間の長期荷重が支配的になっていき梁の中央と端部で応力が変わって行きます。

[![](https://1.bp.blogspot.com/-8wFsvNJkjok/WHt-bgvr_EI/AAAAAAAABVA/RK4LdZuevs8CYq28cjUfP15-Q9PfNAnvgCEw/s400/50.PNG)](https://1.bp.blogspot.com/-8wFsvNJkjok/WHt-bgvr_EI/AAAAAAAABVA/RK4LdZuevs8CYq28cjUfP15-Q9PfNAnvgCEw/s1600/50.PNG)

さらにスパンを伸ばすと通常の長期荷重時の梁の曲げモーメント分布のようになりました。

[![](https://3.bp.blogspot.com/-sIDZ6OwgiZk/WHt-btCG-TI/AAAAAAAABVE/D3N1ZgoGzIso-f2g8VLLKPKyxMpNkFqbQCEw/s400/75.PNG)](https://3.bp.blogspot.com/-sIDZ6OwgiZk/WHt-btCG-TI/AAAAAAAABVE/D3N1ZgoGzIso-f2g8VLLKPKyxMpNkFqbQCEw/s1600/75.PNG)


こうやって設計上でおいしい形状を探していけるツールとしても Karamba3D はやはり使えそうですね。
例えば変位が最小になる形状だとか、外周の梁と内周の梁の応力が等しくなる、つまり梁せいをそろえられる形状などの形状の複数案をすぐ出せそうですね。

