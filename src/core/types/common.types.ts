export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
export type ApiResult<T> = { data: T; message?: string };
