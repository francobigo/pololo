import { useEffect, useState } from "react";
import { getProducts } from "../../services/productsService";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl"; // 👈 IMPORTANTE

function Catalogo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts(); // sin categoría -> todos
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="container mt-4"><p>Cargando productos...</p></div>;
  if (error)   return <div className="container mt-4"><p>{error}</p></div>;

  if (products.length === 0) {
    return <div className="container mt-4"><p>No hay productos cargados todavía.</p></div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Catálogo</h1>

      <div className="row">
        {products.map((p) => (
          <div key={p.id} className="col-md-4 mb-4">
            <Link
              to={`/producto/${p.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="card h-100">

                {/* 👇 ACÁ SE ARREGLA EL PROBLEMA */}
                {p.image && (
                  <img
                    src={getImageUrl(p.image)}
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

export default Catalogo;
