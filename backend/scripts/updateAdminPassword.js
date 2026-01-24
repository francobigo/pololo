import bcrypt from "bcrypt";
import { pool } from "../src/config/db.js";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var ${name}`);
    process.exit(1);
  }
  return value;
}

async function main() {
  const email = requireEnv("ADMIN_EMAIL");
  const password = requireEnv("ADMIN_PASSWORD");

  try {
    const { rows } = await pool.query(
      "SELECT id, role FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    const user = rows[0];
    if (!user || user.role !== "admin") {
      console.error(`No existe admin con email ${email}`);
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "UPDATE users SET password_hash = $2 WHERE email = $1",
      [email, passwordHash]
    );

    if (result.rowCount === 1) {
      console.log(`Contraseña de admin actualizada para ${email}`);
    } else {
      console.error("No se pudo actualizar la contraseña (rowCount != 1)");
    }
    process.exit(0);
  } catch (error) {
    console.error("Error actualizando contraseña de admin:", error.message || error);
    process.exit(1);
  }
}

main();
