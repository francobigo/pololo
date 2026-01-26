// backend/src/config/env.js
import "dotenv/config";

function ensureEnvVar(name) {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing or empty environment variable: ${name}`);
  }
  return value;
}

export const envs = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || "development",

  DB_HOST: ensureEnvVar("DB_HOST"),
  DB_PORT: ensureEnvVar("DB_PORT"),
  DB_USER: ensureEnvVar("DB_USER"),
  DB_PASSWORD: ensureEnvVar("DB_PASSWORD"),
  DB_NAME: ensureEnvVar("DB_NAME"),

  JWT_SECRET: ensureEnvVar("JWT_SECRET"),

  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};
