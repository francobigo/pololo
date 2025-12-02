import { pool } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error obteniendo productos:", error);
    res.status(500).json({ message: "Error obteniendo productos" });
  }
};
