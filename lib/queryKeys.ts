export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  conversations: {
    all: ['conversations'] as const,
    list: () => [...queryKeys.conversations.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.conversations.all, 'detail', id] as const,
    messages: (id: string) => [...queryKeys.conversations.all, 'messages', id] as const,
  },
  users: {
    all: ['users'] as const,
    search: (query: string) => [...queryKeys.users.all, 'search', query] as const,
  },
};
