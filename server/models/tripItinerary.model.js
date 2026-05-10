/**
 * Itinerary rows for a trip. Caller must verify trip ownership before use.
 */
import { pool } from "../config/database.js";

const SELECT =
  "id, trip_id, day_number, title, notes, created_at";

/**
 * @param {number} tripId
 */
export async function listItineraryItemsByTripId(tripId) {
  const result = await pool.query(
    `SELECT ${SELECT}
     FROM trip_itinerary_items
     WHERE trip_id = $1
     ORDER BY day_number ASC, id ASC`,
    [tripId],
  );
  return result.rows;
}

/**
 * @param {{ tripId: number, dayNumber: number, title: string, notes: string | null }} data
 */
export async function insertItineraryItem({ tripId, dayNumber, title, notes }) {
  const result = await pool.query(
    `INSERT INTO trip_itinerary_items (trip_id, day_number, title, notes)
     VALUES ($1, $2, $3, $4)
     RETURNING ${SELECT}`,
    [tripId, dayNumber, title, notes],
  );
  return result.rows[0];
}
