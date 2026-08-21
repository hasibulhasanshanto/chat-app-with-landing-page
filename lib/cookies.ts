import Cookies from 'js-cookie';

export const AUTH_COOKIE_NAME = 'chatflow_auth_token';

/**
 * Cookie options:
 * - expires: 30 days
 * - sameSite: 'lax' for CSRF protection while permitting top-level navigation
 * - path: '/' for accessibility across all routes
 * - secure: enabled in production HTTPS
 */
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 30,
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return Cookies.get(AUTH_COOKIE_NAME) || null;
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  Cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  Cookies.remove(AUTH_COOKIE_NAME, { path: '/' });
}
