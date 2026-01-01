import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from "../controllers/products.controller.js";

import { upload } from "../config/upload.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

/* =========================
   PÚBLICO
========================= */

// listado (puede filtrar por category)
router.get("/", getProducts);

// búsqueda por nombre
router.get("/search", searchProducts);

// detalle
router.get("/:id", getProductById);

/* =========================
   ADMIN
========================= */

router.post("/", verifyToken, upload.single("image"), createProduct);
router.put("/:id", verifyToken, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
export { router as productsRoutes };
