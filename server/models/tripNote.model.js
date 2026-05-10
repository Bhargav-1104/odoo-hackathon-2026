/**
 * Free-form notes for a trip. Caller must verify trip ownership before use.
 */
import { pool } from "../config/database.js";

const SELECT = "id, trip_id, content, created_at";

/**
 * @param {number} tripId
 */
export async function listNotesByTripId(tripId) {
  const result = await pool.query(
    `SELECT ${SELECT}
     FROM trip_notes
     WHERE trip_id = $1
     ORDER BY created_at DESC, id DESC`,
    [tripId],
  );
  return result.rows;
}

/**
 * @param {{ tripId: number, content: string }} data
 */
export async function insertTripNote({ tripId, content }) {
  const result = await pool.query(
    `INSERT INTO trip_notes (trip_id, content)
     VALUES ($1, $2)
     RETURNING ${SELECT}`,
    [tripId, content],
  );
  return result.rows[0];
}
