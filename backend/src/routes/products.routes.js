import { Router } from "express";
import { getProducts } from "../controllers/products.controller.js";

const router = Router();

// GET /api/products  (mounted as '/products' in index.routes)
// expose root here
router.get("/", getProducts);

export { router as productsRoutes };