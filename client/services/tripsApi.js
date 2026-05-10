/**
 * Authenticated trip API client (GET/POST /api/trips).
 */
import { getAuthToken } from "../utils/authToken.js";

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
 * Maps API trip row to dashboard shape (camelCase dates).
 * @param {Record<string, unknown>} row
 */
export function normalizeTrip(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description ?? "",
    startDate: row.start_date,
    endDate: row.end_date,
    budget: row.budget,
    createdAt: row.created_at,
  };
}

export async function fetchTrips() {
  const token = getAuthToken();
  if (!token) {
    return {
      ok: false,
      status: 401,
      data: { message: "Sign in to view your trips." },
    };
  }

  const res = await fetch(`${API_BASE}/api/trips`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await readJsonResponse(res);
  return { ok: res.ok, status: res.status, data };
}

/**
 * @param {{ title: string, description?: string, start_date: string, end_date: string, budget: number }} body
 */
export async function createTrip(body) {
  const token = getAuthToken();
  if (!token) {
    return {
      ok: false,
      status: 401,
      data: { message: "Sign in to create a trip." },
    };
  }

  const res = await fetch(`${API_BASE}/api/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await readJsonResponse(res);
  return { ok: res.ok, status: res.status, data };
}
