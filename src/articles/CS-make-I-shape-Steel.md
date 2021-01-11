---
title: "grasshopperとC# を使ってH形鋼を出力する"
date: "2016-12-24"
draft: false
path: "/articles/CS-make-I-shape-Steel"
article-tags: ["Grasshopper", "CSharp"]
---

以前の記事では、単純梁の計算をするコンポーネントを作成しました。その際はすべてのパラメーターが手入力だったので、今回は H 形鋼を対象にして、解析に必要なパラメーターを計算し、出力するコンポーネントの作成を行います。

また設定した形状の H 形鋼を rhino 上への出力も併せて行います。

[![](https://4.bp.blogspot.com/-zIDrpwCI2kA/WF4Ad2n6M6I/AAAAAAAABTQ/fnAo7AUH4UY8KRx2JSvsOfYDLjZ06c_5wCLcB/s640/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)](https://4.bp.blogspot.com/-zIDrpwCI2kA/WF4Ad2n6M6I/AAAAAAAABTQ/fnAo7AUH4UY8KRx2JSvsOfYDLjZ06c_5wCLcB/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

初めに rhino への出力の仕方から説明します。やることは実際の rhino でサーフェスを作成することに非常に近いことをします。作成はフランジとウェブごとにサーフェスを作成するという方法で行っています。上フランジを例に説明します。  
　まず Point3d で、（x,y,z）の座標を持つ点を 3 点（UFp1、UFp2、UFp3）作成します。その後、その 3 点を通る平面として Plane（UFplane）を作成します。この平面が、サーフェスを作成する面となります。サーフェスは、入力される部材幅 B と部材長さ L をもとに平面のサーフェスとして作成します。ここでは、Interval を使用して、原点から対象に B の幅を持つものとしてします。

次に、解析用諸元の計算と出力の設定です。断面二次モーメントと断面係数は、書いてある通りです。基本的なところですが、C#の割り算は、double 型等にしても小数点以下を明示しないと整数での割り算になって、小数点以下はなくなってしまうので注意しましょう。  
　出力に際して、パラメータを一つの引数でコンポーネント間でやり取りしたいので、ここでは List 型の Params を定義し、その中に、部材長さ、断面二次モーメント、断面係数を格納するようにしています。サーフェスはとりあえず出力するだけなので、リストではなくただの配列としてまとめています。  
　最後の出力設定では、以前は SetData としていましたが、今回は List を出力するので、SetDataList として出力しています。

これで H 型鋼の諸元を出力するコンポーネントの作成は終わりです。  
　次に単純梁の計算を行うコンポーネントの修正を行います。前回ここにパラメータを入力していた部分を一括して入力を受ける Param という入力に変更します。  
　 List 型のデータを受け取るので、最初の RegisterInputParams の個所で、Param を登録する箇所では、  
pManager.AddNumberParameter("Analysis Parametar", "Param", "Input Analysis Parameter", GH_ParamAccess**.list**);  
として、item ではなく list としています。同様に以前 GetData としていた箇所も、GetDataList として List 型のデータを受け取る形としています。

完成したコード全体は以下のようになります。
