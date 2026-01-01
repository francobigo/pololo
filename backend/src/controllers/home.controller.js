import {
  getActiveCarousel,
} from'../data/homeCarousel.repository.js';

import {
  getActiveHomeProducts,
} from '../data/homeProducts.repository.js';

// GET /api/home
const getHome = async (req, res) => {
  try {
    const carousel = await getActiveCarousel();
    const featuredProducts = await getActiveHomeProducts();

    return res.status(200).json({
      carousel,
      featuredProducts,
    });
  } catch (error) {
    console.error('Error al obtener el home:', error);
    return res.status(500).json({
      message: 'Error al obtener información del home',
    });
  }
};

export{
  getHome,
};
