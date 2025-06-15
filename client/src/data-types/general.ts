export interface Suggestion {
  id: number;
  label: string;
}

export interface ApiResponse<T> {
  count: number;
  total: number;
  fromItem: number;
  pageSize: number
  result: T[];
}

export interface SmallUserType {
  email: string,
  fullName: string,
  id: string,
  profilePictureUrl: string,
}
export interface ConversationType {
  participants: SmallUserType[],
  title: string,
  description: string,
  createdAt: Date,
  updatedAt: Date,
  id: string,
  lastMessage?: MessageType,
  unreadCount: number
}

export interface MessageType {
  createdBy: SmallUserType,
  seenBy: SmallUserType[],
  reactions: string[],
  text: string,
  isDeleted: false,
  isEdited: false,
  conversationId: string,
  createdAt: Date,
  updatedAt: Date,
  editedAt: Date,
  id: string,
  isSelf?: boolean,
}