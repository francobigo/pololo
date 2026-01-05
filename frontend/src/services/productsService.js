const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/* ===========================
   Helper: headers con JWT
=========================== */
function authHeaders() {
  const token = localStorage.getItem("authToken");

  return {
    Authorization: `Bearer ${token}`,
  };
}

/* ===========================
   Helper: manejo global auth
=========================== */
function handleAuthError(res) {
  if (res.status === 401 || res.status === 403) {
    // token vencido o inválido
    localStorage.removeItem("authToken");
    window.location.href = "/catalogo"; // fuerza salida limpia
    return true;
  }
  return false;
}

/* ===========================
   CATÁLOGO (PÚBLICO)
=========================== */
export async function getProducts(category) {
  let url = `${API_URL}/products`;

  if (category) {
    url += `?category=${encodeURIComponent(category)}`;
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Error al obtener productos");
  }

  return await res.json();
}

/* ===========================
   ADMIN (TODOS LOS PRODUCTOS)
=========================== */
export async function getAllProductsAdmin() {
  const res = await fetch(`${API_URL}/products?includeInactive=true`, {
    headers: authHeaders(),
  });

  if (handleAuthError(res)) return;

  if (!res.ok) {
    throw new Error("Error al obtener productos (admin)");
  }

  return await res.json();
}

/* ===========================
   PRODUCTO POR ID
=========================== */
export async function getProductById(id) {
  const res = await fetch(`${API_URL}/products/${id}`);

  if (!res.ok) {
    throw new Error("Error al obtener el producto");
  }

  return await res.json();
}

/* ===========================
   ELIMINAR PRODUCTO (ADMIN)
=========================== */
export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (handleAuthError(res)) return;

  if (!res.ok) {
    throw new Error("Error al eliminar el producto");
  }

  return await res.json();
}

/* ===========================
   CREAR PRODUCTO (ADMIN)
=========================== */
export async function createProduct(productData) {
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("category", productData.category);
  formData.append("description", productData.description || "");
  formData.append("price", productData.price);
  formData.append("stock", productData.stock ?? 0);
  formData.append("active", productData.active);

  if (productData.imageFile) {
    formData.append("image", productData.imageFile);
  }

  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (handleAuthError(res)) return;

  if (!res.ok) {
    throw new Error("Error al crear el producto");
  }

  return await res.json();
}

/* ===========================
   ACTUALIZAR PRODUCTO (ADMIN)
=========================== */
export async function updateProduct(id, productData) {
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("category", productData.category);
  formData.append("description", productData.description || "");
  formData.append("price", productData.price);
  formData.append("stock", productData.stock ?? 0);
  formData.append("active", productData.active);

  if (productData.imageFile) {
    formData.append("image", productData.imageFile);
  }

  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: formData,
  });

  if (handleAuthError(res)) return;

  if (!res.ok) {
    throw new Error("Error al actualizar el producto");
  }

  return await res.json();
}
