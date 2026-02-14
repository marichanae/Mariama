const TOKEN_KEY = 'lpme_token';

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getUserRoleFromToken(): 'ADMIN' | 'USER' | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payloadPart = token.split('.')[1];
    const decoded = JSON.parse(atob(payloadPart));
    if (decoded && (decoded.role === 'ADMIN' || decoded.role === 'USER')) {
      return decoded.role;
    }
  } catch {
    return null;
  }
  return null;
}
