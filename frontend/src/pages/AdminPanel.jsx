function AdminPanel() {
  return (
    <section style={{ padding: "2rem" }}>
      <h1>Panel de Administración</h1>
      <p>Gestión de productos y contenido.</p>
      <div style={{ marginTop: "1rem" }}>
        <h2>Opciones disponibles:</h2>
        <ul>
          <li>Agregar nuevos productos</li>
          <li>Editar productos existentes</li>
          <li>Ver pedidos</li>
          <li>Gestionar usuarios</li>
        </ul>
      </div>
    </section>
  );
}

export default AdminPanel;
