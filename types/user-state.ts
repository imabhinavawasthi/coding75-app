export interface UserNote {
  id: string;
  text: string;
  created_at: string;
}

export interface UserAssetState {
  id?: string;
  user_id?: string;
  asset_id: string;
  asset_type: "video" | "problem" | "article";
  status: "pending" | "done" | "revision";
  is_bookmarked?: boolean;
  bookmarked_at?: string | null;
  notes?: UserNote[];
  metadata?: Record<string, any>;
  last_interacted_at?: string;
}
