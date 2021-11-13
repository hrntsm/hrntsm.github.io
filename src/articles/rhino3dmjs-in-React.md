---
title: "Rhino3dm.js の使い方 〜React編〜"
date: "2021-11-14"
draft: false
path: "/articles/Intro-Rhino3dm-js-in-React"
article-tags: ["Rhinoceros", "TypeScript", "React"]
---

## はじめに

この記事は、[Rhino3dm.js の使い方 〜HTML 編〜](./Intro-Rhino3dm-js-in-html) の続きの記事になります。
そもそも Rhino3dm.js で何ができるかは上記の記事を見てください。

### 参考データ

参考のデータは以下の GitHub にアップしているので適宜参照してください。

- [hrntsm/Introduction-Rhino3dmjs](https://github.com/hrntsm/Introduction-Rhino3dmjs)

作成したサイトは以下に公開しているので、完成品を確認したい方は参照してください。

- [Rhino3dm.js Intro Page](https://hiron.dev/Introduction-Rhino3dmjs/)

### 必要な環境

1. Node.js
1. VSCode

## REACT を触ってみる

Node.js がインストールされている環境で、ターミナルに以下のように打ち込むと React のサンプルのデータが作成されます。
ここでは `--template typescript` として TypeScript として作成していますが、
template を指定しないと JavaScript で作成されます。

```bash
npx create-react-app rhino-react --template typescript
```

問題なくプロジェクトが作成されたら、
以下を打ち込むとページがビルドされサンプルの React のロゴがくるくる回っているページが表示されます。

```bash
npm start
```

これで簡単な React をつかったサイトが作成されました。

## 半径を表示する

前の記事で扱っていた HTML ファイルに直接書いていたときと同様に Rhino3dm を使って球を作成しましょう。

まず Index.tsx ファイルを以下のように書き換えます。
Rhino3dm の wasm を読み込む必要があるため、以下のように cdn を使って読み込んでいます。

```ts
import { StrictMode } from "react"
import ReactDOM from "react-dom"

import App from "./App"

const rootElement = document.getElementById("root")

const script = document.createElement("script")
script.src = "https://cdn.jsdelivr.net/npm/rhino3dm@0.12.0/rhino3dm.min.js"
script.addEventListener("load", () => {
  ReactDOM.render(
    <StrictMode>
      <App />
    </StrictMode>,
    rootElement
  )
})
document.body.appendChild(script)
```

次に App.ts を以下のように書き換えます。

```ts
import React, { useEffect, useState } from "react"
import { RhinoModule, Sphere } from "rhino3dm"
import "./App.css"

declare global {
  interface Window {
    rhino3dm: any
  }
}

export default function App() {
  const [sphere, setSphere] = useState<Sphere>()
  useEffect(() => {
    window.rhino3dm().then((Module: RhinoModule) => {
      setSphere(new Module.Sphere([1, 2, 3], 16))
    })
  }, [])

  return (
    <div className="App">
      {sphere && <p>{`sphere diameter is: ${sphere.diameter}`}</p>}
    </div>
  )
}
```

これで `npm start` で動作を確認するとブラウザに球の直径が表示されます。

## UI を作成する

ブラウザにただ結果のテキストが表示されるだけでは
React を使っている利点があまり活かせていないのでがないので、簡単に UI を整えてみます。
ここでは mui というライブラリを使って見た目を整えていきます。

公式サイト

- https://mui.com/

### タイトルバーをつける

ページの上にタイトルバーをつけてみます。
タイトルバーには mui の [App Bar](https://mui.com/components/app-bar/) を使って作ります。

新しく AppBar.tsx というファイルを作成し以下のコードを入れてください。

基本的には公式サイトから取得できるサンプルのコードを使用し、若干内容を変えています。
ここでは最初に出てくる Basic App Bar を使います。

```ts
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"

export default function ButtonAppBar(prop: any) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {prop.title}
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
```

今回使わない部分もありますが、将来のために残しておきます。

公式のサンプルと異なる点は、prop を受け取って表示するタイトルを変更できるようにしています。

作成した AppBar を App.tsx に追加して表示されるようにしましょう。
それに加えて今後拡張しやすくするため、球を作成している部分を CreateSphere 関数として分割します。

```ts
function CreateSphere() {
  const [sphere, setSphere] = useState<Sphere>()
  useEffect(() => {
    window.rhino3dm().then((Module: RhinoModule) => {
      setSphere(new Module.Sphere([1, 2, 3], 16))
    })
  }, [])

  return (
    <div className="App">
      {sphere && <p>{`sphere diameter is: ${sphere.diameter}`}</p>}
    </div>
  )
}

export default function App() {
  return (
    <div>
      <ButtonAppBar title="Rhino3dm Test Project" />
      <CreateSphere />
    </div>
  )
}
```

### スライダーをつける

事前に書いたコードの指定された通りの球が作成されては UI として十分ではないため、
スライダーをつけてブラウザから球の半径を変えられるようにします。

スライダーは mui の [Slider](https://mui.com/components/slider/) を使って作成します。

タイトルバーは別の tsx ファイルを作成しましたが、
こちらは球の作成に紐付いているので、CreateSphere 内に記入することにします。

これまでは useEffect を使ってページを開いたときに球を作成していましたが、
スライダーを動かしたときにモデルを作成したいので、useEffect を削除します。

そして、スライダーの値が変化したときのイベントを受け取って動く onChange を作成します。
表示される文字列は、最初は球が作成されていないのでエラーにならないよう、三項演算子を使って値を切り替えるようにしています。

```ts
function CreateSphere() {
  const [sphere, setSphere] = useState<Sphere>()

  const onChange = (e: any) => {
    window.rhino3dm().then((Module: RhinoModule) => {
      setSphere(new Module.Sphere([1, 2, 3], e.target.value))
      console.log(sphere)
    })
  }

  return (
    <div>
      <p>
        {sphere
          ? "生成された Sphere の直径は " + sphere.diameter + " です。"
          : "Sphere はまだ作成されていません"}
      </p>
      <Box width={300}>
        <Slider
          defaultValue={16}
          valueLabelDisplay="auto"
          onChange={onChange}
        />
      </Box>
    </div>
  )
}
```

### 作ったファイルをダウンロードする

作成したモデルがちゃんと想定通りに作成されているか確認するために、モデルをダウンロードできるようにします。

ここでは mui の [Button](https://mui.com/components/buttons/) を使って作成します。ボタンをクリックした際に onClick が呼ばれるようにしています。

```ts
<Button variant="contained" onClick={onClick}>
  Download
</Button>
```

onClick は HTML で作成したときの内容とほぼ同じです。
TS で書くために型を追記したり、Hook を使うために sphere の値を使ったりしています。

```ts
const onClick = () => {
  window.rhino3dm().then((Module: RhinoModule) => {
    let doc: File3dm = new Module.File3dm()

    if (sphere) {
      let item = new Module.Sphere(
        sphere.center as number[],
        sphere.radius as number
      )
      // @ts-ignore
      doc.objects().addSphere(item, null)
      saveByteArray("sphere.3dm", doc.toByteArray())
    } else {
      alert("Sphere not created")
    }
  })
}

const saveByteArray = (fileName: string, byte: any) => {
  let blob = new Blob([byte], { type: "application/octect-stream" })
  let link = document.createElement("a")
  link.href = window.URL.createObjectURL(blob)
  link.download = fileName
  link.click()
}

return (
  <div>
    <p>
      {sphere
        ? "生成された Sphere の直径は " + sphere.diameter + " です。"
        : "Sphere はまだ作成されていません"}
    </p>
    <Box width={300}>
      <Slider defaultValue={16} valueLabelDisplay="auto" onChange={onChange} />
    </Box>
    <Button variant="contained" onClick={onClick}>
      Download
    </Button>
  </div>
)
```

これで Download ボタンを押すと 3dm ファイルがダウンロードされます。

## 既存のファイルを読み込む

HTML でやっていたときはファイルのパスを直接指定していましたが、
ここではボタンをつけてそこからファイルを選択できるようにします。

### Input と Check ボタンを作る

まずファイルをアップロードしてそれを処理するための関数 CheckUploadedFile 関数を作成します。

```ts
function CheckUploadedFile() {
  const [file, setFile] = useState<File>()

  const onChange = (e: any) => {
    setFile(e.target.files[0])
  }

  const onClick = () => {
    if (file) {
      window.rhino3dm().then(async (Module: RhinoModule) => {
        const buffer: ArrayBuffer = await file.arrayBuffer()
        const arr: Uint8Array = new Uint8Array(buffer)
        // @ts-ignore
        const doc: File3dm = Module.File3dm.fromByteArray(arr)
        console.log(doc)
      })
    }
  }

  return (
    <div>
      <h3>Check Uploaded File</h3>
      <input type="file" onChange={onChange} />
      <Button variant="outlined" onClick={onClick}>
        Check
      </Button>
    </div>
  )
}
```

インプットしたあとにファイルをチェックするボタンは mui の Button を使っています。
球を作ったときの Download ボタンと同じです。

作成したものが表示されるように App 関数 の return を以下のようにします。

```ts
export default function App() {
  return (
    <div>
      <ButtonAppBar title="Rhino3dm.js Intro Page!!" />
      <CreateSphere />
      <CheckUploadedFile />
    </div>
  )
}
```

### UserString を表示する表を作成する

今の設定では、onClick で最後の console にファイルの中身を表示しているだけでは UI には出てこないので、
HTML の部分でやったように UserStrings を取得して表示できるようにします。UserString は複数の値が許容されている連想配列なので、表形式で表示します。

表には mui の [table](https://mui.com/components/tables/) を使用します。

UserString を table に書き込む UserStringTable.tsx を作成して以下のようにします。
基本的には公式のサンプルを使っていますが、UserString を持っていない場合などにエラーにならないための処理を追加しています。

表示するデータは prop.data で受け取るようにしているので、
使う際には data に UserStrings を渡す形式にしています。

```ts
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"

export default function BasicTable(prop: any) {
  return (
    <div>
      {prop.data
        ? prop.data.map((row: string[][], gIndex: number) => (
            <div>
              <p>{"Geometry Index:" + gIndex}</p>
              <TableContainer sx={{ width: 300 }} component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell align="right">Key</TableCell>
                      <TableCell align="right">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.map((item: string[], index: number) => (
                      <TableRow
                        key="geometry"
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {index}
                        </TableCell>
                        <TableCell align="right">{item[0]}</TableCell>
                        <TableCell align="right">{item[1]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ))
        : null}
    </div>
  )
}
```

### 作ったものをまとめる

UserStringTable ができたのでそれを使って、読み込んだファイルの UserString が表示されるようにします。

追加した事項は以下です。

- 読み込んだ UserString を扱う Hooks を追加
- onClick で取得した doc を CreateUserStringList に渡す部分を追加
- doc から UserStrings を取得する CreateUserStringList を作成
- return 内に Table を表示するための BasicTable を追加

うまく型の処理ができなかったので、@ts-ignore が多いのはごめんなさい

```ts
function CheckUploadedFile() {
  const [file, setFile] = useState<File>()
  const [userStrings, setUserStrings] = useState<string[]>()

  const onChange = (e: any) => {
    setFile(e.target.files[0])
  }

  const onClick = () => {
    if (file) {
      window.rhino3dm().then(async (Module: RhinoModule) => {
        const buffer: ArrayBuffer = await file.arrayBuffer()
        const arr: Uint8Array = new Uint8Array(buffer)
        // @ts-ignore
        const doc: File3dm = Module.File3dm.fromByteArray(arr)
        console.log(doc)

        CreateUserStringList(doc)
      })
    }
  }

  const CreateUserStringList = (doc: File3dm) => {
    const list: string[] = []

    if (doc) {
      // @ts-ignore
      const objects: File3dmObjectTable = doc.objects()

      for (let i = 0; i < objects.count; i++) {
        // @ts-ignore
        const obj = objects.get(i)
        // @ts-ignore
        list.push(obj.attributes().getUserStrings())
      }
    }

    setUserStrings(list)
  }

  return (
    <div>
      <h3>Check Uploaded File</h3>
      <input type="file" onChange={onChange} />
      <Button variant="outlined" onClick={onClick}>
        Check
      </Button>
      <BasicTable data={userStrings} />
    </div>
  )
}
```

## Build して Deploy する

完成したページをデプロイしましょう。
ここでは GitHub Pages を使う場合の例をあげます。手順は以下です。

1. package.json に `"homepage": "."` を追加
1. ターミナルで `npm run build` を実行する
1. ページが build フォルダに作成される
1. フォルダ名を docs に変えて、ルートディレクトリに移動する
1. GitHub にプッシュする
1. GitHub Pages の設定から Source を今プッシュしたブランチの docs にする
1. リポジトリのトップページの Environments を見ると作成したページのリンクがあるのでそこへ飛ぶ

問題なくビルドされていれば以下のようなページが公開されます。

- [Rhino3dm.js Intro Page](https://hiron.dev/Introduction-Rhino3dmjs/)

## まとめ

React と mui を使った簡単な UI を作って Rhino3dm を扱えるようにしました。
モデルの可視化などは Threejs を使うとできたりするので、興味がある方はやってみてください。
