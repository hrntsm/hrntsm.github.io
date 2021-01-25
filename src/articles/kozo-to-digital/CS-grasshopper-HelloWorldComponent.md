---
title: "C# と Grasshopperで Hello World! を表示"
date: "2017-05-28"
draft: false
path: "/articles/CS-grasshopper-HelloWorldComponent"
article-tags: ["Grasshopper", "CSharp", "構造とデジタル"]
---

Grasshopper のコンポーネントのカスタム方法についての記事です。コンポーネントにボタンを設置し、ボタンを押すとウインドウズフォームから出力されるウインドウに定番の「HelloWorld」を出力するコンポーネントを作成します。

[![](https://4.bp.blogspot.com/-c9x0l3r4drM/WRfabD79LqI/AAAAAAAABXY/Pybpxc6JIasqn00EfV87bYW-JZe78PbdwCLcB/s320/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)](https://4.bp.blogspot.com/-c9x0l3r4drM/WRfabD79LqI/AAAAAAAABXY/Pybpxc6JIasqn00EfV87bYW-JZe78PbdwCLcB/s1600/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)

コンポーンネントのカスタムは、カスタム専用のクラスを作成して行います。今回は、Attributes_Custom というクラス名としています。  
構成を簡単に説明すると以下のようになります。

1.  layout でコンポーネントの外観を変更しています。rec0 でコンポーネントのサイズを大きくし、ボタンを設置するスペースを作ります。（rec0.Height += 44 で高さを増している）
1.  上記画像で Button1 と表示される範囲を rec1、Button2 と表示される範囲を rec2 として作成します。
1.  ボタンにテキストを表示させるように Render の設定を行います。
1.  ボタンとして反応し、ウインドウを出すためにイベントハンドラの設定を行います。Button1 はタイトルにもなっている「HelloWorld」を出力するよう設定しています。Button2 はボタンを増やす例として作っています。どちらも右クリックでイベントが発生するようにしています。
1.  最後にここでの設定をコンポーネントに反映するため以下の gist でいうと 14-17 行目にあるようにコンポーネントと Attributes_Custom と関連つけます。

では今回作成したものを以下に掲載します。
 
コンポーネント本体
```cs
using Grasshopper.Kernel;
using Grasshopper.Kernel.Attributes;
using Grasshopper.GUI;
using Grasshopper.GUI.Canvas;

using System;
using System.Drawing;
using System.Windows.Forms;

public class SpecialComponent : GH_Component
{
    public SpecialComponent() : base("Hello World!", "Hello World!", "Special component showing winforms override", "Special", "Special") { }
    public override void CreateAttributes()
    {
        m_attributes = new Attributes_Custom(this);
    }
    protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
    {
        pManager.AddIntegerParameter("Option", "O", "Option parameter", GH_ParamAccess.item, 1);
    }
    protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
    {
        pManager.AddTextParameter("Output", "O", "Output value", GH_ParamAccess.item);
    }
    protected override void SolveInstance(IGH_DataAccess DA)
    {
        int option = 0;
        if (!DA.GetData(0, ref option)) return;

        switch (option)
        {
            case 1:
                DA.SetData(0, "A");
                return;
            case 2:
                DA.SetData(0, "B");
                return;
            default:
                DA.SetData(0, "Unknown");
                return;
        }
    }
    public override System.Guid ComponentGuid
    {
        get { return new Guid(SET_GUID); }
    }
}
```

コンポーネントのカスタムを行うクラス

```cs
public class Attributes_Custom : GH_ComponentAttributes
{
    public Attributes_Custom(GH_Component owner) : base(owner) { }
    protected override void Layout()
    {
        base.Layout();

        Rectangle rec0 = GH_Convert.ToRectangle(Bounds);
        rec0.Height += 44;

        Rectangle rec1 = rec0;
        rec1.Y = rec1.Bottom - 44;
        rec1.Height = 22;
        rec1.Inflate(-2, -2);

        Rectangle rec2 = rec0;
        rec2.Y = rec0.Bottom - 22;
        rec2.Height = 22;
        rec2.Inflate(-2, -2);

        Bounds = rec0;
        ButtonBounds = rec1;
        ButtonBounds2 = rec2;
    }
    private Rectangle ButtonBounds { get; set; }
    private Rectangle ButtonBounds2 { get; set; }

    protected override void Render(GH_Canvas canvas, Graphics graphics, GH_CanvasChannel channel)
    {
        base.Render(canvas, graphics, channel);
        if (channel == GH_CanvasChannel.Objects)
        {
            GH_Capsule button = GH_Capsule.CreateTextCapsule(ButtonBounds, ButtonBounds, GH_Palette.Black, "Button1", 2, 0);
            button.Render(graphics, Selected, Owner.Locked, false);
            button.Dispose();
        }
        if (channel == GH_CanvasChannel.Objects)
        {
            GH_Capsule button2 = GH_Capsule.CreateTextCapsule(ButtonBounds2, ButtonBounds2, GH_Palette.Black, "Button2", 2, 0);
            button2.Render(graphics, Selected, Owner.Locked, false);
            button2.Dispose();
        }
    }

    public override GH_ObjectResponse RespondToMouseDown(GH_Canvas sender, GH_CanvasMouseEvent e)
    {
        if (e.Button == MouseButtons.Left)
        {
            RectangleF rec = ButtonBounds;
            if (rec.Contains(e.CanvasLocation))
            {
                MessageBox.Show("Hello World", "Hello World", MessageBoxButtons.OK);
                return GH_ObjectResponse.Handled;
            }
        }

        if (e.Button == MouseButtons.Left)
        {
            RectangleF rec = ButtonBounds2;
            if (rec.Contains(e.CanvasLocation))
            {
                MessageBox.Show("こんな感じで増えます。", "増やし方", MessageBoxButtons.OK);
                return GH_ObjectResponse.Handled;
            }
        }
        return base.RespondToMouseDown(sender, e);
    }
}
```