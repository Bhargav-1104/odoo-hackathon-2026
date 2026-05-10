/**
 * Signs and verifies access tokens. Secret and expiry come from environment.
 */
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

function requireSecret() {
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
}

/**
 * @param {{ sub: number, email: string }} payload
 * @returns {string}
 */
export function signAccessToken(payload) {
  requireSecret();
  return jwt.sign(
    { sub: payload.sub, email: payload.email },
    secret,
    { expiresIn, issuer: "traveloop-api" },
  );
}

/**
 * @param {string} token
 * @returns {{ sub: number, email: string }}
 */
export function verifyAccessToken(token) {
  requireSecret();
  return jwt.verify(token, secret, { issuer: "traveloop-api" });
}
