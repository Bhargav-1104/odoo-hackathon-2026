/**
 * PostgreSQL connection pool. Reuses connections for all requests.
 * Configure via DATABASE_URL; optional SSL for hosted databases.
 */
import pg from "pg";

const { Pool } = pg;

const useSsl = process.env.DATABASE_SSL === "true";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  ...(useSsl ? { ssl: { rejectUnauthorized: true } } : {}),
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error", err);
});
