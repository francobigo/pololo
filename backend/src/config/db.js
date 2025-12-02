// backend/src/config/db.js
import pkg from "pg";
import { envs } from "./env.js";

const { Pool } = pkg;

export const pool = new Pool({
  host: envs.DB_HOST,
  port: Number(envs.DB_PORT),
  user: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
});

// Test de conexión
export const testDBConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Conectado a PostgreSQL:", result.rows[0].now);
  } catch (err) {
    console.error("❌ Error conectando a PostgreSQL:", err.message);
  }
};
