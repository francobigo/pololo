import express from 'express';
import cors from 'cors';
import { envs } from './config/env.js'; 
import router from './routes/index.routes.js';
import { testDBConnection } from './config/db.js';

const app = express();

app.use(cors());
app.use(express.json());

// Prefijo común de la API
app.use('/api', router);

// Ruta raíz para evitar confusión cuando se visita '/'
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API root — las rutas públicas están bajo /api',
    available: ['/api/health'],
  });
});

// 404 (colocado después de rutas definidas)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Inicializar y arrancar server después de comprobar conexión a DB
const startServer = async () => {
  // Probar conexión a PostgreSQL una sola vez antes de arrancar
  await testDBConnection();

  app.listen(envs.PORT, () => {
    console.log(`✅ Backend escuchando en http://localhost:${envs.PORT}`);
  });
};

startServer();
