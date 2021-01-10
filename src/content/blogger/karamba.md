---
title: 'karambaの単位'
date: 2015-06-11T23:26:00.001+09:00
draft: false
aliases: [ "/2015/06/karamba.html" ]
tags : [karamba, rhinoceros]
---

Karambaの単位系は、メートル系とフィート系のどちらかを選択できますが、ここでは、SI基本単位系としてモデリングしていきます。ここで、rhinoceros上や、Grasshoppher上で単位系を変更しても、Karambaの単位は変更されないので注意が必要です。  
  
厄介なことに、karambaでは、コンポーネントごとに単位が異なってくるので、有意な解析を行うために注意が必要です。単位はコンポーネントの入力端子にマウスを合わせることでポップアップされるので、入力の際に確認することができます。  
  
たとば、節点荷重でモーメントを指定するときの単位は「kNm」、部材の断面を指定するときの単位は「cm」になっています。  
  

[![](http://3.bp.blogspot.com/-UDjXdbuq6Qo/VXmYTuL9ABI/AAAAAAAAAA4/5ExEKTsOxM0/s320/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A32.JPG)](http://3.bp.blogspot.com/-UDjXdbuq6Qo/VXmYTuL9ABI/AAAAAAAAAA4/5ExEKTsOxM0/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A32.JPG)

  

[![](http://1.bp.blogspot.com/-X9bmmET_ySM/VXmYTi9SB_I/AAAAAAAAAA0/AaGvisUSz7I/s320/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.JPG)](http://1.bp.blogspot.com/-X9bmmET_ySM/VXmYTi9SB_I/AAAAAAAAAA0/AaGvisUSz7I/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.JPG)