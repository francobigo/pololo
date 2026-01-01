import { useEffect, useState } from "react";
import { getImageUrl } from "../utils/imageUrl";

const Carousel = ({ images, interval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <div className="carousel">
      <img
        src={getImageUrl(currentImage.imagen_url)}
        alt={currentImage.titulo || "Imagen carrusel"}
        className="carousel-image"
      />

      {currentImage.titulo && (
        <div className="carousel-title">
          {currentImage.titulo}
        </div>
      )}
    </div>
  );
};

export default Carousel;
