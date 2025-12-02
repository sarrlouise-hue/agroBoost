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

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerOptions));

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

// Ne démarrer le serveur que si on n'est pas en mode test
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  startServer();
}

module.exports = app;
