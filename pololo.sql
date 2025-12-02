CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10,2) NOT NULL,
  imagen_url TEXT,
  stock INT DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE
);
