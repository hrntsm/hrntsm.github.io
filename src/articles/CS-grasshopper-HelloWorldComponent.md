---
title: "C#とgrasshopperで Hello World! を表示"
date: "2017-05-28"
draft: false
path: "/articles/CS-grasshopper-HelloWorldComponent"
article-tags: ["Grasshopper", "CSharp"]
---

grasshopper のコンポーネントのカスタム方法についての記事です。コンポーネントにボタンを設置し、ボタンを押すとウインドウズフォームから出力されるウインドウに定番の「HelloWorld」を出力するコンポーネントを作成します。

[![](https://4.bp.blogspot.com/-c9x0l3r4drM/WRfabD79LqI/AAAAAAAABXY/Pybpxc6JIasqn00EfV87bYW-JZe78PbdwCLcB/s320/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)](https://4.bp.blogspot.com/-c9x0l3r4drM/WRfabD79LqI/AAAAAAAABXY/Pybpxc6JIasqn00EfV87bYW-JZe78PbdwCLcB/s1600/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)

コンポーンネントのカスタムは、カスタム専用のクラスを作成して行います。今回は、Attributes_Custom というクラス名としています。  
構成を簡単に説明すると以下のようになります。

1.  layout でコンポーネントの外観を変更しています。rec0 でコンポーネントのサイズを大きくし、ボタンを設置するスペースを作ります。（rec0.Height += 44 で高さを増している）
2.  上記画像で Button1 と表示される範囲を rec1、Button2 と表示される範囲を rec2 として作成します。
3.  ボタンにテキストを表示させるように Render の設定を行います。
4.  ボタンとして反応し、ウインドウを出すためにイベントハンドラの設定を行います。Button1 はタイトルにもなっている「HelloWorld」を出力するよう設定しています。Button2 はボタンを増やす例として作っています。どちらも右クリックでイベントが発生するようにしています。
5.  最後にここでの設定をコンポーネントに反映するため以下の gist でいうと 14-17 行目にあるようにコンポーネントと Attributes_Custom と関連つけます。

では今回作成したものを以下に掲載します。
