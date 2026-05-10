/**
 * HTTP client for auth endpoints. Returns parsed JSON and status for UI error mapping.
 */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function readJsonResponse(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

/**
 * @param {{ name: string, email: string, password: string }} body
 */
export async function signupRequest(body) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: body.name,
      email: body.email,
      password: body.password,
    }),
  });
  const data = await readJsonResponse(res);
  return { ok: res.ok, status: res.status, data };
}

/**
 * @param {{ email: string, password: string }} body
 */
export async function loginRequest(body) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
    }),
  });
  const data = await readJsonResponse(res);
  return { ok: res.ok, status: res.status, data };
}
