// src/components/Footer.jsx
function Footer() {
  return (
    <footer
      style={{
        marginTop: "2rem",
        padding: "1rem",
        borderTop: "1px solid #ddd",
        textAlign: "center",
        fontSize: "0.9rem",
      }}
    >
      © {new Date().getFullYear()} Indumentaria – Todos los derechos reservados
    </footer>
  );
}

export default Footer;
