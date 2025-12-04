import { Router } from "express";
import { getProducts, 
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/products.controller.js";

const router = Router();

// GET /api/products  (mounted as '/products' in index.routes)
// expose root here
router.get("/", getProducts);

router.get("/:id", getProductById);

// público (listado / detalle)
router.get('/', getProducts);
router.get('/:id', getProductById);

// admin (CRUD)
router.post('/', createProduct);       // crear producto
router.put('/:id', updateProduct);     // actualizar producto
router.delete('/:id', deleteProduct);  // eliminar producto

export default router;


export { router as productsRoutes };