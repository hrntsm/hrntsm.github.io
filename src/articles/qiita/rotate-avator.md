---
title: "SteamVR Plugin v2.5を使ってアバターを移動回転させる"
date: "2020-03-17"
draft: false
path: "/articles/rotate-avator"
article-tags: ["Unity", "VR", "SteamVR", "Qiita"]
---

## はじめに

以下の参考記事をもとに VRM アバターを平行移動および回転させることができたので、そのメモです。

# 参考にした記事

1. [UniVRM+SteamVR+Final IK で始める VTuber](https://qiita.com/sh_akira/items/81fca69d6f34a42d261c)
2. [SteamVR Plugin 2.0 で単純なスライド移動を実装する](https://qiita.com/r6u5ei/items/563340930a4de5588e42)
3. [SteamVR Unity Plugin v2.2.0 でのインプット](https://qiita.com/sakano/items/d87a9b11c23a9bbe166f#%E3%83%8F%E3%83%B3%E3%83%89%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%A9%E3%81%AE%E5%85%A5%E5%8A%9B%E3%82%92%E6%89%B1%E3%81%86%E6%96%B9%E6%B3%95)

# 方針

1. 右手のタッチパッドで平行移動
2. 左手のタッチパッドで回転
3. 移動・回転の基準はアバター
4. VIVE のタッチパットは触れているだけでも値を出力するがそれだと指が触れただけで動いてしまうので、クリックも必要とする

# 実装

## Unity 側

SteamVR の plugin を読み込んで、参考の 2 をもとに SteamVR Input の設定(position に tpad を設定)をしてたり、Unity のヒエラルキーに参考の 1 をもとにアバターを配置したり SteamVR の[CameraRig]を配置したりしておきます。

[CameraRig]には以下で作成する PlayMover をアタッチしています。中身は下で説明しますが、動かしたい操作対象のアバターを Avatar に入れておきます。

![unity設定.png](https://hiron.dev/image/qiita/rotate-avator.png)

## C#Script 側

[CameraRig]にアタッチした PlayMover について以下で設定していきます。

まず SteamVR のインプットを取得する必要があるので、そのための変数を作ります。

```CS
SteamVR_Input_Sources _srcRight = SteamVR_Input_Sources.RightHand; //SteamVR_Input_Sources.RightHandで右手のinput
SteamVR_Input_Sources _srcLeft = SteamVR_Input_Sources.LeftHand; // .LeftHandで左手のinput
// .any にすれば両手どちらからでもOKになる
```

次に取得したインプットをそれぞれに割り当てていきます。以下では例として右手の場合。Teleport がここではタッチパッドをクリックの有無の Boolean、tpad がタッチパッド上での xy 平面のどこにいるかの Vector2 になります。

```CS
void Start()
{
    _actionBoolean = SteamVR_Actions._default.Teleport;
    _actionVector2 = SteamVR_Actions._default.tpad;
}

void Update()
{
    _clickRight = _actionBoolean.GetState(_srcRight);
    _tpadRightX = _actionVector2.GetAxis(_srcRight).x;
    _tpadRightY = _actionVector2.GetAxis(_srcRight).y;
}
```

取得した値をアバターのトランスフォームに適用します。例えば正面に進む場合は以下です。

if でクリックされていてかつ、タッチパッドの前方をおしている場合を条件としています。

if の中では、対象としているアバターの正面のベクトルを取得するために _avatarObject.transform.forward を使用しています。アバターの移動に際してフレーム間でばらつきが出ないように deltaTime をそれにかけて、それに移動速度をかけています。

```CS
if (_clickRight && _tpadRightY > 0 && _tpadRightX < 0.5f && _tpadRightX > -0.5f) {
    transform.position += _avatarObject.transform.forward * Time.deltaTime * _moveSpeed;
}
```

回転は以下のようになります。この C#スクリプトが[CameraRig]にアタッチしているので、上の平行移動と異なり[CameraRig]の transform の rotate にそのまま適用してしまうと[CameraRig]を中心に回転してしまい、アバター中心に回転しないため、RotateAround を使用してアバターの位置を中心として[CameraRig]が回転するようにしています。

```CS
if (_clickLeft && _tpadLeftX < 0 && _tpadLeftY < 0.5f && _tpadLeftY > -0.5f)
{
    transform.RotateAround(_avatarObject.transform.position, transform.up, -Time.deltaTime * _rotateSpeed);
}
```

これで ▶Play すればコントローラーから移動できるようになっていると思います。

SteamVR Plugin については参考の 3 を参照するとより細かく書かれています。

# 完成したコード全体

```CS
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Valve.VR;

public class PlayerMover:MonoBehaviour
{
    // 右手のinput
    SteamVR_Input_Sources _srcRight = SteamVR_Input_Sources.RightHand;
    // 左手のinput
    SteamVR_Input_Sources _srcLeft = SteamVR_Input_Sources.LeftHand;
    // inputの受け取り
    SteamVR_Action_Boolean _actionBoolean;
    SteamVR_Action_Vector2 _actionVector2;

    // 右手の各値
    bool _clickRight;
    float _tpadRightX;
    float _tpadRightY;

    // 左手の各値
    bool _clickLeft;
    float _tpadLeftX;
    float _tpadLeftY;

    [SerializeField]
    float _moveSpeed = 2.0f; // 移動速度
    [SerializeField]
    float _rotateSpeed = 15.0f; // 回転速度
    [SerializeField]
    GameObject _avatar; // 操作の対象のゲームオブジェクト

    void Start()
    {
        // クリックされているかどうかのboolean
        _actionBoolean = SteamVR_Actions._default.Teleport;
        // タッチパッドのどこを触っているかのvector2
        _actionVector2 = SteamVR_Actions._default.tpad;
    }

    void Update()
    {
        // 右手input
        _clickRight = _actionBoolean.GetState(_srcRight);
        _tpadRightX = _actionVector2.GetAxis(_srcRight).x;
        _tpadRightY = _actionVector2.GetAxis(_srcRight).y;

        // 左手input
        _clickLeft = _actionBoolean.GetState(_srcLeft);
        _tpadLeftX = _actionVector2.GetAxis(_srcLeft).x;
        _tpadLeftY = _actionVector2.GetAxis(_srcLeft).y;

        // 右のタッチパッドは移動を割り当て
        // avatarのforworadにすることで、向かっている正面をキーの前ボタンと対応させた。
        if (_clickRight && _tpadRightY > 0 && _tpadRightX < 0.5f && _tpadRightX > -0.5f)
        {
            transform.position += _avatar.transform.forward * Time.deltaTime * _moveSpeed;
        }
        if (_clickRight && _tpadRightY < 0 && _tpadRightX < 0.5f && _tpadRightX > -0.5f)
        {
            transform.position -= _avatar.transform.forward * Time.deltaTime * _moveSpeed;
        }
        if (_clickRight && _tpadRightX < 0 && _tpadRightY < 0.5f && _tpadRightY > -0.5f) 
        {
            transform.position -= _avatar.transform.right * Time.deltaTime * _moveSpeed;
        }
        if (_clickRight && _tpadRightX > 0 && _tpadRightY < 0.5f && _tpadRightY > -0.5f)
        {
            transform.position += _avatar.transform.right * Time.deltaTime * _moveSpeed;
        }

        // 左のタッチパッドは回転を割り当て
        // RotateAroundにavatarを入れることで、avatarを中心に回転するように設定
        if (_clickLeft && _tpadLeftX < 0 && _tpadLeftY < 0.5f && _tpadLeftY > -0.5f)
        {
            transform.RotateAround(_avatar.transform.position, transform.up, -Time.deltaTime * _rotateSpeed);
        }
        if (_clickLeft && _tpadLeftX > 0 && _tpadLeftY < 0.5f && _tpadLeftY > -0.5f)
        {
            transform.RotateAround(_avatar.transform.position, transform.up, Time.deltaTime * _rotateSpeed);
        }
    }
}
```
