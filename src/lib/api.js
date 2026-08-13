const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    // Our backend always sends { error: "..." } on failure — surface that message.
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}