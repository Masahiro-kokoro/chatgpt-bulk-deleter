import type { ConversationsResponse, MemoriesResponse } from './types';

class ChatGPTApiClient {
  /**
   * リトライ機能付きでContent Scriptにメッセージを送信
   */
  private async sendMessageWithRetry(message: any, maxRetries: number = 3): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📡 Attempt ${attempt}/${maxRetries}:`, message.action);
        return await this.sendMessage(message);
      } catch (error) {
        lastError = error as Error;
        console.warn(`⚠️ Attempt ${attempt} failed:`, lastError.message);

        // 最後の試行でなければ待機してリトライ
        if (attempt < maxRetries) {
          const delayMs = Math.pow(2, attempt - 1) * 1000; // 1秒、2秒、4秒
          console.log(`⏳ Retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }

    // すべてのリトライが失敗
    console.error(`❌ All ${maxRetries} attempts failed for ${message.action}`);
    throw lastError || new Error('All retry attempts failed');
  }

  /**
   * Content Scriptにメッセージを送信してAPIを呼び出す
   */
  private async sendMessage(message: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // ステップ1: アクティブなタブを優先
        const activeTab = await this.findChatGPTTab({ active: true, currentWindow: true });
        if (activeTab) {
          console.log('🎯 Using active tab:', activeTab.id);
          await this.sendToTab(activeTab, message, resolve, reject);
          return;
        }

        // ステップ2: 同じウィンドウの任意のタブ
        const currentWindowTab = await this.findChatGPTTab({ currentWindow: true });
        if (currentWindowTab) {
          console.log('🪟 Using tab in current window:', currentWindowTab.id);
          await this.sendToTab(currentWindowTab, message, resolve, reject);
          return;
        }

        // ステップ3: 全ウィンドウから検索
        const anyTab = await this.findChatGPTTab({});
        if (anyTab) {
          console.log('🌐 Using tab from any window:', anyTab.id);
          await this.sendToTab(anyTab, message, resolve, reject);
          return;
        }

        // タブが見つからない
        reject(new Error('ChatGPTのタブが見つかりません。\n\nhttps://chatgpt.com/ を開いてから、もう一度お試しください。'));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * ChatGPTのタブを検索
   */
  private async findChatGPTTab(queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab | null> {
    return new Promise((resolve) => {
      chrome.tabs.query(
        { 
          url: 'https://chatgpt.com/*',
          ...queryInfo
        },
        (tabs) => {
          resolve(tabs.length > 0 ? tabs[0] : null);
        }
      );
    });
  }

  /**
   * タブにメッセージを送信
   */
  private async sendToTab(
    tab: chrome.tabs.Tab,
    message: any,
    resolve: (value: any) => void,
    reject: (reason: any) => void
  ): Promise<void> {
    if (!tab.id) {
      reject(new Error('タブIDが取得できません'));
      return;
    }

    console.log('📤 Sending message to tab:', tab.id, tab.url, message);

    // タブが完全にロードされているか確認
    if (tab.status !== 'complete') {
      console.warn('⚠️ Tab is not fully loaded, waiting...');
      await new Promise(r => setTimeout(r, 1000));
    }

    // Content Scriptにメッセージを送信
    chrome.tabs.sendMessage(tab.id, message, (response) => {
      if (chrome.runtime.lastError) {
        console.error('❌ Chrome runtime error:', chrome.runtime.lastError);
        reject(new Error(
          'Content Scriptと通信できません。\n\n' +
          '以下をお試しください：\n' +
          '1. ChatGPTのページをリロード（F5）\n' +
          '2. 拡張機能を再読み込み\n' +
          '3. もう一度ポップアップを開く\n\n' +
          '詳細: ' + chrome.runtime.lastError.message
        ));
        return;
      }

      if (!response) {
        console.error('❌ No response from content script');
        reject(new Error('Content Scriptからの応答がありません'));
        return;
      }

      console.log('📥 Received response:', response);

      if (response.success) {
        resolve(response.data);
      } else {
        reject(new Error(response.error || 'Unknown error'));
      }
    });
  }

  /**
   * チャット履歴を取得
   */
  async getConversations(offset: number = 0, limit: number = 28, useRetry: boolean = false): Promise<ConversationsResponse> {
    console.log('📡 Requesting conversations from content script...');
    const message = {
      action: 'getConversations',
      offset,
      limit,
    };

    if (useRetry) {
      return this.sendMessageWithRetry(message);
    } else {
      return this.sendMessage(message);
    }
  }

  /**
   * メモリを取得
   */
  async getMemories(): Promise<MemoriesResponse> {
    console.log('📡 Requesting memories from content script...');
    return this.sendMessage({
      action: 'getMemories',
    });
  }

  /**
   * チャット履歴を削除
   */
  async deleteConversation(id: string): Promise<void> {
    console.log('📡 Requesting conversation deletion:', id);
    await this.sendMessage({
      action: 'deleteConversation',
      id,
    });
  }

  /**
   * メモリを削除
   */
  async deleteMemory(id: string): Promise<void> {
    console.log('📡 Requesting memory deletion:', id);
    await this.sendMessage({
      action: 'deleteMemory',
      id,
    });
  }
}

export const apiClient = new ChatGPTApiClient();
