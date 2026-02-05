# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-02-04

### 🚀 Added
- **全チャット履歴の自動取得**: 28件以上のチャット履歴も自動で全て読み込み
- **並列削除**: 最大10件同時削除による高速化
- **並列ロード**: チャット履歴の読み込みが最大7倍高速化

### ⚡ Performance
- **削除速度の劇的改善**: 
  - 10件削除: 70秒 → 4秒（17倍高速化）
  - 100件削除: 700秒 → 40秒（17倍高速化）
  - 複数削除時は1件あたり実質0.4秒
- **ロード速度の大幅改善**:
  - チャット履歴: 7秒以上 → 1-2秒（最大7倍高速化）
  - 並列APIリクエストによる効率化
  - limit値の最適化（28件 → 100件）

### 🔧 Technical
- Promise.all()を使用した並列処理の実装
- バッチ処理アルゴリズムの導入（5ページずつ並列取得、10件ずつ並列削除）
- レート制限回避のための最適化

---

## [1.0.0] - 2026-02-03

### 🎉 Initial Release
- ポップアップUIによる直感的な操作
- チャット履歴の一括削除
- メモリの一括削除
- 全選択/全解除機能
- 削除進捗表示
- 複数アカウント対応
- Authorization token自動取得
- Content Security Policy (CSP)準拠
