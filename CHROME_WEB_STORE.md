# Chrome Web Store 申請用資料

このドキュメントは、Chrome Web Store への申請時に使用する文章・回答をまとめたものです。

---

## 1. 基本情報

### 拡張機能名
```
Bulk Chat & Memory Deleter for chatgpt.com
```

### カテゴリ
```
生産性向上（Productivity）
```

### 言語
```
英語（English）
日本語（Japanese）
```

---

## 2. 説明文

### 短い説明（Short description - 132文字以内）
```
Bulk delete chat history and memories on ChatGPT. Unofficial tool. Select multiple items and delete them at once. Not affiliated with OpenAI.
```

### 詳細説明（Detailed description）

```markdown
# Bulk Chat & Memory Deleter for chatgpt.com

**Unofficial Chrome Extension - Not affiliated with OpenAI**

This extension helps you bulk delete chat history and memories on ChatGPT (https://chatgpt.com/).

## ⚠️ IMPORTANT
- **No restore/undo function**: Deleted items cannot be recovered.
- **No backup/export**: This extension does not backup your data.
- Deletion is irreversible. A confirmation dialog will be shown before deletion.

## ✨ Features

### 1. Bulk Delete Chat History
- Select multiple chat conversations from the sidebar
- Checkboxes for easy selection
- Select all / Deselect all buttons
- Progress indicator during deletion
- Can be stopped at any time

### 2. Bulk Delete Memories
- Select multiple memories from Settings > Personalization > Memory
- Checkboxes for easy selection
- Select all / Deselect all buttons
- Progress indicator during deletion
- Can be stopped at any time

### 3. Selection Mode Toggle
- **Default OFF**: No UI changes after installation
- **When ON**: Checkboxes and action bar are displayed
- Easy toggle with one click

## 🔒 Privacy & Security

- **No external communication**: No data is sent to any server
- **Minimal permissions**: Only `storage` (for settings) and `https://chatgpt.com/*`
- **Local processing only**: All deletions happen in your browser
- **No data collection**: Chat content and memory content are never stored
- **No analytics**: No telemetry, crash reports, or tracking

See our [Privacy Policy] for details.

## 🛠️ How to Use

1. Install the extension
2. Go to https://chatgpt.com/
3. Click the "一括削除モード" (Bulk Delete Mode) toggle button in the sidebar
4. Select items with checkboxes
5. Click "削除" (Delete) button
6. Confirm deletion in the dialog

For memory deletion, go to Settings > Personalization > Memory and follow the same steps.

## 📝 Notes

- This extension uses DOM manipulation only (no private APIs)
- Deletion is performed by simulating human click actions
- A random delay (300-500ms) is added between each deletion
- Memories are stored separately from chat history. Deleting chats does not delete memories.

## 🐛 Troubleshooting

If the extension doesn't work:
1. Make sure Selection Mode is ON
2. Reload the page (F5)
3. Check if ChatGPT's UI has changed (see GitHub for updates)

## 📜 Open Source

This extension is open source. You can review the code on GitHub: [リポジトリURL]

## ⚖️ Disclaimer

This is an unofficial tool. Not affiliated with OpenAI or ChatGPT.
Use at your own risk. Deleted data cannot be recovered.

---

**Support**: [Googleフォーム] (No response guaranteed)
```

---

## 3. Single Purpose（単一目的）の説明

Chrome Web Storeの審査では「拡張機能が単一の目的を持っているか」を確認されます。

### Single Purpose Statement
```
This extension's single purpose is to help users bulk delete chat history and memories on chatgpt.com through a user-friendly selection interface.

The extension provides:
1. A selection mode toggle
2. Checkboxes for multiple selection
3. Bulk deletion with confirmation

All features directly support this single purpose of bulk deletion on ChatGPT.
```

---

## 4. Permissions Justification（権限の正当化）

### `storage`
```
Used to store only one boolean value: the Selection Mode state (ON/OFF).
This allows the extension to remember the user's preference across page reloads.

Data stored:
- Key: "selectionMode"
- Value: true or false

No chat content, memory content, or user data is stored.
```

### `host_permissions: ["https://chatgpt.com/*"]`
```
Required to inject UI elements (checkboxes, buttons, dialogs) into the ChatGPT website and perform deletion operations through DOM manipulation.

The extension:
- Only accesses https://chatgpt.com/*
- Does not access any other websites
- Does not use network requests
- Only manipulates the DOM to add UI and simulate user clicks

No data is sent outside the browser.
```

---

## 5. Privacy Practices（プライバシー慣行）

Chrome Web Store Developer Dashboardの「Privacy practices」セクションでの回答：

### Does your extension collect or transmit user data?
```
❌ NO

This extension does not collect, store, or transmit any user data.

The only data stored locally is a single boolean value (Selection Mode ON/OFF) in chrome.storage.local.
No chat content, memory content, or personally identifiable information (PII) is collected.
```

### Does your extension use or rely on remote code?
```
❌ NO

All code is included in the extension package.
No external scripts, CDNs, or remote resources are loaded.
```

### Does your extension use cookies?
```
❌ NO

This extension does not use cookies.
```

### Privacy Policy URL
```
[GitHub PagesのPrivacy Policy URL]

例: https://[username].github.io/bulk-chat-memory-deleter/privacy-policy.html
```

---

## 6. Privacy Policyとの整合性チェック

| Dashboard質問 | 回答 | Privacy Policyに記載 |
|-------------|-----|---------------------|
| ユーザーデータを収集するか？ | NO | ✅ 「一切収集しません」と明記 |
| リモートコードを使用するか？ | NO | ✅ 「外部リソース不使用」と明記 |
| Cookieを使用するか？ | NO | ✅ 権限一覧に記載なし |
| データを第三者と共有するか？ | NO | ✅ 「いかなるデータも共有しません」と明記 |
| 分析ツールを使用するか？ | NO | ✅ 「分析ツールは使用していません」と明記 |

**結果: すべて整合性あり ✅**

---

## 7. スクリーンショット用画像の準備

Chrome Web Storeには最低1枚のスクリーンショット（1280x800 または 640x400）が必要です。

### 推奨スクリーンショット
1. **選択モードOFF時**: ChatGPTの通常画面（変化なし）
2. **選択モードON時**: チェックボックスと操作バーが表示されている状態
3. **削除確認ダイアログ**: 「この操作は取り消せません」の警告が表示されている
4. **メモリ削除画面**: メモリ管理画面でチェックボックスが表示されている状態
5. **進捗表示**: 削除中の進捗表示（3 / 12など）

### 注意点
- ChatGPTの会話内容やメモリ本文は**絶対に写さない**
- ダミーデータ（"Test Chat 1", "Test Chat 2"など）を使用
- OpenAIのロゴやブランドが目立ちすぎないようにトリミング

---

## 8. サポート窓口

### フィードバックフォーム（Googleフォーム）の設定

#### 質問項目
1. **メールアドレス**（任意）
   - ヘルプテキスト: 「返信を希望する場合のみ入力してください。返信は保証されません。」

2. **問題の種類**（必須・ラジオボタン）
   - バグ報告
   - 機能要望
   - その他

3. **詳細**（必須・長文）
   - ヘルプテキスト: 「できるだけ詳しく説明してください。ChatGPTの会話内容やメモリ内容は含めないでください。」

4. **ブラウザ情報**（任意・短文）
   - ヘルプテキスト: 「例: Chrome 120.0.6099.129」

5. **拡張機能のバージョン**（任意・短文）
   - ヘルプテキスト: 「chrome://extensions/ で確認できます」

#### フォーム設定
- 回答の編集を許可: OFF
- 回答のコピーを送信: OFF
- 匿名での回答を許可: ON

#### 自動返信メッセージ
```
フィードバックをお送りいただきありがとうございます。

このフォームは自動収集のみを行っており、個別の返信は保証されません。
緊急の問題がある場合は、GitHubのIssueをご利用ください。

重要:
- 会話内容やメモリの本文を送信しないでください
- 個人を特定できる情報を送信しないでください

Bulk Chat & Memory Deleter 開発チーム
```

---

## 9. manifest.json の最終確認

審査時に確認されるポイント：

```json
{
  "manifest_version": 3,  // ✅ MV3準拠
  "name": "Bulk Chat & Memory Deleter for chatgpt.com",  // ✅ 明確
  "version": "1.0.0",  // ✅ セマンティックバージョニング
  "description": "...",  // ✅ 単一目的が明確
  "permissions": ["storage"],  // ✅ 最小限
  "host_permissions": ["https://chatgpt.com/*"],  // ✅ 限定的
  "content_scripts": [...],  // ✅ matches が host_permissions と一致
  // ❌ background: なし（不要）
  // ❌ activeTab: なし（不要）
  // ❌ tabs: なし（不要）
  // ❌ webRequest: なし（不要）
}
```

**結果: すべてクリア ✅**

---

## 10. 審査で聞かれる可能性のある質問と回答

### Q1: Why do you need `storage` permission?
```
A: We use chrome.storage.local to store a single boolean value (Selection Mode: ON/OFF) 
to remember the user's preference across page reloads. No user data or chat content is stored.
```

### Q2: Why do you need access to `https://chatgpt.com/*`?
```
A: Our extension adds UI elements (checkboxes, buttons) to the ChatGPT website 
and performs deletion by simulating user clicks. We only access chatgpt.com and 
do not make any network requests.
```

### Q3: Does your extension use any third-party services or APIs?
```
A: No. Our extension does not use any third-party services, APIs, CDNs, or analytics tools. 
All code is self-contained in the extension package.
```

### Q4: How does your extension handle user privacy?
```
A: Our extension does not collect, store, or transmit any user data. 
Chat content and memory content are never accessed or logged. 
We only store a single boolean value locally for the Selection Mode toggle.
```

### Q5: Why is there no backup or export function?
```
A: Our extension's single purpose is bulk deletion, not data management. 
We clearly warn users that deletion is irreversible and show a confirmation dialog 
before any deletion. Users who want backups should use ChatGPT's official export feature.
```

---

## 11. 公開前チェックリスト

- [ ] manifest.json に不要な権限がないことを確認
- [ ] Privacy Policy をGitHub Pagesで公開
- [ ] スクリーンショット5枚を用意（会話内容なし）
- [ ] アイコン画像（16x16, 48x48, 128x128）を用意
- [ ] Googleフォームを作成し、リンクをREADMEに記載
- [ ] ソースコードをGitHubで公開
- [ ] ビルド時に source map が含まれないことを確認（`vite.config.ts` で `sourcemap: false`）
- [ ] console.log に会話内容やメモリ内容が出力されないことを確認
- [ ] 実際にChatGPTで動作テストを実施
- [ ] 「Not affiliated with OpenAI」を manifest description, README, ストア説明に明記

---

## 12. 審査落ちした場合の対応

### よくある理由と対処法

#### 1. 権限が多すぎる
- 不要な権限を削除
- 各権限の必要性を再説明

#### 2. Privacy Policyが不十分
- データ収集の有無を明確に記載
- 各権限の使用目的を詳細に説明

#### 3. 単一目的が不明確
- Single Purpose Statementを明確化
- 不要な機能を削除

#### 4. スクリーンショットに問題
- ユーザーの会話内容が写っている → ダミーデータに差し替え
- OpenAIのブランドが目立ちすぎる → トリミング

#### 5. 外部リソースの使用
- CDNを使用していないか確認
- すべてのファイルをパッケージに同梱

---

以上がChrome Web Store申請用の資料です。
