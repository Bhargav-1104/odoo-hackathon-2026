/**
 * Trip HTTP handlers: enforce ownership via model queries filtered by req.user.id.
 */
import { AppError } from "../utils/AppError.js";
import {
  insertTrip,
  listTripsForUser,
  findTripForUser,
} from "../models/trip.model.js";

function parseTripIdParam(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, "Invalid trip id");
  }
  return id;
}

function isoDateOnly(value) {
  if (!value) return value;
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  const s = String(value);
  return s.length >= 10 ? s.slice(0, 10) : s;
}

function publicTrip(row) {
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

export async function createTrip(req, res) {
  const userId = req.user.id;
  const { title, description, start_date, end_date, budget } = req.body;

  const budgetNum =
    typeof budget === "number" ? budget : Number(String(budget).trim());
  const budgetDecimal = budgetNum.toFixed(2);

  const row = await insertTrip({
    userId,
    title: title.trim(),
    description:
      description === undefined || description === null || description === ""
        ? null
        : String(description),
    startDate: start_date.trim(),
    endDate: end_date.trim(),
    budget: budgetDecimal,
  });

  res.status(201).json({
    success: true,
    data: { trip: publicTrip(row) },
  });
}

export async function listTrips(req, res) {
  const rows = await listTripsForUser(req.user.id);
  res.status(200).json({
    success: true,
    data: { trips: rows.map(publicTrip) },
  });
}

export async function getTripById(req, res) {
  const tripId = parseTripIdParam(req.params.id);
  const row = await findTripForUser(tripId, req.user.id);
  if (!row) {
    throw new AppError(404, "Trip not found");
  }
  res.status(200).json({
    success: true,
    data: { trip: publicTrip(row) },
  });
}
