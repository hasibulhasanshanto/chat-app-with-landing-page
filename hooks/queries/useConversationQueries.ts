'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.conversations.list(),
    queryFn: async () => {
      const freshList = await getConversationsApi();
      const prevData = queryClient.getQueryData<Conversation[]>(queryKeys.conversations.list()) || [];
      const unreadMap = new Map<string, number>();
      prevData.forEach((c) => {
        if (c.unreadCount) {
          unreadMap.set(c._id, c.unreadCount);
        }
      });

      return freshList.map((c) => ({
        ...c,
        unreadCount: unreadMap.get(c._id) ?? c.unreadCount ?? 0,
      }));
    },
    enabled: isAuthenticated,
    // Background polling every 1.5 seconds for rapid synchronization across tabs/browsers
    refetchInterval: 1500,
    refetchIntervalInBackground: false,
  });
}

/**
 * Infinite-scroll pagination for conversation messages (fetches older messages on scroll-up)
 */
export function useMessagesQuery(conversationId: string | null) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useInfiniteQuery({
    queryKey: queryKeys.conversations.messages(conversationId || ''),
    queryFn: async ({ pageParam }) => {
      const res = await getMessagesApi(conversationId!, {
        limit: 25,
        before: pageParam as string | undefined,
      });
      return res || { messages: [], hasMore: false };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasMore || !lastPage?.messages || lastPage.messages.length === 0) {
        return undefined;
      }
      // The API returns messages in newest-first order. The oldest message is the last item.
      const oldestMessage = lastPage.messages[lastPage.messages.length - 1];
      return oldestMessage?._id || oldestMessage?.createdAt;
    },
    enabled: isAuthenticated && !!conversationId,
    // Ultra-fast active conversation polling (1000ms) for lightning-fast delivery
    refetchInterval: 1000,
    refetchIntervalInBackground: false,
    staleTime: 500,
    select: (data) => {
      const allMessages: Message[] = [];
      const seenIds = new Set<string>();

      data.pages.forEach((page) => {
        (page?.messages || []).forEach((m) => {
          if (m && m._id && !seenIds.has(m._id)) {
            seenIds.add(m._id);
            allMessages.push(m);
          } else if (m && !m._id) {
            allMessages.push(m);
          }
        });
      });

      // Filter out optimistic duplicate if real backend message already exists
      const realMessages = allMessages.filter((m) => !m.isOptimistic && !m._id?.startsWith('optimistic-'));
      const deduplicated = allMessages.filter((m) => {
        if (m.isOptimistic || m._id?.startsWith('optimistic-')) {
          const hasRealMatch = realMessages.some(
            (real) =>
              real.text === m.text &&
              Math.abs(new Date(real.createdAt).getTime() - new Date(m.createdAt).getTime()) < 30000
          );
          return !hasRealMatch;
        }
        return true;
      });

      // Sort chronologically: oldest at index 0 (top) -> newest at index N-1 (bottom)
      const sorted = deduplicated.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const hasMore = data.pages[data.pages.length - 1]?.hasMore ?? false;

      return {
        messages: sorted,
        hasMore,
      };
    },
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
      await queryClient.cancelQueries({ queryKey: queryKeys.conversations.messages(conversationId) });

      const prevData = queryClient.getQueryData<any>(
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

      // Optimistically inject into infinite query or flat query cache
      queryClient.setQueryData<any>(
        queryKeys.conversations.messages(conversationId),
        (old: any) => {
          if (!old) {
            return {
              pages: [{ messages: [optimisticMessage], hasMore: false }],
              pageParams: [undefined],
            };
          }

          if (old.pages && Array.isArray(old.pages)) {
            const nextPages = [...old.pages];
            nextPages[0] = {
              ...nextPages[0],
              messages: [optimisticMessage, ...(nextPages[0]?.messages || [])],
            };
            return {
              ...old,
              pages: nextPages,
            };
          }

          return {
            ...old,
            messages: [...(old.messages || []), optimisticMessage],
          };
        }
      );

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
            unreadCount: 0,
          };
          const next = [...old];
          next.splice(index, 1);
          return [updated, ...next];
        }
      );

      return { prevData, tempId, conversationId };
    },
    onError: (err, variables, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(
          queryKeys.conversations.messages(context.conversationId),
          context.prevData
        );
      }
    },
    onSuccess: (sentMessage, variables, context) => {
      // Swap optimistic message with real MongoDB message
      queryClient.setQueryData<any>(
        queryKeys.conversations.messages(variables.conversationId),
        (old: any) => {
          if (!old) {
            return {
              pages: [{ messages: [sentMessage], hasMore: false }],
              pageParams: [undefined],
            };
          }

          if (old.pages && Array.isArray(old.pages)) {
            const nextPages = old.pages.map((page: any) => {
              if (!page?.messages) return page;
              return {
                ...page,
                messages: page.messages.map((m: any) =>
                  m._id === context?.tempId ? sentMessage : m
                ),
              };
            });
            return {
              ...old,
              pages: nextPages,
            };
          }

          if (old.messages && Array.isArray(old.messages)) {
            return {
              ...old,
              messages: old.messages.map((m: any) =>
                m._id === context?.tempId ? sentMessage : m
              ),
            };
          }

          return old;
        }
      );
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
