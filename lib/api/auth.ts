import { apiClient } from './client';
import { LoginPayload, LoginResponse } from '@/types/auth';
import { User } from '@/types/user';

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMeApi(token?: string): Promise<User> {
  return apiClient<User>('/auth/me', {
    method: 'GET',
    token,
  });
}
