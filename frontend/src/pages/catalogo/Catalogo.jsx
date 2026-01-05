import { useEffect, useState } from "react";
import { getProducts } from "../../services/productsService";
import { Link, useSearchParams } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";

function Catalogo() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(products);
    } else {
      const text = search.toLowerCase();
      setFiltered(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(text) ||
            p.description.toLowerCase().includes(text)
        )
      );
    }
  }, [search, products]);

  /* =====================
     ESTADOS
  ====================== */

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" />
        <p className="mt-3">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="fw-bold">Catálogo</h1>

        {search && (
          <p className="text-muted mb-0">
            Resultados para: <strong>{search}</strong>
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <p>No se encontraron productos.</p>
      ) : (
        <div className="row g-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <Link
                to={`/producto/${p.id}`}
                className="text-decoration-none text-dark"
              >
                <div className="card h-100 border-0 shadow-sm product-card">

                  {/* IMAGEN */}
                  <div className="ratio ratio-1x1">
                    <img
                      src={getImageUrl(p.image)}
                      alt={p.name}
                      className="card-img-top object-fit-cover"
                    />
                  </div>

                  {/* BODY */}
                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-semibold mb-1">{p.name}</h6>

                    <p className="fw-bold fs-5 mb-1">
                      ${p.price}
                    </p>

                    <small className="text-muted mb-3">
                      {p.category}
                    </small>

                    <div className="mt-auto">
                      <button className="btn btn-dark w-100">
                        Ver producto
                      </button>
                    </div>
                  </div>

                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalogo;
