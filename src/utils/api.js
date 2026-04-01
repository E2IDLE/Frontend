export const API_BASE = "https://api-dev.directp2p.com";

export const getToken = () => localStorage.getItem("dp2p_token");
export const setToken = (t) => localStorage.setItem("dp2p_token", t);
export const clearToken = () => localStorage.removeItem("dp2p_token");

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

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw { type: "network" };
  }

  // Auto-logout on 401 for authenticated (non-auth) endpoints
  if (res.status === 401 && !path.startsWith("/auth/") && token) {
    clearToken();
    _onUnauth?.();
  }

  return res;
}
