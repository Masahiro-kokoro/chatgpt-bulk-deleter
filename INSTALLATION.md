# インストールガイド

このドキュメントでは、Bulk Chat & Memory Deleter for chatgpt.com のインストール方法を説明します。

---

## 📦 方法1: Chrome Web Storeからインストール（公開後）

1. [Chrome Web Store]（リンク）にアクセス
2. 「Chromeに追加」ボタンをクリック
3. 権限の確認ダイアログで「拡張機能を追加」をクリック
4. インストール完了！

---

## 🛠️ 方法2: ローカルビルド（開発者向け）

### 前提条件
- Node.js 18.x 以上
- npm 9.x 以上
- Google Chrome 最新版

### 手順

#### 1. リポジトリをクローン
```bash
git clone https://github.com/[username]/bulk-chat-memory-deleter.git
cd bulk-chat-memory-deleter
```

または、ZIPファイルをダウンロードして解凍。

#### 2. 依存関係をインストール
```bash
npm install
```

#### 3. ビルド
```bash
npm run build
```

`dist` フォルダに拡張機能のファイルが生成されます。

#### 4. Chromeに拡張機能を読み込む

1. Chromeを開く
2. アドレスバーに `chrome://extensions/` と入力してEnter
3. 右上の「デベロッパーモード」をONにする
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. `dist` フォルダを選択
6. 読み込み完了！

#### 5. 動作確認

1. https://chatgpt.com/ を開いてログイン
2. Chromeツールバーの拡張機能アイコン（🗑️）をクリック
3. ポップアップが開き、チャット履歴が表示されることを確認
4. 「メモリ」タブをクリックして、メモリが表示されることを確認

---

## 🔄 開発モード（ファイル変更を自動反映）

### 1. 開発サーバーを起動
```bash
npm run dev
```

Viteの開発サーバーが起動し、ファイル変更を監視します。

### 2. Chromeで拡張機能を読み込む
上記「方法2」の手順4と同じ。

### 3. ファイルを変更
TypeScriptファイルやCSSファイルを編集すると、自動的に再ビルドされます。

### 4. Chromeで更新
`chrome://extensions/` で拡張機能の「更新」ボタンをクリック（または、拡張機能を再読み込み）。

### 5. ページをリロード
chatgpt.com のタブをリロード（F5）して変更を確認。

---

## 🐛 トラブルシューティング

### インストール時のエラー

#### `npm install` が失敗する
- Node.jsのバージョンを確認: `node -v`（18.x以上が必要）
- npmのキャッシュをクリア: `npm cache clean --force`
- node_modules を削除して再インストール: `rm -rf node_modules && npm install`

#### `npm run build` が失敗する
- TypeScriptのエラーを確認: `npm run build` の出力を読む
- `src/` 配下のファイルに構文エラーがないか確認

### Chrome拡張のエラー

#### 「パッケージが無効です」
- manifest.json にエラーがないか確認
- `dist` フォルダに manifest.json が存在するか確認

#### 「権限が必要です」
- manifest.json の `permissions` と `host_permissions` を確認
- Chromeで拡張機能を再読み込み

#### 拡張機能が動作しない
1. `chrome://extensions/` で拡張機能が有効になっているか確認
2. エラーが表示されていないか確認（「エラー」ボタンをクリック）
3. chatgpt.com をリロード（F5）
4. DevToolsのConsoleでエラーを確認

---

## 🔍 動作確認

### 会話履歴の削除機能
1. https://chatgpt.com/ を開く
2. 左サイドバーに「一括削除モード」ボタンが表示されるか確認
3. ボタンをクリックしてONにする
4. 各会話にチェックボックスが表示されるか確認
5. チェックボックスを選択
6. 「削除」ボタンが有効になるか確認
7. 「削除」をクリック
8. 確認ダイアログが表示されるか確認
9. 「削除する」をクリック
10. 削除が実行されるか確認（進捗表示が出る）
11. 完了後にトースト通知が表示されるか確認

### メモリの削除機能
1. https://chatgpt.com/ を開く
2. 設定（Settings）> パーソナライズ（Personalization）> メモリ（Memory）に移動
3. 注意文（「メモリはチャット履歴とは別に...」）が表示されるか確認
4. 左サイドバーの「一括削除モード」をONにする
5. 各メモリにチェックボックスが表示されるか確認
6. 以降は会話履歴と同様の手順

---

## 📊 パフォーマンス確認

### メモリ使用量
1. `chrome://extensions/` を開く
2. 拡張機能の「詳細」をクリック
3. 「メモリ」の値を確認（10MB以下が理想）

### CPU使用量
1. DevToolsを開く（F12）
2. Performance タブで記録開始
3. 選択モードをON/OFFする
4. 記録停止
5. CPU使用率を確認（スパイクがないことを確認）

---

## 🗑️ アンインストール

### Chrome Web Store版
1. `chrome://extensions/` を開く
2. 拡張機能の「削除」をクリック
3. 確認ダイアログで「削除」をクリック

### ローカルビルド版
1. `chrome://extensions/` を開く
2. 拡張機能の「削除」をクリック
3. ローカルの `dist` フォルダは手動で削除

### 保存されたデータの削除
アンインストールすると、chrome.storage に保存された設定（選択モードの状態）も自動的に削除されます。

手動で削除する場合：
1. chatgpt.com を開く
2. DevToolsを開く（F12）
3. Consoleで以下を実行：
```javascript
chrome.storage.local.clear();
```

---

## 📚 関連ドキュメント

- [README.md](./README.md) - 機能概要と使い方
- [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) - プライバシーポリシー
- [CHROME_WEB_STORE.md](./CHROME_WEB_STORE.md) - ストア申請用資料

---

以上
