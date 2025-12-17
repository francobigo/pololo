import { Router } from "express";
import { getProducts, 
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/products.controller.js";
import { upload } from '../config/upload.js';
import { authAdmin } from "../middlewares/authAdmin.js"; // Protege rutas
import { verifyToken } from "../middlewares/auth.middleware.js";


const router = Router();

// GET /api/products  (mounted as '/products' in index.routes)
// expose root here
router.get("/", getProducts);

router.get("/:id", getProductById);

// público (listado / detalle)
router.get('/', getProducts);
router.get('/:id', getProductById);

// admin (CRUD) con subida de imagen
router.post('/', verifyToken, upload.single('image'), createProduct);
router.put('/:id', verifyToken, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, deleteProduct);


export default router;


export { router as productsRoutes };