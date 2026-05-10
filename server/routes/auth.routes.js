/**
 * Auth routes mounted under /api/auth.
 */
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateSignup, validateLogin } from "../middleware/validateAuth.middleware.js";
import { signup, login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", validateSignup, asyncHandler(signup));
router.post("/login", validateLogin, asyncHandler(login));

export default router;
