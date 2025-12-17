import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { adminUser } from "../config/admin.js";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (email !== adminUser.email) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const validPassword = await bcrypt.compare(
    password,
    adminUser.passwordHash
  );

  if (!validPassword) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
};
