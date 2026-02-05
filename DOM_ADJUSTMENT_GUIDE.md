# DOM変更時の調整ガイド（詳細版）

ChatGPTのUIが更新され、セレクタが変更された場合の対応方法を詳しく解説します。

---

## 🔍 問題の診断方法

### ステップ1: 現象を確認

以下のような問題が発生していますか？

- [ ] トグルボタンが表示されない
- [ ] チェックボックスが表示されない
- [ ] 削除ボタンをクリックしても反応がない
- [ ] 削除が実行されない

### ステップ2: DevToolsで確認

1. chatgpt.com を開く
2. F12キーでDevToolsを開く
3. **Console タブ**を確認

以下のようなログが出ていますか？

```
[ChatHistory] Sidebar not found
[ChatHistory] No chat items found
[ChatHistory] Menu button not found
[ChatHistory] Delete button not found
[Memory] Container not found for info box
[Memory] No memory items found
```

これらのログは、セレクタが古くなっている可能性を示しています。

### ステップ3: DOM構造を確認

**Elements タブ**で該当する要素を探します。

---

## 🛠️ 修正手順

### 📁 修正対象ファイル

| 問題 | ファイル | メソッド |
|------|---------|---------|
| トグルボタンが表示されない | `chat-history-manager.ts` | `injectToggleButton()` |
| 会話にチェックボックスが表示されない | `chat-history-manager.ts` | `injectCheckboxes()` |
| 会話の削除が実行されない | `chat-history-manager.ts` | `deleteItem()` |
| メモリの注意文が表示されない | `memory-manager.ts` | `injectInfoBox()` |
| メモリにチェックボックスが表示されない | `memory-manager.ts` | `injectCheckboxes()` |
| メモリの削除が実行されない | `memory-manager.ts` | `deleteItem()` |

---

## 🔧 具体的な修正方法

### 1. トグルボタンが表示されない

#### 原因
左サイドバーのセレクタが変更された。

#### 診断方法
1. DevToolsの **Elements タブ**を開く
2. 左サイドバーの要素を右クリック → 「検証」
3. `nav` タグや親要素の構造を確認

#### 修正箇所
**ファイル**: `src/content/chat-history-manager.ts`

**メソッド**: `injectToggleButton()`

```typescript
// 現在のコード（60行目あたり）
const selectors = [
  'nav[aria-label="Chat history"]',
  'nav.flex.flex-col',
  'aside nav',
  '[data-testid="chat-history-sidebar"]'
];
```

#### 修正方法
1. DevToolsで確認した要素のセレクタを追加
2. 例: `nav` に `data-testid="sidebar"` が追加された場合

```typescript
const selectors = [
  '[data-testid="sidebar"]',           // ← 新しいセレクタを追加
  'nav[aria-label="Chat history"]',
  'nav.flex.flex-col',
  'aside nav',
  '[data-testid="chat-history-sidebar"]'
];
```

---

### 2. 会話にチェックボックスが表示されない

#### 原因
会話項目のセレクタが変更された。

#### 診断方法
1. 左サイドバーの会話項目（1つ）を右クリック → 「検証」
2. 親要素の構造を確認
3. 通常は `nav > ol > li` 構造

#### 修正箇所
**ファイル**: `src/content/chat-history-manager.ts`

**メソッド**: `injectCheckboxes()`

```typescript
// 現在のコード（160行目あたり）
const selectors = [
  'nav ol li',
  '[data-testid="history-item"]',
  'nav.flex.flex-col ol > li',
  'nav li > a'
];
```

#### 修正方法

**パターン1**: `data-testid` が追加された
```typescript
const selectors = [
  '[data-testid="conversation-item"]',  // ← 新しいセレクタを追加
  'nav ol li',
  '[data-testid="history-item"]',
  'nav.flex.flex-col ol > li'
];
```

**パターン2**: クラス名が変更された
```typescript
const selectors = [
  'nav .chat-list-item',  // ← 新しいクラス名を追加
  'nav ol li',
  '[data-testid="history-item"]'
];
```

**パターン3**: 構造が大幅に変更された
```typescript
// 例: div に変更された場合
const selectors = [
  'nav > div > div[role="button"]',  // ← 新しい構造に対応
  'nav ol li',
  '[data-testid="history-item"]'
];
```

---

### 3. 会話の削除が実行されない

#### 原因
削除ボタンのセレクタが変更された。

#### 診断方法
1. 手動で会話の「…」メニューを開く
2. DevToolsで「Delete」ボタンを右クリック → 「検証」
3. `data-testid`, `role`, `aria-label` などを確認

#### 修正箇所
**ファイル**: `src/content/chat-history-manager.ts`

**メソッド**: `deleteItem()`

#### 修正ポイント1: メニューボタン

```typescript
// 現在のコード（440行目あたり）
const menuButton = item.querySelector<HTMLElement>('button[aria-haspopup="menu"]') ||
                  item.querySelector<HTMLElement>('button[data-testid="history-item-menu"]') ||
                  item.querySelector<HTMLElement>('button:last-child');
```

**修正例**: 新しい `data-testid` が追加された場合
```typescript
const menuButton = item.querySelector<HTMLElement>('button[data-testid="conversation-menu"]') ||  // ← 追加
                  item.querySelector<HTMLElement>('button[aria-haspopup="menu"]') ||
                  item.querySelector<HTMLElement>('button[data-testid="history-item-menu"]') ||
                  item.querySelector<HTMLElement>('button:last-child');
```

#### 修正ポイント2: Deleteボタン

```typescript
// 現在のコード（450行目あたり）
const deleteButton = document.querySelector<HTMLElement>('[role="menuitem"][data-testid="delete"]') ||
                    document.querySelector<HTMLElement>('[role="menuitem"]:has(svg)') ||
                    Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]'))
                      .find(el => el.textContent?.toLowerCase().includes('delete'));
```

**修正例**: `data-testid` が変更された場合
```typescript
const deleteButton = document.querySelector<HTMLElement>('[data-testid="delete-conversation"]') ||  // ← 追加
                    document.querySelector<HTMLElement>('[role="menuitem"][data-testid="delete"]') ||
                    document.querySelector<HTMLElement>('[role="menuitem"]:has(svg)') ||
                    Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]'))
                      .find(el => el.textContent?.toLowerCase().includes('delete'));
```

#### 修正ポイント3: 確認ボタン

```typescript
// 現在のコード（460行目あたり）
const confirmButton = document.querySelector<HTMLElement>('button[data-testid="confirm-delete"]') ||
                     Array.from(document.querySelectorAll<HTMLElement>('button'))
                       .find(btn => btn.textContent?.toLowerCase().includes('delete') || 
                                   btn.textContent?.toLowerCase().includes('confirm'));
```

**修正例**: ダイアログの構造が変更された場合
```typescript
const confirmButton = document.querySelector<HTMLElement>('[role="dialog"] button[data-testid="confirm"]') ||  // ← 追加
                     document.querySelector<HTMLElement>('button[data-testid="confirm-delete"]') ||
                     Array.from(document.querySelectorAll<HTMLElement>('button'))
                       .find(btn => btn.textContent?.toLowerCase().includes('delete'));
```

---

### 4. メモリ関連の修正

#### メモリ設定ページが見つからない

**ファイル**: `src/content/memory-manager.ts`

**メソッド**: `injectInfoBox()`

```typescript
// 現在のコード（30行目あたり）
const selectors = [
  '[data-testid="memory-settings"]',
  'main section',
  'main > div > div'
];
```

**修正例**: 新しい構造に対応
```typescript
const selectors = [
  '[data-testid="personalization-memory"]',  // ← 追加
  '[data-testid="memory-settings"]',
  'main section',
  'main > div > div'
];
```

#### メモリ項目が見つからない

**ファイル**: `src/content/memory-manager.ts`

**メソッド**: `injectCheckboxes()`

```typescript
// 現在のコード（70行目あたり）
const selectors = [
  '[data-testid="memory-item"]',
  'main section > div > div',
  'main ul > li',
  'main [role="listitem"]'
];
```

**修正例**: リスト構造が変更された場合
```typescript
const selectors = [
  '[data-testid="memory-entry"]',  // ← 新しいdata-testid
  '[data-testid="memory-item"]',
  'main section > div > div',
  'main [role="listitem"]'
];
```

---

## 🧪 修正後のテスト

### 1. ビルド
```bash
npm run build
```

エラーがないことを確認。

### 2. Chrome で再読み込み
1. `chrome://extensions/` を開く
2. 拡張機能の「更新」ボタンをクリック

### 3. 動作確認
1. chatgpt.com をリロード（F5）
2. トグルボタンが表示されるか確認
3. 選択モードをONにする
4. チェックボックスが表示されるか確認
5. 1件削除してみる
6. 削除が成功するか確認

### 4. DevToolsでログ確認
- `[ChatHistory] ... not found` のエラーが出ていないか確認
- エラーが出ている場合は、該当セレクタをさらに調整

---

## 🔬 高度なデバッグ手法

### セレクタのテスト（Consoleで実行）

#### 要素が見つかるかテスト
```javascript
// サイドバーを探す
document.querySelector('nav[aria-label="Chat history"]');
// → 見つかれば要素が返る、見つからなければ null

// 会話項目を探す
document.querySelectorAll('nav ol li');
// → 見つかれば NodeList が返る、見つからなければ空の NodeList
```

#### 複数セレクタを順番に試す
```javascript
const selectors = [
  'nav[aria-label="Chat history"]',
  'nav.flex.flex-col',
  'aside nav'
];

for (const selector of selectors) {
  const element = document.querySelector(selector);
  if (element) {
    console.log('✅ Found with selector:', selector, element);
    break;
  } else {
    console.log('❌ Not found with selector:', selector);
  }
}
```

#### 要素の属性を確認
```javascript
const item = document.querySelector('nav ol li');
if (item) {
  console.log('Tag:', item.tagName);
  console.log('Classes:', item.className);
  console.log('ID:', item.id);
  console.log('data-testid:', item.getAttribute('data-testid'));
  console.log('role:', item.getAttribute('role'));
  console.log('aria-label:', item.getAttribute('aria-label'));
}
```

---

## 📋 チェックリスト

修正前に確認すること：

- [ ] DevToolsのConsoleでエラーログを確認
- [ ] 該当する要素をDevToolsで検証
- [ ] 新しいセレクタをConsoleでテスト
- [ ] 既存のセレクタ配列に追加（置き換えない）
- [ ] ビルドが成功することを確認
- [ ] 実際にChatGPTで動作確認
- [ ] 他の機能に影響がないことを確認

---

## 🚨 緊急対応

UIが大幅に変更され、すぐに修正できない場合：

### 一時的な対応
1. 拡張機能を一時的に無効化（`chrome://extensions/`）
2. GitHubのIssueで報告
3. 修正版がリリースされるまで待つ

### 自分で修正する場合
1. このガイドに従ってセレクタを調整
2. ローカルでビルドして動作確認
3. 問題なければGitHubでプルリクエストを作成

---

## 📚 参考情報

### よく使うセレクタ
- `[data-testid="XXX"]`: データ属性（最も安定）
- `[role="XXX"]`: ARIA役割（比較的安定）
- `[aria-label="XXX"]`: ラベル（言語によって変わる可能性）
- `nav`, `main`, `aside`: セマンティック要素（安定）
- `.class-name`: クラス名（変更されやすい）
- `#id`: ID（変更されやすい）

### セレクタの優先順位
1. **`data-testid`** - 最も安定
2. **`role` + `aria-label`** - 比較的安定
3. **タグ名 + 構造** - 中程度
4. **クラス名** - 変更されやすい
5. **テキスト一致** - 言語依存、最も不安定

---

以上
