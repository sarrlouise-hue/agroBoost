# Architecture - AGRO BOOST Backend

## Vue d'ensemble

Le backend AGRO BOOST est construit avec la stack **PERN** (PostgreSQL, Express, React, Node.js).

## Structure du Projet

```
backend/
├── src/
│   ├── config/          # Configuration
│   │   ├── database.js  # Connexion PostgreSQL
│   │   ├── env.js        # Variables d'environnement
│   │   └── constants.js  # Constantes
│   │
│   ├── models/          # Modèles Sequelize
│   │   ├── User.js      # Modèle utilisateur
│   │   ├── OTP.js       # Modèle OTP
│   │   └── PasswordResetToken.js  # Modèle token de réinitialisation
│   │
│   ├── data-access/     # Repositories (couche d'accès aux données)
│   │   ├── user.repository.js
│   │   ├── otp.repository.js
│   │   └── passwordResetToken.repository.js
│   │
│   ├── controllers/     # Contrôleurs
│   │   └── auth/
│   │       └── auth.controller.js
│   │
│   ├── routes/          # Routes API
│   │   ├── index.js
│   │   └── auth.routes.js
│   │
│   ├── services/        # Services métier
│   │   └── auth/
│   │       ├── auth.service.js
│   │       ├── otp.service.js
│   │       └── password.service.js
│   │
│   ├── middleware/      # Middlewares Express
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── rateLimit.middleware.js
│   │
│   ├── validators/      # Validateurs Joi
│   │   └── auth.validator.js
│   │
│   ├── utils/           # Utilitaires
│   │   ├── errors.js
│   │   ├── logger.js
│   │   └── response.js
│   │
│   └── app.js           # Point d'entrée
│
├── tests/               # Tests
│   ├── unit/
│   ├── integration/
│   └── setup.js
│
├── doc/                 # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
│
└── package.json
```

## Flux de Données

### Inscription
```
Client → Route → Validator → Controller → Service → Repository → PostgreSQL
                ↓
            Middleware (Rate Limit)
```

### Authentification
```
Client → Route → Middleware (Auth) → Controller → Service → Repository → PostgreSQL
```

## Technologies

### Backend
- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web
- **PostgreSQL** : Base de données relationnelle
- **Sequelize** : ORM pour PostgreSQL

### Sécurité
- **JWT** : Authentification par tokens
- **Helmet** : Sécurisation des headers HTTP
- **CORS** : Gestion des origines croisées
- **Rate Limiting** : Protection contre les abus

### Validation
- **Joi** : Validation des schémas

### Logging
- **Winston** : Système de logs
- **Morgan** : Logs HTTP

## Modèles de Données

### User
```javascript
{
  id: UUID,
  phoneNumber: String (unique, required),
  firstName: String (required),
  lastName: String (required),
  email: String (optional, unique),
  language: String (enum: ['fr', 'wolof']),
  latitude: Decimal,
  longitude: Decimal,
  address: String,
  password: String (hashed, excluded by default),
  isVerified: Boolean,
  role: String (enum: ['user', 'provider', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### OTP
```javascript
{
  id: UUID,
  phoneNumber: String (required),
  code: String (required),
  expiresAt: Date (required),
  isUsed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### PasswordResetToken
```javascript
{
  id: UUID,
  userId: UUID (foreign key to User),
  token: String (unique, required),
  expiresAt: Date (required),
  isUsed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Couche Data-Access (Repositories)

Cette couche encapsule toutes les requêtes PostgreSQL et fournit une abstraction pour l'accès aux données. Elle permet de :
- Isoler la logique d'accès aux données
- Faciliter les tests (mocking)
- Faciliter les changements de base de données

## Middlewares

### Auth Middleware
- Vérifie le token JWT
- Extrait les informations utilisateur
- Gère les erreurs d'authentification

### Error Middleware
- Gestion centralisée des erreurs
- Format de réponse standardisé
- Logging des erreurs
- Gestion des erreurs Sequelize (ValidationError, UniqueConstraintError, etc.)

### Rate Limit Middleware
- Limitation globale : 100 req/15min
- Limitation auth : 5 req/15min

## Services

### Auth Service
- Génération et vérification de tokens JWT
- Inscription et connexion
- Rafraîchissement de tokens
- Connexion avec mot de passe

### OTP Service
- Génération de codes OTP
- Création et validation d'OTP
- Gestion de l'expiration

### Password Service
- Hashage et comparaison de mots de passe
- Création et validation de tokens de réinitialisation
- Réinitialisation et changement de mot de passe

## Sécurité

### Authentification
- JWT avec expiration (7 jours)
- Refresh tokens (30 jours)
- OTP pour vérification
- Mots de passe hashés avec bcrypt

### Protection
- Rate limiting
- Validation stricte des entrées
- Headers sécurisés (Helmet)
- CORS configuré
- Gestion des erreurs Sequelize

## Évolutivité

### Scalabilité
- Architecture modulaire
- Séparation des préoccupations
- Prêt pour le clustering Node.js
- Support des transactions PostgreSQL

### Extensibilité
- Facile d'ajouter de nouveaux modules
- Support multilingue intégré
- Structure prête pour nouvelles fonctionnalités
- Relations et associations Sequelize

---

*Documentation mise à jour le 2024-01-01*
