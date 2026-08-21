'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { loginApi, getMeApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginPayload } from '@/types/auth';

export function useCurrentUserQuery() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const user = await getMeApi(token || undefined);
      setUser(user);
      return user;
    },
    enabled: !!token,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await loginApi(payload);
      return res;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(queryKeys.auth.me, data.user);
      // Invalidate any previous conversation caches
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all });
    },
  });
}
