/**
 * Aggregates API route modules.
 */
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import tripRoutes from "./trip.routes.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/trips", requireAuth, tripRoutes);

export default router;
