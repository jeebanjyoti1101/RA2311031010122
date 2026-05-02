let _authToken: string | null = null;

export function setAuthToken(token: string): void {
  _authToken = token;
}

export function getAuthToken(): string | null {
  return _authToken;
}

export function clearAuthToken(): void {
  _authToken = null;
}
