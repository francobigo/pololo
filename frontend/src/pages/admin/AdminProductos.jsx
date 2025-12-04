// src/pages/admin/AdminProductos.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../../services/productsService";

function AdminProductos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts(); // trae todos
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Seguro que querés eliminar este producto?");
    if (!confirmar) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Hubo un error al eliminar el producto");
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Administrar productos</h2>
        {/* Este botón lo vamos a usar en el siguiente paso para crear productos */}
        <Link to="/admin/productos/nuevo" className="btn btn-primary">
          + Nuevo producto
        </Link>
      </div>

      {products.length === 0 ? (
        <p>No hay productos cargados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Activo</th>
                <th style={{ width: "180px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                  <td>{p.active ? "Sí" : "No"}</td>
                  <td>
                    <div className="d-flex gap-2">
                      {/* EDITAR: lo hacemos en el siguiente paso */}
                      <Link
                        to={`/admin/productos/${p.id}/editar`}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        Editar
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(p.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProductos;
