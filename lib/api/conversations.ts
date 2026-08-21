import { apiClient } from './client';
import {
  Conversation,
  GroupConversation,
  Message,
  MessagesResponse,
  CreateDirectPayload,
  CreateGroupPayload,
} from '@/types/chat';

export async function getConversationsApi(): Promise<Conversation[]> {
  const res = await apiClient<{ data: Conversation[] }>('/conversations', {
    method: 'GET',
  });
  return res?.data || [];
}

export async function createDirectConversationApi(payload: CreateDirectPayload): Promise<Conversation> {
  return apiClient<Conversation>('/conversations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createGroupConversationApi(payload: CreateGroupPayload): Promise<GroupConversation> {
  return apiClient<GroupConversation>('/conversations/group', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMessagesApi(
  conversationId: string,
  params?: { limit?: number; before?: string }
): Promise<MessagesResponse> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.before) query.set('before', params.before);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return apiClient<MessagesResponse>(`/conversations/${conversationId}/messages${qs}`, {
    method: 'GET',
  });
}

export async function sendMessageApi(conversationId: string, text: string): Promise<Message> {
  return apiClient<Message>('/messages', {
    method: 'POST',
    body: JSON.stringify({ conversationId, text }),
  });
}

export async function addGroupMembersApi(conversationId: string, userIds: string[]): Promise<GroupConversation> {
  return apiClient<GroupConversation>(`/conversations/${conversationId}/participants`, {
    method: 'POST',
    body: JSON.stringify({ userIds }),
  });
}

export async function removeGroupMemberApi(conversationId: string, userId: string): Promise<GroupConversation> {
  return apiClient<GroupConversation>(`/conversations/${conversationId}/participants/${userId}`, {
    method: 'DELETE',
  });
}

export async function promoteAdminApi(conversationId: string, userId: string): Promise<GroupConversation> {
  return apiClient<GroupConversation>(`/conversations/${conversationId}/admins`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export async function renameGroupApi(conversationId: string, name: string): Promise<GroupConversation> {
  return apiClient<GroupConversation>(`/conversations/${conversationId}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
}
