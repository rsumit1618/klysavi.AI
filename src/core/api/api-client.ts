import { APP_CONFIG } from '@/core/constants/app-constants';
export class ApiError extends Error { constructor(message: string, public readonly status?: number) { super(message); this.name = 'ApiError'; } }
async function request<T>(path: string, method: string, body?: unknown): Promise<T> {
  if (!APP_CONFIG.apiBaseUrl) throw new ApiError('EXPO_PUBLIC_API_BASE_URL is not configured.');
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}${path}`, { method, body: body === undefined ? undefined : JSON.stringify(body), headers: { Accept: 'application/json', 'Content-Type': 'application/json' } });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(typeof payload === 'object' && payload && 'message' in payload ? String(payload.message) : 'Unable to complete the request.', response.status);
  return payload as T;
}
export const apiClient = { get: <T>(path: string) => request<T>(path, 'GET'), post: <T>(path: string, body?: unknown) => request<T>(path, 'POST', body) };
