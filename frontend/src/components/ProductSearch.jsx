export default function ProductSearch({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Buscar productos..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "0.5rem",
        marginBottom: "1rem",
      }}
      className="search-input"
    />
  );
}
