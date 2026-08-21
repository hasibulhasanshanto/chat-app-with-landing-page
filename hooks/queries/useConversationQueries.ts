'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import {
  getConversationsApi,
  getMessagesApi,
  sendMessageApi,
  createDirectConversationApi,
  createGroupConversationApi,
  addGroupMembersApi,
  removeGroupMemberApi,
  promoteAdminApi,
  renameGroupApi,
} from '@/lib/api/conversations';
import {
  Conversation,
  GroupConversation,
  Message,
  MessagesResponse,
  CreateDirectPayload,
  CreateGroupPayload,
} from '@/types/chat';
import { useAuthStore } from '@/store/useAuthStore';

export function useConversationsQuery() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.conversations.list(),
    queryFn: getConversationsApi,
    enabled: isAuthenticated,
    // Background polling every 3 seconds for guaranteed synchronization across tabs/browsers
    refetchInterval: 3000,
    refetchIntervalInBackground: false,
  });
}

export function useMessagesQuery(conversationId: string | null) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.conversations.messages(conversationId || ''),
    queryFn: async () => {
      const res = await getMessagesApi(conversationId!);
      // Ensure messages are sorted in chronological order (oldest -> newest / top -> bottom)
      const sorted = [...(res?.messages || [])].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      return {
        ...res,
        messages: sorted,
      };
    },
    enabled: isAuthenticated && !!conversationId,
    // Background polling every 2 seconds for active conversation
    refetchInterval: 2000,
    refetchIntervalInBackground: false,
  });
}

export function useSendMessageMutation() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async ({ conversationId, text }: { conversationId: string; text: string }) => {
      return sendMessageApi(conversationId, text);
    },
    onMutate: async ({ conversationId, text }) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.conversations.messages(conversationId) });

      const prevMessages = queryClient.getQueryData<MessagesResponse>(
        queryKeys.conversations.messages(conversationId)
      );

      const tempId = `optimistic-${Date.now()}`;
      const optimisticMessage: Message = {
        _id: tempId,
        conversation: conversationId,
        sender: user?._id || 'me',
        text,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };

      // Optimistically append to the bottom of messages query cache
      if (prevMessages) {
        queryClient.setQueryData<MessagesResponse>(
          queryKeys.conversations.messages(conversationId),
          {
            ...prevMessages,
            messages: [...prevMessages.messages, optimisticMessage],
          }
        );
      } else {
        queryClient.setQueryData<MessagesResponse>(
          queryKeys.conversations.messages(conversationId),
          {
            messages: [optimisticMessage],
            hasMore: false,
          }
        );
      }

      // Optimistically update conversation list lastMessage and reset unread
      queryClient.setQueryData<Conversation[]>(
        queryKeys.conversations.list(),
        (old = []) => {
          const index = old.findIndex((c) => c._id === conversationId);
          if (index === -1) return old;
          const updated = {
            ...old[index],
            lastMessage: {
              text,
              sender: user?._id || 'me',
              createdAt: optimisticMessage.createdAt,
            },
            updatedAt: optimisticMessage.createdAt,
            unreadCount: 0,
          };
          const next = [...old];
          next.splice(index, 1);
          return [updated, ...next];
        }
      );

      return { prevMessages, tempId, conversationId };
    },
    onError: (err, variables, context) => {
      if (context?.prevMessages) {
        queryClient.setQueryData(
          queryKeys.conversations.messages(context.conversationId),
          context.prevMessages
        );
      }
    },
    onSuccess: (sentMessage, variables, context) => {
      // Swap optimistic message with real message from server
      queryClient.setQueryData<MessagesResponse>(
        queryKeys.conversations.messages(variables.conversationId),
        (old) => {
          if (!old) return { messages: [sentMessage], hasMore: false };
          return {
            ...old,
            messages: old.messages.map((m) =>
              m._id === context?.tempId ? sentMessage : m
            ),
          };
        }
      );
      // Invalidate to ensure conversation list metadata is up to date
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list() });
    },
  });
}

export function useCreateDirectConversationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDirectPayload) => createDirectConversationApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list() });
    },
  });
}

export function useCreateGroupConversationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGroupPayload) => createGroupConversationApi(payload),
    onSuccess: (newGroup) => {
      queryClient.setQueryData<Conversation[]>(
        queryKeys.conversations.list(),
        (old = []) => [newGroup, ...old]
      );
    },
  });
}

export function useAddGroupMembersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, userIds }: { conversationId: string; userIds: string[] }) =>
      addGroupMembersApi(conversationId, userIds),
    onSuccess: (updatedGroup) => {
      queryClient.setQueryData<Conversation[]>(
        queryKeys.conversations.list(),
        (old = []) => old.map((c) => (c._id === updatedGroup._id ? updatedGroup : c))
      );
    },
  });
}

export function useRemoveGroupMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, userId }: { conversationId: string; userId: string }) =>
      removeGroupMemberApi(conversationId, userId),
    onSuccess: (updatedGroup) => {
      queryClient.setQueryData<Conversation[]>(
        queryKeys.conversations.list(),
        (old = []) => old.map((c) => (c._id === updatedGroup._id ? updatedGroup : c))
      );
    },
  });
}

export function usePromoteAdminMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, userId }: { conversationId: string; userId: string }) =>
      promoteAdminApi(conversationId, userId),
    onSuccess: (updatedGroup) => {
      queryClient.setQueryData<Conversation[]>(
        queryKeys.conversations.list(),
        (old = []) => old.map((c) => (c._id === updatedGroup._id ? updatedGroup : c))
      );
    },
  });
}

export function useRenameGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, name }: { conversationId: string; name: string }) =>
      renameGroupApi(conversationId, name),
    onSuccess: (updatedGroup) => {
      queryClient.setQueryData<Conversation[]>(
        queryKeys.conversations.list(),
        (old = []) => old.map((c) => (c._id === updatedGroup._id ? updatedGroup : c))
      );
    },
  });
}
