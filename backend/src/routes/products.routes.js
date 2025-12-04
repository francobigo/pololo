import { Router } from "express";
import { getProducts, getProductById} from "../controllers/products.controller.js";

const router = Router();

// GET /api/products  (mounted as '/products' in index.routes)
// expose root here
router.get("/", getProducts);

router.get("/:id", getProductById);


export { router as productsRoutes };