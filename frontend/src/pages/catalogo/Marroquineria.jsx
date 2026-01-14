import { useEffect, useState } from "react";
import { getProducts } from "../../services/productsService";
import { Link, useSearchParams } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";
import FiltersSidebar from "../../components/filters/FiltersSidebar";
import "./CatalogCards.css";
import "./CatalogLayout.css";

function Marroquineria() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const [searchParams] = useSearchParams();
  const priceOrder = searchParams.get("price") || "desc"; // 🔹 default desc

  useEffect(() => {
    setLoading(true);

    getProducts({ category: "marroquineria" })
      .then(data => {
        setProducts(data);
        setFiltered(data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("No se pudieron cargar los productos de marroquinería");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...products];

    // 🔹 siempre mayor a menor
    result.sort((a, b) => b.price - a.price);

    setFiltered(result);
  }, [priceOrder, products]);

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

  if (filtered.length === 0) {
    return (
      <div className="container mt-4">
        <h1 className="mb-4">Marroquinería</h1>
        <p>No hay productos en esta categoría.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Marroquinería</h1>

      <div className="catalog-layout">
        <FiltersSidebar filters={["price"]} />

        <div>
          {filtered.length === 0 ? (
            <div className="no-products">
              <p>No hay productos en esta categoría.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map((p) => (
                <Link
                  key={p.id}
                  to={`/producto/${p.id}`}
                  className="text-decoration-none"
                >
                  <div className="product-card">
                    {p.image && (
                      <img
                        src={getImageUrl(p.image)}
                        alt={p.name}
                        className="product-image"
                      />
                    )}

                    <div className="product-body">
                      <h5 className="product-name">{p.name}</h5>
                      <p className="product-description">{p.description}</p>
                      
                      <div className="product-footer">
                        <span className="product-price">${p.price}</span>
                        <span className="product-category">{p.category}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Marroquineria;
