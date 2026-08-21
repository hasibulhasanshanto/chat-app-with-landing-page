import { User } from './user';

export type ConversationType = 'direct' | 'group';

export interface LastMessage {
  text?: string;
  sender?: string;
  createdAt?: string;
}

export interface DirectConversation {
  _id: string;
  type: 'direct';
  participant: User;
  lastMessage?: LastMessage;
  updatedAt?: string;
  createdAt?: string;
  unreadCount?: number;
}

export interface GroupConversation {
  _id: string;
  type: 'group';
  name: string;
  createdBy?: string;
  admins: string[];
  participants: User[];
  lastMessage?: LastMessage;
  updatedAt?: string;
  createdAt?: string;
  unreadCount?: number;
}

export type Conversation = DirectConversation | GroupConversation;

export interface Message {
  _id: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: string;
  isOptimistic?: boolean;
  senderUser?: User;
}

export interface MessagesResponse {
  messages: Message[];
  hasMore: boolean;
}

export interface CreateDirectPayload {
  userId: string;
}

export interface CreateGroupPayload {
  name: string;
  participantIds: string[];
}
