---
title: "UDP を使って Unity に Grasshopper の Mesh を送る方法"
date: "2019-04-21"
draft: false
path: "/articles/MethodToSendSurfaceToUnityUsingUDP"
article-tags: ["Unity", "Grasshopper", "CSharp", "構造とデジタル"]
---

UDP で通信ができる gHowl というコンポーネントを使用して、ゲームエンジンの Unity と grasshopper を接続する方法について説明します。
今回が初の Unity 関連の記事です。

基本的な Unity の使い方はほかのサイトの方が詳しいので、そちらをググってください。今回やったことを解説していきます。

## 動作している様子

実際に接続してメッシュを送っている様子が以下です。

[![](https://3.bp.blogspot.com/-JOQY2UbklfQ/XLv1YDUcymI/AAAAAAAABn8/KnFXduxbYJIIJB2PiRUt7_a1uUJY9VxwQCLcBGAs/s640/test.gif)](https://3.bp.blogspot.com/-JOQY2UbklfQ/XLv1YDUcymI/AAAAAAAABn8/KnFXduxbYJIIJB2PiRUt7_a1uUJY9VxwQCLcBGAs/s1600/test.gif)

## 参考動画

今回の内容は基本的には以下の動画を参考に作成しています。
こちらの動画は細かい解説をしていないため、実際はどうかわかりませんが様子を見る限りたぶん同じことをやっています。

[![](https://img.youtube.com/vi/krWW12V9y8M/0.jpg)](https://www.youtube.com/watch?v=krWW12V9y8M)

基本的な流れは以下です。

1. Rhino または grasshopper でサーフェスをモデル化
1. 作成したサーフェスを TriangularPanelsA コンポーネントで全て三角形に変換
1. DeconstructBrep で作成したサーフェスを分解し、頂点情報を UDP で送信用に編集
1. ghowl で Unity へ UDP で送信
1. Unity 側で UDP 受信する C#スクリプトを作成して gh 側からのデータを受け取る
1. 受けった頂点情報から Unity 内で mesh を作成する

## Rhino または grasshopper での操作

送りたいデータはなんでもよいですが、最終的には [Lunchbox](https://www.food4rhino.com/app/lunchbox) の TriangularPanelsA コンポーネントですべて三角形にするのでそれを念頭にモデル化してください。

作成したサーフェスを DeconstructBrep で頂点情報を取得し Flatten して出力していますが、最終的には 1 行の頂点座標が羅列された文字列にしたいのでこうしています。
出力はリスト形式になっているので、Join コンポーネントで一体化して 1 つの文字列にしています。

1 つの文字列になった頂点情報を gHowl を使用して UDP で送信しています。
ポートは 3333 していますが、Unity の受信側で設定しているポートと一致していれば何でもよいです。

gHowl の使い方は AMD lab さんが書いているのでそちらをどうぞ（[gHowl の使い方 ①](https://amdlaboratory.com/amdblog/grasshopperghowl%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9%E2%91%A0/)）

実際にやってみた感じはこんな感じです。

[![](https://2.bp.blogspot.com/-BXztLgMM4IY/XLv-X12LIjI/AAAAAAAABoc/b8aorXbARWM2px5dLCJiOQylAnaihNCCQCLcBGAs/s640/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)](https://2.bp.blogspot.com/-BXztLgMM4IY/XLv-X12LIjI/AAAAAAAABoc/b8aorXbARWM2px5dLCJiOQylAnaihNCCQCLcBGAs/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

## Unity 側での操作

Unity 側では、以下の 2 つのスクリプトを作成しています。

1. UDP で受信して受信した 1 つの文字データを必要な状態に加工する UDPMesh.cs
1. 加工したデータから Unity 上にメッシュを作成する GHMesh.cs

### UDPMesh.cs の中身について

基本的にはすべて UDP の受信の設定です。[Qiita の Unity で UDP を受信してみる](https://qiita.com/nenjiru/items/8fa8dfb27f55c0205651)  を参考に作っています。ここの LOCAL_PORT の値を gh 側のポートの番号と合わせてください。

最後の部分の messege = text;  以下の部分で gh から受信したデータをこの後のために加工しています。
やっていることは、データは例えば ｛0,0,0｝｛1,0,0｝... といった形で送られてくるので 、以下のようにカッコを削除して単なる数字の羅列にしてます。

｛0,0,0｝｛1,0,0｝　 → 　 0,0,0,1,0,0

この作業は gh 側でやっても問題ありません。

以下コードの中身。

```cs
using UnityEngine;
using System.Collections;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

public class UDPMesh : MonoBehaviour
{
    int LOCAL_PORT = 3333;
    private static UdpClient _udp;
    private Thread _thread;
    public static string messege = string.Enpty;
    public static string textRep = string.Enpty;

    void Start () 
    {
        _udp = new UdpClient(LOCAL_PORT);
        _thread = new Thread(new ThreadStart(ThreadMethod));
        _thread.Start(); 
    }

    void Update () { }

    void OnApplicationQuit() {
        _thread.Abort();
    }

    private static void ThreadMethod() {
        while(true) {
            IPEndPoint remoteEP = null;
            byte[] data = _udp.Receive(ref remoteEP);
            string text = Encoding.ASCII.GetString(data);
            messege = text;
            textRep = text.Remove(0, 1);
            textRep = textRep.Replace("}", "");
            textRep = textRep.Replace("{", ",");
            textRep = textRep.Replace(" ", "");
        }
    } 
}
```

### GHMesh.cs の中身について

最初は引数とかいろいろ。

void Start のところで Mesh を扱う準備をします。void Update のところから実際のメッシュの作成しています。

まず加工した UDP で受信した文字列データをカンマごと区切ってに float 型にして FloatArray に入れています。

Vector3 型を作成して FloatArray のデータを 3 つずつ入れていきます。｛0,0,0｝を 0,0,0 に加工しているだけなので、3 つずつ入れていけば自然と(x 座標, y 座標, z 座標)になるはずです。

この後頂点の番号を振っていきます。
頂点が同一座標でも、番号が異なる場合と同じ場合で unity 側での表示が異なります。
ですが、頂点の番号情報は gh から持ってきていないので、ここでは気にせず頂点の数だけ for 文で番号を作成しているだけです。

最後に CreateMesh へ頂点座標と番号を渡して三角形のメッシュを作成して完成です。

以下コードの中身。
```cs
using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

public class GHMesh : MonoBehaviour
{
	// 頂点配列
	private Vector3[] _vertices;
	// 三角形の順番配列
	private int[] _triangles;
	// メッシュ
	private Mesh _mesh;
	// メッシュ表示コンポーネント
	private MeshRenderer _meshRenderer;
	// メッシュに設定するマテリアル
	public Material material;

    void Start ()
    {
		gameObject.AddComponent<MeshFilter> ();
		_meshRenderer = gameObject.AddComponent<MeshRenderer> ();
		_mesh = GetComponent<MeshFilter> ().mesh;
		_meshRenderer.material = material;
    }

    void Update ()
    {
		// GHの頂点座標の取得
		string[] arr =  UDPMesh.textRep.Split(',');
		var FloatArray = new float[arr.Length+1];
		for (int i = 0; i < arr.Length; i++)
        {
			FloatArray[i] = float.Parse(arr[i]);
		};
		// Unityでの頂点座標の生成
		var _vertices = new Vector3[arr.Length/3];
		for (int j = 0; j < arr.Length/3.0; j++)
        {
			_vertices[j] = new Vector3 (FloatArray[3*j], FloatArray[3*j+2],  FloatArray[3*j+1] );
		};
		// Unityでの三角形メッシュの生成
		var _triangles = new int[arr.Length/3];
		for (int i = 0; i < arr.Length/3; i++)
        {
			_triangles[i] = i;
		};
		CreateMesh(_mesh, _vertices, _triangles);
    }
	
	private static void CreateMesh(Mesh mesh, Vector3[] vertices, int[] triangles) 
    {
		// 最初にメッシュをクリアする
		mesh.Clear();
		// 頂点の設定
		mesh.vertices = vertices;
		// 三角形メッシュの設定
		mesh.triangles = triangles;
		// Boundsの再計算
		mesh.RecalculateBounds ();
		// NormalMapの再計算
		mesh.RecalculateNormals ();
	}
}
```

作った C#スクリプトを Unity 側で CreateEmpty とかで GameObject を作成して AddComponent して play したら gh 側からデータが送られてきます。

かなり力技の方法でやっていてあまりスマートではないですが、とりあえずできたのでまとめました。
gh 側で作っているものはサーフェスなのに、Unity 側はメッシュなので、そのせいでうまくいっていない個所があったりします。

最新の技を使うなら、RhinoInside を使う方が、これより簡単だと思います。

内容を見てわかりますが、このコードは三角形のみを対象にしているので四角形のサーフェスやメッシュが含まれるとうまくデータを Unity 側でメッシュを作成できませんので、気を付けてください。  

作ったものは [GitHub](https://github.com/hrntsm/UnityGH) にもあげているのでそちらもどうぞ。
