# v1.1.0 - Performance Improvements

## 🚀 v1.1.0 - パフォーマンス大幅改善

### ✨ 新機能

- **全チャット履歴の自動取得**: 28件以上のチャット履歴も自動で全て読み込み
- **並列削除**: 最大10件同時削除による高速化
- **並列ロード**: チャット履歴の読み込みが最大7倍高速化

### ⚡ パフォーマンス改善

**削除速度の劇的改善**:
- 10件削除: 70秒 → **4秒** (17倍高速化)
- 100件削除: 700秒 → **40秒** (17倍高速化)
- 複数削除時は1件あたり実質0.4秒

**ロード速度の大幅改善**:
- チャット履歴: 7秒以上 → **1-2秒** (最大7倍高速化)
- 並列APIリクエストによる効率化
- limit値の最適化（28件 → 100件/リクエスト）

### 🔧 技術的改善

- Promise.all()を使用した並列処理の実装
- バッチ処理アルゴリズムの導入
  - 5ページずつ並列取得
  - 10件ずつ並列削除
- レート制限回避のための最適化

---

## 📦 インストール方法

### Chrome拡張機能として手動インストール

1. [リリースページ](https://github.com/Masahiro-kokoro/chatgpt-bulk-deleter/releases/tag/v1.1.0)から `chatgpt-bulk-deleter-v1.1.0.zip` をダウンロード
2. ファイルを解凍
3. Chrome で `chrome://extensions/` を開く
4. 「デベロッパーモード」をONにする
5. 「パッケージ化されていない拡張機能を読み込む」をクリック
6. 解凍した `dist` フォルダを選択

### ソースからビルド

```bash
git clone https://github.com/Masahiro-kokoro/chatgpt-bulk-deleter.git
cd chatgpt-bulk-deleter
git checkout v1.1.0
npm install
npm run build
# chrome://extensions/ で dist フォルダを読み込む
```

---

## ⚠️ 重要な注意事項

- **削除は不可逆です**: 削除したデータは復元できません
- **バックアップなし**: エクスポート機能はありません
- **複数アカウント使用時**: 正しいアカウントのタブがアクティブであることを確認してください

---

## 📝 完全な変更履歴

詳細は [CHANGELOG.md](https://github.com/Masahiro-kokoro/chatgpt-bulk-deleter/blob/main/CHANGELOG.md) をご覧ください。

---

## 🔗 リンク

- [GitHub Repository](https://github.com/Masahiro-kokoro/chatgpt-bulk-deleter)
- [Issues](https://github.com/Masahiro-kokoro/chatgpt-bulk-deleter/issues)
- [README](https://github.com/Masahiro-kokoro/chatgpt-bulk-deleter/blob/main/README.md)
