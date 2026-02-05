/**
 * Content Script for API calls
 * このスクリプトはchatgpt.comのコンテキストで実行され、
 * ポップアップからのメッセージを受け取ってAPI呼び出しを行います
 */

interface ConversationsResponse {
  items: Array<{
    id: string;
    title: string;
    create_time?: number;
    update_time?: number;
  }>;
  total: number;
  limit: number;
  offset: number;
}

interface MemoriesResponse {
  memories: Array<{
    id: string;
    content: string;
    updated_at: string;
    gizmo_id: string | null;
    status: string;
    conversation_id: string | null;
    created_timestamp: string | null;
    last_updated: string | null;
    labels: string[] | null;
  }>;
  memory_max_tokens: number;
  memory_num_tokens: number;
}

// タイムアウト付きfetchのヘルパー関数
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 30000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn(`⏱️ Request timeout after ${timeoutMs}ms:`, url);
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
}

// メッセージリスナーを設定
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[ContentAPI] 📨 Received message:', message);

  // Pingメッセージ（接続確認用）
  if (message.action === 'ping') {
    console.log('[ContentAPI] 🏓 Ping received, sending pong');
    sendResponse({ success: true, data: 'pong' });
    return true;
  }

  // 非同期処理のため、trueを返す
  (async () => {
    try {
      switch (message.action) {
        case 'getConversations':
          console.log('[ContentAPI] 📡 Getting conversations...');
          const conversations = await getConversations(message.offset, message.limit);
          sendResponse({ success: true, data: conversations });
          break;

        case 'getMemories':
          console.log('[ContentAPI] 📡 Getting memories...');
          const memories = await getMemories();
          sendResponse({ success: true, data: memories });
          break;

        case 'deleteConversation':
          console.log('[ContentAPI] 🗑️ Deleting conversation:', message.id);
          await deleteConversation(message.id);
          sendResponse({ success: true });
          break;

        case 'deleteMemory':
          console.log('[ContentAPI] 🗑️ Deleting memory:', message.id);
          await deleteMemory(message.id);
          sendResponse({ success: true });
          break;

        default:
          console.error('[ContentAPI] ❌ Unknown action:', message.action);
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('[ContentAPI] ❌ Error:', error);
      sendResponse({ success: false, error: (error as Error).message });
    }
  })();

  return true; // 非同期レスポンスを有効化
});

// チャット履歴を取得（API経由、トークン付き）
async function getConversations(offset: number = 0, limit: number = 28): Promise<ConversationsResponse> {
  console.log('[ContentAPI] Getting conversations from API...');

  try {
    // トークンを取得
    const token = await getAuthToken();
    console.log('[ContentAPI] Using auth token for fetching conversations');

    const url = `https://chatgpt.com/backend-api/conversations?offset=${offset}&limit=${limit}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': token,
    };

    // Account IDをヘッダーに追加
    if (cachedAccountId) {
      headers['chatgpt-account-id'] = cachedAccountId;
      console.log('[ContentAPI] Using account ID:', cachedAccountId);
    }

    const response = await fetchWithTimeout(url, {
      method: 'GET',
      credentials: 'include',
      headers,
    }, 30000);

    console.log('[ContentAPI] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ContentAPI] Fetch failed:', errorText);
      throw new Error(`Failed to fetch conversations: ${response.status} - ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    console.log('[ContentAPI] 📦 API Response:', data);
    console.log('[ContentAPI] ✅ Fetched', data.items?.length || 0, 'conversations from API');

    return data;
  } catch (error) {
    console.error('[ContentAPI] ❌ Error fetching conversations:', error);
    throw error;
  }
}

// メモリを取得（API経由、トークン付き）
async function getMemories(): Promise<MemoriesResponse> {
  console.log('[ContentAPI] Getting memories from API...');

  try {
    // トークンを取得
    const token = await getAuthToken();
    console.log('[ContentAPI] Using auth token for fetching memories');

    const url = 'https://chatgpt.com/backend-api/memories?exclusive_to_gizmo=false&include_memory_entries=true';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': token,
    };

    // Account IDをヘッダーに追加
    if (cachedAccountId) {
      headers['chatgpt-account-id'] = cachedAccountId;
      console.log('[ContentAPI] Using account ID for memories:', cachedAccountId);
    }

    const response = await fetchWithTimeout(url, {
      method: 'GET',
      credentials: 'include',
      headers,
    }, 30000);

    console.log('[ContentAPI] Memories response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ContentAPI] Memories fetch failed:', errorText);
      throw new Error(`Failed to fetch memories: ${response.status} - ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    console.log('[ContentAPI] 📦 Memories response:', data);
    console.log('[ContentAPI] ✅ Fetched', data.memories?.length || 0, 'memories from API');

    return data;
  } catch (error) {
    console.error('[ContentAPI] ❌ Error fetching memories:', error);
    throw error;
  }
}

// チャット履歴を削除（トークン付きAPI経由）
async function deleteConversation(id: string): Promise<void> {
  console.log('[ContentAPI] Deleting conversation via API:', id);

  try {
    // トークンを取得
    const token = await getAuthToken();
    console.log('[ContentAPI] Using auth token for deletion');

    const url = `https://chatgpt.com/backend-api/conversation/${id}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': token,
    };

    // Account IDをヘッダーに追加
    if (cachedAccountId) {
      headers['chatgpt-account-id'] = cachedAccountId;
    }

    const response = await fetchWithTimeout(url, {
      method: 'PATCH',
      credentials: 'include',
      headers,
      body: JSON.stringify({ is_visible: false }),
    }, 30000);

    console.log('[ContentAPI] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ContentAPI] Delete failed:', errorText);
      throw new Error(`Failed to delete conversation: ${response.status} - ${errorText.substring(0, 100)}`);
    }

    const result = await response.json();
    console.log('[ContentAPI] Delete result:', result);

    if (!result.success) {
      throw new Error('Delete operation returned success: false');
    }

    console.log('[ContentAPI] ✅ Conversation deleted successfully');
  } catch (error) {
    console.error('[ContentAPI] ❌ Delete error:', error);
    throw error;
  }
}

// メモリを削除（API経由、トークン付き）
async function deleteMemory(id: string): Promise<void> {
  console.log('[ContentAPI] Deleting memory via API:', id);

  try {
    // トークンを取得
    const token = await getAuthToken();
    console.log('[ContentAPI] Using auth token for memory deletion');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': token,
    };

    // Account IDをヘッダーに追加
    if (cachedAccountId) {
      headers['chatgpt-account-id'] = cachedAccountId;
    }

    // 方法1: POST to /ces/v1/m
    try {
      const response = await fetchWithTimeout('https://chatgpt.com/ces/v1/m', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ id, action: 'delete' }),
      }, 30000);

      console.log('[ContentAPI] Method 1 response status:', response.status);

      if (response.ok) {
        console.log('[ContentAPI] ✅ Memory deleted successfully (method 1)');
        return;
      }
    } catch (error) {
      console.warn('[ContentAPI] Method 1 failed, trying method 2:', (error as Error).message);
    }

    // 方法2: DELETE request
    const response = await fetchWithTimeout(`https://chatgpt.com/backend-api/memory/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers,
    }, 30000);

    console.log('[ContentAPI] Method 2 response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ContentAPI] Method 2 failed:', errorText);
      throw new Error(`Failed to delete memory: ${response.status} - ${errorText.substring(0, 100)}`);
    }

    console.log('[ContentAPI] ✅ Memory deleted successfully (method 2)');
  } catch (error) {
    console.error('[ContentAPI] ❌ Delete error:', error);
    throw error;
  }
}

// トークンとアカウントIDをキャッシュ
let cachedAuthToken: string | null = null;
let cachedAccountId: string | null = null;

// ページのfetchをインターセプトしてトークンを取得
function interceptFetch() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('assets/fetch-interceptor.js');
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}

// トークンとアカウントIDを取得する関数
async function getAuthToken(): Promise<string> {
  if (cachedAuthToken) {
    return cachedAuthToken;
  }

  // window経由でトークンを取得する試み
  return new Promise((resolve, reject) => {
    const messageHandler = (event: MessageEvent) => {
      if (event.source !== window) return;
      if (event.data.type !== 'AUTH_TOKEN') return;

      window.removeEventListener('message', messageHandler);
      
      if (event.data.token) {
        cachedAuthToken = event.data.token;
        
        // トークンからアカウントIDを抽出
        try {
          const parts = event.data.token.replace('Bearer ', '').split('.');
          const payload = JSON.parse(atob(parts[1]));
          cachedAccountId = payload['https://api.openai.com/auth'].chatgpt_account_id;
          console.log('[ContentAPI] ✅ Auth token and account ID cached');
        } catch (error) {
          console.warn('[ContentAPI] Failed to extract account ID:', error);
        }
        
        resolve(event.data.token);
      } else {
        reject(new Error('No auth token found'));
      }
    };

    window.addEventListener('message', messageHandler);

    // リクエストを送信
    window.postMessage({ type: 'GET_AUTH_TOKEN' }, '*');

    // タイムアウト
    setTimeout(() => {
      window.removeEventListener('message', messageHandler);
      reject(new Error('Failed to get auth token'));
    }, 5000);
  });
}

// ページロード時にインターセプターをインストール
interceptFetch();

console.log('[ContentAPI] ✅ Content script loaded and ready');

// スクリプトが読み込まれたことをページに通知（デバッグ用）
if (typeof window !== 'undefined') {
  (window as any).__contentScriptLoaded = true;
  console.log('[ContentAPI] ✅ Window flag set');
}
