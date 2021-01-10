　[前回の記事](http://rgkr-memo.blogspot.jp/2016/11/SimpleBeam-Component-in-CS.html)では、単純梁の計算をするコンポーネントを作成しました。その際はすべてのパラメーターが手入力だったので、今回はH形鋼を対象にして、解析に必要なパラメーターを計算し、出力するコンポーネントの作成を行います。　また設定した形状のH形鋼をrhino上への出力も併せて行います。
![Image](/media/blog/CS-make-I-shape-Steel/-25E3-2582-25AD-25E3-2583-25A3-25E3-2583-2597-25E3-2583-2581-25E3-2583-25A3.PNG)

　　初めにrhinoへの出力の仕方から説明します。やることは実際のrhinoでサーフェスを作成することに非常に近いことをします。作成はフランジとウェブごとにサーフェスを作成するという方法で行っています。上フランジを例に説明します。
　まずPoint3dで、（x,y,z）の座標を持つ点を3点（UFp1、UFp2、UFp3）作成します。その後、その3点を通る平面としてPlane（UFplane）を作成します。この平面が、サーフェスを作成する面となります。サーフェスは、入力される部材幅 B と部材長さ L をもとに平面のサーフェスとして作成します。ここでは、Intervalを使用して、原点から対象にBの幅を持つものとしてします。

%[https://gist.github.com/hrntsm/0e6172aeefe5b414592cd11003f81f67.js] 
　次に、解析用諸元の計算と出力の設定です。断面二次モーメントと断面係数は、書いてある通りです。基本的なところですが、C#の割り算は、double型等にしても小数点以下を明示しないと整数での割り算になって、小数点以下はなくなってしまうので注意しましょう。
　出力に際して、パラメータを一つの引数でコンポーネント間でやり取りしたいので、ここではList型のParamsを定義し、その中に、部材長さ、断面二次モーメント、断面係数を格納するようにしています。サーフェスはとりあえず出力するだけなので、リストではなくただの配列としてまとめています。
　最後の出力設定では、以前はSetDataとしていましたが、今回はListを出力するので、SetDataListとして出力しています。

%[https://gist.github.com/hrntsm/f7cffda3907a21e2fd7d8204a329894f.js]　これでH型鋼の諸元を出力するコンポーネントの作成は終わりです。
　次に単純梁の計算を行うコンポーネントの修正を行います。前回ここにパラメータを入力していた部分を一括して入力を受けるParamという入力に変更します。
　List型のデータを受け取るので、最初のRegisterInputParamsの個所で、Paramを登録する箇所では、
pManager.AddNumberParameter("Analysis Parametar", "Param", "Input Analysis Parameter", <u>GH_ParamAccess<b>.list</b></u>);
として、itemではなくlistとしています。同様に以前GetDataとしていた箇所も、GetDataListとしてList型のデータを受け取る形としています。

%[https://gist.github.com/hrntsm/4fa7ebdf6cae2ebb6296f9386969666a.js] 　完成したコード全体は以下のようになります。

%[https://gist.github.com/hrntsm/fd783d886aba752f0b902c1cbbf84be8.js]