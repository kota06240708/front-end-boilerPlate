# front-end-boilerplate

## Overview

PUG + Sass + webpack v4 (TypeScript)

- [**Pug**](https://github.com/pugjs/pug)
- [**Sass**](https://sass-lang.com/)
- [**PostCSS**](https://github.com/postcss)
- [**webpack**](https://github.com/webpack/webpack)
  - [TypeScript](https://github.com/microsoft/TypeScript)

## Installing

yarn を使うので下記に従い yarn インストールしてください。

```bash
$ brew install yarn
```

## Building

### 依存モジュールをインストール。

```bash
$ yarn install
```

### 開発開始

```bash
$ yarn start
```

### 本番環境生成

```bash
$ yarn build
```

### 本番環境デバック

```bash
$ yarn browser
```

開発をする際、`yarn start`をして頂き、[http://localhost:8080](http://localhost:8080) にブラウザにアクセスすればデバックできます。

`yarn build`で production フォルダ内に納品ファイルが生成されます。

## Structure

```sh
.
├── @type          # 全体共通の型
├── dist           # 開発ファイルの書出先
├── production     # 本番環境向
├── src            # 実際に手を動かすファイル
└── system         # ビルド環境
```
