import { CustomApiError } from '@/types/api';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/cookies';

const DEFAULT_API_BASE_URL = 'https://frontend-task-chatapp.onrender.com/api';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;

export { getAuthToken, setAuthToken, removeAuthToken };

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = options.token !== undefined ? options.token : getAuthToken();

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
    throw new CustomApiError(
      err?.message || 'Network error occurred. Please check your connection.',
      'NETWORK_ERROR'
    );
  }
}
