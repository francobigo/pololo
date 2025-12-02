import { Router } from "express";
import {productsRoutes} from "./products.routes.js";
import { healthRouter } from "./health.routes.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/products", productsRoutes);

export default router;
