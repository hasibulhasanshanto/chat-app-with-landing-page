import Cookies from 'js-cookie';

export const AUTH_COOKIE_NAME = 'chatflow_auth_token';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  // 1. Check js-cookie
  const cookieVal = Cookies.get(AUTH_COOKIE_NAME);
  if (cookieVal) return cookieVal;

  // 2. Direct document.cookie fallback
  if (typeof document !== 'undefined' && document.cookie) {
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + AUTH_COOKIE_NAME + '=([^;]*)'));
    if (match && match[2]) {
      return decodeURIComponent(match[2]);
    }
  }

  return null;
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;

  const isHttps = window.location.protocol === 'https:';

  // 1. Set with js-cookie
  Cookies.set(AUTH_COOKIE_NAME, token, {
    expires: 30,
    path: '/',
    sameSite: 'lax',
    secure: isHttps,
  });

  // 2. Direct document.cookie assignment for guaranteed instant availability
  const maxAge = 30 * 24 * 60 * 60;
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax${isHttps ? '; Secure' : ''}`;
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;

  // 1. js-cookie remove
  Cookies.remove(AUTH_COOKIE_NAME, { path: '/' });
  Cookies.remove(AUTH_COOKIE_NAME, { path: '' });
  Cookies.remove(AUTH_COOKIE_NAME);

  // 2. Direct document.cookie expiration for guaranteed clearing across all environments
  const pastDate = 'Thu, 01 Jan 1970 00:00:01 GMT';
  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Expires=${pastDate};`;
  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; SameSite=Lax; Expires=${pastDate};`;
  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; SameSite=Strict; Expires=${pastDate};`;

  if (window.location.hostname) {
    document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Domain=${window.location.hostname}; Expires=${pastDate};`;
    document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Domain=.${window.location.hostname}; Expires=${pastDate};`;
  }
}

