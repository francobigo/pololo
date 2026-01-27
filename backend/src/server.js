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

// --- CONFIGURACIÓN DE CORS MEJORADA ---
app.use(cors({
  origin: '*', // Permite que tu frontend en Vercel se conecte sin bloqueos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/home", homeRoutes);
app.use("/api/admin/home", adminHomeRoutes);

// Servir imágenes estáticas
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Resto de la API
app.use("/api", router);

// Root (Útil para verificar que el backend está vivo)
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Pololo API is running",
    database: "Connected",
    timestamp: new Date()
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Iniciar servidor con el test de DB
const startServer = async () => {
  try {
    await testDBConnection();
    app.listen(envs.PORT, () => {
      console.log(`✅ Backend escuchando en el puerto ${envs.PORT}`);
    });
  } catch (error) {
    console.error("❌ No se pudo iniciar el servidor debido a la base de datos:", error);
  }
};

startServer();