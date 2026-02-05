# プロジェクトサマリー

このドキュメントは、Bulk Chat & Memory Deleter for chatgpt.com の全体像をまとめたものです。

---

## 📋 プロジェクト概要

### 基本情報
- **名称**: Bulk Chat & Memory Deleter for chatgpt.com
- **種類**: Chrome拡張機能（Manifest V3）
- **対象サイト**: https://chatgpt.com/
- **ライセンス**: MIT License
- **非公式ツール**: OpenAI / ChatGPT とは無関係

### 目的
ChatGPTの会話履歴とメモリを一括削除する機能を提供する。

### 設計思想
1. **安全性最優先**: 誤削除を防ぐ確認ダイアログ、中断機能
2. **透明性**: 外部通信なし、データ収集なし、オープンソース
3. **炎上耐性**: 最小権限、復元機能なし（明示）、非公式明記
4. **ユーザーコントロール**: 選択モードOFF時はUI注入なし

---

## 🏗️ アーキテクチャ

### 構成
```
Content Scripts のみ
├─ main.ts (エントリーポイント)
├─ chat-history-manager.ts (会話削除)
├─ memory-manager.ts (メモリ削除)
├─ ui.ts (共通UI部品)
├─ storage.ts (設定保存)
└─ styles.css (スタイル)
```

**background (service worker) は不使用**

### 主要クラス

#### ChatHistoryManager
- 左サイドバーにトグルボタンを注入
- 選択モードON時にチェックボックスと操作バーを表示
- 会話履歴の逐次削除を実行

#### MemoryManager
- メモリ設定ページに注意文を表示
- 選択モードON時にチェックボックスと操作バーを表示
- メモリの逐次削除を実行

#### StorageManager
- chrome.storage.local を使った設定保存
- 保存するデータ: 選択モード状態（boolean）のみ

---

## 🔒 セキュリティ設計

### 権限
- **`storage`**: 選択モード状態の保存のみ
- **`host_permissions: ["https://chatgpt.com/*"]`**: DOM操作のため

### 禁止事項
- ✅ 外部通信なし（fetch/XHR/WebSocket禁止）
- ✅ データ収集なし（会話・メモリ本文は保存しない）
- ✅ ログ最小化（コンテンツ情報は出力しない）
- ✅ 外部リソース不使用（CDN/外部フォント禁止）
- ✅ 分析ツール不使用（テレメトリ禁止）

---

## 📂 ファイル構成

```
Chat History & Memory Deleter for Chat GPT/
├── manifest.json                   # Chrome拡張のマニフェスト
├── package.json                    # npm設定
├── tsconfig.json                   # TypeScript設定
├── vite.config.ts                  # Vite + crxjs設定
├── .gitignore                      # Git除外設定
├── .npmrc                          # npm設定
├── LICENSE                         # MITライセンス
│
├── icons/                          # アイコン画像
│   ├── icon16.png                  # 16x16px
│   ├── icon48.png                  # 48x48px
│   ├── icon128.png                 # 128x128px
│   └── README.md                   # アイコン作成ガイド
│
├── src/                            # ソースコード
│   └── content/                    # Content Scripts
│       ├── main.ts                 # エントリーポイント
│       ├── storage.ts              # 設定保存
│       ├── ui.ts                   # UI部品
│       ├── chat-history-manager.ts # 会話削除機能
│       ├── memory-manager.ts       # メモリ削除機能
│       └── styles.css              # スタイル
│
├── dist/                           # ビルド出力（自動生成）
│
├── README.md                       # プロジェクト概要
├── INSTALLATION.md                 # インストール手順
├── TESTING.md                      # テストガイド
├── CONTRIBUTING.md                 # コントリビューションガイド
├── PRIVACY_POLICY.md               # プライバシーポリシー
├── CHROME_WEB_STORE.md             # ストア申請用資料
├── DOM_ADJUSTMENT_GUIDE.md         # DOM変更時の調整ガイド
└── PROJECT_SUMMARY.md              # このファイル
```

---

## 🚀 開発フロー

### 初回セットアップ
```bash
npm install
npm run build
# chrome://extensions/ でdistフォルダを読み込む
```

### 開発時
```bash
npm run dev
# ファイル変更 → Chromeで拡張機能を更新 → ページリロード
```

### 本番ビルド
```bash
npm run build
# distフォルダをZIP化してChrome Web Storeに提出
```

---

## 🎯 主要機能

### 1. 選択モードのトグル
- デフォルト: OFF
- トグルボタンで ON/OFF 切り替え
- 状態は chrome.storage に保存

### 2. 会話履歴の一括削除
- 左サイドバーにチェックボックスを表示
- 全選択 / 全解除
- 選択件数表示
- 確認ダイアログ（取り消せない旨を明示）
- 逐次削除（300〜500msのランダムディレイ）
- 進捗表示（3 / 12 など）
- 中断機能
- 完了通知（成功数/失敗数）

### 3. メモリの一括削除
- メモリ設定ページに注意文を表示
- チェックボックスで選択
- 会話履歴と同様の削除フロー

### 4. 誤削除防止
- 二段階確認（選択 → 確認ダイアログ）
- 警告文の明示（「この操作は取り消せません」）
- いつでも中断可能

---

## 📊 技術仕様

### 技術スタック
- **TypeScript 5.3+**: 型安全な開発
- **Vite 5.0+**: 高速ビルド
- **@crxjs/vite-plugin**: Chrome拡張のビルド自動化
- **Vanilla JS + CSS**: 軽量、依存関係なし

### ブラウザ要件
- Google Chrome 最新版
- Manifest V3 対応ブラウザ

### Node.js要件
- Node.js 18.0.0 以上
- npm 9.0.0 以上

---

## 🔄 削除の仕組み

### 削除フロー
1. ユーザーがチェックボックスで選択
2. 「削除」ボタンをクリック
3. 確認ダイアログで件数と警告を表示
4. 「削除する」をクリック
5. 逐次削除開始
   - 各項目のメニューボタン（…）をクリック
   - Deleteボタンをクリック
   - 確認ボタンをクリック
   - 300〜500msのランダムディレイ
   - 次の項目へ
6. 完了通知

### 削除の特徴
- **人間と同じ操作**: UIクリックによる削除
- **逐次処理**: 並列削除は行わない（安全性優先）
- **ランダムディレイ**: ボット検知回避
- **中断可能**: いつでも停止できる
- **進捗表示**: 現在の進行状況を表示

---

## 🧩 DOM操作の戦略

### セレクタの優先順位
1. `data-testid` - 最も安定
2. `role` + `aria-label` - 比較的安定
3. タグ名 + 構造 - 中程度
4. クラス名 - 変更されやすい
5. テキスト一致 - 最も不安定（最終手段）

### 複数セレクタのフォールバック
各要素の検索には複数のセレクタを用意し、順番に試行。

```typescript
const selectors = [
  'nav[aria-label="Chat history"]',  // 第一候補
  'nav.flex.flex-col',                // 第二候補
  'aside nav',                        // 第三候補
  '[data-testid="chat-history-sidebar"]' // 第四候補
];

let sidebar: HTMLElement | null = null;
for (const selector of selectors) {
  sidebar = document.querySelector(selector);
  if (sidebar) break;
}
```

### SPA対応
- `popstate` イベントでURL変化を検知
- `pushState` / `replaceState` をオーバーライド
- URL変化時に再初期化

---

## 📈 パフォーマンス

### MutationObserver の最適化
- 選択モード時のみ有効化
- 削除中は監視を一時停止
- CPU負荷を最小限に抑える

### メモリ使用量
- 目標: 10MB以下
- Content Scriptsのみ（background不使用）で軽量化

---

## 🐛 トラブルシューティング

### よくある問題と対処法

| 問題 | 原因 | 対処法 |
|------|------|--------|
| トグルボタンが表示されない | サイドバーのセレクタ変更 | `chat-history-manager.ts` の `injectToggleButton()` を修正 |
| チェックボックスが表示されない | 会話項目のセレクタ変更 | `chat-history-manager.ts` の `injectCheckboxes()` を修正 |
| 削除が実行されない | 削除ボタンのセレクタ変更 | `chat-history-manager.ts` の `deleteItem()` を修正 |
| メモリが見つからない | メモリ設定ページの構造変更 | `memory-manager.ts` のセレクタを修正 |

詳細は [DOM_ADJUSTMENT_GUIDE.md](./DOM_ADJUSTMENT_GUIDE.md) を参照。

---

## 📚 ドキュメント一覧

| ファイル | 内容 |
|---------|------|
| README.md | プロジェクト概要、機能説明、使い方 |
| INSTALLATION.md | インストール手順、開発環境セットアップ |
| TESTING.md | 機能テスト手順、チェックリスト |
| CONTRIBUTING.md | コントリビューションガイド、コーディング規約 |
| PRIVACY_POLICY.md | プライバシーポリシー（GitHub Pages用） |
| CHROME_WEB_STORE.md | Chrome Web Store申請用資料 |
| DOM_ADJUSTMENT_GUIDE.md | DOM変更時の詳細な調整方法 |
| PROJECT_SUMMARY.md | プロジェクト全体のサマリー（このファイル） |

---

## ✅ Chrome Web Store 公開チェックリスト

### コード
- [x] manifest.json が Manifest V3 準拠
- [x] 権限が最小限（storage, chatgpt.com のみ）
- [x] 外部通信なし
- [x] 外部リソース不使用
- [x] ログ最小化
- [x] source map なし（本番ビルド）

### ドキュメント
- [x] Privacy Policy 作成済み
- [x] README に非公式明記
- [x] CHROME_WEB_STORE.md に申請用文書
- [x] LICENSE 作成済み

### アイコン
- [ ] icon16.png, icon48.png, icon128.png を作成
- [ ] OpenAI / ChatGPT のロゴ・配色を避ける
- [ ] 中立的なデザイン

### スクリーンショット
- [ ] 5枚のスクリーンショットを用意
- [ ] 会話内容やメモリ本文を含めない
- [ ] ダミーデータを使用

### サポート
- [ ] Googleフォームを作成
- [ ] README にリンクを記載

### テスト
- [ ] TESTING.md のすべての項目をクリア
- [ ] 複数環境で動作確認

---

## 🎓 学習リソース

### Chrome拡張の開発
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Overview](https://developer.chrome.com/docs/extensions/mv3/intro/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### DOM操作
- [MDN Web Docs - DOM](https://developer.mozilla.org/ja/docs/Web/API/Document_Object_Model)

### Vite
- [Vite Guide](https://vitejs.dev/guide/)

---

## 🤝 コミュニティ

- **GitHub**: [リポジトリURL]
- **Issues**: バグ報告・機能要望
- **Discussions**: 一般的な質問・相談
- **Googleフォーム**: 匿名フィードバック

---

## 📅 ロードマップ

### v1.0.0（初回リリース）
- [x] 会話履歴の一括削除
- [x] メモリの一括削除
- [x] 選択モードのトグル
- [x] 確認ダイアログ
- [x] 進捗表示
- [x] 中断機能

### 今後の検討事項（慎重に判断）
- フィルタ機能（日付範囲、キーワード等）
- ソート機能
- パフォーマンス改善

### 実装しない機能（スコープ外）
- ❌ バックアップ・エクスポート
- ❌ 復元・アンドゥ
- ❌ ChatGPT以外のサイト対応
- ❌ 非公開APIの使用

---

以上
