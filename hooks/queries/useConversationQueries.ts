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
import { useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';

export function useConversationsQuery() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.conversations.list(),
    queryFn: getConversationsApi,
    enabled: isAuthenticated,
  });
}

export function useMessagesQuery(conversationId: string | null) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.conversations.messages(conversationId || ''),
    queryFn: () => getMessagesApi(conversationId!),
    enabled: isAuthenticated && !!conversationId,
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

      // Optimistically update messages query cache
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

      // Optimistically update conversation list lastMessage
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
    },
  });
}

export function useCreateDirectConversationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDirectPayload) => createDirectConversationApi(payload),
    onSuccess: (newConv) => {
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

/**
 * Senior hook connecting Socket.io real-time events directly with the TanStack Query Cache
 */
export function useRealtimeSocketSync(activeConversationId: string | null) {
  const queryClient = useQueryClient();
  const { onNewMessage, onConversationUpdated } = useSocket();

  useEffect(() => {
    // 1. Synchronize incoming messages
    const unsubMessage = onNewMessage((incomingMessage) => {
      const convId = incomingMessage.conversation;

      // Update message stream cache if conversation cache exists
      queryClient.setQueryData<MessagesResponse>(
        queryKeys.conversations.messages(convId),
        (old) => {
          if (!old) return { messages: [incomingMessage], hasMore: false };
          const exists = old.messages.some((m) => m._id === incomingMessage._id);
          if (exists) return old;

          // Replace optimistic message if any matching text
          const optIdx = old.messages.findIndex(
            (m) => m.isOptimistic && m.text === incomingMessage.text
          );
          if (optIdx !== -1) {
            const nextMsgs = [...old.messages];
            nextMsgs[optIdx] = incomingMessage;
            return { ...old, messages: nextMsgs };
          }

          return { ...old, messages: [...old.messages, incomingMessage] };
        }
      );

      // Update conversation list item lastMessage and bump to top
      queryClient.setQueryData<Conversation[]>(
        queryKeys.conversations.list(),
        (old = []) => {
          const index = old.findIndex((c) => c._id === convId);
          if (index === -1) {
            queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list() });
            return old;
          }
          const updated = {
            ...old[index],
            lastMessage: {
              text: incomingMessage.text,
              sender: incomingMessage.sender,
              createdAt: incomingMessage.createdAt,
            },
            updatedAt: incomingMessage.createdAt,
          };
          const next = [...old];
          next.splice(index, 1);
          return [updated, ...next];
        }
      );
    });

    // 2. Synchronize group updates
    const unsubGroup = onConversationUpdated((updatedGroup) => {
      queryClient.setQueryData<Conversation[]>(
        queryKeys.conversations.list(),
        (old = []) => {
          const index = old.findIndex((c) => c._id === updatedGroup._id);
          if (index === -1) return [updatedGroup, ...old];
          const next = [...old];
          next[index] = { ...next[index], ...updatedGroup };
          return next;
        }
      );
    });

    return () => {
      unsubMessage();
      unsubGroup();
    };
  }, [onNewMessage, onConversationUpdated, queryClient]);
}
