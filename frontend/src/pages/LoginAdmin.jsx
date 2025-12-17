import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 👈 Importamos el hook

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  // 🔐 Obtenemos la función login del contexto
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Credenciales inválidas");

      const data = await res.json();

      // ✅ EXPLICACIÓN: Usamos la función del contexto. 
      // Si data.user no existe, enviamos un objeto con el email para que no sea 'undefined'.
      const userToSave = data.user || { email: email, role: 'admin' };
      
      login(data.token, userToSave); 

      // 👉 Ir al panel admin
      navigate("/admin/productos");

    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <section style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Login Admin</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
    </section>
  );
}

export default LoginAdmin;