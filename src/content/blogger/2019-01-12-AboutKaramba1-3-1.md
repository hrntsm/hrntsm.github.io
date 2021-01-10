---
path: "/blog/2019/01/AboutKaramba1-3-1"
title: "karamba1.3.1の新機能について"
date: "19/01/12"
originalUrl: "https://rgkr-memo.blogspot.com/2019/01/AboutKaramba1-3-1.html"
slug: "/blog/2019/01/AboutKaramba1-3-1"
tags:
    - karamba
---
　<span style="font-family: inherit;">2019/01時点でのkaramba 1.3.1 の新機能について公式のページを確認しましたので以下にまとめます。1.2から1.3での大きな変更は材料非線形への対応で、そのため多くのコンポーネントが変更になっています。1.2から1.3の変更点は[こちらで](https://rgkr-memo.blogspot.com/2018/04/karamba-1-3.html)</span>  
<span style="font-family: inherit;">　翻訳が間違っている可能性もあるので、詳細は[公式の原文](https://www.grasshopper3d.com/group/karamba3d/page/new-features-and-bug-fixes)を確認してください。</span>  
<span style="font-family: inherit;">  
</span>  
<div class="separator" style="clear: both; text-align: center;">[<span style="font-family: inherit;">![](https://www.karamba3d.com/wp-content/uploads/2016/03/karamba_logo.png)</span>](https://www.karamba3d.com/wp-content/uploads/2016/03/karamba_logo.png)</div><div class="separator" style="clear: both; text-align: center;"><span style="font-family: inherit;">  
</span></div><div><div style="background-color: white; line-height: inherit; margin-bottom: 0.5em; min-height: 1em; padding: 0px;"><div style="color: #333333;">**<span style="font-family: inherit;">Karmba3D 1.3.1 のわかっているバグ:</span>**</div><span style="font-family: inherit;">  
</span>  

*   <span style="font-family: inherit;">Optimize ReinforcementコンポーネントでのMassの出力がシェルに等分布荷重がかけられている際間違っている。この際、コンクリート断面は補強分までが計算されている。</span>
*   <span style="font-family: inherit;">Optimize ReinforcementコンポーネントのMassの出力で10倍の大きさの値が返される</span>
*   <span style="font-family: inherit;"><span style="font-family: inherit;"><span style="font-family: inherit;"><span style="color: #333333; font-family: inherit;">Analysis ThII</span><span style="color: #333333; font-family: " verdana"="" ,="" "geneva"="" ,="" "tahoma"="" ,="" sans-serif;"="">コンポーネントと</span><span style="color: #333333; font-family: inherit;">Optimize Cross Section</span></span><span style="color: #333333; font-family: " verdana"="" ,="" "geneva"="" ,="" "tahoma"="" ,="" sans-serif;"="">コン</span></span><span style="color: #333333; font-family: " verdana"="" ,="" "geneva"="" ,="" "tahoma"="" ,="" sans-serif;"="">ポーネントで</span>初期ひずみ荷重および温度荷重を使用した際間違った応力が出力される</span>
*   <span style="font-family: inherit;">Optimize Cross Sectionコンポーネントは塑性設計を行う時でも弾性設計の流れを適用する</span>
*   <span style="font-family: inherit;">Material Selectionコンポーネントはアメリカの鋼材タイプを選択すると剛性と強度が０の材料を返す</span>
*   <span style="font-family: inherit;">Optimize Cross Sectionコンポーネントは要素のアクティブかどうかのステータスを無視します。非アクティブの要素が含まれても、アクティブと同様に剛性を考慮します。</span></div><div style="background-color: white; line-height: inherit; margin-bottom: 0.5em; min-height: 1em; padding: 0px;"><div style="color: #333333; font-size: 13.0909px;"><strong style="font-size: 1em;"><span style="font-family: inherit;">  
</span>**</strong></div><div style="color: #333333;">**<span style="font-family: inherit;">Karmba3D 1.3.1 の新機能とバグ修正:</span>**</div>

*   マニュアルのアップデート
*   Rhino5 64bit版と Rhino6 で並行して開発
*   MeshLoadのバグ修正
*   MeshLoadのテキスト出力の向上
*   Rhino6のBLOCKEDITコマンドでの問題を修正
*   円形断面の中で、中実断面と中空断面の間でせん断面積および塑性モーメントの区別を作成
*   シェルの座標軸と同じになるようにローカルのメッシュ荷重の座標軸を変更
*   DisassembleMeshLoadコンポーネントで節点の番号に関わりなく節点荷重と連携して出力
*   <span style="font-family: inherit;">シェル要素に温度荷重とひずみ荷重がかけられないバグを解消</span>
*   <span style="font-family: inherit;">AnalyzeTh.Iコンポーネントは、P‑Δ 効果を考慮する荷重が設定されている場合、自動でP‑Δ 効果を考慮するため、Analyzeコンポーネントに名称変更</span>
*   <span style="font-family: inherit;">変位の入力と出力の単位をセンチメートルに変更</span>
*   <span style="font-family: inherit;">シェルの補強設計の例を追加</span>
*   <span style="font-family: inherit;">よりワークフローにフィットするようにツールバーの中でのkaramba3Dのサブカテゴリを整理</span>
*   <span style="font-family: inherit;">OrientateElementコンポーネントに梁要素とトラス要素のためにローカルのY座標を指定を追加。適用可能であれば（例えば要素座標軸と平行でない）Z座標よりもY座標を優先します。</span>
*   <span style="font-family: inherit;">モデルを分解した後、節点番号が変更された場合でも再組立てできるように、節点番号ではなく節点位置をもちます。</span>
*   <span style="font-family: inherit;">DisassembleModelコンポーネントが番号ではなく位置で定義するように変更したため、節点荷重に対応</span>
*   <span style="font-family: inherit;">MatProps、MatSelect、Cross Sectionsのコンポーネントでリストから Elems|Ids を入力するように変更</span>
*   <span style="font-family: inherit;">板要素のような平面的に分布するモーメントの単位をkNの代わりに kNm/mで表示</span>
*   <span style="font-family: inherit;">非アクティブな要素がある際のUtilizationコンポーネントの出力の改善</span>
*   <span style="font-family: inherit;">非アクティブな要素がある場合に例外を引き起こすUtilizationコンポーネントのバグを解消</span>
*   <span style="font-family: inherit;">モデルを組み立てている際に、節点に対して重複して境界条件が与えられている場合、ワーニングを表示し重複を取り除かない</span>
*   <span style="font-family: inherit;">材料の番号の出力が間違っていたため修正</span>
*   <span style="font-family: inherit;">DStVへのエクスポート機能で、ばね要素の出力に対応し、ばねの温度荷重の出力を削除</span>
*   <span style="font-family: inherit;">フリーバージョンでも梁要素荷重が作成可能</span></div></div>