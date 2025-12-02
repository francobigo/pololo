// src/routes/health.routes.js
import { Router } from "express";
import { healthCheck } from "../controllers/health.controller.js";

const router = Router();

// GET /api/health  (this file is mounted as '/health' in index.routes)
// so expose root path here
router.get("/", healthCheck);

// Exporto con este nombre porque en index.routes.js lo importamos como healthRouter
export { router as healthRouter };
