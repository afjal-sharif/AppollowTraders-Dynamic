const BASE = '';

// Global auth error handler - will be set by App.tsx
let onAuthError: (() => void) | null = null;

export function setAuthErrorHandler(handler: () => void) {
  onAuthError = handler;
}

async function handleResponse(res: Response): Promise<Response> {
  if (res.status === 401) {
    if (onAuthError) onAuthError();
    throw new Error('unauthorized');
  }
  return res;
}

export async function api(path: string, options?: RequestInit) {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    ...options,
  });
  return handleResponse(res);
}

export async function apiJson<T = any>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    ...options,
  });
  const checked = await handleResponse(res);
  return checked.json();
}

export async function postJson<T = any>(path: string, body: any): Promise<T> {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const checked = await handleResponse(res);
  return checked.json();
}

export async function postForm<T = any>(path: string, form: FormData): Promise<T> {
  const res = await fetch(BASE + path, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  const checked = await handleResponse(res);
  return checked.json();
}
