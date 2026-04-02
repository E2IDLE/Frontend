export const API_BASE = "https://directp2p.happytanuki.kr";
export const AGENT_BASE = "http://127.0.0.1:17432";

export const getToken = () => localStorage.getItem("token");
export const setToken = (t) => localStorage.setItem("token", t);
export const clearToken = () => localStorage.removeItem("token");

let _onUnauth = null;
export const setUnauthHandler = (fn) => { _onUnauth = fn; };

/**
 * fetch wrapper with Bearer token injection.
 * For non-auth endpoints: auto-clears token and calls _onUnauth on 401.
 * Throws { type: "network" } on network failure.
 */
export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers, signal: controller.signal });
  } catch {
    throw { type: "network" };
  } finally {
    clearTimeout(timeoutId);
  }

  // Auto-logout on 401 for authenticated (non-auth) endpoints
  if (res.status === 401 && !path.startsWith("/auth/") && token) {
    clearToken();
    _onUnauth?.();
  }

  return res;
}

export async function agentCall(method, path, body) {
  const res = await fetch(`${AGENT_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res;
}
