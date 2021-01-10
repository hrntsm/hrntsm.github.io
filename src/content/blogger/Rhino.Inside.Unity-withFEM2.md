---
title: 'RhinoInside を使ってリアルタイムで人の動きのFEM解析をやってみる　～速度改善編～'
date: "2020-03-22"
draft: false
path: "/diary/Rhino.Inside.Unity-withFEM2"
tags : ["karamba", "Unity", "VR", "RhinoInside", "C#"]
---

　[前回の記事](https://rgkr-memo.blogspot.com/2020/03/Rhino.Inside.Unity-withFEM.html)で、RhinoInside を使った人の動きのFEM解析をやりましたが、速度が全然出ずちょっと実用に耐えられなかったので、原因を調べて改善したので、その内容についてです。  
　改善した結果以下のようになったので、かなりいい感じではないでしょうか。  
  

[![](https://1.bp.blogspot.com/-7kEpT72OnH0/XncdEshJ9YI/AAAAAAAAB1Q/O5Wf_iQu2CwaFF4BzoJJRzdRh_fiAyLpQCLcBGAsYHQ/s400/stevia_bar.gif)](https://1.bp.blogspot.com/-7kEpT72OnH0/XncdEshJ9YI/AAAAAAAAB1Q/O5Wf_iQu2CwaFF4BzoJJRzdRh_fiAyLpQCLcBGAsYHQ/s1600/stevia_bar.gif)

  
  
　改善するためにはまず原因を調べないといけないので、UnityのProfilerを使って何に一番時間がかかっているかを調べました。ここは以下のUnite の講演のアーカイブを参考にさせていただきました。  
  

  
　結果として原因はUnity内でRhinoに送るために行っているNameCallbackが重いことが分かったのでそこを改善していきます。[前回の記事](https://rgkr-memo.blogspot.com/2020/03/Rhino.Inside.Unity-withFEM.html)で書いた以下の10行目です。  
  
　問題は、ボーンの各点をポイントとして送っているので、UnityでUpdateが実行されるたびに、ここではNameCallbackが18回（送っているポイントの数分）だけ行われることでした。Profilerによればここに600ms程度かかっていました。2fps程度しか出ていないことになります。  
　なのでNameCallbackの回数を減らすことを考えます。9行目での args.Set でポイントを一つだけセットしていては回数を減らせないので、RhinoCommonAPIを調べてみると  
IEnumerable<GeometryBase>が送れるようなので、それを使います。（[ここ参照](https://developer.rhino3d.com/wip/api/RhinoCommon/html/M_Rhino_Runtime_NamedParametersEventArgs_Set_3.htm)）  
　上記を踏まえて修正した SendBonePosition は以下になります。  
  
  
　2～9行目で、List<GeometryBase>を作って初期化し、19行目で各ボーンのポジションを入れていっています。numはボーンの名前と紐づけていて、例えばnum=0ならHeadのボーンの位置を表すような形にしています。  
　そして21行目の if でnumが18のときのみ List をNameCallbackで送るようにしています。これでNameCallbackの回数は 1/18 になったので単純計算でこの箇所の実行速度は600/18 = 33.3ms になるので何とか30fps 程度まで近づけたのではないでしょうか。  
  
　他の修正点として18行目にある .ToRhino() の動作を変えました。以前はUnityのVector3型をRhinoのPoint3d型に変換しでポイントを送っていましたが、[Point3dは構造体](https://developer.rhino3d.com/wip/api/RhinoCommon/html/T_Rhino_Geometry_Point3d.htm)なのでGeometryBaseにすることはできません。なので、GeometryBaseを継承している[Point クラス](https://developer.rhino3d.com/wip/api/RhinoCommon/html/T_Rhino_Geometry_Point.htm)に変換するように以下のように書き換えています。  
  
　これで人の運動とか解析したら楽しそうですね。