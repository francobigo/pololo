import { useSearchParams } from "react-router-dom";

const CATEGORIES = [
  { value: "", label: "Todas" },
  { value: "remeras", label: "Remeras" },
  { value: "buzos", label: "Buzos" },
  { value: "pantalones", label: "Pantalones" },
  { value: "marroquineria", label: "Marroquinería" },
];

function CategoryFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get("category") || "";

  const handleChange = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    setSearchParams(params);
  };

  return (
    <div className="mb-3">
      <label className="form-label">Categoría</label>
      <select
        className="form-select"
        value={selected}
        onChange={handleChange}
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;
