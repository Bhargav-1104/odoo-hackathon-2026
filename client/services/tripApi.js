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

function authHeaders(extra = {}) {
  const token = getAuthToken();
  if (!token) return { ...extra };
  return { ...extra, Authorization: `Bearer ${token}` };
}

export async function listTripsRequest() {
  const res = await fetch(`${API_BASE}/api/trips`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await readJsonResponse(res);
  return { ok: res.ok, status: res.status, data };
}

export async function createTripRequest(payload) {
  const res = await fetch(`${API_BASE}/api/trips`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  const data = await readJsonResponse(res);
  return { ok: res.ok, status: res.status, data };
}

export async function getTripDetailsRequest(tripId) {
  const res = await fetch(`${API_BASE}/api/trips/${tripId}/details`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await readJsonResponse(res);
  return { ok: res.ok, status: res.status, data };
}

export async function createItineraryItemRequest(tripId, payload) {
  const res = await fetch(`${API_BASE}/api/trips/${tripId}/itinerary-items`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  const data = await readJsonResponse(res);
  return { ok: res.ok, status: res.status, data };
}

export async function createTripNoteRequest(tripId, payload) {
  const res = await fetch(`${API_BASE}/api/trips/${tripId}/notes`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  const data = await readJsonResponse(res);
  return { ok: res.ok, status: res.status, data };
}
