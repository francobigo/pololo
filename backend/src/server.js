import express from "express";
import cors from "cors";
import { envs } from "./config/env.js";
import router from "./routes/index.routes.js";
import { testDBConnection } from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Servir imágenes
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 👉 TODA la API pasa por acá
app.use("/api", router);

// Root
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "API root",
    available: ["/api/health", "/api/auth/login"],
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

const startServer = async () => {
  await testDBConnection();
  app.listen(envs.PORT, () => {
    console.log(`✅ Backend escuchando en http://localhost:${envs.PORT}`);
  });
};

startServer();
