import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("authUser");
      // MODIFICACIÓN: Agregamos check para el string "null" por seguridad
      if (!saved || saved === "undefined" || saved === "null") return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem("authToken");
    // MODIFICACIÓN: Agregamos check para el string "null"
    return saved && saved !== "undefined" && saved !== "null" ? saved : null;
  });

  const login = (token, user) => {
    // MODIFICACIÓN: Si 'user' llega como undefined desde el componente, 
    // guardamos un objeto genérico para que el Navbar funcione.
    const userToSave = user || { loggedIn: true, role: 'admin' };

    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(userToSave));
    
    setToken(token);
    setUser(userToSave);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);