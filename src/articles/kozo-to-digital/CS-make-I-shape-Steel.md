---
title: "Grasshopper と C# を使って H 形鋼を出力する"
date: "2016-12-24"
draft: false
path: "/articles/CS-make-I-shape-Steel"
article-tags: ["Grasshopper", "CSharp", "構造とデジタル"]
---

以前の記事では、単純梁の計算をするコンポーネントを作成しました。その際はすべてのパラメーターが手入力だったので、今回は H 形鋼を対象にして、解析に必要なパラメーターを計算し、出力するコンポーネントの作成を行います。

また設定した形状の H 形鋼を Rhino 上への出力も併せて行います。

[![](https://4.bp.blogspot.com/-zIDrpwCI2kA/WF4Ad2n6M6I/AAAAAAAABTQ/fnAo7AUH4UY8KRx2JSvsOfYDLjZ06c_5wCLcB/s640/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)](https://4.bp.blogspot.com/-zIDrpwCI2kA/WF4Ad2n6M6I/AAAAAAAABTQ/fnAo7AUH4UY8KRx2JSvsOfYDLjZ06c_5wCLcB/s1600/%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%2597%25E3%2583%2581%25E3%2583%25A3.PNG)

初めに Rhino への出力の仕方から説明します。やることは実際の Rhino でサーフェスを作成することに非常に近いことをします。作成はフランジとウェブごとにサーフェスを作成するという方法で行っています。上フランジを例に説明します。  

まず Point3d で、（x,y,z）の座標を持つ点を 3 点（UFp1、UFp2、UFp3）作成します。その後、その 3 点を通る平面として Plane（UFplane）を作成します。この平面が、サーフェスを作成する面となります。サーフェスは、入力される部材幅 B と部材長さ L をもとに平面のサーフェスとして作成します。ここでは、Interval を使用して、原点から対象に B の幅を持つものとしてします。

```cs
// 上フランジのサーフェス作成
var UFp2 = new Point3d(1, 0, H / 2);
var UFp1 = new Point3d(0, 0, H / 2);
var UFp3 = new Point3d(0, 1, H / 2);
var UFplane = new Plane(UFp1, UFp2, UFp3);
var upper_flange = new PlaneSurface(UFplane, new Interval(-B / 2, B / 2), new Interval(0, L) );

```

次に、解析用諸元の計算と出力の設定です。断面二次モーメントと断面係数は、書いてある通りです。基本的なところですが、C#の割り算は、double 型等にしても小数点以下を明示しないと整数での割り算になって、小数点以下はなくなってしまうので注意しましょう。  

出力に際して、パラメータを一つの引数でコンポーネント間でやり取りしたいので、ここでは List 型の Params を定義し、その中に、部材長さ、断面二次モーメント、断面係数を格納するようにしています。サーフェスはとりあえず出力するだけなので、リストではなくただの配列としてまとめています。  

最後の出力設定では、以前は SetData としていましたが、今回は List を出力するので、SetDataList として出力しています。

```cs
// 解析用パラメータの計算
Iy = (1.0 / 12.0 * B * H * H * H) - (1.0 / 12.0 * (B - tw) * (H - 2 * tf) * (H - 2 * tf) * (H - 2 * tf));
Zy = Iy / (H / 2);

// ひとまとめにするため List で作成
List<double> Params = new List<double>();
Params.Add(L);  //  部材長さ
Params.Add(Iy) ; //  断面二次モーメント
Params.Add(Zy) ; //  断面係数

// モデルはRhino状に出力するだけなので、とりあえず配列でまとめる
var model = new PlaneSurface[3];
model[0] = upper_flange;
model[1] = bottom_flange;
model[2] = web;

// まとめての出力なので、SetDataList で出力
DA.SetDataList(0, model);
DA.SetDataList(1, Params);
```

これで H 型鋼の諸元を出力するコンポーネントの作成は終わりです。 
 
次に単純梁の計算を行うコンポーネントの修正を行います。前回ここにパラメータを入力していた部分を一括して入力を受ける Param という入力に変更します。  

List 型のデータを受け取るので、最初の RegisterInputParams の個所で、Param を登録する箇所では、  

```cs
pManager.AddNumberParameter("Analysis Parametar", "Param", "Input Analysis Parameter", GH_ParamAccess.list);  

```
として、item ではなく list としています。同様に以前 GetData としていた箇所も、GetDataList として List 型のデータを受け取る形としています。

```cs
protected override void RegisterInputParams(GH_InputParamManager pManager)
{
    pManager.AddNumberParameter("Analysis Parametar", "Param", "Input Analysis Parameter", GH_ParamAccess.list);
    pManager.AddNumberParameter("Load", "P", "Centralized load (kN)", GH_ParamAccess.item);
    pManager.AddNumberParameter("Young's modulus", "E", "Young's modulus (N/mm^2)", GH_ParamAccess.item);
}

protected override void SolveInstance(IGH_DataAccess DA)
{
    // input
    // パラメータはひとまとめにするため、List にまとめる
    List<double> Param = new List<double>();

    // Paramは List なので、GetDataList とする。
    if (!DA.GetDataList(0,  Param )) { return; }
    if (!DA.GetData(1, ref P)) { return; }
    if (!DA.GetData(2, ref E)) { return; }
}
```

完成したコード全体は以下のようになります。

```cs
using System;
using Grasshopper.Kernel;
using Rhino.Geometry;
using System.Collections.Generic;


namespace SBAnalysis
{
    public class SBComponent : GH_Component
    {

        public SBComponent() 
            : base("SimpleBeamAnalysis", "SB Analysis","calculate sinmple beam", "rgkr", "Simple-beam")
        {
        }

        protected override void RegisterInputParams(GH_InputParamManager pManager)
        {
            pManager.AddNumberParameter("Analysis Parametar", "Param", "Input Analysis Parameter", GH_ParamAccess.list);
            pManager.AddNumberParameter("Load", "P", "Centralized load (kN)", GH_ParamAccess.item);
            pManager.AddNumberParameter("Young's modulus", "E", "Young's modulus (N/mm^2)", GH_ParamAccess.item);
        }

        protected override void RegisterOutputParams(GH_OutputParamManager pManager)
        {
            pManager.AddNumberParameter("Bending Moment", "M", "output max bending moment(kNm)", GH_ParamAccess.item);
            pManager.AddNumberParameter("Bending Stress", "Sig", "output max bending stress (N/mm^2)", GH_ParamAccess.item);
            pManager.AddNumberParameter("Deformation", "D", "output max deformation(mm)", GH_ParamAccess.item);
        }

        protected override void SolveInstance(IGH_DataAccess DA)
        {
            // input
            // パラメータはひとまとめにするため、List にまとめる
            List<double> Param = new List<double>();
            double P = double.NaN;
            double E = double.NaN;
            // output
            double M = double.NaN;
            double Sig = double.NaN;
            double D = double.NaN;
            //
            double L, Iy, Zy;

            // Paramは List なので、GetDataList とする。
            if (!DA.GetDataList(0,  Param )) { return; }
            if (!DA.GetData(1, ref P)) { return; }
            if (!DA.GetData(2, ref E)) { return; }

            L = Param[0];
            Iy = Param[1];
            Zy = Param[2];

            M = P * (L/1000) / 4;
            Sig = M * 1000000 / Zy;
            D = P*1000*L*L*L/(48*E*Iy);

                      
            // 出力設定
            DA.SetData(0, M);
            DA.SetData(1, Sig);
            DA.SetData(2, D);

        }

        public override Guid ComponentGuid
        {
            get { return new Guid("419c3a3a-cc48-4717-8cef-5f5647a5ecfc"); }
        }
    }
}

namespace H_Shape_Model
{
    public class H_Shape_Model : GH_Component
    {

        public H_Shape_Model() : base("Make H Shape Model", "H Steel", "Display H Shape Model", "rgkr", "H-Shape")
        {
        }
        protected override void RegisterInputParams(GH_InputParamManager pManager)
        {
            pManager.AddNumberParameter("Width", "B", "Model Width (mm)", GH_ParamAccess.item);
            pManager.AddNumberParameter("Height", "H", "Model High (mm)", GH_ParamAccess.item);
            pManager.AddNumberParameter("Web Thickness", "tw", "Web Thickness (mm)", GH_ParamAccess.item);
            pManager.AddNumberParameter("Flange Thickness", "tf", "Flange Thickness (mm)", GH_ParamAccess.item);
            pManager.AddNumberParameter("Length", "L", "Model Length (mm)", GH_ParamAccess.item);
        }

        protected override void RegisterOutputParams(GH_OutputParamManager pManager)
        {
            pManager.AddSurfaceParameter("View Model", "model", "output Model", GH_ParamAccess.item);
            pManager.AddNumberParameter("Analysis Parametar", "Param", "output Analysis Parameter", GH_ParamAccess.item);
        }

        protected override void SolveInstance(IGH_DataAccess DA)
        {
            // 引数設定
            double B = double.NaN;
            double H = double.NaN;
            double L = double.NaN;
            double tw = double.NaN;
            double tf = double.NaN;
            double Iy, Zy;

            // 入力設定
            if (!DA.GetData(0, ref B)) { return; }
            if (!DA.GetData(1, ref H)) { return; }
            if (!DA.GetData(2, ref tw)) { return; }
            if (!DA.GetData(3, ref tf)) { return; }
            if (!DA.GetData(4, ref L)) { return; }

            // 原点の作成
            var Ori = new Point3d(0, 0, 0);

            // 上フランジのサーフェス作成
            var UFp1 = new Point3d(0, 0, H / 2);
            var UFp2 = new Point3d(1, 0, H / 2);
            var UFp3 = new Point3d(0, 1, H / 2);
            var UFplane = new Plane(UFp1, UFp2, UFp3);
            var upper_flange = new PlaneSurface(UFplane, new Interval(-B / 2, B / 2), new Interval(0, L) );

            // 下フランジのサーフェス作成
            var BFp1 = new Point3d(0, 0, -H / 2);
            var BFp2 = new Point3d(1, 0, -H / 2);
            var BFp3 = new Point3d(0, 1, -H / 2);
            var BFplane = new Plane(BFp1, BFp2, BFp3);
            var bottom_flange = new PlaneSurface(BFplane, new Interval(-B / 2, B / 2),  new Interval(0, L) );

            // ウェブのサーフェス作成
            var Wp1 = new Point3d(0, 0, 0);
            var Wp2 = new Point3d(0, 0, -1);
            var Wp3 = new Point3d(0, 1, 0);
            var Wplane = new Plane(Wp1, Wp2, Wp3);
            var web = new PlaneSurface(Wplane,  new Interval(-H / 2, H / 2), new Interval(0, L));

            // 解析用パラメータの計算
            Iy = (1.0 / 12.0 * B * H * H * H) - (1.0 / 12.0 * (B - tw) * (H - 2 * tf) * (H - 2 * tf) * (H - 2 * tf));
            Zy = Iy / (H / 2);
            // ひとまとめにするため List で作成
            List<double> Params = new List<double>();
            Params.Add(L);  //  部材長さ
            Params.Add(Iy) ; //  断面二次モーメント
            Params.Add(Zy) ; //  断面係数

            // モデルはRhino上に出力するだけなので、とりあえず配列でまとめる
            var model = new PlaneSurface[3];
            model[0] = upper_flange;
            model[1] = bottom_flange;
            model[2] = web;

            // まとめての出力なので、SetDataList で出力
            DA.SetDataList(0, model);
            DA.SetDataList(1, Params);
        }

        public override Guid ComponentGuid
        {
            get { return new Guid("419c3a3a-cc48-4717-8cef-5f5647a5ecAa"); }
        }
    }
}
```
