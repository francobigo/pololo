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
// GET /api/products/:id
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
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
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener producto por id:', error);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};
