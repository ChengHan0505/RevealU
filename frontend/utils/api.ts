const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: unknown
  ) {
    super(message);
  }
}

export function apiUrl(path: string) {
  return `${apiBaseUrl}${path}`;
}

export async function postJson<TPayload>(path: string, payload: TPayload) {
  const response = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const body = await readResponseBody(response);

  if (!response.ok) {
    throw new ApiError(`Request failed: ${response.status}`, response.status, body);
  }

  return body as unknown;
}

export async function getJson<TResponse>(path: string) {
  const response = await fetch(apiUrl(path), {
    cache: 'no-store'
  });

  const body = await readResponseBody(response);

  if (!response.ok) {
    throw new ApiError(`Request failed: ${response.status}`, response.status, body);
  }

  return body as TResponse;
}

async function readResponseBody(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}
