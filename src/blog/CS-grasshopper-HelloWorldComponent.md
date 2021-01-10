---
title: 'C#とgrasshopperで Hello World! を表示'
date: "2017-05-28"
draft: false
path: "/diary/CS-grasshopper-HelloWorldComponent"
tags : ["grasshopper", "C#"]
---

　grasshopperのコンポーネントのカスタム方法についての記事です。コンポーネントにボタンを設置し、ボタンを押すとウインドウズフォームから出力されるウインドウに定番の「HelloWorld」を出力するコンポーネントを作成します。  
  

[![](https://4.bp.blogspot.com/-c9x0l3r4drM/WRfabD79LqI/AAAAAAAABXY/Pybpxc6JIasqn00EfV87bYW-JZe78PbdwCLcB/s320/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)](https://4.bp.blogspot.com/-c9x0l3r4drM/WRfabD79LqI/AAAAAAAABXY/Pybpxc6JIasqn00EfV87bYW-JZe78PbdwCLcB/s1600/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)

  
　コンポーンネントのカスタムは、カスタム専用のクラスを作成して行います。今回は、Attributes\_Customというクラス名としています。  
構成を簡単に説明すると以下のようになります。  

1.  layoutでコンポーネントの外観を変更しています。rec0でコンポーネントのサイズを大きくし、ボタンを設置するスペースを作ります。（rec0.Height += 44で高さを増している）
2.  上記画像でButton1と表示される範囲をrec1、Button2と表示される範囲をrec2として作成します。
3.  ボタンにテキストを表示させるようにRenderの設定を行います。
4.  ボタンとして反応し、ウインドウを出すためにイベントハンドラの設定を行います。Button1はタイトルにもなっている「HelloWorld」を出力するよう設定しています。Button2はボタンを増やす例として作っています。どちらも右クリックでイベントが発生するようにしています。
5.  最後にここでの設定をコンポーネントに反映するため以下のgistでいうと14-17行目にあるようにコンポーネントとAttributes\_Customと関連つけます。

では今回作成したものを以下に掲載します。