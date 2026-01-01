import express from "express";
import cors from "cors";
import { envs } from "./config/env.js";
import router from "./routes/index.routes.js";
import { testDBConnection } from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

// Rutas específicas
import homeRoutes from "./routes/home.routes.js";
import adminHomeRoutes from "./routes/adminHome.routes.js";

// __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rutas
app.use("/api/home", homeRoutes);
app.use("/api/admin/home", adminHomeRoutes);

// Servir imágenes estáticas
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Resto de la API
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

// Start server
const startServer = async () => {
  await testDBConnection();
  app.listen(envs.PORT, () => {
    console.log(`✅ Backend escuchando en http://localhost:${envs.PORT}`);
  });
};

startServer();
