// src/pages/catalogo/Catalogo.jsx
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productsService";

function Catalogo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Cargando productos...</p>;
  if (error)   return <p>{error}</p>;

  if (products.length === 0) {
    return <p>No hay productos cargados todavía.</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Catálogo</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "100%", borderRadius: "4px", marginBottom: "0.5rem" }}
              />
            )}
            <h3>{p.name}</h3>
            <p style={{ fontSize: "0.9rem" }}>{p.description}</p>
            <p><strong>${p.price}</strong></p>
            <p style={{ fontSize: "0.8rem", color: "#555" }}>
              Categoría: {p.category}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogo;
