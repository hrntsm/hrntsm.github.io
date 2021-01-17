---
title: "RhinoInside と Unity を使ったゲーム作り"
date: "2020-07-04"
draft: false
path: "/articles/rhinoinside-game"
article-tags: ["Unity", "RhinoInside", "Qiita"]
---

## はじめに

これは 2020/07/04 に行われた[Tokyo AEC Industry Dev Group](https://www.meetup.com/ja-JP/Tokyo-AEC-Industry-Dev-Group/) でのハンズオンをもとにした資料になります。
RhinoInside と Unity を使ったボールをゴールへ運ぶゲームのつくり方になります。
参考のデータはこちらの GitHub のリポジトリにあります。

- [RhinoInsideGame](https://github.com/hrntsm/RhinoInsideGame)

そもそも RhinoInside とは？という方は[こちら](https://qiita.com/hiron_rgkr/items/ba00b7ae75068a54ff20)を参照してください。
Rhinoceros という 3DCAD ソフトの機能をほかのソフトで利用する仕組みになります。

## 完成品のイメージ

![](https://raw.githubusercontent.com/hrntsm/RhinoInsideGame/master/images/RIUGame.gif)

## 実際に作っていきましょう！！

## 0. 環境構築

- RhinoInside のリポをクローンしておく（いくつかのファイルを使う）
  - [ここ](https://github.com/mcneel/rhino.inside)からクローン or ダウンロード
- RhinoWIP
  - [ここ](https://www.rhino3d.com/download/rhino/wip)からダウンロード
- Unity2019.4.1.f1

  - [ここ](https://unity3d.com/jp/get-unity/download)からダウンロード

- Rider2020.1 (スクリプトエディタ)
  - コードを書くエディタです。VisualStudio や VSCode などでもよいです。
  - Unity 関連のデータをダウンロードをしておいてください。

    - Rider の場合
      - 特に追加でダウンロードするものはないです
    - Visual Studio の場合
      - Visual Studio Installer から以下の Unity に関するものをインストール
        ![](https://raw.githubusercontent.com/hrntsm/RhinoInsideGame/master/images/VS_Unity.png)
        
    - VS Code の場合

      - Extensions から Debugger for Unity をインストール

      ![](https://raw.githubusercontent.com/hrntsm/RhinoInsideGame/master/images/VSC_Unity.png)

    - エディタの設定は Unity の以下から設定

      ![](https://raw.githubusercontent.com/hrntsm/RhinoInsideGame/master/images/EditorSettings.png)

## 1. Unity で Rhino を使う

### 1.1 RhinoInside を起動できるようにする

- Asset 下に Scripts という名前のフォルダを作成してそこに"Convert.cs"を入れる。"LoftSurface.cs"を作る
- Asset 下に Plugins という名前のフォルダを作成してそこに"RhinoCommon.dll"を入れる。
  - Convert.cs、RhinoCommon.dll はクローンしたリポの中に入っています。
- Asset 下に Editor というフォルダを作成して、"RhinoInsideUI.cs"を作る
  - Editor という名前のフォルダ名は特殊な扱いを受けるのでフォルダ名は間違えないで入れてください。
- 以下を書いて、エディタから Rhino を起動してみる

```cs
using System;
using System.IO;

using UnityEngine;
using UnityEditor;

using Rhino.Runtime.InProcess;

[ExecuteInEditMode]
public class RhinoInsideUI : MonoBehaviour
{
    [MenuItem("Rhino/Start RhinoInside")]
    public static void StartRhinoInside()
    {
        string rhinoSystemDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Rhino WIP", "System");
        var path = Environment.GetEnvironmentVariable("PATH");
        Environment.SetEnvironmentVariable("PATH", path + ";" + rhinoSystemDir);
        GC.SuppressFinalize(new RhinoCore(new string[] { "/scheme=Unity", "/nosplash" }, WindowStyle.Minimized));
    }
}
```

### 1.2 Rhino で Surface を作る

- ロフトサーフェスを作る
  - まずは Rhino 内で作ってみる。

  ![](https://raw.githubusercontent.com/hrntsm/RhinoInsideGame/master/images/loftsurf.png)

### 1.3 RhinoInside で Surface を作る

- 次に RhinoInside を使って作ってみる。
  - コントロールポイントをまず作る

```cs
public class RhinoInsideUI : MonoBehaviour
{
    public static void StartRhinoInside()
    {
        // 省略
    }

    [MenuItem("Rhino/Create Loft Surface")]
    public static void Create()
    {
        var surface = new GameObject("Loft Surface");
        surface.AddComponent<LoftSurface>();
        CreateLoft(surface);
    }

    private static void CreateLoft(GameObject surface)
    {
        surface.AddComponent<MeshFilter>();

        // Surfaceの色の設定
        var material = new Material(Shader.Find("Standard"))
        {
            color = new Color(1.0f, 0.0f, 0.0f, 1.0f)
        };
        surface.AddComponent<MeshRenderer>().material = material;
        // 影を落とさないようにする
        surface.GetComponent<MeshRenderer>().receiveShadows = false;

        // コントロールポイントの色の設定
        var cpMaterial = new Material(Shader.Find("Standard"))
        {
            color = new Color(0.2f, 0.2f, 0.8f, 1f)
        };

        // コントロールポイントの作成
        for (int i = 0; i < 4; i++)
        {
            for (int j = 0; j < 4; j++)
            {
                int num = 4 * i + j;
                var controlSphere = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                controlSphere.name = "Sphere" + num;
                controlSphere.transform.parent = surface.transform;
                controlSphere.transform.localScale = new Vector3(0.5f, 0.5f, 0.5f);
                controlSphere.transform.position = new Vector3( i * 5f, 0, j * 5f);
                controlSphere.GetComponent<MeshRenderer>().material = cpMaterial;
            }
        }
    }
}
```

作ったコントロールポイントを使ってロフトサーフェスを作る

```cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Rhino.Geometry;

#if UNITY_EDITOR
using UnityEditor;
#endif

#if UNITY_EDITOR
[ExecuteInEditMode]
#endif
public class LoftSurface : MonoBehaviour
{
    void Update()
    {
        var controlPoints  = new List<List<Vector3>>();

        int i = 0;
        List<Vector3> controlPointsRow = null;
        foreach (UnityEngine.Transform controlSphere in transform)
        {
            if ((i++ % 4) == 0)
            {
                controlPointsRow = new List<Vector3>(4);
                controlPoints.Add(controlPointsRow);
            }
            controlPointsRow.Add(controlSphere.position);
        }
        gameObject.GetComponent<MeshFilter>().mesh = CreateLoft(controlPoints);
    }

    private UnityEngine.Mesh CreateLoft(List<List<Vector3>> controlPoints)
    {
        if (controlPoints.Count > 0 )
        {
            var profileCurves = new List<Curve>();
            foreach (var controlPointsRow in controlPoints)
            {
                profileCurves.Add(Curve.CreateInterpolatedCurve(controlPointsRow.ToRhino(), 3));
            }
            Brep brep = Brep.CreateFromLoft(profileCurves, Point3d.Unset,Point3d.Unset, LoftType.Normal, false)[0];
            Rhino.Geometry.Mesh mesh = Rhino.Geometry.Mesh.CreateFromBrep(brep, MeshingParameters.Default)[0];
            return mesh.ToHost();
        }
        return null;
    }
}
```

これで"Rhino/Start RhinoInside" をした後に、"Rhino/Create Loft Surface"を押すとロフトサーフェスが作成されるはずです。

![](https://raw.githubusercontent.com/hrntsm/RhinoInsideGame/master/images/LoftSurface.png)

ここまでの内容は、part1 のフォルダのデータになっています。

### 1.4 Unity のデバッグの仕方

- Unity にエディタをアタッチすることでデバッグできます

**これで RhinoInside は終わり。あとは Unity のみになります。**

---

## 2. ゲーム化する

### 2.1 ボールを弾ませる

1. Ball を作成する
2. play▶ してみる
   - 何も行らない…
3. RigidBody をアタッチする
   - 重力で落ちていくが貫通する…
4. LoftSurface に MeshCollider をアタッチする
   - Ball が弾まない…
5. Materials フォルダを作成してそこに PhysicMaterial を作成する。
   - Bounces を任意の値にして、Ball と LoftSurface にアタッチする。
6. ボールが弾む！！
7. コントロールポイントを動かしてみる
   - コライダーが反映されない…
8. 動的に MeshCollider をアタッチできるようにする。
   - LoftSurface.cs に以下を追記
   - アタッチされているゲームオブジェクトに MeshCollider があれば削除し、新しい MeshCollider を設定する SetMeshCollider メソッドを追加している

```cs
public class LoftSurface : MonoBehaviour
{
    void Start()
    {
        SetMeshCollider(gameObject);
    }

    private void SetMeshCollider(GameObject obj)
    {
        if (obj.GetComponent<MeshCollider>() != null)
        {
            DestroyImmediate(gameObject.GetComponent<MeshCollider>());
        }
        obj.AddComponent<MeshCollider>();
        obj.GetComponent<MeshCollider>().material = new PhysicMaterial("SurfMaterial")
        {
            bounciness = (float) 1.0
        };
    }

    void Update()
    {
        SetMeshCollider(gameObject);
        var controlPoints  = new List<List<Vector3>>();
        // 以下省略...
```

### 2.2 ゲームオーバー時にゲームを再スタートできるようにする

1. SampleScene の名前を GameScene に変える
2. Cube を作成する
   - 名前を Respawn にする
3. LoftSurface の下の方に適当な距離をとって、X と Z の Scale を 100 にする
   - ここに当たらないと再スタートしないので、位置に注意
4. リスポンの判定に使うのみで、レンダーする必要なので MeshRenderer を非アクティブにする
5. Add Component で Respawn.cs を追加する。
   - コライダーに入ってきたら実行するメソッド OnCollisionEnter を使う
   - シーンを読み込む形で再スタートを実装する

```cs
using UnityEngine;
using UnityEngine.SceneManagement;

public class Respawn : MonoBehaviour
{
    private void OnCollisionEnter(Collision other)
    {
        SceneManager.LoadScene("GameScene");
    }
}
```

### 2.3 ゴールを作る

1. Cube で作成する
   - 名前を Goal にする
2. ゴールにしたい個所に配置する
   - スケールも好きな値に設定する
   - 単純にこれがゲームの難しさになるので注意
3. Add Component で Goal.cs を追加する。
4. ゲームクリア時の画面を作成（次のところでまとめて作成するので後回し）
5. ゲームクリアなので Ball を消す
   - SerializeField をつけるとエディタ上から値を設定できるようになる
   - Ball をエディタ上で設定する

```cs
public class Goal : MonoBehaviour
{
  [SerializeField] private GameObject ball;
  private void OnCollisionEnter(Collision other)
  {
    ball.SetActive(false);
  }
}
```

### 2.4 現状の確認

ここまで作ると Unity はこんなになっているはずです

![]https://raw.githubusercontent.com/hrntsm/RhinoInsideGame/master/images/GameScene.png)

ここまでのデータは part2 のフォルダ に入っているものになっています

---

## 3. UI を作っていく

### 3.1 クリア画面を作る

1. Hierarchy で右クリックして、UI から Text を選ぶと Hierarchy に Canvas と EventSystem と Canvas の子に Text が作成される

   - Canvas のサイズは Game ウインドウのサイズによるので注意してください

   ![](https://raw.githubusercontent.com/hrntsm/RhinoInsideGame/master/images/UI.png)

2. Text にクリアを示す文字を入れる
3. Panel を使って背景を入れる
4. Panel の名前を GoalPanel にして、Text を子にする
5. GoalPanel を非アクティブにする
6. 2.3 で作成した Goal.cs に下記を追記して、Ball が Goal に入った時に GoalPanel をアクティブにして表示されるようにする
   - エディタから GoalPanel をセットしておく

```cs
public class Goal : MonoBehaviour
{
  [SerializeField] private GameObject ball;
  [SerializeField] private GameObject goalPanel; // 追加
  private void OnTriggerEnter(Collider other)
  {
    goalPanel.gameObject.SetActive(true); // 追加
    ball.SetActive(false);
  }
}
```

### 3.2 リスポンの確認画面を作成する

1. 3.1 と同様に Text と Panel を使って確認画面を作成する
2. 2.2 で作成した Respawn.cs を以下のように書き換える
   - Ball が Respawn の枠内に入ったらボールを消して、リスポン確認画面を表示させる
   - Update では\_retry が true かつ右クリックが押されたら GameScene をロードさせる

```cs
public class Respawn : MonoBehaviour
{
    [SerializeField] private GameObject ball;
    [SerializeField] private GameObject respawn;
    private bool _retry = false;

    private void OnCollisionEnter(Collision other)
    {
        respawn.SetActive(true);
        ball.SetActive(false);
        _retry = true;
    }

    void Update ()
    {
        if (Input.GetMouseButtonDown (0) & _retry == true)
        {
            SceneManager.LoadScene("GameScene");
        }
    }
}
```

### 3.3 コントロールポイントの座標をスライダーで変更できるようにする

1. UI から Slider を作成する
2. Anchors を左の中央にする
3. Slider の MinValue を-10、MaxValue を 10 にする
4. MoveSphere.cs を作成して Slider にアタッチする

```cs
public class MoveSphere : MonoBehaviour
{
    [SerializeField] private GameObject sphere;
    private Slider _slider;

    private void Start()
    {
      _slider = gameObject.GetComponent<Slider>();
      _slider.value = 0;
    }

    public void Move()
    {
      // gameobject.transform.position.y は値が変えられないのでいったんposを介して値を変える
      var pos = sphere.transform.position;
      pos.y = _slider.value;
      sphere.transform.position = pos;
    }
}
```

5. sphere の部分に座標を操作したいコントロールポイントを設定する
6. Slider の On Value Changed を設定する

   - ここで設定されたものはスライダーの値が変えられたときに呼ばれる

   ![](https://raw.githubusercontent.com/hrntsm/RhinoInsideGame/master/images/Slider.png)

7. 各コントロールポイントにスライダーを設定する

### 3.4 カメラを設定する

1. MainCamera を選択すると Scene のウインドウの中にカメラのビューが表示される
2. ゲーム画面にしたい、いい感じのアングルを設定する

   ![](https://raw.githubusercontent.com/hrntsm/RhinoInsideGame/master/images/Camera.png)

### 3.5 ゲームのスタート画面を作る

1. Project ウインドウを右クリックして Create から Scene を作成する
   - 名前は TitleScene とする
2. Scene を TitleScene に切り替える
3. Respawn 画面などでやったように Title 画面を作成する

   ![](https://raw.githubusercontent.com/hrntsm/RhinoInsideGame/master/images/Title.png)

4. Create Empty から空の GameObject を作り、それに TitleSceneScript をアタッチする
   - 今は Unity エディタから RhinoInside を起動しているが、ビルドした単体のアプリとしても RhinoInside を起動できるようにしなければいけないので、Start に RhinoInside を起動する部分をかく
   - Update には画面をクリックしたら先程まで作っていた GameScene がロードされるようにしている

```cs
using System;
using System.IO;
using UnityEngine;
using UnityEngine.SceneManagement;
using Rhino.Runtime.InProcess;

public class TitleSceneScript : MonoBehaviour
{
  private void Start()
  {
    string RhinoSystemDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Rhino WIP", "System");
    var PATH = Environment.GetEnvironmentVariable("PATH");
    Environment.SetEnvironmentVariable("PATH", PATH + ";" + RhinoSystemDir);
    GC.SuppressFinalize(new RhinoCore(new string[] { "/scheme=Unity", "/nosplash" }, WindowStyle.Minimized));
  }

  void Update () {

    if (Input.GetMouseButtonDown (0)) {
      SceneManager.LoadScene("GameScene");
    }
  }
}
```

### 4. ゲームとしてビルドする

- File - Build Settings を開く
- Scene In Build で作成した 2 つのシーンを登録する
- Architecture は x86_64 にする（多分デフォルトでこのあたい）
- PlayerSettings から OtherSettings から ScriptingBackend を Mono、Api Compatibility Level を .Net 4.x にする
- Build する

- 完成！！！！！

### 5. その他

- Build Setting で Build したものでもスクリプトのデバッグできる設定がある

  ![](https://raw.githubusercontent.com/hrntsm/RhinoInsideGame/master/images/BuildDebug.png)

- 起動時に RhinoInside の起動の待ちが気になる
  - 該当箇所を非同期処理に書き換える
  - Task.Run を使って非同期化
    - うまく CancellationToken を設定できてないので、強制終了しかできない…

```cs
public class TitleSceneScript : MonoBehaviour
{
    void Start()
    {
        string RhinoSystemDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Rhino WIP", "System");
        var PATH = Environment.GetEnvironmentVariable("PATH");
        Environment.SetEnvironmentVariable("PATH", PATH + ";" + RhinoSystemDir);
        Task.Run(() =>
           new RhinoCore(new string[] {"/scheme=Unity", "/nosplash"}, WindowStyle.Minimized));
    }
}
```

## まとめ

- 最終版は final version のものになっています。
- ほとんど Unity でしたが、うまく動きましたでしょうか。
- RhinoInside の部分は、RhinoInside のリポの Unity フォルダの sample1 のものを参考にしています。
