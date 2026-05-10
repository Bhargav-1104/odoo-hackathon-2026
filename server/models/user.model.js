/**
 * Data access for users. All SQL for the users table lives here.
 */
import { pool } from "../config/database.js";

/**
 * @param {string} email - normalized lowercase email
 */
export async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT id, name, email, password, created_at FROM users WHERE email = $1 LIMIT 1`,
    [email],
  );
  return result.rows[0] ?? null;
}

/**
 * @param {{ name: string, email: string, passwordHash: string }} data
 */
export async function createUser({ name, email, passwordHash }) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name.trim(), email, passwordHash],
  );
  return result.rows[0];
}
