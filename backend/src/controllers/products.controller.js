// src/controllers/products.controller.js
import { pool } from '../config/db.js';

// GET /api/products?category=marroquineria
export const getProducts = async (req, res) => {
  const { category } = req.query;

  try {
    let query = `
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
    `;
    const params = [];

    if (category) {
      query += ' WHERE LOWER(categoria) = LOWER($1)';
      params.push(category);
    }

    query += ' ORDER BY id';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};
