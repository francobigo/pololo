import { Router } from "express";
import { productsRoutes } from "./products.routes.js";
import { healthRouter } from "./health.routes.js";
import authRouter from "./auth.routes.js"; // 👈 SIN {}

const router = Router();

router.use("/health", healthRouter);
router.use("/products", productsRoutes);
router.use("/auth", authRouter); // 👈 AHORA SÍ

export default router;
