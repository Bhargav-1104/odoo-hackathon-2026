/**
 * Aggregates API route modules. Add new routers here (e.g. /api/trips).
 */
import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/auth", authRoutes);

export default router;
