import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config, validateConfig } from './config';
import routes from './routes';

/**
 * Crea y configura la aplicación Express
 */
function createApp(): express.Application {
  const app = express();

  // Validar configuración
  validateConfig();

  // Middlewares de seguridad
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // CORS configuration
  app.use(cors({
    origin: config.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Middlewares de parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Routes
  app.use('/api', routes);

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Articles API Server',
      version: '1.0.0',
      endpoints: {
        articles: '/api/articles',
        stats: '/api/articles/stats',
        health: '/api/health'
      }
    });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `Endpoint ${req.method} ${req.originalUrl} no encontrado`
    });
  });

  // Error handler
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  });

  return app;
}

/**
 * Inicia el servidor
 */
async function startServer(): Promise<void> {
  try {
    const app = createApp();
    
    const server = app.listen(config.port, () => {
      console.log(`🚀 Servidor iniciado en puerto ${config.port}`);
      console.log(`📖 Documentación disponible en http://localhost:${config.port}`);
      console.log(`🏥 Health check: http://localhost:${config.port}/api/health`);
      console.log(`📊 Artículos: http://localhost:${config.port}/api/articles`);
      console.log(`📈 Estadísticas: http://localhost:${config.port}/api/articles/stats`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Iniciar servidor si este archivo es ejecutado directamente
if (require.main === module) {
  startServer();
}

export { createApp, startServer };
