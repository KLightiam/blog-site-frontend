// One place for the API address. Set VITE_API_URL in a .env file to point at a deployed backend.
export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export class NotFoundError extends Error {}

export async function getJSON(path, { signal } = {}) {
  const response = await fetch(`${API_URL}${path}`, { signal });
  if (response.status === 404) throw new NotFoundError(path);
  if (!response.ok) throw new Error(`Request failed (${response.status}) for ${path}`);
  return response.json();
}
