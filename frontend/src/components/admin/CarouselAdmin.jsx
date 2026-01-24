import { useState } from "react";
import { addCarouselImage } from "../../services/adminHome.service";

const CarouselAdmin = () => {
  const [imagenUrl, setImagenUrl] = useState("");
  const [titulo, setTitulo] = useState("");
  const [orden, setOrden] = useState(0);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addCarouselImage(
      {
        imagen_url: imagenUrl,
        titulo,
        orden,
      },
      token
    );

    setImagenUrl("");
    setTitulo("");
    setOrden(0);
  };

  return (
    <div>
      <h2>Carrusel</h2>

      <form onSubmit={handleSubmit} className="row g-2">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="URL de imagen"
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Orden"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          />
        </div>

        <div className="col-12">
          <button className="btn btn-primary">
            Agregar imagen
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarouselAdmin;
