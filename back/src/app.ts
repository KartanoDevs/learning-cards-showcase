import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import routes from './routes';
import { ENV } from './config/env';
import { errorHandler } from './middlewares/errorHandler';

export const createApp = () => {
  const app = express();

  app.use(express.json({ limit: '2mb' }));
  app.use( cors( { origin: ENV.CORS_ORIGIN, credentials: false } ) );
  // Helmet deshabilitado para evitar conflictos con CORS en producción
  // app.use(helmet());
  app.use(compression());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => res.json({ ok: true, status: 'healthy' }));

  // ✅ monta /api
  app.use('/api', routes);

  // 404 JSON
  app.use((_req, res) => res.status(404).json({ ok: false, message: 'Ruta no encontrada' }));

  app.use(errorHandler);
  return app;
};
