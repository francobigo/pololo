import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT id, email, password_hash, role FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    const user = rows[0];

    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("Falta la variable JWT_SECRET");
      return res.status(500).json({ message: "Error en configuración del servidor" });
    }

    const token = jwt.sign(
      { role: "admin", email: user.email, userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ token });
  } catch (error) {
    console.error("Error al iniciar sesión admin:", error);
    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
};
