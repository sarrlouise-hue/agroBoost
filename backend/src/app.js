const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Importer la configuration
const { PORT, NODE_ENV } = require('./config/env');
const { connectDB } = require('./config/database');

// Détecter si on est sur Vercel (serverless)
const isVercel = process.env.VERCEL === '1';

// Importer les routes
const routes = require('./routes');

// Importer les middlewares
const errorMiddleware = require('./middleware/error.middleware');
const { rateLimiter } = require('./middleware/rateLimit.middleware');

// Importer Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Initialiser l'application Express
const app = express();

// Middleware de sécurité (configuré pour permettre Swagger UI)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));

// Middleware de parsing du corps
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Limitation du taux de requêtes (désactivé en mode test)
if (process.env.NODE_ENV !== 'test') {
  app.use(rateLimiter);
}

// Documentation Swagger
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'AGRO BOOST API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
  },
};

// Configuration Swagger UI
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: swaggerOptions.swaggerOptions,
  customCss: swaggerOptions.customCss,
  customSiteTitle: swaggerOptions.customSiteTitle,
};

// Sur Vercel, swagger-ui-express a des problèmes avec les fichiers statiques
// On utilise une configuration qui charge depuis un CDN via les options
if (isVercel) {
  // Utiliser swagger-ui-express avec une configuration qui charge les assets depuis unpkg
  swaggerUiOptions.customJs = [
    'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js',
    'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js',
  ];
  swaggerUiOptions.customCssUrl = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css';
}

// Servir Swagger UI
// Sur Vercel, on ne peut pas utiliser swaggerUi.serve car les fichiers statiques
// ne sont pas accessibles, donc on sert uniquement la page HTML avec les assets CDN
if (isVercel) {
  app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerUiOptions));
} else {
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerUiOptions));
}

/**
 * @swagger
 * /:
 *   get:
 *     summary: Page d'accueil de l'API
 *     tags: [Health]
 *     description: Retourne des informations sur l'API et les endpoints disponibles
 *     responses:
 *       200:
 *         description: Informations sur l'API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Bienvenue sur l'API AGRO BOOST
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 environment:
 *                   type: string
 *                   example: production
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     health:
 *                       type: string
 *                       example: /health
 *                     api:
 *                       type: string
 *                       example: /api
 *                     documentation:
 *                       type: string
 *                       example: /api-docs
 *                 status:
 *                   type: string
 *                   example: OK
 */
// Route d'accueil
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenue sur l\'API AGRO BOOST',
    version: '1.0.0',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      api: '/api',
      documentation: '/api-docs',
    },
    status: 'OK',
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Vérifier l'état du serveur
 *     tags: [Health]
 *     description: Endpoint de health check pour vérifier que le serveur fonctionne correctement
 *     responses:
 *       200:
 *         description: Serveur opérationnel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-01T00:00:00.000Z
 *                 environment:
 *                   type: string
 *                   example: production
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// Routes API
app.use('/api', routes);

// Gestionnaire 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
  });
});

// Middleware de gestion des erreurs (doit être en dernier)
app.use(errorMiddleware);

// Démarrer le serveur (uniquement si on n'est pas en mode test)
const startServer = async () => {
  try {
    // Connecter à PostgreSQL
    await connectDB();

    // Démarrer le serveur
    const server = app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT} en mode ${NODE_ENV}`);
    });

    // Arrêt gracieux
    process.on('SIGTERM', () => {
      console.log('Signal SIGTERM reçu: fermeture du serveur HTTP');
      server.close(() => {
        console.log('Serveur HTTP fermé');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Échec du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Ne démarrer le serveur que si on n'est pas en mode test et pas sur Vercel
const isTest = process.env.NODE_ENV === 'test';
const isMainModule = require.main === module;

if (!isTest && !isVercel && isMainModule) {
  startServer();
}

module.exports = app;
