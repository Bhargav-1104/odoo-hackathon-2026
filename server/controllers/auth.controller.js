/**
 * HTTP layer for auth: parses validated input, calls models + password/JWT utils, sends responses.
 */
import { AppError } from "../utils/AppError.js";
import { signAccessToken } from "../utils/jwt.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { createUser, findUserByEmail } from "../models/user.model.js";
import { normalizeEmail } from "../validators/auth.validator.js";

function publicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    created_at: row.created_at,
  };
}

export async function signup(req, res) {
  const { name, email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    throw new AppError(409, "An account with this email already exists");
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({
    name,
    email: normalizedEmail,
    passwordHash,
  });

  const token = signAccessToken({ sub: user.id, email: user.email });

  res.status(201).json({
    success: true,
    data: {
      user: publicUser(user),
      token,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const ok = await comparePassword(password, user.password);
  if (!ok) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = signAccessToken({ sub: user.id, email: user.email });

  res.status(200).json({
    success: true,
    data: {
      user: publicUser(user),
      token,
    },
  });
}
