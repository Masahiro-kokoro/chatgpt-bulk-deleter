# コントリビューションガイド

Bulk Chat & Memory Deleter for chatgpt.com へのコントリビューションを歓迎します！

---

## 🤝 貢献方法

### 1. バグ報告
- GitHubのIssueで報告してください
- 以下の情報を含めてください：
  - Chromeのバージョン
  - 拡張機能のバージョン
  - 再現手順
  - 期待される動作
  - 実際の動作
  - スクリーンショット（任意）
- **会話内容やメモリ本文は含めないでください**

### 2. 機能要望
- GitHubのIssueで提案してください
- 以下の情報を含めてください：
  - 機能の概要
  - 使用例
  - この機能が必要な理由

### 3. コードのコントリビューション
以下のセクションを参照してください。

---

## 💻 開発環境のセットアップ

### 前提条件
- Node.js 18.x 以上
- npm 9.x 以上
- Git

### セットアップ手順
```bash
# リポジトリをフォーク後、クローン
git clone https://github.com/[your-username]/bulk-chat-memory-deleter.git
cd bulk-chat-memory-deleter

# 依存関係をインストール
npm install

# 開発モードで起動
npm run dev
```

---

## 🔧 開発ガイドライン

### コーディング規約

#### TypeScript
- 厳格な型チェックを有効にする（`tsconfig.json` の `strict: true`）
- `any` 型は使用しない（やむを得ない場合のみ `unknown` を使用）
- 関数には必ず型注釈を付ける

#### 命名規則
- クラス名: PascalCase（例: `ChatHistoryManager`）
- 関数名: camelCase（例: `deleteItem`）
- 定数: UPPER_SNAKE_CASE（例: `STORAGE_KEY`）
- CSS クラス名: kebab-case + プレフィックス（例: `bulk-deleter-checkbox`）

#### コメント
- 複雑なロジックには日本語または英語でコメントを付ける
- 関数の先頭にはJSDocコメントを付ける

```typescript
/**
 * 単一項目を削除
 * @param item 削除対象の要素
 * @returns 削除に成功したら true
 */
private async deleteItem(item: HTMLElement): Promise<boolean> {
  // ...
}
```

### セキュリティ要件（絶対遵守）

1. **外部通信禁止**
   - `fetch`, `XMLHttpRequest`, `WebSocket` は使用しない
   - 外部APIへのアクセスは一切禁止

2. **データ収集禁止**
   - 会話内容、メモリ本文、ユーザー情報を保存しない
   - `chrome.storage` には設定値のみ保存

3. **ログ最小化**
   - `console.log` で会話内容やDOM全体を出力しない
   - エラーログは `error.message` のみに限定

4. **外部リソース禁止**
   - CDN、外部フォント、外部画像は使用しない
   - すべてのリソースをパッケージ内に同梱

5. **権限最小化**
   - `manifest.json` の `permissions` は最小限に
   - 新しい権限を追加する場合は必ず理由を説明

### UI/UX要件

1. **選択モードOFF時**
   - UI変更は一切しない（トグルボタンのみ表示）

2. **誤削除防止**
   - 削除前に必ず確認ダイアログを表示
   - 警告文（「この操作は取り消せません」）を明示

3. **中断可能**
   - 削除中はいつでも中断できる

4. **進捗表示**
   - 削除中は現在の進捗を表示（例: 「3 / 12」）

---

## 🧪 テスト

### 手動テスト
プルリクエスト前に、[TESTING.md](./TESTING.md) のすべてのテストを実施してください。

### 型チェック
```bash
npm run type-check
```

エラーがゼロであることを確認してください。

---

## 📝 プルリクエストの手順

### 1. ブランチを作成
```bash
git checkout -b feature/your-feature-name
```

または

```bash
git checkout -b fix/your-bug-fix
```

### 2. コミット
- コミットメッセージは明確に書く
- 1コミット = 1つの変更

```bash
git commit -m "feat: 選択モードの永続化機能を追加"
```

コミットメッセージのプレフィックス：
- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント更新
- `style:` コードスタイル修正（機能変更なし）
- `refactor:` リファクタリング
- `test:` テスト追加
- `chore:` ビルド設定等

### 3. プッシュ
```bash
git push origin feature/your-feature-name
```

### 4. プルリクエストを作成
- GitHubでプルリクエストを作成
- 以下の情報を含める：
  - 変更内容の概要
  - 変更理由
  - テスト結果
  - スクリーンショット（UIに変更がある場合）

### 5. レビュー対応
- レビュアーのフィードバックに対応
- 必要に応じて修正をコミット

---

## 🚫 禁止事項

以下の変更は受け入れられません：

1. **セキュリティ・プライバシー違反**
   - 外部通信の追加
   - ユーザーデータの収集・保存
   - 不要な権限の追加

2. **スコープ外の機能**
   - バックアップ・エクスポート機能
   - 復元・アンドゥ機能
   - ChatGPT以外のサイトへの対応
   - ChatGPTの非公開APIの使用

3. **コード品質低下**
   - 型安全性の低下（`any` の多用）
   - エラーハンドリングの欠如
   - パフォーマンスの大幅な低下

4. **ライセンス違反**
   - MITライセンスと互換性のないコードの追加
   - 他者の著作権侵害

---

## 🐛 バグ修正の優先度

### 🔥 緊急（即座に対応）
- セキュリティ脆弱性
- データ損失のバグ
- 拡張機能が全く動作しない

### ⚠️ 高優先度（1週間以内）
- 重要な機能が動作しない
- 頻繁に発生するエラー

### 📌 中優先度（1ヶ月以内）
- 一部の機能が動作しない
- UIの不具合

### 📝 低優先度
- 軽微な表示の問題
- パフォーマンスの改善

---

## 📚 参考資料

### Chrome拡張の開発
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Vite
- [Vite Documentation](https://vitejs.dev/)

---

## 💬 質問・相談

- **GitHub Discussions**: 一般的な質問や相談
- **GitHub Issues**: バグ報告や機能要望
- **Googleフォーム**: 匿名のフィードバック

---

## 📜 ライセンス

このプロジェクトにコントリビュートすることで、あなたの貢献がMITライセンスの下でライセンスされることに同意したものとみなされます。

詳細は [LICENSE](./LICENSE) を参照してください。

---

ありがとうございます！🎉
