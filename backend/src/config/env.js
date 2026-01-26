// backend/src/config/env.js
import "dotenv/config";

// Función modificada para que no sea tan estricta
function getEnvVar(name) {
  return process.env[name] || ""; 
}

export const envs = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || "development",

  DATABASE_URL: process.env.DATABASE_URL || "", 

  // Ahora estas no tiran error si están vacías
  DB_HOST: getEnvVar("DB_HOST"),
  DB_PORT: getEnvVar("DB_PORT"),
  DB_USER: getEnvVar("DB_USER"),
  DB_PASSWORD: getEnvVar("DB_PASSWORD"),
  DB_NAME: getEnvVar("DB_NAME"),

  JWT_SECRET: process.env.JWT_SECRET || "fallback_secret_por_si_las_dudas",

  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};