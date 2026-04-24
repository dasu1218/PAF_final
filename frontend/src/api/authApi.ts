import type { AuthUser, LoginPayload, SignupPayload } from '../types/Auth';

const BASE_URL = 'http://localhost:8080/api/auth';

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'Authentication request failed';
    throw new Error(message);
  }

  return payload as T;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthUser> => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return parseResponse<AuthUser>(response);
  },

  signup: async (payload: SignupPayload): Promise<AuthUser> => {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return parseResponse<AuthUser>(response);
  },
};