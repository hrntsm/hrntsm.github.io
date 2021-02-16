---
title: "RhinoInside Unity で Rhino へメッシュを送るやり方"
date: "2020-03-05"
draft: false
path: "/articles/rhino.inside.unity-sendmesh"
article-tags: ["Unity", "RhinoInside", "CSharp", "Rhinoceros", "構造とデジタル"]
---

Rhino.Inside.Unity で Unity から Rhino にメッシュを送る部分を作成したので、送り方を説明します。なお作った結果として、メッシュはデータ量が多いからか動作が非常に重くなるので、リアルタイムでメッシュのやり取りをしない限りは FBX などを介して送ったほうがよさそうです。

[![](https://1.bp.blogspot.com/-VYfATyeLD_k/XmERX5ZA1cI/AAAAAAAABzU/TazirU_T4GUczJpEcmT1UYhCq7GWtczuACLcBGAsYHQ/s640/RIUmesh.gif)](https://1.bp.blogspot.com/-VYfATyeLD_k/XmERX5ZA1cI/AAAAAAAABzU/TazirU_T4GUczJpEcmT1UYhCq7GWtczuACLcBGAsYHQ/s1600/RIUmesh.gif)

mcneel の GitHub に Rhino から Unity にメッシュを送る部分があるのですが、Unity から Rhino に送る部分がなかったためその部分を作成しました。  
　ただし今回作成したのは、Unity でゲームオブジェクトにアタッチされているメッシュそのもの（MeshFilter の中の Mesh）を送っているだけなため、transform で設定する position、rotation、scale は送っていません。このこともあって冒頭で FBX などのものを進めています。  
　作成したベースは [Rhino.Inside.Unity の sample2](https://github.com/mcneel/rhino.inside/tree/master/Unity/Sample2)を使っています。  
　 Rhino に送るためには Unity のメッシュ(UnityEngine.Mesh)を Rhino のメッシュ(Rhino.Geometry.Mesh)に変換する必要があるので、そこを作成します。上記サンプルの中では Convert.cs の中でその変換をやっているので、そこに追記します。追記した内容は以下です。

```cs
  static public Rhino.Geometry.Mesh ToRhino(this UnityEngine.Mesh _mesh)
  {
    Vector3[] verteces = _mesh.vertices;
    int[] triangles = _mesh.triangles;
    var result = new Rhino.Geometry.Mesh();
    List<Brep> brep = new List<Brep>();

    for (int i = 0; i < triangles.Length / 3 - 1; i++)
    {
      var pt1 = verteces[triangles[3 * i]].ToRhino();
      var pt2 = verteces[triangles[3 * i + 1]].ToRhino();
      var pt3 = verteces[triangles[3 * i + 2]].ToRhino();
      brep.Add(Brep.CreateFromCornerPoints(pt1, pt2, pt3, 0.00001));
    }
    for (int i = 0; i < brep.Count; i++)
    {
      result.Append(Rhino.Geometry.Mesh.CreateFromBrep(brep[i]));
    }
    
    return result;
  }
```

Unity の Mesh(\_mesh)を受け取って、そこから Brep を作り、その Brep から Rhino の Mesh を作っています。  
　 Brep のつくり方は、まず Unity のメッシュの vertices と triangles を使って構成する 3 点を取得します。この点は Unity の Vector3 なので、ToRhino で Rhino の Point3d に変換し、CreateFromCornerPoints で Brep を作ります。最後の引数は、tolerance なので、想定する精度をもとに決めればよいですが、Unity の 1 は 1m 相当なので、ここで tolerance を 1mm と思って 1 にすると細かいモデルはうまく送れないのでここでは 0.0001 にしています。必要な精度で適宜設定してください。  
　 Mesh は Brep から CreateFromBrep でつくり Append することでひとまとまりのメッシュにしています。  
　送るメッシュは別途 RhinoInsideController.cs を作ってそれを適当なゲームオブジェクトにアタッチして、そこに\_sendObject として受け取るようにしてます。

```cs
public GameObject _sendObject;

void Update()
{
  var mesh = _sendObject.GetComponent<MeshFilter>().mesh.ToRhino();
  using (var args = new Rhino.Runtime.NamedParametersEventArgs())
  {
    args.Set("mesh", mesh);
    Rhino.Runtime.HostUtils.ExecuteNamedCallback("SendObject", args);
  }
}
```

Grasshopper で受け取る側は以下です。
```cs
  void Register(IGH_Component component)
  {
    if(!registered)
    {
      Rhino.Runtime.HostUtils.RegisterNamedCallback("SendObject", ToGrasshopper);
      comp = component;
      registered = true;
    }
  }

  void ToGrasshopper(object sender, Rhino.Runtime.NamedParametersEventArgs args)
  {
    Rhino.Geometry.GeometryBase[] values;
    if (args.TryGetGeometry("mesh", out values))
      mesh = values[0] as Rhino.Geometry.Mesh;
    comp.ExpireSolution(true);
  }
```

受け取り方は、ポイントの受け取り方と同じで NameCallback を使ってやっています。

  
　ここで作ったものは Unity のプロジェクトごと[ここの Sample3](https://github.com/hrntsm/rhino.inside/tree/master/Unity)にあげました。Unity 2018.4 で作っています。参考にしてください。
