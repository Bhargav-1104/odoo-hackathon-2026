/**
 * Trip details: aggregated read + itinerary / note creation (ownership enforced).
 */
import { AppError } from "../utils/AppError.js";
import { findTripForUser } from "../models/trip.model.js";
import {
  listItineraryItemsByTripId,
  insertItineraryItem,
} from "../models/tripItinerary.model.js";
import { listNotesByTripId, insertTripNote } from "../models/tripNote.model.js";
import { parseTripIdParam, publicTrip } from "../utils/tripPublic.js";

function publicItineraryItem(row) {
  return {
    id: row.id,
    trip_id: row.trip_id,
    day_number: row.day_number,
    title: row.title,
    notes: row.notes,
    created_at: row.created_at,
  };
}

function publicTripNote(row) {
  return {
    id: row.id,
    trip_id: row.trip_id,
    content: row.content,
    created_at: row.created_at,
  };
}

async function requireOwnedTrip(tripId, userId) {
  const trip = await findTripForUser(tripId, userId);
  if (!trip) {
    throw new AppError(404, "Trip not found");
  }
  return trip;
}

export async function getTripDetails(req, res) {
  const tripId = parseTripIdParam(req.params.id);
  const userId = req.user.id;

  const tripRow = await requireOwnedTrip(tripId, userId);

  const [itineraryRows, noteRows] = await Promise.all([
    listItineraryItemsByTripId(tripId),
    listNotesByTripId(tripId),
  ]);

  res.status(200).json({
    success: true,
    data: {
      trip: publicTrip(tripRow),
      itineraryItems: itineraryRows.map(publicItineraryItem),
      notes: noteRows.map(publicTripNote),
    },
  });
}

export async function createItineraryItem(req, res) {
  const tripId = parseTripIdParam(req.params.id);
  const userId = req.user.id;
  await requireOwnedTrip(tripId, userId);

  const { title, day_number, notes } = req.body;
  const dayNumber = typeof day_number === "number" ? day_number : Number(day_number);
  const notesValue =
    notes === undefined || notes === null || notes === "" ? null : String(notes);

  const row = await insertItineraryItem({
    tripId,
    dayNumber,
    title: title.trim(),
    notes: notesValue,
  });

  res.status(201).json({
    success: true,
    data: { itineraryItem: publicItineraryItem(row) },
  });
}

export async function createTripNote(req, res) {
  const tripId = parseTripIdParam(req.params.id);
  const userId = req.user.id;
  await requireOwnedTrip(tripId, userId);

  const { content } = req.body;

  const row = await insertTripNote({
    tripId,
    content: content.trim(),
  });

  res.status(201).json({
    success: true,
    data: { note: publicTripNote(row) },
  });
}
