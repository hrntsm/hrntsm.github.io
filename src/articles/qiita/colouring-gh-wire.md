---
title: "GrasshopperでNumberSliderにつながるワイヤーにのみ色を付ける方法"
date: "2019-12-08"
draft: false
path: "/articles/colouring-gh-wire"
article-tags: ["CSharp", "Grasshopper", "Qiita"]
---

## はじめに

せっかく[RhinocerosForum](https://discourse.mcneel.com/t/editing-wire-colours-like-galapagos/84496/4)で Rutten に教えてもらったので、その知見を残しておきます。以下のように Grasshopper コンポーネント間をつなぐワイヤーで、NumberSlider につながっているもののみに色を付ける方法を説明します。発端は Galápagos みたいなコンポーネントを作ろうとしたとき、どのようにしたらいいのかわからなくて質問したのが始まりです。

Rutten さん、いつも本当にありがとうございます。

<img src="https://aws1.discourse-cdn.com/mcneel/uploads/default/original/3X/9/3/93e4aadd0a1386cd253c0e096d9dcc356ec0f25c.png" width="720">

### まずは中身を知りたい人むけ

Rutten が回答で gh ファイルを上げてくれているので、すぐに試したい人は[そちら](https://discourse.mcneel.com/t/editing-wire-colours-like-galapagos/84496/4)をどうぞ。

## 説明編

回答もらって半年くらいまとめずに放っておいて、年末にせっかくまとめを作っているので、のんびり勉強もかねて使用しているものの API の個所のリンクもつけてます。

### RunScript の部分

NumberSlider を対象にしたいので入力の x の値をデフォルトの object から double に変えています。そのあと EnsurePaintHandler()を呼んでここでワイヤーに赤丸を付ける処理をしています。

```cs
private void RunScript(double x, object y, ref object A)
{
  EnsurePaintHandler();

  A = x;
}
```

### EnsurePaintHandler の部分

初めに描画するためのハンドラーがあるかの有無を判断するため、bool で paintHandlerAssigned をつくって false にしておきます。

EnsurePaintHandler の中で、paintHandlerAssigned が true でなかったら、今アクティブな Grasshopper のキャンバスを取得する[Grasshopper.Instances.ActiveCanvas](https://developer.rhino3d.com/api/grasshopper/html/P_Grasshopper_Instances_ActiveCanvas.htm)を使って、ワイヤーを描く前に起動する[CanvasPrePaintWires](https://developer.rhino3d.com/api/grasshopper/html/E_Grasshopper_GUI_Canvas_GH_Canvas_CanvasPrePaintWires.htm)に PrePaintWires（これは以下で説明）を追加しています。

```cs
// <Custom additional code>
private bool _paintHandlerAssigned = false;

private void EnsurePaintHandler()
{
  if (_paintHandlerAssigned)
    return;

  Grasshopper.Instances.ActiveCanvas.CanvasPrePaintWires += PrePaintWires;
  _paintHandlerAssigned = true;
}
```

## PrePaintWires の部分（その 1）

最初に、自分が今アクティブにしているキャンバスに対してワイヤーを描画したいので、スクリプトがあるキャンバス(GrasshopperDocument)と入力されてきているキャンバス(canvas.Document)が同じかどうか[ReferenceEquals](https://docs.microsoft.com/ja-jp/dotnet/api/system.object.referenceequals?view=netframework-4.8)で確認して、true でなければ return にしています。

GrasshopperDocument は、C#スクリプトコンポーネン作った時デフォルトで用意されているを #region Members の中に作られていてます。その部分の抜粋も以下につけておきます。[GH_Document についてはこちら](https://developer.rhino3d.com/api/grasshopper/html/T_Grasshopper_Kernel_GH_Document.htm)

そのあと input の x (順番でいうと 0 番目)に入力されているコンポーネント数を取得するため、[Component.Params](https://developer.rhino3d.com/api/grasshopper/html/P_Grasshopper_Kernel_IGH_Component_Params.htm)の[Input](https://developer.rhino3d.com/api/grasshopper/html/P_Grasshopper_Kernel_GH_ComponentParamServer_Input.htm)の 0 番を first としています。もし 0 個([first.SourceCount](https://developer.rhino3d.com/api/grasshopper/html/P_Grasshopper_Kernel_GH_Param_1_SourceCount.htm)==0)なら return してます。

```cs
private void PrePaintWires(Grasshopper.GUI.Canvas.GH_Canvas canvas)
{
  // We should only draw wires if the document loaded in the canvas is the document we're in.
  if (!ReferenceEquals(GrasshopperDocument, canvas.Document))
    return;

  // Find all sliders that plug into the first component input.
  var first = Component.Params.Input[0];
  if (first.SourceCount == 0)
    return;

  // その2、その3の部分
}
```

```cs
#region Members
  /// <summary>Gets the Grasshopper document that owns this script.</summary>
  private readonly GH_Document GrasshopperDocument;
  /// <summary>Gets the Grasshopper script component that owns this script.</summary>
  private readonly IGH_Component Component;
#endregion
```

### PrePaintWires の部分（その 2）

ここでは NumberSlider か判定して、NumberSlider ならば処理を加えるということをやっています。

まずは上記で取得した入力の数だけ流れるように(var source in [first.Sources](https://developer.rhino3d.com/api/grasshopper/html/P_Grasshopper_Kernel_GH_Param_1_Sources.htm))で foreach しています。

その後、source を Grasshopper.Kernel.Special.GH_NumberSlider としてキャストし直して slider を作っています。[as でキャスト](https://qiita.com/toshi0607/items/ec7f8f04f2453423d56f)すると、キャストできないときに null で返すので、キャストの下の個所で NumberSlider でない(つまり null)なら continue になってます。

```cs
private void PrePaintWires(Grasshopper.GUI.Canvas.GH_Canvas canvas)
{
  // その1部分

  foreach (var source in first.Sources)
  {
    var slider = source as Grasshopper.Kernel.Special.GH_NumberSlider;
    if (slider == null)
      continue;

  // その3部分
  }
}
```

### PrePaintWires の部分（その 3）

ここからが、実際にワイヤーに色を付けていく部分です。

ワイヤーの描画は名前空間 System.Drawing の[Graphics.DrawPath](https://docs.microsoft.com/ja-jp/dotnet/api/system.drawing.graphics.drawpath?view=netframework-4.8#System_Drawing_Graphics_DrawPath_System_Drawing_Pen_System_Drawing_Drawing2D_GraphicsPath_)のメソッドを使ってやっているので、描画のために必要なパス(path)とペンの設定(edge)を作成していきます。

まずは path からです。最初に描画するためにワイヤーの始点と終点の座標を[GH_Param.Attributes](https://developer.rhino3d.com/api/grasshopper/html/P_Grasshopper_Kernel_GH_DocumentObject_Attributes.htm)の[InputGrip](https://developer.rhino3d.com/api/grasshopper/html/P_Grasshopper_Kernel_IGH_Attributes_InputGrip.htm)と[OutputGrip](https://developer.rhino3d.com/api/grasshopper/html/P_Grasshopper_Kernel_IGH_Attributes_OutputGrip.htm)を使用して取得し、それぞれ input と output としています。次に[GH_Painter.ConnectionPath](https://developer.rhino3d.com/api/grasshopper/html/M_Grasshopper_GUI_Canvas_GH_Painter_ConnectionPath.htm)のメソッドを使って、描画のためのラインのパスを作成しています。

次に edge です。ここでは一番最初に図示したように点々になるようなペンの設定を作成します。[System.Drawing.Pen](https://docs.microsoft.com/ja-jp/dotnet/api/system.drawing.pen.-ctor?view=netframework-4.8#System_Drawing_Pen__ctor_System_Drawing_Color_System_Single_)の部分でペンの色と太さ、edge の[DashCap](https://docs.microsoft.com/ja-jp/dotnet/api/system.drawing.pen.dashcap?view=netframework-4.8#System_Drawing_Pen_DashCap)のプロパティを使用して丸くして、[DashPattern](https://docs.microsoft.com/ja-jp/dotnet/api/system.drawing.pen.dashpattern?view=netframework-4.8#System_Drawing_Pen_DashPattern)のプロパティでダッシュと空白の長さを指定しています。

これで必要なものが設定できたので、canvas.Graphics.DrawPath(edge, path)の部分で赤丸の点線を描画しています。

そして最後に Dispose して終わりです。（[Dispose なんもわからん](https://qiita.com/tera1707/items/d066672f834e296a9e40)）

```CS
private void PrePaintWires(Grasshopper.GUI.Canvas.GH_Canvas canvas)
{
  // その1部分

  foreach (var source in first.Sources)
  {
    // その2部分

    var input = first.Attributes.InputGrip;
    var output = slider.Attributes.OutputGrip;

    var path = Grasshopper.GUI.Canvas.GH_Painter.ConnectionPath(
      input,
      output,
      Grasshopper.GUI.Canvas.GH_WireDirection.left,
      Grasshopper.GUI.Canvas.GH_WireDirection.right);

    var edge = new System.Drawing.Pen(System.Drawing.Color.DeepPink, 8);
    edge.DashCap = System.Drawing.Drawing2D.DashCap.Round;
    edge.DashPattern = new float[] { 0.1f, 2f };

    canvas.Graphics.DrawPath(edge, path);

    edge.Dispose();
    path.Dispose();
  }
}
```

## 最終的なコードの全体

で結局全体でどうなっているのよ？というのは以下参照

```CS
private void RunScript(double x, object y, ref object A)
{
  EnsurePaintHandler();
  A = x;
}

// <Custom additional code>
private bool _paintHandlerAssigned = false;

private void EnsurePaintHandler()
{
  if (_paintHandlerAssigned)
    return;

  Grasshopper.Instances.ActiveCanvas.CanvasPrePaintWires += PrePaintWires;
  _paintHandlerAssigned = true;
}

private void PrePaintWires(Grasshopper.GUI.Canvas.GH_Canvas canvas)
{
  // We should only draw wires if the document loaded in the canvas is the document we're in.
  if (!ReferenceEquals(GrasshopperDocument, canvas.Document))
    return;

  // Find all sliders that plug into the first component input.
  var first = Component.Params.Input[0];
  if (first.SourceCount == 0)
    return;

  foreach (var source in first.Sources)
  {
    var slider = source as Grasshopper.Kernel.Special.GH_NumberSlider;
    if (slider == null)
      continue;

    var input = first.Attributes.InputGrip;
    var output = slider.Attributes.OutputGrip;

    var path = Grasshopper.GUI.Canvas.GH_Painter.ConnectionPath
    (
      input,
      output,
      Grasshopper.GUI.Canvas.GH_WireDirection.left,
      Grasshopper.GUI.Canvas.GH_WireDirection.right
    );

    var edge = new System.Drawing.Pen(System.Drawing.Color.DeepPink, 8);
    edge.DashCap = System.Drawing.Drawing2D.DashCap.Round;
    edge.DashPattern = new float[] { 0.1f, 2f };

    canvas.Graphics.DrawPath(edge, path);

    edge.Dispose();
    path.Dispose();
  }
}
// </Custom additional code>
```
