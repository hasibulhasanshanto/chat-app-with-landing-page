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
import { useEffect, useRef } from 'react';
import { useSocket } from '@/context/SocketContext';

// Helper to safely extract string conversation ID from message
function extractConversationId(message: any): string {
  if (!message) return '';
  if (typeof message.conversation === 'string') return message.conversation;
  if (typeof message.conversation === 'object' && message.conversation?._id) return message.conversation._id;
  if (typeof message.conversationId === 'string') return message.conversationId;
  if (typeof message.conversationId === 'object' && message.conversationId?._id) return message.conversationId._id;
  return '';
}

// Helper to safely extract sender ID from message
function extractSenderId(message: any): string {
  if (!message) return '';
  if (typeof message.sender === 'string') return message.sender;
  if (typeof message.sender === 'object' && message.sender?._id) return message.sender._id;
  if (typeof message.senderId === 'string') return message.senderId;
  if (typeof message.senderId === 'object' && message.senderId?._id) return message.senderId._id;
  return '';
}

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

/**
 * Senior hook connecting Socket.io real-time events directly with TanStack Query Cache
 * with unread badge tracking and live message stream synchronization.
 */
export function useRealtimeSocketSync(activeConversationId: string | null) {
  const queryClient = useQueryClient();
  const { onNewMessage, onConversationUpdated } = useSocket();
  const currentUser = useAuthStore((state) => state.user);

  // Store activeConversationId in ref so the socket callback always accesses the current value
  const activeIdRef = useRef(activeConversationId);
  useEffect(() => {
    activeIdRef.current = activeConversationId;
  }, [activeConversationId]);

  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    // 1. Synchronize incoming messages
    const unsubMessage = onNewMessage((incomingMessage) => {
      const convId = extractConversationId(incomingMessage);
      const senderId = extractSenderId(incomingMessage);
      if (!convId) return;

      const currentActiveId = activeIdRef.current;
      const myId = currentUserRef.current?._id;
      const isFromMe = myId && senderId === myId;
      const isCurrentlyOpen = currentActiveId === convId;

      // Update message stream cache for this conversation
      queryClient.setQueryData<MessagesResponse>(
        queryKeys.conversations.messages(convId),
        (old) => {
          if (!old) {
            return { messages: [incomingMessage], hasMore: false };
          }
          const exists = old.messages.some((m) => m._id === incomingMessage._id);
          if (exists) return old;

          // Replace optimistic message if matching text
          const optIdx = old.messages.findIndex(
            (m) => m.isOptimistic && m.text === incomingMessage.text
          );
          if (optIdx !== -1) {
            const nextMsgs = [...old.messages];
            nextMsgs[optIdx] = incomingMessage;
            return { ...old, messages: nextMsgs };
          }

          // Append to bottom (chronological)
          return {
            ...old,
            messages: [...old.messages, incomingMessage],
          };
        }
      );

      // Update conversation list: update lastMessage, bump to top, and manage unreadCount
      queryClient.setQueryData<Conversation[]>(
        queryKeys.conversations.list(),
        (old = []) => {
          const index = old.findIndex((c) => c._id === convId);

          // If conversation is new to the list, trigger refetch to pull full shape
          if (index === -1) {
            queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list() });
            return old;
          }

          const existingConv = old[index];
          // Increment unread count only if message is from someone else and user is not currently in this chat
          const currentUnread = existingConv.unreadCount || 0;
          const newUnreadCount =
            !isFromMe && !isCurrentlyOpen ? currentUnread + 1 : isCurrentlyOpen ? 0 : currentUnread;

          const updated: Conversation = {
            ...existingConv,
            lastMessage: {
              text: incomingMessage.text,
              sender: senderId,
              createdAt: incomingMessage.createdAt,
            },
            updatedAt: incomingMessage.createdAt,
            unreadCount: newUnreadCount,
          };

          const nextList = [...old];
          nextList.splice(index, 1);
          return [updated, ...nextList];
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
