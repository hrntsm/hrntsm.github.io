---
title: "Deep dive into RhinoCompute through Rust"
date: "2022-02-12"
draft: false
path: "/articles/deep-dive-into-rhinocompute-through-rust"
article-tags: ["Rust", "RhinoCompute", "Grasshopper"]
---

## はじめに

最近流行りの言語として Rust があり、触ってみたいと思っている方も多いのではないでしょうか。
ただ、建築系ソフトをみるとその多くが Python や C# で SDK が提供されており、仕事で使わない Rust のような言語に触れることはほぼありません。

ならば Rust で建築系のソフトのなにかを操作できるようになれば、Rust を触れる機会が生まれるはずです。
ということで、本記事では Rhinoceros と HTTP 通信することで Rhinoceros の機能を使うことができる RhinoCompute を Rust で使う方法について紹介します。

本記事でははじめに Rust を触る前にどのように実装するべきか確認するため、RhinoCompute と通信することへの理解を深めます。
その後、その内容に基づいて Rust で実行環境を作成します。

技術的には Rust でも Rhino のデータを取得し rhino3dm 相当の操作が可能です。
しかしそのための実装は時間がかかるため、Grasshopper データを Post して RhinoCompute を使いその結果を取得することを目標とします。

### 必要な環境

- Rhinoceros 7 以降
- Grasshopper の Hops コンポーネント v0.11 以降
- Rust(作成段階で rustc 1.58.1 を使っています)

## RhinoCompute との通信内容について

## Rust について

Rust の特徴を[公式サイト](https://www.rust-lang.org/ja)より引用します。

> なぜ Rust か？
>
> **パフォーマンス**  
> Rust は非常に高速でメモリ効率が高くランタイムやガベージコレクタがないため、パフォーマンス重視のサービスを実装できますし、組込み機器上で実行したり他の言語との調和も簡単にできます。
>
> **信頼性**  
> Rust の豊かな型システムと所有権モデルによりメモリ安全性とスレッド安全性が保証されます。さらに様々な種類のバグをコンパイル時に排除することが可能です。
>
> **生産性**  
> Rust には優れたドキュメント、有用なエラーメッセージを備えた使いやすいコンパイラ、および統合されたパッケージマネージャとビルドツール、多数のエディタに対応するスマートな自動補完と型検査機能、自動フォーマッタといった一流のツール群が数多く揃っています。

こういった特徴があり C/C++ に代わる言語として注目されています。
インストールも同様に [公式サイトのインストール](https://www.rust-lang.org/ja/tools/install) よりできます。

開発に VSCode を使う場合は Rust の公式が出している [Rust](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust) という Extension がありますが、それを使うより [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=matklad.rust-analyzer) を使うことをおススメします。

VSCode の Settings で Rust-analyzer›Check On Save: Command の設定がデフォルトでは check になっていますが、clippy にすると保存するごとに linter が走るのでコードの確認をしやすくなります。
修正の提案もしてくれるのでとても便利です。

基本的な事項については公式のドキュメントがとても充実しているので実際に自分でコードを書いていきたい方は一読すると理解が深まります。  
[The Rust Programming Language 日本語版](https://doc.rust-jp.rs/book-ja/)

## Rust を使った RhinoCompute 実行の実装

ここで作成するものは GitHub にあげていますので必要に応じて参照しながらすすめてください。

- [RustHopper](https://github.com/hrntsm/RustHopper)

はじめに cargo を使って新しいパッケージを作成します。
名前を "rusthopper" とする場合は以下です。

```bash
cargo new rusthopper
```

これを使ってこれから作成してきます。

### Json との IO 用の構造体の作成

通信部を作成する前に Input/Output で Json を簡単にやり取りするための構造体を作成します。
Json へのシリアライズ/デシリアライズをサポートする crate は Rust では serde が主に使われています。
ここでも同様に使用するので、Cargo.toml に以下を追加します。

```toml
[dependencies]
serde = "1.0.136"
serde_derive = "1.0.136"
serde_json = "1.0.78"
```

src ディレクトリに io.rs ファイルを作成し、ここに Json を I/O するための構造体を作成します。

この構造体は RhinoCompute のリポジトリにある [Schema.cs](https://github.com/mcneel/compute.rhino3d/blob/master/src/compute.geometry/IO/Schema.cs) を基に作成します。
上であげたようにここのクラスを使って RhinoCompute 側は処理しているので、この Schema に倣うことでスムーズにデータのやり取りができ量になります。

ただ、これを 0 から実装していくとが面倒なので、自動実装を使うと楽です。
例えばこちらの [transform.tools](https://transform.tools/json-to-rust-serde) を使うと Json から Rust の構造体を作成できるので、それを下敷きに足りない部分を手で修正してくことをおススメします。

Hops から出力された Json がここでも役に立ちます。
例として Hops のポストした IO への Json を変換すると以下のようになります。

```json
{
  "absolutetolerance": 0.0,
  "angletolerance": 0.0,
  "algo": "7VgJUBNZGk4gQ.....",
  "pointer": null,
  "cachesolve": false,
  "recursionlevel": 0,
  "values": [],
  "warnings": [],
  "errors": []
}
```

```rust
use serde_derive::Deserialize;
use serde_derive::Serialize;
use serde_json::Value;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Root {
    pub absolutetolerance: f64,
    pub angletolerance: f64,
    pub algo: String,
    pub pointer: Value,
    pub cachesolve: bool,
    pub recursionlevel: i64,
    pub values: Vec<Value>,
    pub warnings: Vec<Value>,
    pub errors: Vec<Value>,
}
```

Json 内で null だったり空の配列だったりする箇所は当然自動で生成されないのでここは Schema を見ながら修正してきましょう。
修正した結果が以下になります。

```rust
#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Schema {
    pub absolutetolerance: f64,
    pub angletolerance: f64,
    pub algo: Option<String>,
    pub pointer: Option<String>,
    pub cachesolve: bool,
    pub recursionlevel: i64,
    pub values: Vec<DataTree>,
    pub warnings: Vec<String>,
    pub errors: Vec<String>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DataTree {
    #[serde(rename = "ParamName")]
    pub param_name: String,
    #[serde(rename = "InnerTree")]
    pub inner_tree: HashMap<String, Vec<RestHopperObject>>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RestHopperObject {
    #[serde(rename = "type")]
    pub object_type: String,
    pub data: String,
}
```

`algo` と `pointer` は null（Rust では None）になる可能性があるので Option の Enum を使用して None または Some(T) を扱えるようにしています。

`warnings` と `errors` は文字列の配列である `Vec<String>` としています。

`values` は Grasshopper のツリーの情報を入れるため、別途 `DataTree` という構造体を作成しています。
C# の Schema ファイルでは、DataTree は別の扱い方をしていますが、簡単に扱うためここでは違う構成にしています。
DataTree はパラメータの名前である `param_name` とそのパラメータに入れる値のパスの String と実際の値を持つ `inner_tree` の HashMap で構成しています。

同様にして Response の構造体も作成します。
作成した内容は以下です。
こちらの内容は C# の Schema.cs と同様の内容を Rust の構造体に書き換えたものとなっています。

```rust
#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IoResponseSchema {
    #[serde(rename = "Description")]
    pub description: Option<String>,
    #[serde(rename = "CacheKey")]
    pub cache_key: Option<String>,
    #[serde(rename = "InputNames")]
    pub input_names: Vec<String>,
    #[serde(rename = "OutputNames")]
    pub output_names: Vec<String>,
    #[serde(rename = "Icon")]
    pub icon: Option<String>,
    #[serde(rename = "Inputs")]
    pub inputs: Vec<InputParamSchema>,
    #[serde(rename = "Outputs")]
    pub outputs: Vec<IoParamSchema>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InputParamSchema {
    #[serde(rename = "Description")]
    pub description: String,
    #[serde(rename = "AtLeast")]
    pub at_least: f64,
    #[serde(rename = "AtMost")]
    pub at_most: f64,
    #[serde(rename = "Default")]
    pub default: String,
    #[serde(rename = "Minimum")]
    pub minimum: Value,
    #[serde(rename = "Maximum")]
    pub maximum: Value,
    #[serde(rename = "Name")]
    pub name: String,
    #[serde(rename = "Nickname")]
    pub nickname: Option<String>,
    #[serde(rename = "ParamType")]
    pub param_type: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IoParamSchema {
    #[serde(rename = "Name")]
    pub name: Option<String>,
    #[serde(rename = "Nickname")]
    pub nickname: Option<String>,
    #[serde(rename = "ParamType")]
    pub param_type: Option<String>,
}
```

### 通信部分の作成

IO 用の構造体が作成できたので、次にそれらを Post する部分を作成していきます。
必要な依存関係として、通信用にバイナリ（gh のファイル）を Base64 に変換する base64 と通信のための reqwest と非同期化に必要な tokio を依存関係に追加します。

```toml
[dependencies]
base64 = "0.13.0"
reqwest = { version = "0.11", features = ["json"] }
serde = "1.0.136"
serde_derive = "1.0.136"
serde_json = "1.0.78"
tokio =  { version = "1", features = ["full"] }
```

はじめに Grasshopper のファイルを /io にポストする部分を作成します。
実装としては引数に &str で gh ファイルへのパスをとり、ポストした結果を Result で返すようにしています。
また通信なので関数は非同期とするためはじめに `async` をつけています。

/io へのポストなので、algo に gh ファイルのデータが入ったものをいれ、レスポンスでそのデータへの cache_key が返ってくることを期待しています。

```rust
use base64::encode;
use std::fs::File;
use std::io::Read;

use crate::{io, URL};

async fn upload_definition(
    gh_path: &str,
) -> Result<io::IoResponseSchema, Box<dyn std::error::Error>> {
    // io の URL を作成
    let io_url = URL.to_owned() + "io";

    // ファイルを読み込み、Base64 にエンコード
    let mut gh_file = File::open(gh_path).unwrap();
    let mut buf = Vec::new();
    let _ = gh_file.read_to_end(&mut buf);
    let encoded: &str = &encode(&buf);

    // body となる各値を作成し Json の文字列化
    let io_schema = io::Schema {
        absolutetolerance: 0.0,
        angletolerance: 0.0,
        algo: Some(encoded.to_owned()),
        pointer: None,
        cachesolve: false,
        recursionlevel: 0,
        values: Vec::new(),
        warnings: Vec::new(),
        errors: Vec::new(),
    };
    let io_body = serde_json::to_string(&io_schema)?;

    // ポストして結果の Json をデシリアライズ
    let client = reqwest::Client::new();
    let res = client
        .post(io_url)
        .body(io_body)
        .send()
        .await?
        .json::<io::IoResponseSchema>()
        .await?;

    Ok(res)
}
```

Rust はコンパイラが細かいと聞いたことがある方もいると思いますので、その例をここで示します。
上で io_schema を作成している箇所で、absolutetolerance は f64 なのですが、文字列 "0.0" をいれて `cargo check` を実行します。

```rust
let io_schema = io::Schema {
    absolutetolerance: "0.0",
```

このようにどこがどのようにダメなのかを細かくコンパイラが教えてくれます。
基本的にはこのコンパイラの指示に素直に従っていればコードが仕上がっていきます。

```rust
error[E0308]: mismatched types
  --> src\grasshopper.rs:15:28
   |
15 |         absolutetolerance: "0.0",
   |                            ^^^^^ expected `f64`, found `&str`
```


/io からのレスポンスでポストした gh ファイルの cache key が返ってくるので、それを使って実際にファイルを評価する部分を作成します。

実装としては mcneel の Python の compute-rhino3d の実装に倣って、gh ファイルのパスと DataTree を受け取ってそれを使って処理する関数としています。

```rust
pub async fn evaluate_definition(
    gh_path: &str,
    data_tree: Vec<io::DataTree>,
) -> Result<io::Schema, Box<dyn std::error::Error>> {

    // 上で実装した /io へのポストを使って cache_key を取得
    let cache_key = upload_definition(gh_path).await?.cache_key;

    // io の URL を作成
    let solve_url = URL.to_owned() + "grasshopper";

    // body となる各値を作成し Json の文字列化
    let solve_schema = io::Schema {
        absolutetolerance: 0.001,
        angletolerance: 1.0,
        cachesolve: false,
        algo: None,
        pointer: cache_key,
        recursionlevel: 0,
        values: data_tree,
        warnings: Vec::new(),
        errors: Vec::new(),
    };
    let solve_body = serde_json::to_string(&solve_schema)?;

    // ポストして結果の Json をデシリアライズ
    let solve_client = reqwest::Client::new();
    let solve_res = solve_client
        .post(solve_url)
        .body(solve_body)
        .send()
        .await?
        .json::<io::Schema>()
        .await?;

    Ok(solve_res)
}
```

これで Grasshopper ファイルを実行して値を取得する部分の作成が完了しました。

### main.rs の作成

IO の部分、通信する部分が作成できたので、これらをまとめて実際にポストするデータを作成し結果を表示する部分を作成していきます。

```rust 
mod grasshopper;
mod io;

use std::collections::HashMap;

// ベースとなる URL 作成
const URL: &str = "http://localhost:6500/";

// 非同期のメイン関数であることを示すため #[tokio::main] を付ける
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {

    // grasshopper のパスを入れる
    let gh_path = "definitions/sum.gh";

    // インプット用の DataTree を作成する
    let mut input_tree: Vec<io::DataTree> = Vec::new();
    let mut tree = HashMap::new();
    tree.insert(
        "0".to_string(),
        vec![io::RestHopperObject {
            object_type: "System.Double".to_string(),
            data: "1.0".to_string(),
        }],
    );
    input_tree.push(io::DataTree {
        param_name: "A".to_string(),
        inner_tree: tree,
    });

    let mut tree = HashMap::new();
    tree.insert(
        "0".to_string(),
        vec![io::RestHopperObject {
            object_type: "System.Double".to_string(),
            data: "2.0".to_string(),
        }],
    );
    input_tree.push(io::DataTree {
        param_name: "B".to_string(),
        inner_tree: tree,
    });

    // RhinoCompute と通信して結果を受け取る
    let output = grasshopper::evaluate_definition(gh_path, input_tree).await?;

    // 各結果を表示する
    // エラーの結果
    let errors = output.errors;
    if !errors.is_empty() {
        println!("Errors:");
        for error in errors {
            println!("{}", error);
        }
    }

    // ワーニングの結果
    let warnings = output.warnings;
    if !warnings.is_empty() {
        println!("Warnings:");
        for warning in warnings {
            println!("{}", warning);
        }
    }

    // RH_OUT で得られた結果
    let values = output.values;
    for value in values {
        let name = value.param_name;
        let inner_tree = value.inner_tree;
        println!("{}", name);
        for (key, value) in inner_tree {
            println!("{}", key);
            for v in value {
                println!("{}", v.data);
            }
        }
    }

    Ok(())
}
```

すべてできたら `cargo check` を実行して問題がないか確認しましょう。
問題なければ RhinoCompute を起動して `cargo run`　することで実際にコードを実行しちゃんと結果が返ってくることを確認しましょう。

ここでは冒頭で出した A+B の足し算するデータに対して実行しているので結果は 3 が返ってきます。

## まとめ

Rust で RhinoCompute を実行する例を出しましたがどうでしたでしょうか。
C# や Python とはだいぶ違う言語なため手こずったと思いますが、実際に書きながらすすめると Rust の強力なコンパイラの力を感じられたのではないでしょうか。

建築系ではあまり使うことはないと思いますが、機会があったら Rust にもぜひチャレンジしてみてください。
