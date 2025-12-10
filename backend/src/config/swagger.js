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
        url: '/', // URL relative - sera remplacée dynamiquement
        description: 'Serveur de production',
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
      responses: {
        ValidationError: {
          description: 'Erreur de validation',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                success: false,
                message: 'Erreur de validation',
              },
            },
          },
        },
        UnauthorizedError: {
          description: 'Non autorisé - Token invalide ou expiré',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                success: false,
                message: 'Non autorisé',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Accès interdit',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                success: false,
                message: 'Accès interdit',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Ressource non trouvée',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                success: false,
                message: 'Ressource non trouvée',
              },
            },
          },
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
            latitude: {
              type: 'number',
              format: 'float',
              minimum: -90,
              maximum: 90,
              description: 'Latitude',
              example: 14.7167,
            },
            longitude: {
              type: 'number',
              format: 'float',
              minimum: -180,
              maximum: 180,
              description: 'Longitude',
              example: -17.4677,
            },
            address: {
              type: 'string',
              description: 'Adresse',
              example: 'Dakar, Sénégal',
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
        Provider: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID unique du prestataire',
            },
            userId: {
              type: 'string',
              description: 'ID de l\'utilisateur associé',
            },
            businessName: {
              type: 'string',
              description: 'Nom de l\'entreprise',
              example: 'Agri Services Sénégal',
            },
            description: {
              type: 'string',
              description: 'Description du prestataire',
              example: 'Services agricoles de qualité',
            },
            documents: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Documents du prestataire',
              example: ['doc1.pdf', 'doc2.pdf'],
            },
            isApproved: {
              type: 'boolean',
              description: 'Statut d\'approbation',
              example: false,
            },
            rating: {
              type: 'number',
              format: 'float',
              minimum: 0,
              maximum: 5,
              description: 'Note moyenne',
              example: 0,
            },
            totalBookings: {
              type: 'integer',
              description: 'Nombre total de réservations',
              example: 0,
            },
            latitude: {
              type: 'number',
              format: 'float',
              minimum: -90,
              maximum: 90,
              description: 'Latitude',
              example: 14.7167,
            },
            longitude: {
              type: 'number',
              format: 'float',
              minimum: -180,
              maximum: 180,
              description: 'Longitude',
              example: -17.4677,
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
        Booking: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID unique de la réservation',
            },
            userId: {
              type: 'string',
              description: 'ID de l\'utilisateur',
            },
            serviceId: {
              type: 'string',
              description: 'ID du service',
            },
            providerId: {
              type: 'string',
              description: 'ID du prestataire',
            },
            bookingDate: {
              type: 'string',
              format: 'date',
              description: 'Date de réservation',
              example: '2024-12-15',
            },
            startTime: {
              type: 'string',
              pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
              description: 'Heure de début (HH:MM)',
              example: '08:00',
            },
            endTime: {
              type: 'string',
              pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
              description: 'Heure de fin (HH:MM)',
              example: '17:00',
            },
            duration: {
              type: 'integer',
              minimum: 1,
              description: 'Durée en heures',
              example: 8,
            },
            totalPrice: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Prix total',
              example: 40000,
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'completed', 'cancelled'],
              description: 'Statut de la réservation',
              example: 'pending',
            },
            latitude: {
              type: 'number',
              format: 'float',
              minimum: -90,
              maximum: 90,
              description: 'Latitude',
              example: 14.7167,
            },
            longitude: {
              type: 'number',
              format: 'float',
              minimum: -180,
              maximum: 180,
              description: 'Longitude',
              example: -17.4677,
            },
            notes: {
              type: 'string',
              description: 'Notes additionnelles',
              example: 'Travaux de labour',
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
        Payment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID unique du paiement',
            },
            bookingId: {
              type: 'string',
              description: 'ID de la réservation',
            },
            userId: {
              type: 'string',
              description: 'ID de l\'utilisateur',
            },
            providerId: {
              type: 'string',
              description: 'ID du prestataire',
            },
            amount: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Montant du paiement',
              example: 40000,
            },
            paymentMethod: {
              type: 'string',
              enum: ['paytech'],
              description: 'Méthode de paiement',
              example: 'paytech',
            },
            transactionId: {
              type: 'string',
              description: 'ID de transaction',
              example: 'paytech-txn-123',
            },
            paytechTransactionId: {
              type: 'string',
              description: 'ID de transaction PayTech',
              example: 'paytech-txn-123',
            },
            status: {
              type: 'string',
              enum: ['pending', 'success', 'failed', 'cancelled'],
              description: 'Statut du paiement',
              example: 'pending',
            },
            paymentDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date du paiement',
            },
            metadata: {
              type: 'object',
              description: 'Métadonnées du paiement',
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
        CreateBookingRequest: {
          type: 'object',
          required: ['serviceId', 'bookingDate', 'startTime'],
          properties: {
            serviceId: {
              type: 'string',
              format: 'uuid',
              description: 'ID du service',
              example: 'service-id-123',
            },
            bookingDate: {
              type: 'string',
              format: 'date',
              description: 'Date de réservation (YYYY-MM-DD)',
              example: '2024-12-15',
            },
            startTime: {
              type: 'string',
              pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
              description: 'Heure de début (HH:MM)',
              example: '08:00',
            },
            endTime: {
              type: 'string',
              pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
              description: 'Heure de fin (HH:MM) - requis si duration non fourni',
              example: '17:00',
            },
            duration: {
              type: 'integer',
              minimum: 1,
              description: 'Durée en heures - requis si endTime non fourni',
              example: 8,
            },
            latitude: {
              type: 'number',
              format: 'float',
              minimum: -90,
              maximum: 90,
              description: 'Latitude',
              example: 14.7167,
            },
            longitude: {
              type: 'number',
              format: 'float',
              minimum: -180,
              maximum: 180,
              description: 'Longitude',
              example: -17.4677,
            },
            notes: {
              type: 'string',
              description: 'Notes additionnelles',
              example: 'Travaux de labour',
            },
          },
        },
        InitiatePaymentRequest: {
          type: 'object',
          required: ['bookingId', 'phoneNumber'],
          properties: {
            bookingId: {
              type: 'string',
              format: 'uuid',
              description: 'ID de la réservation',
              example: 'booking-id-123',
            },
            phoneNumber: {
              type: 'string',
              pattern: '^\\+?[0-9]+$',
              description: 'Numéro de téléphone pour le paiement Mobile Money',
              example: '+221771234567',
            },
          },
        },
        Service: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID unique du service',
            },
            providerId: {
              type: 'string',
              description: 'ID du prestataire',
            },
            serviceType: {
              type: 'string',
              enum: ['tractor', 'semoir', 'operator', 'other'],
              description: 'Type de service',
              example: 'tractor',
            },
            name: {
              type: 'string',
              description: 'Nom du service',
              example: 'Tracteur John Deere 6120',
            },
            description: {
              type: 'string',
              description: 'Description du service',
              example: 'Tracteur puissant pour travaux agricoles',
            },
            pricePerHour: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Prix par heure',
              example: 5000,
            },
            pricePerDay: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Prix par jour',
              example: 40000,
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Images du service',
              example: ['image1.jpg', 'image2.jpg'],
            },
            availability: {
              type: 'boolean',
              description: 'Disponibilité',
              example: true,
            },
            latitude: {
              type: 'number',
              format: 'float',
              minimum: -90,
              maximum: 90,
              description: 'Latitude',
              example: 14.7167,
            },
            longitude: {
              type: 'number',
              format: 'float',
              minimum: -180,
              maximum: 180,
              description: 'Longitude',
              example: -17.4677,
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
        UpdateProfileRequest: {
          type: 'object',
          properties: {
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
            address: {
              type: 'string',
              example: 'Dakar, Sénégal',
            },
          },
        },
        UpdateLocationRequest: {
          type: 'object',
          required: ['latitude', 'longitude'],
          properties: {
            latitude: {
              type: 'number',
              format: 'float',
              minimum: -90,
              maximum: 90,
              example: 14.7167,
              description: 'Latitude (-90 à 90)',
            },
            longitude: {
              type: 'number',
              format: 'float',
              minimum: -180,
              maximum: 180,
              example: -17.4677,
              description: 'Longitude (-180 à 180)',
            },
            address: {
              type: 'string',
              example: 'Dakar, Sénégal',
              description: 'Adresse (optionnel)',
            },
          },
        },
        UpdateLanguageRequest: {
          type: 'object',
          required: ['language'],
          properties: {
            language: {
              type: 'string',
              enum: ['fr', 'wolof'],
              example: 'wolof',
              description: 'Langue préférée',
            },
          },
        },
        RegisterProviderRequest: {
          type: 'object',
          required: ['businessName'],
          properties: {
            businessName: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'Agri Services Sénégal',
              description: 'Nom de l\'entreprise (2-100 caractères)',
            },
            description: {
              type: 'string',
              example: 'Services agricoles de qualité',
              description: 'Description du prestataire',
            },
            documents: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['doc1.pdf', 'doc2.pdf'],
              description: 'Documents du prestataire',
            },
          },
        },
        UpdateProviderRequest: {
          type: 'object',
          properties: {
            businessName: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'Nouveau nom',
            },
            description: {
              type: 'string',
              example: 'Nouvelle description',
            },
            documents: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['nouveau-doc.pdf'],
            },
          },
        },
        CreateServiceRequest: {
          type: 'object',
          required: ['serviceType', 'name'],
          properties: {
            serviceType: {
              type: 'string',
              enum: ['tractor', 'semoir', 'operator', 'other'],
              example: 'tractor',
              description: 'Type de service',
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'Tracteur John Deere 6120',
              description: 'Nom du service (2-100 caractères)',
            },
            description: {
              type: 'string',
              example: 'Tracteur puissant pour travaux agricoles',
            },
            pricePerHour: {
              type: 'number',
              format: 'float',
              minimum: 0,
              example: 5000,
              description: 'Prix par heure (au moins un prix requis)',
            },
            pricePerDay: {
              type: 'number',
              format: 'float',
              minimum: 0,
              example: 40000,
              description: 'Prix par jour (au moins un prix requis)',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['image1.jpg', 'image2.jpg'],
            },
            availability: {
              type: 'boolean',
              default: true,
              example: true,
            },
            latitude: {
              type: 'number',
              format: 'float',
              minimum: -90,
              maximum: 90,
              example: 14.7167,
            },
            longitude: {
              type: 'number',
              format: 'float',
              minimum: -180,
              maximum: 180,
              example: -17.4677,
            },
          },
        },
        UpdateServiceRequest: {
          type: 'object',
          properties: {
            serviceType: {
              type: 'string',
              enum: ['tractor', 'semoir', 'operator', 'other'],
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
            },
            description: {
              type: 'string',
            },
            pricePerHour: {
              type: 'number',
              format: 'float',
              minimum: 0,
            },
            pricePerDay: {
              type: 'number',
              format: 'float',
              minimum: 0,
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            availability: {
              type: 'boolean',
            },
            latitude: {
              type: 'number',
              format: 'float',
              minimum: -90,
              maximum: 90,
            },
            longitude: {
              type: 'number',
              format: 'float',
              minimum: -180,
              maximum: 180,
            },
          },
        },
        UpdateAvailabilityRequest: {
          type: 'object',
          required: ['availability'],
          properties: {
            availability: {
              type: 'boolean',
              example: false,
              description: 'Statut de disponibilité',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Données récupérées avec succès',
            },
            data: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1,
                },
                limit: {
                  type: 'integer',
                  example: 20,
                },
                total: {
                  type: 'integer',
                  example: 100,
                },
                totalPages: {
                  type: 'integer',
                  example: 5,
                },
              },
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
      {
        name: 'Users',
        description: 'Gestion des utilisateurs',
      },
      {
        name: 'Providers',
        description: 'Gestion des prestataires',
      },
      {
        name: 'Services',
        description: 'Gestion des services agricoles',
      },
      {
        name: 'Bookings',
        description: 'Gestion des réservations',
      },
      {
        name: 'Payments',
        description: 'Gestion des paiements PayTech',
      },
    ],
  },
  apis: [
    path.join(routesPath, '*.js'),
    appPath,
  ],
};

// Fonction pour générer la spécification Swagger avec l'URL dynamique basée sur la requête
const generateSwaggerSpec = (req = null) => {
  // Déterminer l'URL de base dynamiquement
  let baseUrl;
  
  if (process.env.API_URL) {
    // Priorité 1: Variable d'environnement API_URL
    baseUrl = process.env.API_URL;
  } else if (req && req.headers && req.headers.host) {
    // Priorité 2: URL depuis les headers de la requête
    const protocol = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
    baseUrl = `${protocol}://${req.headers.host}`;
  } else if (process.env.VERCEL === '1' && process.env.VERCEL_URL) {
    // Priorité 3: URL automatique de Vercel
    baseUrl = `https://${process.env.VERCEL_URL}`;
  } else {
    // Fallback: localhost
    baseUrl = `http://localhost:${PORT}`;
  }

  // Cloner les options et mettre à jour l'URL du serveur
  const dynamicOptions = {
    ...options,
    definition: {
      ...options.definition,
      servers: [
        {
          url: baseUrl,
          description: process.env.VERCEL === '1' ? 'Serveur de production (Vercel)' : 'Serveur de développement',
        },
        {
          url: `http://localhost:${PORT}`,
          description: 'Serveur de développement (local)',
        },
      ],
    },
  };

  return swaggerJsdoc(dynamicOptions);
};

// Spécification par défaut (sans requête) pour compatibilité
const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec, generateSwaggerSpec };

