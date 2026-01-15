import { useSearchParams } from "react-router-dom";
import "./FiltersSidebar.css";

export default function FiltersSidebar({ filters, subcategories = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category");
  const activeSize = searchParams.get("size");
  const activePrice = searchParams.get("price");
  const activeSubcategory = searchParams.get("subcategory");

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="filters-sidebar">
      <div className="filters-header">
        <h5 className="filters-title">FILTROS</h5>
        {(activeCategory || activeSize || activePrice || activeSubcategory) && (
          <button
            className="btn btn-link btn-sm text-muted p-0"
            onClick={clearFilters}
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* SUBCATEGORÍAS (p.ej. Marroquinería) */}
      {filters.includes("subcategory") && subcategories.length > 0 && (
        <div className="filter-section">
          <h6 className="filter-section-title">Subcategoría</h6>
          <div className="filter-options">
            <button
              className={`filter-option ${!activeSubcategory ? "active" : ""}`}
              onClick={() => handleFilterChange("subcategory", "")}
            >
              Todas
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub}
                className={`filter-option ${activeSubcategory === sub ? "active" : ""}`}
                onClick={() => handleFilterChange("subcategory", activeSubcategory === sub ? "" : sub)}
              >
                {sub.charAt(0).toUpperCase() + sub.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORÍAS */}
      {filters.includes("category") && (
        <div className="filter-section">
          <h6 className="filter-section-title">Categoría</h6>
          <div className="filter-options">
            {["remeras", "buzos", "pantalones", "marroquineria"].map((cat) => (
              <button
                key={cat}
                className={`filter-option ${
                  activeCategory === cat ? "active" : ""
                }`}
                onClick={() => handleFilterChange("category", activeCategory === cat ? "" : cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TALLES */}
      {filters.includes("size") && (
        <div className="filter-section">
          <h6 className="filter-section-title">Talle</h6>
          <div className="filter-options size-options">
            {["XS", "S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                className={`filter-option size-option ${
                  activeSize === size ? "active" : ""
                }`}
                onClick={() => handleFilterChange("size", activeSize === size ? "" : size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ORDEN POR PRECIO */}
      {filters.includes("price") && (
        <div className="filter-section">
          <h6 className="filter-section-title">Ordenar por precio</h6>
          <div className="filter-options">
            <button
              className={`filter-option ${
                activePrice === "asc" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("price", activePrice === "asc" ? "" : "asc")}
            >
              <span className="filter-icon">↑</span>
              Menor a mayor
            </button>

            <button
              className={`filter-option ${
                activePrice === "desc" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("price", activePrice === "desc" ? "" : "desc")}
            >
              <span className="filter-icon">↓</span>
              Mayor a menor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
