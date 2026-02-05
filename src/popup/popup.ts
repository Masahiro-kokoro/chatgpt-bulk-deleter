import { apiClient } from './api-client';
import type { Conversation, Memory, AppState } from './types';

// アプリケーション状態
const state: AppState = {
  activeTab: 'chat',
  conversations: [],
  memories: [],
  isLoading: false,
  isDeleting: false,
  deleteProgress: {
    current: 0,
    total: 0,
  },
};

// 選択されたアイテムのID
const selectedIds = new Set<string>();

// DOM要素
const elements = {
  chatTab: document.getElementById('chat-tab')!,
  memoryTab: document.getElementById('memory-tab')!,
  chatList: document.getElementById('chat-list')!,
  memoryList: document.getElementById('memory-list')!,
  loading: document.getElementById('loading')!,
  progress: document.getElementById('progress')!,
  progressText: document.getElementById('progress-text')!,
  selectAllBtn: document.getElementById('select-all')!,
  deselectAllBtn: document.getElementById('deselect-all')!,
  deleteBtn: document.getElementById('delete-btn')! as HTMLButtonElement,
  selectedCount: document.getElementById('selected-count')!,
};

// 初期化
async function init() {
  // 選択状態をクリア（前回の状態を引き継がない）
  selectedIds.clear();
  
  setupEventListeners();
  await loadData();
}

// イベントリスナーの設定
function setupEventListeners() {
  // タブ切り替え
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const tabName = target.dataset.tab as 'chat' | 'memory';
      switchTab(tabName);
    });
  });

  // 全選択/全解除
  elements.selectAllBtn.addEventListener('click', selectAll);
  elements.deselectAllBtn.addEventListener('click', deselectAll);

  // 削除
  elements.deleteBtn.addEventListener('click', handleDelete);
}

// タブ切り替え
async function switchTab(tabName: 'chat' | 'memory') {
  state.activeTab = tabName;
  selectedIds.clear();

  // タブのアクティブ状態を更新
  document.querySelectorAll('.tab').forEach((tab) => {
    const target = tab as HTMLElement;
    if (target.dataset.tab === tabName) {
      target.classList.add('active');
    } else {
      target.classList.remove('active');
    }
  });

  // コンテンツの表示切り替え
  if (tabName === 'chat') {
    elements.chatTab.style.display = 'flex';
    elements.memoryTab.style.display = 'none';
  } else {
    elements.chatTab.style.display = 'none';
    elements.memoryTab.style.display = 'flex';
  }

  // データがまだロードされていない場合は読み込む
  if (tabName === 'memory' && state.memories.length === 0) {
    await loadMemories();
  }

  updateUI();
}

// データの読み込み
async function loadData() {
  await loadConversations();
}

// チャット履歴の読み込み（最大50件のみ）
async function loadConversations() {
  state.isLoading = true;
  showLoading(true);
  updateLoadingText('チャット履歴を読み込み中...');

  try {
    console.log('📡 Fetching conversations (max 50)...');
    
    // 最大50件のみ取得
    const limit = 50;
    const response = await apiClient.getConversations(0, limit, true);
    
    state.conversations = response.items;
    console.log('✅ Conversations loaded:', state.conversations.length);
    
    // 50件以上ある場合は通知
    if (response.total > limit) {
      console.log(`ℹ️ Total: ${response.total} conversations, showing: ${limit}`);
    }
    
    renderConversations();
  } catch (error) {
    console.error('❌ Failed to load conversations:', error);
    alert('チャット履歴の読み込みに失敗しました。\n\nエラー: ' + (error as Error).message);
  } finally {
    state.isLoading = false;
    showLoading(false);
  }
}

// メモリの読み込み
async function loadMemories() {
  state.isLoading = true;
  showLoading(true);
  updateLoadingText('メモリを読み込み中...');

  try {
    console.log('📡 Fetching memories...');
    const response = await apiClient.getMemories();
    state.memories = response.memories;
    console.log('✅ Memories loaded:', state.memories.length);
    renderMemories();
  } catch (error) {
    console.error('❌ Failed to load memories:', error);
    alert('メモリの読み込みに失敗しました。');
  } finally {
    state.isLoading = false;
    showLoading(false);
  }
}

// チャット履歴のレンダリング
function renderConversations() {
  elements.chatList.innerHTML = '';

  if (state.conversations.length === 0) {
    elements.chatList.innerHTML = `
      <div class="empty-state">
        <p>チャット履歴がありません</p>
      </div>
    `;
    return;
  }

  state.conversations.forEach((conv) => {
    const item = createConversationItem(conv);
    elements.chatList.appendChild(item);
  });
}

// メモリのレンダリング
function renderMemories() {
  elements.memoryList.innerHTML = '';

  if (state.memories.length === 0) {
    elements.memoryList.innerHTML = `
      <div class="empty-state">
        <p>メモリがありません</p>
      </div>
    `;
    return;
  }

  state.memories.forEach((memory) => {
    const item = createMemoryItem(memory);
    elements.memoryList.appendChild(item);
  });
}

// チャット履歴アイテムの作成
function createConversationItem(conv: Conversation): HTMLElement {
  const item = document.createElement('div');
  item.className = 'list-item';
  item.dataset.id = conv.id;

  const date = conv.update_time
    ? new Date(conv.update_time * 1000).toLocaleDateString('ja-JP')
    : '';

  item.innerHTML = `
    <input type="checkbox" class="item-checkbox" data-id="${conv.id}">
    <div class="item-content">
      <div class="item-title">${escapeHtml(conv.title)}</div>
      <div class="item-date">${date}</div>
    </div>
  `;

  // チェックボックスのイベント
  const checkbox = item.querySelector('.item-checkbox') as HTMLInputElement;
  checkbox.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      selectedIds.add(conv.id);
    } else {
      selectedIds.delete(conv.id);
    }
    updateUI();
  });

  // アイテム全体のクリックでチェックボックスをトグル
  item.addEventListener('click', (e) => {
    if (e.target !== checkbox) {
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
    }
  });

  return item;
}

// メモリアイテムの作成
function createMemoryItem(memory: Memory): HTMLElement {
  const item = document.createElement('div');
  item.className = 'list-item';
  item.dataset.id = memory.id;

  const shortContent = truncate(memory.content, 100);

  item.innerHTML = `
    <input type="checkbox" class="item-checkbox" data-id="${memory.id}">
    <div class="item-content">
      <div class="item-title">${escapeHtml(shortContent)}</div>
      <div class="item-date">${memory.updated_at}</div>
    </div>
  `;

  // チェックボックスのイベント
  const checkbox = item.querySelector('.item-checkbox') as HTMLInputElement;
  checkbox.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      selectedIds.add(memory.id);
    } else {
      selectedIds.delete(memory.id);
    }
    updateUI();
  });

  // アイテム全体のクリックでチェックボックスをトグル
  item.addEventListener('click', (e) => {
    if (e.target !== checkbox) {
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
    }
  });

  return item;
}

// 全選択
function selectAll() {
  selectedIds.clear();

  if (state.activeTab === 'chat') {
    state.conversations.forEach((conv) => selectedIds.add(conv.id));
    document.querySelectorAll('#chat-list .item-checkbox').forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = true;
    });
  } else {
    state.memories.forEach((memory) => selectedIds.add(memory.id));
    document.querySelectorAll('#memory-list .item-checkbox').forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = true;
    });
  }

  updateUI();
}

// 全解除
function deselectAll() {
  selectedIds.clear();

  document.querySelectorAll('.item-checkbox').forEach((checkbox) => {
    (checkbox as HTMLInputElement).checked = false;
  });

  updateUI();
}

// 削除処理
async function handleDelete() {
  if (selectedIds.size === 0) return;

  // 最大50件チェック
  const MAX_DELETION = 50;
  if (selectedIds.size > MAX_DELETION) {
    alert(
      `⚠️ 削除上限エラー\n\n` +
      `一度に削除できるのは${MAX_DELETION}件までです。\n` +
      `現在${selectedIds.size}件選択されています。\n\n` +
      `選択を減らしてください。`
    );
    return;
  }

  const itemType = state.activeTab === 'chat' ? 'チャット履歴' : 'メモリ';
  const confirmed = confirm(
    `${selectedIds.size}件の${itemType}を削除します。\nこの操作は取り消せません。\n\n本当に削除しますか？`
  );

  if (!confirmed) return;

  state.isDeleting = true;
  state.deleteProgress.current = 0;
  state.deleteProgress.total = selectedIds.size;
  elements.progress.style.display = 'block';
  elements.deleteBtn.disabled = true;

  // トークンを再取得（期限切れを防ぐ）
  try {
    await apiClient.clearTokenCache();
    console.log('✅ Token cache cleared, will be refreshed on next request');
  } catch (error) {
    console.warn('⚠️ Failed to clear token cache:', error);
  }

  const idsToDelete = Array.from(selectedIds);
  const errors: { id: string; error: string }[] = [];

  // バッチ並列削除（5件ずつ同時削除）
  const batchSize = 5;
  let processedCount = 0;

  for (let i = 0; i < idsToDelete.length; i += batchSize) {
    const batch = idsToDelete.slice(i, i + batchSize);
    
    // バッチ内のアイテムに削除中スタイルを適用
    batch.forEach((id) => {
      const itemElement = document.querySelector(`[data-id="${id}"]`);
      if (itemElement) {
        itemElement.classList.add('deleting');
      }
    });

    // 並列削除
    const results = await Promise.allSettled(
      batch.map(async (id) => {
        try {
          // 削除API呼び出し
          if (state.activeTab === 'chat') {
            await apiClient.deleteConversation(id);
          } else {
            await apiClient.deleteMemory(id);
          }
          return { success: true, id };
        } catch (error) {
          return { success: false, id, error: (error as Error).message };
        }
      })
    );

    // 結果を処理
    results.forEach((result, index) => {
      const id = batch[index];
      processedCount++;

      if (result.status === 'fulfilled' && result.value.success) {
        // 成功したらリストから削除
        if (state.activeTab === 'chat') {
          state.conversations = state.conversations.filter((c) => c.id !== id);
        } else {
          state.memories = state.memories.filter((m) => m.id !== id);
        }

        selectedIds.delete(id);

        // UIから削除
        const itemElement = document.querySelector(`[data-id="${id}"]`);
        if (itemElement) {
          itemElement.remove();
        }
      } else {
        // 失敗
        const errorMsg = result.status === 'fulfilled' 
          ? result.value.error 
          : (result.reason as Error).message;
        console.error(`Failed to delete ${id}:`, errorMsg);
        errors.push({ id, error: errorMsg || 'Unknown error' });

        // 失敗時もselectedIdsから削除（状態の不整合を防ぐ）
        selectedIds.delete(id);

        // 削除中スタイルを解除
        const itemElement = document.querySelector(`[data-id="${id}"]`);
        if (itemElement) {
          itemElement.classList.remove('deleting');
        }
      }

      // 進行状況を更新
      state.deleteProgress.current = processedCount;
      elements.progressText.textContent = `${state.deleteProgress.current} / ${state.deleteProgress.total}`;
    });

    // バッチ間のディレイなし（最速化）
  }

  // 完了
  state.isDeleting = false;
  elements.progress.style.display = 'none';
  elements.deleteBtn.disabled = false;

  // 結果を表示
  if (errors.length > 0) {
    alert(
      `削除完了: ${idsToDelete.length - errors.length}件\n失敗: ${errors.length}件\n\n一部のアイテムの削除に失敗しました。`
    );
  } else {
    alert(`${idsToDelete.length}件の${itemType}を削除しました。`);
  }

  // 最新データを再ロード
  if (state.activeTab === 'chat') {
    await loadConversations();
  } else {
    await loadMemories();
  }

  updateUI();
}

// UIの更新
function updateUI() {
  elements.selectedCount.textContent = `選択: ${selectedIds.size}件`;
  elements.deleteBtn.disabled = selectedIds.size === 0 || state.isDeleting;
}

// ローディング表示
function showLoading(show: boolean) {
  elements.loading.style.display = show ? 'flex' : 'none';
}

// ローディングテキストを更新
function updateLoadingText(text: string) {
  const loadingText = elements.loading.querySelector('p');
  if (loadingText) {
    loadingText.textContent = text;
  }
}

// ユーティリティ関数
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function randomDelay(min: number, max: number): Promise<void> {
  const delay = Math.random() * (max - min) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// アプリケーション起動
init();
