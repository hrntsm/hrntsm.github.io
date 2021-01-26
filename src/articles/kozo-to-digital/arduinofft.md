---
title: "arduinoで取得した波形をFFTする"
date: "2015-10-12"
draft: false
path: "/articles/arduinofft"
article-tags: ["Grasshopper", "Firefly", "Python", "Arduino", "構造とデジタル"]
---

以前の[Arduino と Firefly で加速度を取得](../aruduino-firefly)、に続く記事になります。  
　前回の記事で、arduino から grasshopper へ加速度波形を取得することができたので、今回はその加速度波形をフーリエ変換して周波数特性を明らかにすることで、対象物の固有周期を求めてみます。  
　まず、どうやってフーリエ変換を行うかですが、ここでは[GhPython](http://www.food4rhino.com/project/ghpython?ufh)を使用します。これは、grasshopper のコンポーネントをプログラミング言語である python で作成できるようになるプラグインです。grasshopper は標準で C#と VB に対応していますが、個人的に python が好きということと、VB と違い python で作成したものは windows だけだなく Mac でも使用できる利点があります。  
　では FFT ができるコンポーネントの作成を行います。コードの中身は以下です。基本は[rosettacode.org](http://rosettacode.org/wiki/Fast_Fourier_transform#Python:_Recursive)　に記載されているコードに対して、入力波形の長さにかかわらずデータ数が 2 の累乗になるゼロを挿入するコードを追加しています。

grasshopper でこのような感じで表示されます。

[![](https://2.bp.blogspot.com/-5Ya5mopjFS0/VhtTSCjBDOI/AAAAAAAAA8A/5d7UHzOh9K4/s640/fft%25E3%2582%25B3%25E3%2583%25B3%25E3%2583%259D%25E3%2583%25BC%25E3%2583%258D%25E3%2583%25B3%25E3%2583%2588%25E4%25BD%259C%25E6%2588%2590.JPG)](http://2.bp.blogspot.com/-5Ya5mopjFS0/VhtTSCjBDOI/AAAAAAAAA8A/5d7UHzOh9K4/s1600/fft%25E3%2582%25B3%25E3%2583%25B3%25E3%2583%259D%25E3%2583%25BC%25E3%2583%258D%25E3%2583%25B3%25E3%2583%2588%25E4%25BD%259C%25E6%2588%2590.JPG)

コンポーネントの表示は、コンポーネントを拡大すると編集できるようになります。

[![](https://2.bp.blogspot.com/-wZ3Pj_ISAoo/VhtVKaHdoLI/AAAAAAAAA8M/srlLUssTB-E/s320/%25E3%2582%25B3%25E3%2583%25B3%25E3%2583%259D%25E3%2583%25BC%25E3%2583%258D%25E3%2583%25B3%25E3%2583%2588%25E3%2581%25AE%25E7%25B7%25A8%25E9%259B%2586.JPG)](http://2.bp.blogspot.com/-wZ3Pj_ISAoo/VhtVKaHdoLI/AAAAAAAAA8M/srlLUssTB-E/s1600/%25E3%2582%25B3%25E3%2583%25B3%25E3%2583%259D%25E3%2583%25BC%25E3%2583%258D%25E3%2583%25B3%25E3%2583%2588%25E3%2581%25AE%25E7%25B7%25A8%25E9%259B%2586.JPG)

＋、－のボタンを押すことで入出力の増減ができます。名称は、変更したい部分を右クリックすることで変更することができます。

ではこのコンポーネントを使用して、時刻歴波形を変換します。

arduino からの加速度の取得は以前の記事と同様です。arduino からは設定した時刻刻みでデータが 1 つでてくるのみですので、grasshopper 上でデータを保存して一定の長さを持った時刻歴の波形データを作成する必要があります。ここでは Data Recoder コンポーネントを使用します。これは指定したデータ数を保存するコンポーネントです。設定したデータ数を超えた場合は古いデータからデータが消されていきます。

[![](https://2.bp.blogspot.com/-BkyuALlyYKU/VhtYCcavLOI/AAAAAAAAA8c/tKvxVCc0jko/s640/FFT%25E3%2581%25AE%25E5%2585%25A5%25E5%258A%259B%25E6%25B3%2595.JPG)](http://2.bp.blogspot.com/-BkyuALlyYKU/VhtYCcavLOI/AAAAAAAAA8c/tKvxVCc0jko/s1600/FFT%25E3%2581%25AE%25E5%2585%25A5%25E5%258A%259B%25E6%25B3%2595.JPG)

そして取得したデータを先程作成した FFT コンポーネントの wave のところに入力します。dt の部分には時間刻みを入力します。arduino からのデータは 50ms すなわち 0.05s でデータを取得しているので、0.05 を入力します。  
　では出力を確認します。

[![](https://4.bp.blogspot.com/-0w88OQurros/VhtbHNjD3DI/AAAAAAAAA8s/aysTdC893kM/s640/FFT%25E3%2581%25AE%25E5%2587%25BA%25E5%258A%259B.JPG)](http://4.bp.blogspot.com/-0w88OQurros/VhtbHNjD3DI/AAAAAAAAA8s/aysTdC893kM/s1600/FFT%25E3%2581%25AE%25E5%2587%25BA%25E5%258A%259B.JPG)

value は各周波数ごとの値を、Hz は値に対応する周波数を出力します。でてきた値を Quick Graph コンポーネントに入力することで図化することができます。この波形は、私のパソコンを置いてある机の上で取得した波形を FFT したものですが、1 つ目のデータが非常に大きく出ていること、特に目立ったピークがないことから、まだどこが固有周期なのかよくわからない結果となってしまいました。  
　今後の課題は、バンドパスをかけることや、時間刻みやデータ長さ、測定法などをもう少し勉強することですね。ですが、あんまり細かい条件を設定しすぎると「grasshopper で簡易にそこそこの結果を得る」ことができなくなってしまいます。ちゃんとした論文のデータとするわけではないので、そこらへんを考えながら進めていきたいです。
