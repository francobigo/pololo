import express from 'express';
const router = express.Router();

import  {getHome,} from '../controllers/home.controller.js';

// GET /api/home  (mounted as '/home' in index.routes)
router.get('/', getHome);

export default router;
