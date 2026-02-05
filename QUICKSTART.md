# クイックスタートガイド

このガイドでは、最速で拡張機能を動かす方法を説明します。

---

## 🚀 5分でセットアップ

### 前提条件
- Node.js 18以上がインストール済み
- Google Chrome 最新版

### 手順

#### 1. 依存関係をインストール
ターミナルでプロジェクトフォルダに移動し、以下を実行：

```bash
npm install
```

#### 2. ビルド
```bash
npm run build
```

`dist` フォルダが生成されます。

#### 3. Chromeに読み込む
1. Chromeを開く
2. アドレスバーに `chrome://extensions/` と入力してEnter
3. 右上の「デベロッパーモード」をONにする
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. `dist` フォルダを選択
6. 完了！

#### 4. 動作確認
1. https://chatgpt.com/ を開いてログイン
2. Chromeツールバーの拡張機能アイコン（🗑️）をクリック
3. ポップアップが開き、チャット履歴が表示されることを確認
4. 「メモリ」タブでメモリが表示されることを確認

---

## 🐛 動かない場合

### よくある問題

#### `npm install` が失敗する
```bash
# Node.jsのバージョン確認（18以上が必要）
node -v

# npmのバージョン確認（9以上が必要）
npm -v

# バージョンが古い場合はNode.jsをアップデート
```

#### `npm run build` が失敗する
- エラーメッセージを読む
- TypeScriptのエラーがある場合は、該当ファイルを確認

#### Chromeで読み込めない
- `dist` フォルダが存在するか確認
- `dist/manifest.json` が存在するか確認

#### 拡張機能が動作しない
1. `chrome://extensions/` で拡張機能が有効になっているか確認
2. chatgpt.com をリロード（F5）
3. DevTools（F12）のConsoleでエラーを確認

---

## 🔄 開発モード

ファイルを変更しながら開発する場合：

```bash
# 開発モードで起動（ファイル変更を自動検知）
npm run dev
```

ファイルを変更したら：
1. `chrome://extensions/` で拡張機能の「更新」ボタンをクリック
2. chatgpt.com をリロード（F5）

---

## 📚 次に読むべきドキュメント

- **使い方を知りたい**: [README.md](./README.md)
- **詳しくインストールしたい**: [INSTALLATION.md](./INSTALLATION.md)
- **テストしたい**: [TESTING.md](./TESTING.md)
- **コードを修正したい**: [CONTRIBUTING.md](./CONTRIBUTING.md)
- **DOMが変わった**: [DOM_ADJUSTMENT_GUIDE.md](./DOM_ADJUSTMENT_GUIDE.md)

---

## ❓ よくある質問

### Q. アイコンが表示されない
A. `icons/` フォルダにアイコン画像を配置してください。詳細は `icons/README.md` を参照。

### Q. 会話が削除されない
A. ChatGPTのUIが変更された可能性があります。[DOM_ADJUSTMENT_GUIDE.md](./DOM_ADJUSTMENT_GUIDE.md) を参照してセレクタを修正してください。

### Q. Chrome Web Storeに公開できますか？
A. はい。[CHROME_WEB_STORE.md](./CHROME_WEB_STORE.md) に申請用の資料があります。

### Q. プライバシーは大丈夫？
A. この拡張は外部通信を一切行わず、会話内容も保存しません。詳細は [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) を参照してください。

---

以上！
