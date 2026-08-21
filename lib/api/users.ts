import { apiClient } from './client';
import { SearchedUser } from '@/types/user';

export async function searchUsersApi(query: string): Promise<SearchedUser[]> {
  if (!query || !query.trim()) return [];
  const res = await apiClient<SearchedUser[]>(`/users/search?q=${encodeURIComponent(query.trim())}`, {
    method: 'GET',
  });
  return Array.isArray(res) ? res : [];
}
