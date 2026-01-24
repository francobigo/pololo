import { useState } from "react";
import { addHomeProduct } from "../../services/adminHome.service";

const FeaturedProductsAdmin = () => {
  const [productId, setProductId] = useState("");
  const [orden, setOrden] = useState(0);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addHomeProduct(
      {
        product_id: productId,
        orden,
      },
      token
    );

    setProductId("");
    setOrden(0);
  };

  return (
    <div>
      <h2>Productos destacados</h2>

      <form onSubmit={handleSubmit} className="row g-2">
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder="ID del producto"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            placeholder="Orden"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          />
        </div>

        <div className="col-12">
          <button className="btn btn-success">
            Agregar destacado
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeaturedProductsAdmin;
