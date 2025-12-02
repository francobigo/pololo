import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Conectar con backend para validar credenciales
    if (email && password) {
      localStorage.setItem("authToken", "fake-token");
      navigate("/admin");
    }
  };

  return (
    <section style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Login Admin</h1>
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
