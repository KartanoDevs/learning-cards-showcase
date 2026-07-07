// src/index.ts
import 'dotenv/config';
import { createApp } from './app';
import { connectDB } from './config/db';
import { ENV } from './config/env';

const app = createApp();

// Aseguramos número
const PORT = Number(ENV.PORT || 4000);

// En producción, escuchamos en 0.0.0.0 para aceptar conexiones externas
const HOST = ENV.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 API escuchando en http://${HOST}:${PORT}`);
});

// Conecta a Mongo SIN bloquear el arranque del servidor
connectDB()
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => {
    console.error('⚠️ No se pudo conectar a MongoDB. La API sigue arriba para /health.', err);
  });

// Cierre ordenado (CTRL+C)
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando servidor...');
  server.close(() => {
    console.log('🛑 Servidor cerrado');
    process.exit(0);
  });
});
