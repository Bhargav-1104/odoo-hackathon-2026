/**
 * Shared trip id parsing and public JSON shape for trip responses.
 */
import { AppError } from "./AppError.js";

export function parseTripIdParam(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, "Invalid trip id");
  }
  return id;
}

export function isoDateOnly(value) {
  if (!value) return value;
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  const s = String(value);
  return s.length >= 10 ? s.slice(0, 10) : s;
}

export function publicTrip(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    description: row.description,
    start_date: isoDateOnly(row.start_date),
    end_date: isoDateOnly(row.end_date),
    budget: row.budget != null ? String(row.budget) : null,
    created_at: row.created_at,
  };
}
