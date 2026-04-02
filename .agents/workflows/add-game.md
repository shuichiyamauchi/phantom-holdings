---
description: ゲームポータル（upB systems）に新しいゲーム/アプリを追加する手順
---

# ゲーム追加ワークフロー

ユーザーから新しいゲームを追加する指示があった場合、以下の手順で作業する。

## 必要な情報

ユーザーから以下の情報を収集する（不明な場合はプロジェクトディレクトリを調査して推定する）：

- **id**: プロジェクトのディレクトリ名（例: `cipher-flash`）
- **title**: ゲームタイトル（例: `CipherFlash`）
- **subtitle**: サブタイトル（例: `シャッフルモールス暗号ライト`）
- **description**: 説明文（日本語、1〜2文）
- **tags**: タグ配列（例: `["ツール", "暗号", "モールス信号"]`）
- **url**: デプロイ先URL（例: `https://cipher-flash.pages.dev`）
- **color**: テーマカラー（16進数、例: `#10B981`）
- **releaseDate**: リリース日（`YYYY-MM-DD`形式）
- **status**: `released` / `dev` / `coming`

## 手順

### 1. games.json にエントリを追加

ファイル: `/Users/shuichiyamauchi/Documents/030_work/antigravity/phantom-holdings/src/games.json`

既存の配列の末尾に新しいオブジェクトを追加する：

```json
{
  "id": "新しいID",
  "title": "タイトル",
  "subtitle": "サブタイトル",
  "description": "説明文",
  "tags": ["タグ1", "タグ2"],
  "url": "https://example.com",
  "thumbnail": "/thumbnails/新しいID.webp",
  "color": "#カラーコード",
  "releaseDate": "YYYY-MM-DD",
  "status": "released"
}
```

### 2. サムネイル画像を生成

`generate_image` ツールを使って、ゲームのスクリーンショット風のサムネイル画像を生成する。

- 生成後、以下のディレクトリにコピーする：
  `/Users/shuichiyamauchi/Documents/030_work/antigravity/phantom-holdings/public/thumbnails/新しいID.webp`

もしゲームが既にデプロイ済みで、ブラウザでスクリーンショットを取得できる場合は、`browser_subagent` を使ってスクリーンショットを撮影し、それをサムネイルとして使用する方がよい。

### 3. 動作確認

// turbo
開発サーバーを起動して確認する（既に起動中なら不要）：
```bash
npm run dev -- --port 5174
```

`browser_subagent` でゲーム一覧セクションを確認し、新しいカードが正しく表示されていることを確認する。

### 4. ビルド確認

// turbo
```bash
npm run build
```

ビルドが成功することを確認する。

## 指示テンプレート（ユーザー向け）

以下のようなシンプルな指示でゲームを追加できる：

```
ゲームポータルに以下のゲームを追加してください：
- プロジェクト: cipher-flash
- タイトル: CipherFlash
- サブタイトル: シャッフルモールス暗号ライト
- 説明: カスタムモールス符号でスマホのライトを点滅させ、秘密のメッセージを送信するアプリ
- タグ: ツール, 暗号, モールス信号
- URL: https://cipher-flash.pages.dev
- テーマカラー: #10B981
- 状態: released
```

さらにシンプルに、以下でも対応可能：

```
ゲームポータルに cipher-flash を追加して。URL は https://cipher-flash.pages.dev
```

この場合、プロジェクトディレクトリを調査して情報を自動補完する。
