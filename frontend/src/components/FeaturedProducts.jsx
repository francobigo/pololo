const FeaturedProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="featured-products">
      <h2>Productos destacados</h2>

      <div className="featured-grid">
        {products.map((product) => (
          <div key={product.home_product_id} className="product-card">
            <img
              src={product.imagen_url}
              alt={product.nombre}
              className="product-image"
            />

            <h3>{product.nombre}</h3>
            <p className="price">${product.precio}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
