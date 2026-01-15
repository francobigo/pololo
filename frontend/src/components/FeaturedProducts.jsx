import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "../pages/catalogo/CatalogCards.css";

import { getHomeProducts } from "../services/home.service";
import { getImageUrl } from "../utils/imageUrl";
import { formatPrice } from "../utils/formatPrice";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getHomeProducts().then((data) => {
      console.log('Productos destacados:', data);
      setProducts(data);
    });
  }, []);


  const handleViewProduct = (productId) => {
    navigate(`/producto/${productId}`);
  };

  if (products.length === 0) return null;

  return (
    <section className="container my-5 featured-products">
      <h3 className="mb-4">Destacados</h3>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          576: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          992: { slidesPerView: 4 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.home_product_id}>
            <div className="product-card" style={{ cursor: 'pointer' }}>
              {product.imagen_url && (
                <img
                  src={getImageUrl(product.imagen_url)}
                  alt={product.nombre}
                  className="catalog-product-image"
                  onClick={() => handleViewProduct(product.id)}
                />
              )}

              <div className="product-body">
                <h5 
                  className="product-name"
                  onClick={() => handleViewProduct(product.id)}
                >
                  {product.nombre}
                </h5>
                
                <div className="product-footer">
                  <span className="product-price">${formatPrice(product.precio)}</span>
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => handleViewProduct(product.id)}
                    disabled={product.stock <= 0}
                  >
                    {'Comprar'}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default FeaturedProducts;

