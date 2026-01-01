import {pool} from '../config/db.js'; // ajustá la ruta si tu pool está en otro lado

// Obtener carrusel activo ordenado (para el frontend público)
const getActiveCarousel = async () => {
  const { rows } = await pool.query(`
    SELECT id, imagen_url, titulo, orden
    FROM home_carousel
    WHERE activo = true
    ORDER BY orden ASC, id ASC
  `);
  return rows;
};

// Obtener todo el carrusel para el admin (activos e inactivos)
const getAllCarousel = async () => {
  const { rows } = await pool.query(`
    SELECT id, imagen_url, titulo, orden, activo
    FROM home_carousel
    ORDER BY orden ASC, id ASC
  `);
  return rows;
};

// Crear imagen de carrusel
const createCarouselImage = async ({ imagen_url, titulo, orden }) => {
  const { rows } = await pool.query(
    `
    INSERT INTO home_carousel (imagen_url, titulo, orden)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [imagen_url, titulo || null, orden || 0]
  );
  return rows[0];
};

const toggleCarousel = async (id, activo) => {
  const { rows } = await pool.query(
    `
    UPDATE home_carousel
    SET activo = $1
    WHERE id = $2
    RETURNING *
    `,
    [activo, id]
  );

  return rows[0];
};

// Actualizar imagen de carrusel
const updateCarouselImage = async (id, { imagen_url, titulo, orden, activo }) => {
  const { rows } = await pool.query(
    `
    UPDATE home_carousel
    SET
      imagen_url = COALESCE($1, imagen_url),
      titulo     = COALESCE($2, titulo),
      orden      = COALESCE($3, orden),
      activo     = COALESCE($4, activo)
    WHERE id = $5
    RETURNING *
    `,
    [imagen_url, titulo, orden, activo, id]
  );
  return rows[0];
};

// Eliminar imagen de carrusel
const deleteCarouselImage = async (id) => {
  await pool.query(`DELETE FROM home_carousel WHERE id = $1`, [id]);
  return true;
};

export {
  getActiveCarousel,
  getAllCarousel,
  createCarouselImage,
  updateCarouselImage,
  deleteCarouselImage,
  toggleCarousel
};
