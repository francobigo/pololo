// src/services/productsService.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);

  if (!res.ok) {
    throw new Error('Error al obtener productos');
  }

  const data = await res.json();
  return data;
}
