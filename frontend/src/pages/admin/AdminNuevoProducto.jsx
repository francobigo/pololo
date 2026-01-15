// src/pages/admin/AdminNuevoProducto.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProduct } from "../../services/productsService";
import { apiClient } from "../../services/apiClient";

function AdminNuevoProducto() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "marroquineria",
    subcategory: "",
    description: "",
    price: "",
    active: true,
    imageFile: null, // archivo real
  });

  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Estados para talles
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [marroquineriaSubcategories, setMarroquineriaSubcategories] = useState([]);
  const [marroquineriaStock, setMarroquineriaStock] = useState(0);

  // Cargar talles cuando cambia la categoría
  useEffect(() => {
    const loadSizes = async () => {
      const category = form.category;
      
      // Marroquinería no tiene talles pero tiene subcategorías
      if (category === 'marroquineria') {
        setAvailableSizes([]);
        setSelectedSizes([]);
        setMarroquineriaSubcategories([
          { id: 1, nombre: 'bolso' },
          { id: 2, nombre: 'mochila' },
          { id: 3, nombre: 'neceser' },
          { id: 4, nombre: 'riñonera' },
          { id: 5, nombre: 'billetera' }
        ]);
        return;
      }

      // Determinar el tipo de talle según categoría
      let sizeType = '';
      if (category === 'remeras' || category === 'buzos') {
        sizeType = 'ropa';
      } else if (category === 'pantalones') {
        sizeType = 'pantalon';
      }

      if (sizeType) {
        try {
          const response = await apiClient.get(`/products/sizes/type/${sizeType}`);
          setAvailableSizes(response.data);
          setSelectedSizes([]);
        } catch (err) {
          console.error('Error cargando talles:', err);
          setAvailableSizes([]);
        }
      }
    };

    loadSizes();
  }, [form.category]);

  // 👉 cambios en inputs de texto / número / checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price"
          ? value
          : value,
    }));
  };

  // 👉 manejo de talles
  const handleSizeStockChange = (sizeId, stock) => {
    setSelectedSizes((prev) => {
      const existing = prev.find((s) => s.size_id === sizeId);
      
      if (existing) {
        // Actualizar stock
        return prev.map((s) =>
          s.size_id === sizeId ? { ...s, stock: parseInt(stock) || 0 } : s
        );
      } else {
        // Agregar nuevo talle
        return [...prev, { size_id: sizeId, stock: parseInt(stock) || 0 }];
      }
    });
  };

  // 👉 cambios en input file (imagen)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setForm((prev) => ({ ...prev, imageFile: null }));
      setImagePreview(null);
      return;
    }

    // Validar tamaño mínimo: 10KB
    if (file.size < 10 * 1024) {
      setError("La imagen es muy pequeña. Mínimo 10KB");
      return;
    }

    // Validar tamaño máximo: 2MB
    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen no puede superar los 2MB");
      return;
    }

    // Validar formato
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Formato no permitido. Solo JPG, PNG o WEBP");
      return;
    }

    // Validar dimensiones
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(imageUrl);

      if (img.width < 600 || img.height < 600) {
        setError(`Imagen muy pequeña. Mínimo 600x600px. Tu imagen: ${img.width}x${img.height}px`);
        return;
      }

      if (img.width > 2000 || img.height > 2000) {
        setError(`Imagen muy grande. Máximo 2000x2000px. Tu imagen: ${img.width}x${img.height}px`);
        return;
      }

      // Validaciones pasadas
      setError(null);
      setForm((prev) => ({ ...prev, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
    };

    img.onerror = () => {
      setError("No se pudo procesar la imagen. Verifica que sea una imagen válida");
      URL.revokeObjectURL(imageUrl);
    };

    img.src = imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validar que marroquinería tenga subcategoría
    if (form.category === 'marroquineria' && !form.subcategory) {
      setError("Debes seleccionar una subcategoría para marroquinería");
      return;
    }

    // Validar stock de marroquinería
    if (form.category === 'marroquineria' && marroquineriaStock <= 0) {
      setError("El stock de marroquinería debe ser mayor a 0");
      return;
    }

    try {
      // Para marroquinería, crear array de sizes con el talle "Único"
      let sizes = selectedSizes.filter((s) => s.stock > 0);
      
      if (form.category === 'marroquineria') {
        // El backend espera un array de { size_id, stock }
        // Para marroquinería usamos size_id: "marroquineria_unico" como placeholder
        // Luego en el backend buscaremos el size_id real del talle "Único"
        sizes = [{ size_type: 'marroquineria', size_value: 'Único', stock: marroquineriaStock }];
      }

      await createProduct({
        ...form,
        price: parseFloat(form.price),
        sizes: sizes,
      });

      navigate("/admin/productos");
    } catch (err) {
      console.error(err);
      setError("Hubo un error al crear el producto");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Nuevo producto</h2>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="marroquineria">Marroquinería</option>
            <option value="remeras">Remeras</option>
            <option value="pantalones">Pantalones</option>
            <option value="buzos">Buzos</option>
          </select>
        </div>

        {/* SUBCATEGORÍA PARA MARROQUINERÍA */}
        {form.category === 'marroquineria' && (
          <div className="mb-3">
            <label className="form-label">Subcategoría</label>
            <select
              className="form-select"
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una subcategoría</option>
              {marroquineriaSubcategories.map((sub) => (
                <option key={sub.id} value={sub.nombre}>
                  {sub.nombre.charAt(0).toUpperCase() + sub.nombre.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        {/* IMAGEN */}
        <div className="mb-3">
          <label className="form-label">Imagen del producto</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="form-text">
            <strong>Dimensiones:</strong><br />
            • Mínimo: 600×600 px | Máximo: 2000×2000 px<br />
            • <span className="text-primary">Recomendado: 1200×1200 px</span>
          </div>
        </div>

        {imagePreview && (
          <div className="mb-3">
            <p className="mb-2">Preview:</p>
            <img
              src={imagePreview}
              alt="Preview producto"
              className="img-fluid rounded border mb-2"
              style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
            />
            <button
              type="button"
              className="btn btn-danger btn-sm ms-2"
              onClick={() => {
                URL.revokeObjectURL(imagePreview);
                setImagePreview(null);
                setForm((prev) => ({ ...prev, imageFile: null }));
              }}
            >
              Quitar imagen
            </button>
          </div>
        )}

        {/* STOCK PARA MARROQUINERÍA */}
        {form.category === 'marroquineria' && (
          <div className="mb-3">
            <label className="form-label">Stock</label>
            <input
              type="number"
              className="form-control"
              value={marroquineriaStock}
              onChange={(e) => setMarroquineriaStock(parseInt(e.target.value) || 0)}
              required
              min="0"
              placeholder="Ingresa la cantidad en stock"
            />
          </div>
        )}

        {/* TALLES (solo si no es marroquinería) */}
{form.category !== 'marroquineria' && availableSizes.length > 0 && (
  <div className="mb-3">
    <label className="form-label">Talles y Stock</label>
    <div className="border rounded p-3">
      {[...availableSizes]
        .sort((a, b) => {
          // 🟦 Pantalones → orden numérico
          if (form.category === 'pantalones') {
            return Number(a.size) - Number(b.size);
          }

          // 🟩 Remeras / Buzos → orden correcto de ropa
          const ORDER_ROPA = ["XS", "S", "M", "L", "XL"];
          return ORDER_ROPA.indexOf(a.size) - ORDER_ROPA.indexOf(b.size);
        })
        .map((size) => {
          const currentStock =
            selectedSizes.find((s) => s.size_id === size.id)?.stock || 0;

          return (
            <div key={size.id} className="row mb-2 align-items-center">
              <div className="col-3">
                <strong>{size.size}</strong>
              </div>
              <div className="col-5">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Stock"
                  min="0"
                  value={currentStock}
                  onChange={(e) =>
                    handleSizeStockChange(size.id, e.target.value)
                  }
                />
              </div>
            </div>
          );
        })}
    </div>
  </div>
)}


        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="activoCheck"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="activoCheck">
            Producto activo
          </label>
        </div>

        <button type="submit" className="btn btn-primary me-2">
          Guardar
        </button>
        <Link to="/admin/productos" className="btn btn-secondary">
          Cancelar
        </Link>
      </form>
    </div>
  );
}

export default AdminNuevoProducto;
