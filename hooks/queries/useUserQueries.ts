'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { searchUsersApi } from '@/lib/api/users';
import { useAuthStore } from '@/store/useAuthStore';

export function useSearchUsersQuery(query: string, enabled = true) {
  const currentUser = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: queryKeys.users.search(query.trim()),
    queryFn: async () => {
      const users = await searchUsersApi(query);
      return users.filter((u) => u._id !== currentUser?._id);
    },
    enabled: enabled && query.trim().length > 0,
    staleTime: 1000 * 30, // 30 seconds
  });
}
