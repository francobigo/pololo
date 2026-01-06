// src/controllers/products.controller.js
import { pool } from '../config/db.js';

// (duplicate simple getProducts removed; the more complete getProducts implementation remains below)

// OBTENER PRODUCTOS (GET /api/products)
export const getProducts = async (req, res) => {
  const { category, includeInactive, search } = req.query;

  try {
    let query = `
      SELECT 
        p.id,
        p.nombre      AS name,
        p.categoria   AS category,
        p.descripcion AS description,
        p.precio      AS price,
        p.imagen_url  AS image,
        p.stock,
        p.activo      AS active,
        st.nombre     AS size_type
      FROM products p
      LEFT JOIN size_types st ON st.id = p.size_type_id
    `;

    const params = [];
    const conditions = [];

    if (includeInactive !== 'true') {
      conditions.push('p.activo = true');
    }

    if (category) {
      conditions.push(`LOWER(p.categoria) = LOWER($${params.length + 1})`);
      params.push(category);
    }

    if (search) {
      conditions.push(`
        (LOWER(p.nombre) LIKE LOWER($${params.length + 1})
        OR LOWER(p.descripcion) LIKE LOWER($${params.length + 1}))
      `);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY p.id';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};


// buscar un producto por nombre o descripción (GET /api/products/search)
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const result = await pool.query(
      `
      SELECT id, nombre, precio
      FROM products
      WHERE LOWER(nombre) LIKE LOWER($1)
        AND activo = true
      ORDER BY nombre
      LIMIT 10
      `,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error buscando productos:", error);
    res.status(500).json({ message: "Error buscando productos" });
  }
};


// OBTENER UN PRODUCTO POR ID (GET /api/products/:id)
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const productResult = await pool.query(
      `
      SELECT
        p.id,
        p.nombre      AS name,
        p.categoria   AS category,
        p.descripcion AS description,
        p.precio      AS price,
        p.imagen_url  AS image,
        p.activo      AS active,
        st.nombre     AS size_type
      FROM products p
      LEFT JOIN size_types st ON st.id = p.size_type_id
      WHERE p.id = $1
      `,
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const product = productResult.rows[0];

    let sizes = [];

    if (product.size_type) {
      const sizesResult = await pool.query(
        `
        SELECT
          s.valor AS size,
          ps.stock
        FROM product_sizes ps
        JOIN sizes s ON s.id = ps.size_id
        WHERE ps.product_id = $1
        ORDER BY s.id
        `,
        [id]
      );

      sizes = sizesResult.rows;
    }

    res.json({
      ...product,
      sizes: product.size_type
        ? {
            type: product.size_type,
            items: sizes
          }
        : null
    });

  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};



// CREAR PRODUCTO  (POST /api/products)
export const createProduct = async (req, res) => {
  let { name, category, description, price, image, stock, active } = req.body;

  // --- VALIDACIONES BÁSICAS ---
  if (!name || !category || price == null) {
    return res
      .status(400)
      .json({ message: 'Nombre, categoría y precio son obligatorios' });
  }

  const priceNumber = Number(price);
  const stockNumber = stock == null ? 0 : Number(stock);

  if (Number.isNaN(priceNumber) || priceNumber <= 0) {
    return res
      .status(400)
      .json({ message: 'El precio debe ser un número mayor a 0' });
  }

  if (Number.isNaN(stockNumber) || stockNumber < 0) {
    return res
      .status(400)
      .json({ message: 'El stock debe ser un número mayor o igual a 0' });
  }

  const allowedCategories = ['marroquineria', 'remeras', 'pantalones', 'buzos'];
  const normalizedCategory = String(category).toLowerCase();

  if (!allowedCategories.includes(normalizedCategory)) {
    return res.status(400).json({ message: 'Categoría inválida' });
  }

  try {
    // 👇 si vino archivo, usamos su ruta; si no, usamos lo que venga en body (o vacío)
    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : (image || '');

    const result = await pool.query(
      `
      INSERT INTO products (nombre, categoria, descripcion, precio, imagen_url, stock, activo, size_type_id)
      VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, true))
      RETURNING 
        id,
        nombre      AS name,
        categoria   AS category,
        descripcion AS description,
        precio      AS price,
        imagen_url  AS image,
        stock,
        activo      AS active
      `,
      [
        name,
        normalizedCategory,
        description || '',
        priceNumber,
        imagePath,
        stockNumber,
        active,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

// ACTUALIZAR PRODUCTO (PUT /api/products/:id)
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  let { name, category, description, price, image, stock, active } = req.body;

  // --- VALIDACIONES BÁSICAS ---
  if (!name || !category || price == null) {
    return res
      .status(400)
      .json({ message: 'Nombre, categoría y precio son obligatorios' });
  }

  const priceNumber = Number(price);
  const stockNumber = stock == null ? 0 : Number(stock);

  if (Number.isNaN(priceNumber) || priceNumber <= 0) {
    return res
      .status(400)
      .json({ message: 'El precio debe ser un número mayor a 0' });
  }

  if (Number.isNaN(stockNumber) || stockNumber < 0) {
    return res
      .status(400)
      .json({ message: 'El stock debe ser un número mayor o igual a 0' });
  }

  const allowedCategories = ['marroquineria', 'remeras', 'pantalones', 'buzos'];
  const normalizedCategory = String(category).toLowerCase();

  if (!allowedCategories.includes(normalizedCategory)) {
    return res.status(400).json({ message: 'Categoría inválida' });
  }

  try {
    // Primero obtengo la imagen actual
    const current = await pool.query(
      'SELECT imagen_url FROM products WHERE id = $1',
      [id]
    );

    if (current.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const currentImage = current.rows[0].imagen_url;

    // 👇 Prioridad: archivo nuevo > image del body > imagen actual
    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : (image || currentImage || '');

    const result = await pool.query(
      `
      UPDATE products
      SET
        nombre      = $1,
        categoria   = $2,
        descripcion = $3,
        precio      = $4,
        imagen_url  = $5,
        stock       = $6,
        activo      = $7
      WHERE id = $8
      RETURNING 
        id,
        nombre      AS name,
        categoria   AS category,
        descripcion AS description,
        precio      AS price,
        imagen_url  AS image,
        stock,
        activo      AS active
      `,
      [
        name,
        normalizedCategory,
        description || '',
        priceNumber,
        imagePath,
        stockNumber,
        active ?? true,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};


// ELIMINAR PRODUCTO (DELETE /api/products/:id)
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};
