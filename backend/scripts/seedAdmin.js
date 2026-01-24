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
    const existing = await pool.query(
      "SELECT 1 FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (existing.rowCount > 0) {
      console.log(`Admin with email ${email} already exists. Skipping.`);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)",
      [email, passwordHash, "admin"]
    );

    console.log(`Admin user created with email ${email}`);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error.message || error);
    process.exit(1);
  }
}

main();
