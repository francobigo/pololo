// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

// Hook para usar el carrito
export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Error leyendo carrito de localStorage", e);
      return [];
    }
  });

  // Persistir carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ===========================
     AGREGAR PRODUCTO
  =========================== */
  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      // Si ya está en el carrito
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert("No hay más stock disponible");
          return prev;
        }

        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Si no hay stock
      if (product.stock <= 0) {
        alert("Producto sin stock");
        return prev;
      }

      // Nuevo producto
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  /* ===========================
     QUITAR PRODUCTO
  =========================== */
  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  /* ===========================
     AUMENTAR CANTIDAD
  =========================== */
  function increaseQuantity(id) {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (item.quantity >= item.stock) {
          alert("No hay más stock disponible");
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      })
    );
  }

  /* ===========================
     DISMINUIR CANTIDAD
  =========================== */
  function decreaseQuantity(id) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  /* ===========================
     VACIAR CARRITO
  =========================== */
  function clearCart() {
    setCart([]);
  }

  /* ===========================
     TOTALES
  =========================== */
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const value = {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
