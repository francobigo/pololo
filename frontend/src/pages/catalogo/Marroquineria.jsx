import { useEffect, useState } from "react";
import { getProducts } from "../../services/productsService";
import { Link } from "react-router-dom";

function Marroquineria() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // importante: usar el valor que guardás en la BD, ej: 'marroquineria'
        const data = await getProducts("marroquineria");
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos de marroquinería");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="container mt-4"><p>Cargando productos...</p></div>;
  if (error)   return <div className="container mt-4"><p>{error}</p></div>;

  if (products.length === 0) {
    return <div className="container mt-4"><p>No hay productos en esta categoría.</p></div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Marroquinería</h1>

      <div className="row">
        {products.map((p) => (
          <div key={p.id} className="col-md-4 mb-4">
            <Link
              to={`/producto/${p.id}`}
              className="text-decoration-none text-dark"
            >
            <div className="card h-100">
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  className="card-img-top"
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text flex-grow-1">{p.description}</p>
                <p className="fw-bold mb-1">${p.price}</p>
                <small className="text-muted">
                  Categoría: {p.category}
                </small>
              </div>
            </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marroquineria;
