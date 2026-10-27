import { API_URL } from '../lib/api';

// Tokens live in localStorage so a refresh or a new tab stays signed in. The access token
// lasts 15 minutes; when it expires, the refresh token gets a new pair automatically.
const STORAGE_KEY = 'kb-admin-session';

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function readSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null;
  } catch {
    return null;
  }
}

function writeSession(session) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked (private mode): the session lasts until the tab closes.
  }
  memory = session;
}

let memory = readSession();
let refreshing = null;
const listeners = new Set();
export const onSessionEnd = (fn) => (listeners.add(fn), () => listeners.delete(fn));

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {};
  let payload;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) {
    headers['content-type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  if (token) headers.authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError(0, 'Can’t reach the blog server. Check your connection and try again.');
  }
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? `Request failed (${response.status})`, data?.errors);
  }
  return data;
}

function endSession() {
  writeSession(null);
  listeners.forEach((fn) => fn());
}

// One refresh at a time, even if several requests expire together.
async function refresh() {
  const current = memory ?? readSession();
  if (!current?.refreshToken) throw new ApiError(401, 'Signed out');
  refreshing ??= request('/refresh-token', { method: 'POST', body: { refreshToken: current.refreshToken } })
    .then((tokens) => {
      writeSession({ ...current, ...tokens });
      return tokens.accessToken;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

// Requests to admin routes. Retries once with fresh tokens; ends the session if that fails.
export async function adminFetch(path, options = {}) {
  const session = memory ?? readSession();
  if (!session) {
    endSession();
    throw new ApiError(401, 'Signed out');
  }
  try {
    return await request(path, { ...options, token: session.accessToken });
  } catch (error) {
    if (error.status !== 401) throw error;
    let token;
    try {
      token = await refresh();
    } catch {
      endSession();
      throw new ApiError(401, 'Your session has ended. Sign in again.');
    }
    return request(path, { ...options, token });
  }
}

export async function signIn(email, password) {
  let tokens;
  try {
    tokens = await request('/login', { method: 'POST', body: { email, password } });
  } catch (error) {
    if (error.status === 401) throw new ApiError(401, 'That email and password don’t match an account.');
    throw error;
  }
  try {
    const { user } = await request('/admin', { token: tokens.accessToken });
    writeSession({ ...tokens, user });
    return user;
  } catch (error) {
    // Signed in, but not an admin: don't keep the tokens.
    await request('/logout', { method: 'POST', body: { refreshToken: tokens.refreshToken } }).catch(() => {});
    if (error.status === 401) throw new ApiError(403, 'This account can’t manage the blog. Sign in with an admin account.');
    throw error;
  }
}

export async function signOut() {
  const session = memory ?? readSession();
  if (session?.refreshToken) {
    await request('/logout', { method: 'POST', body: { refreshToken: session.refreshToken } }).catch(() => {});
  }
  writeSession(null);
}

// Confirms a stored session still works (refreshing it if needed) and returns the user.
export async function checkSession() {
  const { user } = await adminFetch('/admin');
  writeSession({ ...(memory ?? readSession()), user });
  return user;
}
