export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalMessages: number;
  joinDate: Date;
  lastSeen: Date;
}

export interface SearchResult {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
}

export interface OnlineUsersResult {
  chatId: string;
  users: UserProfile[];
  total: number;
}
