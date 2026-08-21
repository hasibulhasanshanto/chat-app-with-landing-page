import { CustomApiError } from '@/types/api';

const API_BASE_URL = 'https://frontend-task-chatapp.onrender.com/api';

export const TOKEN_STORAGE_KEY = 'chatflow_jwt_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  // Also set cookie for SSR / routing consistency
  document.cookie = `${TOKEN_STORAGE_KEY}=${token}; path=/; max-age=2592000; SameSite=Lax`;
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  document.cookie = `${TOKEN_STORAGE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = options.token !== undefined ? options.token : getStoredToken();

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    let responseData: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = text;
      }
    }

    if (!response.ok) {
      const errorMessage =
        responseData?.error?.message ||
        responseData?.message ||
        `Request failed with status ${response.status}`;
      const errorCode = responseData?.error?.code || responseData?.code;
      const errorDetails = responseData?.error?.details || responseData?.details;

      throw new CustomApiError(errorMessage, errorCode, errorDetails, response.status);
    }

    return responseData as T;
  } catch (err: any) {
    if (err instanceof CustomApiError) {
      throw err;
    }
    throw new CustomApiError(err?.message || 'Network error occurred. Please check your connection.', 'NETWORK_ERROR');
  }
}
