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
const { swaggerSpec, generateSwaggerSpec } = require('./config/swagger');

// Initialiser l'application Express
const app = express();

// Configurer trust proxy pour Vercel (nécessaire pour express-rate-limit)
// Vercel utilise un proxy, donc on doit faire confiance aux headers X-Forwarded-*
app.set('trust proxy', true);

// Middleware de sécurité (configuré pour permettre Swagger UI et les apps mobiles)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://unpkg.com'],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://unpkg.com'],
      scriptSrcElem: ["'self'", "'unsafe-inline'", 'https://unpkg.com'],
      styleSrcElem: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://unpkg.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", 'https://unpkg.com'],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Permettre les ressources cross-origin pour les apps mobiles
  crossOriginOpenerPolicy: false, // Désactiver pour permettre l'accès depuis les apps mobiles
}));

// Configuration CORS pour permettre les requêtes depuis les applications mobiles
const corsOptions = {
  origin: function (origin, callback) {
    // 1. TOUJOURS autoriser les requêtes sans origine (applications mobiles natives)
    // Les apps Flutter, React Native, etc. n'envoient pas d'en-tête Origin
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // 2. En développement, autoriser toutes les origines
    if (NODE_ENV === 'development') {
      callback(null, true);
      return;
    }
    
    // 3. En production, vérifier la liste des origines autorisées
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
      : [process.env.FRONTEND_URL || '*'];
    
    // 4. Si '*' est dans la liste, tout autoriser
    if (allowedOrigins.includes('*')) {
      callback(null, true);
      return;
    }
    
    // 5. Vérifier si l'origine est dans la liste autorisée
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par la politique CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'X-Forwarded-For',
    'X-Forwarded-Proto',
    'X-Forwarded-Port'
  ],
  exposedHeaders: [
    'Content-Length',
    'Content-Type',
    'Authorization',
    'X-Total-Count',
    'X-Page',
    'X-Limit'
  ],
  maxAge: 86400, // 24 heures - cache des preflight requests
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Gestion explicite des requêtes OPTIONS (preflight) pour les applications mobiles
app.options('*', cors(corsOptions));

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

// Servir le JSON Swagger (doit être défini avant les autres routes)
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  // Générer la spécification Swagger avec l'URL dynamique basée sur la requête
  const dynamicSpec = generateSwaggerSpec(req);
  
  // Log pour debug si nécessaire
  if (process.env.NODE_ENV === 'development') {
    console.log('Swagger spec paths:', Object.keys(dynamicSpec.paths || {}));
    console.log('Swagger server URL:', dynamicSpec.servers?.[0]?.url);
  }
  
  res.json(dynamicSpec);
});

// Sur Vercel, créer une route personnalisée qui sert Swagger UI avec les assets depuis un CDN
if (isVercel) {
  app.get('/api-docs', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${swaggerOptions.customSiteTitle}</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    ${swaggerOptions.customCss}
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/api-docs/swagger.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout",
        deepLinking: true,
        showExtensions: true,
        showCommonExtensions: true,
        persistAuthorization: ${swaggerOptions.swaggerOptions.persistAuthorization},
        displayRequestDuration: ${swaggerOptions.swaggerOptions.displayRequestDuration},
        tryItOutEnabled: true
      });
    };
  </script>
</body>
</html>
    `;
    res.send(html);
  });
} else {
  // Configuration normale pour le développement
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

// Route pour le favicon (évite les erreurs 404)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
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

    // Vérifier la configuration email
    const emailService = require('./services/email/email.service');
    if (!emailService.isEmailConfigured()) {
      console.log('');
      console.log('⚠️  ATTENTION: Configuration email non complète');
      console.log('   Les emails (OTP, bienvenue, réinitialisation) ne seront pas envoyés.');
      console.log('   Pour activer l\'envoi d\'emails, configurez dans votre .env:');
      console.log('   - EMAIL_USER');
      console.log('   - EMAIL_PASSWORD');
      console.log('   - EMAIL_FROM_EMAIL');
      console.log('   Voir ENV_VARIABLES.md pour plus de détails.');
      console.log('');
    } else {
      console.log('✅ Configuration email OK');
    }

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
