const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const { PORT, NODE_ENV } = require('./env');

// Utiliser des chemins absolus pour éviter les problèmes sur Vercel
const routesPath = path.join(__dirname, '../routes');
const appPath = path.join(__dirname, '../app.js');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AGRO BOOST API',
      version: '1.0.0',
      description: 'API REST pour la plateforme AGRO BOOST - Réservation de services agricoles au Sénégal',
      contact: {
        name: 'AGRO BOOST',
        email: 'infos@agro-boost.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        // Utiliser API_URL si définie, sinon VERCEL_URL (auto), sinon URL par défaut
        url: process.env.API_URL 
          ? process.env.API_URL
          : process.env.VERCEL === '1' && process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.VERCEL === '1'
          ? 'https://agro-boost-ruddy.vercel.app'
          : `http://localhost:${PORT}`,
        description: process.env.VERCEL === '1' ? 'Serveur de production (Vercel)' : 'Serveur de développement',
      },
      {
        url: `http://localhost:${PORT}`,
        description: 'Serveur de développement (local)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrer le token JWT obtenu lors de la connexion',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID unique de l\'utilisateur',
            },
            phoneNumber: {
              type: 'string',
              description: 'Numéro de téléphone (format international)',
              example: '+221771234567',
            },
            firstName: {
              type: 'string',
              description: 'Prénom',
              example: 'Amadou',
            },
            lastName: {
              type: 'string',
              description: 'Nom',
              example: 'Diallo',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email (optionnel)',
              example: 'amadou@example.com',
            },
            language: {
              type: 'string',
              enum: ['fr', 'wolof'],
              description: 'Langue préférée',
              example: 'fr',
            },
            role: {
              type: 'string',
              enum: ['user', 'provider', 'admin'],
              description: 'Rôle de l\'utilisateur',
              example: 'user',
            },
            isVerified: {
              type: 'boolean',
              description: 'Statut de vérification',
              example: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Opération réussie',
            },
            data: {
              type: 'object',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Message d\'erreur',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['phoneNumber', 'firstName', 'lastName'],
          properties: {
            phoneNumber: {
              type: 'string',
              pattern: '^[0-9+]+$',
              example: '+221771234567',
              description: 'Numéro de téléphone au format international',
            },
            firstName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Amadou',
            },
            lastName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Diallo',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'amadou@example.com',
            },
            language: {
              type: 'string',
              enum: ['fr', 'wolof'],
              default: 'fr',
              example: 'fr',
            },
          },
        },
        VerifyOTPRequest: {
          type: 'object',
          required: ['phoneNumber', 'code'],
          properties: {
            phoneNumber: {
              type: 'string',
              example: '+221771234567',
            },
            code: {
              type: 'string',
              pattern: '^[0-9]{6}$',
              example: '123456',
              description: 'Code OTP à 6 chiffres',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['phoneNumber'],
          properties: {
            phoneNumber: {
              type: 'string',
              example: '+221771234567',
              description: 'Numéro de téléphone',
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123',
              description: 'Mot de passe (optionnel si l\'utilisateur n\'a pas de mot de passe)',
            },
          },
        },
        RefreshTokenRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Connexion réussie',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  type: 'string',
                  description: 'Token JWT d\'accès',
                },
                refreshToken: {
                  type: 'string',
                  description: 'Token de rafraîchissement',
                },
              },
            },
          },
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['phoneNumber'],
          properties: {
            phoneNumber: {
              type: 'string',
              example: '+221771234567',
              description: 'Numéro de téléphone',
            },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['token', 'newPassword'],
          properties: {
            token: {
              type: 'string',
              example: 'reset-token-here',
              description: 'Token de réinitialisation reçu par email',
            },
            newPassword: {
              type: 'string',
              minLength: 6,
              example: 'newPassword123',
              description: 'Nouveau mot de passe (minimum 6 caractères)',
            },
          },
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: {
              type: 'string',
              example: 'currentPassword123',
              description: 'Mot de passe actuel',
            },
            newPassword: {
              type: 'string',
              minLength: 6,
              example: 'newPassword123',
              description: 'Nouveau mot de passe (minimum 6 caractères)',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'Vérification de l\'état du serveur',
      },
      {
        name: 'Authentification',
        description: 'Endpoints d\'authentification et de gestion des utilisateurs',
      },
    ],
  },
  apis: [
    path.join(routesPath, '*.js'),
    appPath,
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

