// チャット履歴
export interface Conversation {
  id: string;
  title: string;
  create_time?: number;
  update_time?: number;
}

export interface ConversationsResponse {
  items: Conversation[];
  total: number;
  limit: number;
  offset: number;
}

// メモリ
export interface Memory {
  id: string;
  content: string;
  updated_at: string;
  gizmo_id: string | null;
  status: string;
  conversation_id: string | null;
  created_timestamp: string | null;
  last_updated: string | null;
  labels: string[] | null;
}

export interface MemoriesResponse {
  memories: Memory[];
  memory_max_tokens: number;
  memory_num_tokens: number;
}

// UI用の状態
export interface AppState {
  activeTab: 'chat' | 'memory';
  conversations: Conversation[];
  memories: Memory[];
  isLoading: boolean;
  isDeleting: boolean;
  deleteProgress: {
    current: number;
    total: number;
  };
}
