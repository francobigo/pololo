import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiClient } from "../../services/apiClient";

function SizeFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const selectedSize = searchParams.get("size") || "";

  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    if (!category || category === "marroquineria") {
      setSizes([]);
      return;
    }

    let type = "";
    if (category === "remeras" || category === "buzos") {
      type = "ropa";
    } else if (category === "pantalones") {
      type = "pantalon";
    }

    if (!type) return;

    (async () => {
      try {
        const res = await apiClient.get(`/products/sizes/type/${type}`);
        setSizes(res.data);
      } catch (err) {
        console.error("Error cargando talles", err);
        setSizes([]);
      }
    })();
  }, [category]);

  const handleChange = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("size", value);
    } else {
      params.delete("size");
    }

    setSearchParams(params);
  };

  if (!sizes.length) return null;

  return (
    <div className="mb-3">
      <label className="form-label">Talle</label>
      <select
        className="form-select"
        value={selectedSize}
        onChange={handleChange}
      >
        <option value="">Todos</option>
        {sizes.map((s) => (
          <option key={s.id} value={s.size}>
            {s.size}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SizeFilter;
