# Bulk Chat & Memory Deleter for chatgpt.com

**非公式のChrome拡張機能**（Manifest V3）  
ChatGPT（https://chatgpt.com/）の会話履歴とメモリを一括削除します。

**Not affiliated with OpenAI.**

---

## ⚠️ 重要な注意事項

### 削除について
- **この拡張は削除の取り消し（復元）を提供しません**
- **削除は不可逆です。バックアップ・エクスポート機能はありません**
- 削除実行前に必ず確認ダイアログが表示されますが、確認後の復元はできません

### 複数アカウント使用時の注意
- **複数のChatGPTアカウント（個人用とビジネス用など）を同時に開いている場合**:
  - 拡張機能は**アクティブなタブ**（現在見ているタブ）のアカウントを優先します
  - 意図しないアカウントのデータを削除しないよう、使用前に**正しいアカウントのタブがアクティブ**であることを確認してください
  - アカウントを切り替えた場合は、**ページをリロード（F5）**してから拡張機能を使用してください

---

## 🎯 機能

### 1. ポップアップから簡単操作
- ツールバーの拡張機能アイコンをクリックしてポップアップを開く
- チャット履歴とメモリをタブで切り替え
- シンプルで直感的なUI

### 2. 会話履歴の一括削除
- ポップアップでチャット履歴を表示
- **全件取得対応**（28件以上のチャット履歴も自動で全て読み込み）
- 全選択/全解除機能
- 複数選択して一括削除
- **高速並列削除**（最大10件同時削除）
- 削除中の進捗表示

### 3. メモリの一括削除
- ポップアップでメモリを表示
- 全選択/全解除機能
- 複数選択して一括削除
- **高速並列削除**（最大10件同時削除）
- 削除中の進捗表示

### 4. パフォーマンス最適化 ⚡ (v1.1.0)
- **超高速ロード**: チャット履歴の読み込みが最大7倍高速化（並列取得）
- **超高速削除**: 複数削除時は最大17倍高速化（並列削除）
  - 例: 10件削除が70秒 → 4秒
  - 例: 100件削除が700秒 → 40秒

---

## 🔒 プライバシーとセキュリティ

- **外部通信なし**: いかなるデータも外部に送信しません
- **最小権限**: `storage`（設定保存）と `https://chatgpt.com/*` のみ
- **ローカル処理のみ**: 削除はすべてブラウザ内で完結
- **データ保存なし**: 会話内容やメモリ内容は一切保存しません
- **分析なし**: テレメトリ・クラッシュレポート等は一切実装していません

詳細は [Privacy Policy](./PRIVACY_POLICY.md) を参照してください。

---

## 📦 インストール方法

### 開発版（ローカルビルド）

```bash
# 1. リポジトリをクローン
git clone <このリポジトリのURL>
cd "Chat History & Memory Deleter for Chat GPT"

# 2. 依存関係をインストール
npm install

# 3. ビルド
npm run build

# 4. Chromeで拡張機能を読み込む
# - chrome://extensions/ を開く
# - 「デベロッパーモード」をONにする
# - 「パッケージ化されていない拡張機能を読み込む」をクリック
# - `dist` フォルダを選択
```

### Chrome Web Store（公開後）
Chrome Web Storeで "Bulk Chat & Memory Deleter for chatgpt.com" を検索してインストール。

---

## 🛠️ 開発

### 開発モード
```bash
npm run dev
```

Viteの開発サーバーが起動し、ファイル変更を監視します。  
`chrome://extensions/` で「更新」ボタンを押すと変更が反映されます。

### プロダクションビルド
```bash
npm run build
```

`dist` フォルダに本番用ビルドが生成されます。

### 技術スタック
- **TypeScript**: 型安全な開発
- **Vite + @crxjs/vite-plugin**: 高速ビルド
- **Vanilla JS + CSS**: 軽量、外部依存なし
- **Manifest V3**: 最新のChrome拡張仕様

---

## 📖 使い方

### 1. 拡張機能を起動
- Chromeのツールバーにある拡張機能アイコン（🗑️）をクリック
- ポップアップが開きます

### 2. チャット履歴の削除
1. **「チャット履歴」タブ**（デフォルトで開いている）でチャット一覧を確認
2. **「全選択」**ボタンをクリック（または個別にチェック）
3. **「削除」**ボタンをクリック
4. 確認ダイアログで**「OK」**
5. 削除が完了するまで待つ

### 3. メモリの削除
1. **「メモリ」タブ**をクリック
2. メモリ一覧を確認
3. **「全選択」**ボタンをクリック（または個別にチェック）
4. **「削除」**ボタンをクリック
5. 確認ダイアログで**「OK」**
6. 削除が完了するまで待つ

---

## 🧪 トラブルシューティング

### チャット履歴やメモリが表示されない

1. **ChatGPTにログインしているか確認**
   - https://chatgpt.com/ を開いてログイン

2. **ページをリロード（F5）**
   - ChatGPTのページをリロード
   - もう一度ポップアップを開く

3. **拡張機能を再読み込み**
   - `chrome://extensions/` で「更新」ボタンをクリック

### 「Content Scriptと通信できません」エラー

1. **ChatGPTのタブを開いているか確認**
2. **ページをリロード（F5）**
3. **拡張機能を再読み込み**
4. もう一度ポップアップを開く

### 削除が失敗する

1. **ネットワーク接続を確認**
2. **ChatGPTにログインしているか確認**
3. 失敗したアイテムはスキップされ、次に進みます

### デバッグログの確認

**ChatGPTページのコンソール**（F12）で以下のログを確認：

```
[ContentAPI] ✅ Content script loaded and ready
[FetchInterceptor] ✅ Installed
[FetchInterceptor] ✅ Auth token captured
```

**ポップアップのコンソール**（ポップアップを右クリック → 検証）で：

```
🎯 Using active tab: [ID]
📊 Number of conversations: X
```

---

## 🔧 開発者向け情報

### APIエンドポイント

本拡張機能は以下のAPIを使用しています：

```typescript
// チャット履歴取得
GET https://chatgpt.com/backend-api/conversations?offset=0&limit=28

// チャット履歴削除
PATCH https://chatgpt.com/backend-api/conversation/{id}
Body: { is_visible: false }

// メモリ取得
GET https://chatgpt.com/backend-api/memories?exclusive_to_gizmo=false&include_memory_entries=true

// メモリ削除（推測）
POST https://chatgpt.com/ces/v1/m
Body: { id, action: 'delete' }
```

### 必要なヘッダー

```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer [JWT Token]',
  'chatgpt-account-id': '[Account ID]'
}
const selectors = [
  '[data-testid="memory-item"]',  // ← 現在のセレクタ
  'main section > div > div',
  'main ul > li',
  'main [role="listitem"]'
];
```

#### メモリ削除ボタンが見つからない場合
`deleteItem()` メソッド内のセレクタを更新：

```typescript
const deleteButton = item.querySelector<HTMLElement>('button[data-testid="delete-memory"]') ||
                    item.querySelector<HTMLElement>('button[aria-label*="delete" i]') ||
                    item.querySelector<HTMLElement>('button:last-child');
```

---

### 3. URL判定の調整

メモリ設定ページのURL構造が変わった場合：

**ファイル**: `src/content/main.ts`

```typescript
function isMemorySettingsPage(): boolean {
  return location.href.includes('#settings/Personalization') || 
         location.pathname.includes('/settings/personalization');
}
```

**確認方法**:
1. メモリ設定ページに移動
2. アドレスバーのURLを確認
3. 適切なパターンに更新

---

### 4. デバッグのベストプラクティス

1. **DevToolsのConsoleを常時監視**
   - `[ChatHistory]` や `[Memory]` のログを確認
   - `not found` エラーが出ている箇所を特定

2. **Elements タブで構造を確認**
   - 目的の要素を右クリック → 「検証」
   - 親要素も含めて構造を確認

3. **Network タブで動的読み込みを確認**
   - SPAなので、ページ遷移時にコンテンツが非同期で読み込まれる
   - `setTimeout` のディレイ時間を調整する必要がある場合も

4. **段階的にセレクタを追加**
   - 既存のセレクタ配列に新しいパターンを追加
   - 複数の候補を用意することで耐久性が上がる

---

## 📋 フォルダ構成

```
Chat History & Memory Deleter for Chat GPT/
├── manifest.json              # Chrome拡張のマニフェスト
├── package.json               # npm設定
├── tsconfig.json              # TypeScript設定
├── vite.config.ts             # Vite + crxjs設定
├── icons/                     # 拡張機能のアイコン
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── src/
│   └── content/               # Content Scripts
│       ├── main.ts            # エントリーポイント
│       ├── storage.ts         # chrome.storage管理
│       ├── ui.ts              # UI部品（トースト、ダイアログ、進捗）
│       ├── chat-history-manager.ts   # 会話履歴削除機能
│       ├── memory-manager.ts  # メモリ削除機能
│       └── styles.css         # スタイル
├── dist/                      # ビルド出力（自動生成）
├── README.md
├── PRIVACY_POLICY.md
└── CHROME_WEB_STORE.md        # ストア申請用文書
```

---

## 📜 ライセンス

MIT License

---

## 🤝 サポート

- **バグ報告・機能要望**: [Googleフォーム](https://forms.gle/rCtp75ZrUrTrTnSQ7)（返信保証なし）
- **Issue**: GitHubのIssueタブ

---

## ⚖️ 免責事項

この拡張機能はOpenAIおよびChatGPTとは一切関係ありません。  
使用は自己責任でお願いします。削除したデータの復元はできません。
