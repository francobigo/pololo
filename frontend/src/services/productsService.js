// src/services/productsService.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function getProducts(category) {
  let url = `${API_URL}/products`;

  if (category) {
    url += `?category=${encodeURIComponent(category)}`;
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Error al obtener productos');
  }

  return await res.json();
}
export async function getProductById(id) {
  const url = `${API_URL}/products/${id}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Error al obtener el producto');
  }

  return await res.json();
}
