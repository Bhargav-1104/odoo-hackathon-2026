/**
 * Protects routes with Bearer JWT. Sets req.user = { id, email } for downstream handlers.
 */
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError(401, "Authentication required"));
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return next(new AppError(401, "Authentication required"));
  }

  try {
    const payload = verifyAccessToken(token);
    const id = Number(payload.sub);
    if (!Number.isInteger(id) || id < 1) {
      return next(new AppError(401, "Invalid or expired token"));
    }
    req.user = { id, email: payload.email };
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}
