/**
 * Trip HTTP handlers: enforce ownership via model queries filtered by req.user.id.
 */
import { AppError } from "../utils/AppError.js";
import {
  insertTrip,
  listTripsForUser,
  findTripForUser,
  updateTripForUser,
  deleteTripForUser,
} from "../models/trip.model.js";
import { parseTripIdParam, publicTrip } from "../utils/tripPublic.js";

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

export async function updateTrip(req, res) {
  const tripId = parseTripIdParam(req.params.id);
  const userId = req.user.id;
  const { title, description, start_date, end_date, budget } = req.body;

  const budgetNum =
    typeof budget === "number" ? budget : Number(String(budget).trim());
  const budgetDecimal = budgetNum.toFixed(2);

  const row = await updateTripForUser(tripId, userId, {
    title: title.trim(),
    description:
      description === undefined || description === null || description === ""
        ? null
        : String(description),
    startDate: start_date.trim(),
    endDate: end_date.trim(),
    budget: budgetDecimal,
  });

  if (!row) {
    throw new AppError(404, "Trip not found");
  }

  res.status(200).json({
    success: true,
    data: { trip: publicTrip(row) },
  });
}

export async function deleteTrip(req, res) {
  const tripId = parseTripIdParam(req.params.id);
  const deleted = await deleteTripForUser(tripId, req.user.id);
  if (!deleted) {
    throw new AppError(404, "Trip not found");
  }
  res.status(200).json({
    success: true,
    data: { deleted: true },
  });
}
