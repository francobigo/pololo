// src/components/Navbar.jsx
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        gap: "1rem",
        padding: "1rem",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Link to="/">Home</Link>
      <Link to="/catalogo">Catálogo</Link>
      <Link to="/catalogo/marroquineria">Marroquinería</Link>
      <Link to="/catalogo/remeras">Remeras</Link>
      <Link to="/catalogo/pantalones">Pantalones</Link>
      <Link to="/catalogo/buzos">Buzos</Link>
      <Link to="/nosotros">Nosotros</Link>
      <Link to="/contacto">Contacto</Link>
      <Link to="/admin/login" style={{ marginLeft: "auto", color: "#666" }}>Admin</Link>
    </nav>
  );
}

export default Navbar;
