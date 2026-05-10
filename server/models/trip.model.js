/**
 * Data access for trips. All queries are scoped by user_id where applicable.
 */
import { pool } from "../config/database.js";

const TRIP_SELECT = `
  id, user_id, title, description, start_date, end_date, budget, created_at
`;

/**
 * @param {{ userId: number, title: string, description: string | null, startDate: string, endDate: string, budget: string }} row
 */
export async function insertTrip({ userId, title, description, startDate, endDate, budget }) {
  const result = await pool.query(
    `INSERT INTO trips (user_id, title, description, start_date, end_date, budget)
     VALUES ($1, $2, $3, $4::date, $5::date, $6)
     RETURNING ${TRIP_SELECT}`,
    [userId, title, description, startDate, endDate, budget],
  );
  return result.rows[0];
}

/**
 * @param {number} userId
 */
export async function listTripsForUser(userId) {
  const result = await pool.query(
    `SELECT ${TRIP_SELECT}
     FROM trips
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId],
  );
  return result.rows;
}

/**
 * @param {number} tripId
 * @param {number} userId
 */
export async function findTripForUser(tripId, userId) {
  const result = await pool.query(
    `SELECT ${TRIP_SELECT}
     FROM trips
     WHERE id = $1 AND user_id = $2
     LIMIT 1`,
    [tripId, userId],
  );
  return result.rows[0] ?? null;
}
