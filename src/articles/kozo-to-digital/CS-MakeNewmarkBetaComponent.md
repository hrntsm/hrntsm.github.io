---
title: "簡単な時刻歴応答解析コンポーネントの開発"
date: "2017-07-17"
draft: false
path: "/articles/CS-MakeNewmarkBetaComponent"
article-tags: ["Grasshopper", "CSharp", "構造とデジタル"]
---

これまでのコンポーネント作成を踏まえて、単質点系の時刻歴応答解析を行うコンポーネントを作成します。

Grasshopper のパラスタしやすい特性を活かせば、時間のかかる時刻歴のパラスタが簡単になるのでは？と思って作成しましたが、単質点、弾性なので、疑似速度応答スペクトル作ったほうが早いですね。非線形、多質点化はまたそのうち実装します。

[![](https://4.bp.blogspot.com/-sTXUGEn1tUw/WWxOYWbsNOI/AAAAAAAABYw/WsuYr1f8rf0vXJeygvpZsvDDVX7I71L5QCLcBGAs/s640/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)](https://4.bp.blogspot.com/-sTXUGEn1tUw/WWxOYWbsNOI/AAAAAAAABYw/WsuYr1f8rf0vXJeygvpZsvDDVX7I71L5QCLcBGAs/s1600/%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2594%25BB%25E5%2583%258F.PNG)

振動解析の手法については、たくさんの本が出ていることと、このブログの目的ではないので、下記の gist からコードの中身を見てください。作成したコンポーネントはデータ置き場に置いておきますが、解の確からしさはコードも公開しているので、使用する際は、確認してください。簡単な諸元は

- Newmark β 法で解析（β の値は直接指定）
- 減衰は初期剛性比例減衰
- 1 自由度の単質点系
- 線形解析
- 地震波は直接指定（カンマ区切りで連続したデータ）
- 入力は、質量、剛性、減衰係数、時間刻み、β の値、入力波の長さ、入力波
- 出力は、加速度、速度、変位

といった形です。  

以下では作成したコンポーネントを使用して加速度応答スペクトルを作成してみます。地震波は El Centro NS を使用しています。対象の減衰定数は 0%、2%、10%としています。  

計算は作成したコンポーネントの質量の入力を固有周期から計算するようにし、おおむねそれらしい解が得られる 0.15 秒から 5 秒まで固有周期を変えていき、応答の最大値を取得することで作成します。解の最大値は、出てくる解を SortList コンポーネントを使い並べかえることで取得しています。解析は平均加速度法(β ＝ 1/4)で行っています。

[![](https://1.bp.blogspot.com/-wQi50YCK9fY/WWxRDSJMXbI/AAAAAAAABY0/QQH06WR_eg8FOCq3MF-dZDZzgOs9ZVUyQCLcBGAs/s640/%25E3%2582%25B9%25E3%2583%259A%25E3%2582%25AF%25E3%2583%2588%25E3%2583%25AB%25E4%25BD%259C%25E6%2588%2590.PNG)](https://1.bp.blogspot.com/-wQi50YCK9fY/WWxRDSJMXbI/AAAAAAAABY0/QQH06WR_eg8FOCq3MF-dZDZzgOs9ZVUyQCLcBGAs/s1600/%25E3%2582%25B9%25E3%2583%259A%25E3%2582%25AF%25E3%2583%2588%25E3%2583%25AB%25E4%25BD%259C%25E6%2588%2590.PNG)

[![](https://4.bp.blogspot.com/-wW-VJS_WaSU/WWxRPcPWMyI/AAAAAAAABY4/e9uoTWcjOY0aPTE-__aWqxaCeA5HhRHBQCLcBGAs/s400/%25E7%25B5%2590%25E6%259E%259C.PNG)](https://4.bp.blogspot.com/-wW-VJS_WaSU/WWxRPcPWMyI/AAAAAAAABY4/e9uoTWcjOY0aPTE-__aWqxaCeA5HhRHBQCLcBGAs/s1600/%25E7%25B5%2590%25E6%259E%259C.PNG)

応答スペクトルを見るとあっていそうな形になっています。  

応答の加速度波形を動画で以下に張り付けておきます。グラフの縦軸を固定していないので若干わかりづらいですが、固有周期が変わるため応答の位相がちょっとづつ動いていくことがわかります。意味があるかはわかりませんが、こういう図はなかなか見ないので新しい感はあります。

作成したコンポーネントのコードを以下にあげます。
こちらは [MICE](https://www.food4rhino.com/app/mice) として公開していますので、動作するものが必要な方はそちらをどうぞ 

コンポーネント本体の定義

```cs
using System;
using Grasshopper.Kernel;

namespace GH_NewmarkBeta
{
    public class NewmarkBetaComponet : GH_Component
    {
        public NewmarkBetaComponet()
            : base("1dof Response Analysis", "1dof RA", "Response Analysis of the Single dof", "rgkr", "Response Analysis")
        {
        }
        protected override void RegisterInputParams(GH_InputParamManager pManager)
        {
            pManager.AddNumberParameter("Mass", "M", "Lumped Mass", GH_ParamAccess.item);
            pManager.AddNumberParameter("Stiffness", "K", "Spring Stiffness", GH_ParamAccess.item);
            pManager.AddNumberParameter("Damping ratio", "h", "Damping ratio", GH_ParamAccess.item);
            pManager.AddNumberParameter("Time Increment", "dt", "Time Increment", GH_ParamAccess.item);
            pManager.AddNumberParameter("Beta", "Beta", "Parameters of Newmark β ", GH_ParamAccess.item);
            pManager.AddIntegerParameter("N", "N", "Parameters of Newmark β ", GH_ParamAccess.item);
            pManager.AddTextParameter("WAVE", "WAVE", "Parameters of Newmark β ", GH_ParamAccess.item);
        }
        protected override void RegisterOutputParams(GH_OutputParamManager pManager)
        {
            pManager.AddNumberParameter("Acceleration", "Acc", "output Acceleration", GH_ParamAccess.item);
            pManager.AddNumberParameter("Velocity", "Vel", "output Velocity", GH_ParamAccess.item);
            pManager.AddNumberParameter("Displacement", "Disp", "output Displacement", GH_ParamAccess.item);
        }
        protected override void SolveInstance(IGH_DataAccess DA)
        {
            // パラメータの定義 ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
            double M = double.NaN;    // 質量
            double K = double.NaN;    // 剛性
            double h = double.NaN;    // 減衰定数
            double dt = double.NaN;   // 時間刻み
            double beta = double.NaN; // 解析パラメータ
            int N = 0;                // 波形データ数
            string wave_str = "0";
            
            // grasshopper からデータ取得　＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
            if (!DA.GetData(0, ref M)) { return; }
            if (!DA.GetData(1, ref K)) { return; }
            if (!DA.GetData(2, ref h)) { return; }
            if (!DA.GetData(3, ref dt)) { return; }
            if (!DA.GetData(4, ref beta)) { return; }
            if (!DA.GetData(5, ref N)) { return; }
            if (!DA.GetData(6, ref wave_str)) { return; }

            //　地震波データの処理　＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
            //　カンマ区切りで波形を入力するので、カンマで区切り配列に入れている
            char[] delimiter = { ',' };    //分割文字
            double[] wave = new double[N];
            string[] wk;
            wk = wave_str.Split(delimiter);  //カンマで分割
            for (int i = 0; i < N; i++)
            {
                wave[i] = double.Parse(wk[i]);
            }

            //　応答解析　＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
            double[] out_a = new double[N];
            double[] out_v = new double[N];
            double[] out_d = new double[N];

            Solver.NewmarkBeta_solver slv = new Solver.NewmarkBeta_solver();
            slv.NewmarkBeta(M, K, h, dt, beta, N, wave, ref out_a, ref out_v, ref out_d);

            // grassshopper へのデータ出力　＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
            DA.SetDataList(0, out_a);
            DA.SetDataList(1, out_v);
            DA.SetDataList(2, out_d);
        }
        public override Guid ComponentGuid
        {
            get { return new Guid("419c3a3a-cc48-4717-9cef-5f5647a5ecfc"); }
        }
    }
}
```

解析部分

```cs
namespace Solver
{
    /// <summary>
    /// Newmarkβ法で応答解析を行うクラス
    /// </summary>
    public class NewmarkBeta_solver
    {
        public void NewmarkBeta(double m, double k, double h, double dt, double beta, int N, double[] Ag, ref double[] out_a, ref double[] out_v, ref double[] out_d)
        {
            // 解析関連パラメータ-----------------------------
            double a = 0.0, v = 0.0, x = 0.0, an = 0.0, vn = 0.0;
            double a0 = Ag[0];                   // 初期加速度
            double v0 = 0.0;                     // 初期速度
            double d0 = 0.0;                     // 初期変位
            double c = 2 * h * Math.Sqrt(m * k); // 粘性減衰定数

            for (int n = 0; n < N; n++)
            {
                if (n == 0)  // t = 0 の時
                {
                    a = a0;
                    v = v0;
                    x = d0;
                }
                else       //  t ≠ 0 の時
                {
                    a = -(c * (v + a * dt / 2.0) + k * (x + v * dt + a * (dt * dt) * (0.5 - beta)) + m * Ag[n])
                        / (m + c * dt / 2.0 + k * (dt * dt) * beta);
                     v = v + (1.0 / 2.0) * (a + an) * dt;
                     x = x + vn * dt + beta * (a + 2.0 * an) * (dt * dt);
                }
                // 結果を出力マトリクスに入れる。
                out_a[n] = a;
                out_v[n] = v;
                out_d[n] = x;

                an = a;
                vn = v;
            }
        }
    }
}
```