---
title: "karamba ver1.2 のアップデート内容"
date: "2016-11-03"
draft: false
path: "/articles/karamba-12"
article-tags: ["Karamba", "Grasshopper", "構造とデジタル"]
---

久しぶりの更新となるので、この間の期間に karamba がどう変わった確認します。  
 ver が 1.1 から 1.2.2 となったので、[公式サイト](http://www.grasshopper3d.com/group/karamba/page/new-features-and-bug-fixes)記載の情報を確認します。

[![](https://api.ning.com/files/2mxGt-70BGGTngCq9wUcVYtSXOQ-aIuAtFiYLQ9ZtAUuJ-9DUufgWDWIn1tnSxjuiF5UksjNqahZiLufV6b*zQPZCIRJRNqN/karambaLogo_480x480.jpg?crop=1:1&width=171)](http://api.ning.com/files/2mxGt-70BGGTngCq9wUcVYtSXOQ-aIuAtFiYLQ9ZtAUuJ-9DUufgWDWIn1tnSxjuiF5UksjNqahZiLufV6b*zQPZCIRJRNqN/karambaLogo_480x480.jpg?crop=1%3A1&width=171)

新機能についてです。この期間に ver1.1.0 → ver1.2.1 → ver1.2.2 となったので、それぞれについて

ver1.1.0 → ver1.2.1  
- 新しいソルバーによって解析が約 2 倍早くなり、より少ないメモリできるようになった。  
- BESOShell  コンポーネントでシェル構造での双方向の ESO が可能  
- シェルの等高線で等高線の値を表示  
- 断面力を正と負の値で２色で表示  
- AnalyzeThI と AnalyzeThII コンポーネントで剛体変形する場合、マイナスの固有値を持つ場合エラーメッセージを出力  
- Deformation Energy コンポーネントで、曲げおよび軸変形エネルギーを計算している要素はそれぞれの ID を通して選択可能  
- Utilization コンポーネントで梁要素、トラス要素で応力度を出力  
- RStab8 への出力機能を追加  
- karamba のモデルを grasshopper の Move コンポーネント Scale コンポーネントで操作可能  
- 荷重、材料、断面で未使用のものがある場合、Assemble コンポーネントでエラーメッセージを出力  
- karamba.ini ファイルによるカスタマイズ項目が増加
- er1.2.1 → ver1.2.2  
- 断面力が変形後の形に合わせて出力  
- BESOShell コンポーネントのユーザーインターフェイスが改善  
- 内部ひずみによるプレストレス荷重の機能をより直観的に変更

解析が早く軽くなることは、最適化やるにあたって非常に助かる改善ですね。
