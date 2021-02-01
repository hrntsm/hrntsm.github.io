---
title: "Karamba3Dのシェル要素について"
date: "2015-06-23"
draft: false
path: "/articles/karamba_23"
article-tags: ["Karamba3D", "構造とデジタル"]
---

Karamba3D のシェル要素のモデル化についてです。  
定式化は TRIC 要素に基づき行われているようで、三角形要素しか扱えないようです。

---

Karamba のシェル要素の特徴は
1. TRIC 要素に対して、キルヒホフの仮定に基づいている。
2. 1 つの節点につき、6 つの自由度がある。
3. 定ひずみ状態がそれぞれの層に想定されている。
4. 面外方向への回転剛性が与えられている。そのため Karamba3D のシェル要素に対しては面外曲げに対しての拘束を与えなければいけない。

"The TRIC shell element: theoretical and numerical investigation." をみれば TRIC 要素についてわかるようですが、英語力が足りないのでまたの機会に TRIC 要素について考えます。

### 補足　キルヒホフの仮定に関して

この仮定は、いわゆる薄板と呼ばれるものに適用されている仮定です。  
薄板とは、平面保持の仮定が成立する板のことをさします。
平面保持とは、板の断面は変形後も平面を維持し、しかも変形前の中立軸に立てた垂線は、変形後も中立軸と直交しているという仮定です。言い換えれば、板の厚さ方向のせん断による変形を無視するという意味を持つ。

参考

http://www.grasshopper3d.com/group/karamba/forum/topics/fem-definition-for-the-shell-element-of-karamba
