const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

export function apiUrl(path: string) {
  return `${apiBaseUrl}${path}`;
}

export async function postJson<TPayload>(path: string, payload: TPayload) {
  const response = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<unknown>;
}

export async function getJson<TResponse>(path: string) {
  const response = await fetch(apiUrl(path), {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}
