/**
 * Formatea un precio sin decimales y con punto para miles
 * Ejemplo: 12500 -> "12.500"
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '0';
  
  // Redondear y convertir a entero
  const priceInt = Math.round(Number(price));
  
  // Formatear con punto para miles
  return priceInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
