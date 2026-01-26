// src/config/db.js
import pkg from "pg";
import { envs } from "./env.js";

const { Pool } = pkg;

// Solo activamos SSL si no estamos en modo desarrollo o si la URL es de Supabase
const useSSL = envs.NODE_ENV === "production" || envs.DB_HOST.includes("supabase.co") || envs.DB_HOST.includes("pooler.supabase.com");

const sslConfig = useSSL 
  ? { rejectUnauthorized: false } 
  : false; // En localhost (desarrollo) se desactiva

export const pool = envs.DATABASE_URL
  ? new Pool({
      connectionString: envs.DATABASE_URL,
      ssl: sslConfig,
    })
  : new Pool({
      host: envs.DB_HOST,
      port: Number(envs.DB_PORT),
      user: envs.DB_USER,
      password: envs.DB_PASSWORD,
      database: envs.DB_NAME,
      ssl: sslConfig,
    });

export const testDBConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Conectado a PostgreSQL:", result.rows[0].now);
  } catch (err) {
    console.error("❌ Error conectando a PostgreSQL:", err.message);
  }
};