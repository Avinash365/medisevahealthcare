export const TOKEN_KEY = 'api_token';
export const USER_KEY = 'user';

export function setToken(token) {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function setUser(user) {
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const s = localStorage.getItem(USER_KEY);
  return s ? JSON.parse(s) : null;
}

export function isAuthenticated() {
  return !!getToken();
}

export async function fetchWithAuth(url, opts = {}) {
  const headers = opts.headers ? { ...opts.headers } : {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { ...opts, headers });
  return res;
}
