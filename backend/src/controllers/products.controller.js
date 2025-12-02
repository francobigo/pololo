// src/controllers/products.controller.js
import { pool } from '../config/db.js';

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        nombre      AS name,
        categoria   AS category,
        descripcion AS description,
        precio      AS price,
        imagen_url  AS image,
        stock,
        activo      AS active
      FROM products
      ORDER BY id;
    `);

    // result.rows es un array con los productos
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};
