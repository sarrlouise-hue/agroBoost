# Architecture - AlloTracteur Backend

## Vue d'ensemble

Le backend AlloTracteur est construit avec la stack **PERN** (PostgreSQL, Express, React, Node.js).

## Structure du Projet

```text
backend/
├── src/
│   ├── config/          # Configuration
│   │   ├── database.js  # Connexion PostgreSQL
│   │   ├── env.js        # Variables d'environnement
│   │   └── constants.js  # Constantes
│   │
│   ├── models/          # Modèles Sequelize
│   │   ├── User.js      # Modèle utilisateur
│   │   ├── Provider.js  # Modèle prestataire
│   │   ├── Service.js   # Modèle service agricole
│   │   ├── Booking.js   # Modèle réservation
│   │   ├── Payment.js   # Modèle paiement
│   │   ├── OTP.js       # Modèle OTP
│   │   ├── PasswordResetToken.js  # Modèle token de réinitialisation
│   │   └── associations.js  # Associations entre modèles
│   │
│   ├── data-access/     # Repositories (couche d'accès aux données)
│   │   ├── user.repository.js
│   │   ├── provider.repository.js
│   │   ├── service.repository.js
│   │   ├── booking.repository.js
│   │   ├── payment.repository.js
│   │   ├── otp.repository.js
│   │   └── passwordResetToken.repository.js
│   │
│   ├── controllers/     # Contrôleurs
│   │   ├── auth/
│   │   │   └── auth.controller.js
│   │   ├── users/
│   │   │   └── user.controller.js
│   │   ├── providers/
│   │   │   └── provider.controller.js
│   │   ├── services/
│   │   │   └── service.controller.js
│   │   ├── bookings/
│   │   │   └── booking.controller.js
│   │   └── payments/
│   │       └── payment.controller.js
│   │
│   ├── routes/          # Routes API
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── provider.routes.js
│   │   ├── service.routes.js
│   │   ├── booking.routes.js
│   │   └── payment.routes.js
│   │
│   ├── services/        # Services métier
│   │   ├── auth/
│   │   │   ├── auth.service.js
│   │   │   ├── otp.service.js
│   │   │   └── password.service.js
│   │   ├── user/
│   │   │   └── user.service.js
│   │   ├── provider/
│   │   │   └── provider.service.js
│   │   ├── service/
│   │   │   └── service.service.js
│   │   ├── booking/
│   │   │   └── booking.service.js
│   │   ├── payment/
│   │   │   ├── payment.service.js
│   │   │   └── paytech.service.js
│   │   ├── location/
│   │   │   └── geolocation.service.js
│   │   ├── search/
│   │   │   └── search.service.js
│   │   └── file/
│   │       └── upload.service.js
│   │   ├── email/
│   │   │   ├── email.service.js
│   │   │   └── templates/
│   │   │       ├── welcome.html
│   │   │       ├── otp.html
│   │   │       ├── password-reset-request.html
│   │   │       └── password-reset-confirmation.html
│   │
│   ├── middleware/      # Middlewares Express
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── rateLimit.middleware.js
│   │
│   ├── validators/      # Validateurs Joi
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── provider.validator.js
│   │   ├── service.validator.js
│   │   ├── booking.validator.js
│   │   └── payment.validator.js
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

```text
Client → Route → Validator → Controller → Service → Repository → PostgreSQL
                ↓
            Middleware (Rate Limit)
```

### Authentification

```text
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
  email: String (required, unique),
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
  email: String (required, unique),
  code: String (required),
  expiresAt: Date (required),
  isUsed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Note:** Le système OTP utilise maintenant l'email au lieu du numéro de téléphone. Les codes OTP sont envoyés par email.

### Provider

```javascript
{
  id: UUID,
  userId: UUID (foreign key to User, unique),
  businessName: String (required, 2-100 chars),
  description: Text (optional),
  documents: Array[String] (optional),
  isApproved: Boolean (default: false),
  rating: Decimal (0-5, default: 0),
  totalBookings: Integer (default: 0),
  latitude: Decimal (-90 to 90, optional),
  longitude: Decimal (-180 to 180, optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Service

```javascript
{
  id: UUID,
  providerId: UUID (foreign key to Provider),
  serviceType: Enum ['tractor', 'semoir', 'operator', 'other'] (required),
  name: String (required, 2-100 chars),
  description: Text (optional),
  pricePerHour: Decimal (optional, min: 0),
  pricePerDay: Decimal (optional, min: 0),
  images: Array[String] (optional),
  availability: Boolean (default: true),
  latitude: Decimal (-90 to 90, optional),
  longitude: Decimal (-180 to 180, optional),
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

### Booking

```javascript
{
  id: UUID,
  userId: UUID (foreign key to User),
  serviceId: UUID (foreign key to Service),
  providerId: UUID (foreign key to Provider),
  bookingDate: Date (required),
  startTime: Time (required),
  endTime: Time (optional),
  duration: Integer (optional, hours),
  totalPrice: Decimal (required),
  status: Enum ['pending', 'confirmed', 'completed', 'cancelled'],
  latitude: Decimal (-90 to 90, optional),
  longitude: Decimal (-180 to 180, optional),
  notes: Text (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Payment

```javascript
{
  id: UUID,
  bookingId: UUID (foreign key to Booking, unique),
  userId: UUID (foreign key to User),
  providerId: UUID (foreign key to Provider),
  amount: Decimal (required),
  paymentMethod: Enum ['paytech'],
  transactionId: String (unique, optional),
  paytechTransactionId: String (optional),
  status: Enum ['pending', 'success', 'failed', 'cancelled'],
  paymentDate: Date (optional),
  metadata: JSONB (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Review *(prévu – Sprint S3 « Avis & Notes »)*

Ces champs suivent le plan général AgroBoost et seront introduits lors de l’implémentation du module d’avis.

```javascript
{
  id: UUID,
  bookingId: UUID,     // Réservation liée
  userId: UUID,        // Auteur de l'avis
  providerId: UUID,    // Prestataire concerné
  serviceId: UUID,     // Service concerné
  rating: Integer (1-5),
  comment: Text,
  createdAt: Date,
  updatedAt: Date
}
```

### Notification *(prévu – Sprint S3 « Notifications »)*

Le backend utilise déjà des types de notification dans `constants.js` (`BOOKING`, `PAYMENT`, `REVIEW`, `SYSTEM`). La persistance et l’envoi multi‑canaux seront ajoutés dans S3.

```javascript
{
  id: UUID,
  userId: UUID,
  type: Enum ['booking', 'payment', 'review', 'system'],
  title: String,
  message: Text,
  isRead: Boolean,
  metadata: JSONB (optionnel),
  createdAt: Date,
  updatedAt: Date
}
```

## Relations entre Modèles

- **User** `hasOne` **Provider** (via `userId`)
- **Provider** `belongsTo` **User** (via `userId`)
- **Provider** `hasMany` **Service** (via `providerId`)
- **Service** `belongsTo` **Provider** (via `providerId`)
- **User** `hasMany` **Booking** (via `userId`)
- **Booking** `belongsTo` **User** (via `userId`)
- **Booking** `belongsTo` **Service** (via `serviceId`)
- **Service** `hasMany` **Booking** (via `serviceId`)
- **Booking** `belongsTo` **Provider** (via `providerId`)
- **Provider** `hasMany` **Booking** (via `providerId`)
- **Booking** `hasOne` **Payment** (via `bookingId`)
- **Payment** `belongsTo` **Booking** (via `bookingId`)
- **User** `hasMany` **Payment** (via `userId`)
- **Payment** `belongsTo` **User** (via `userId`)
- **Provider** `hasMany` **Payment** (via `providerId`)
- **Payment** `belongsTo` **Provider** (via `providerId`)

Relations supplémentaires prévues pour S3 (non encore implémentées dans le code) :

- **Booking** `hasOne` **Review` (via `bookingId`)
- **Review** `belongsTo` **Booking` (via `bookingId`)
- **User** `hasMany` **Review` (via `userId`)
- **Provider** `hasMany` **Review` (via `providerId`)
- **Service** `hasMany` **Review` (via `serviceId`)
- **User** `hasMany` **Notification` (via `userId`)

## Couche Data-Access (Repositories)

Cette couche encapsule toutes les requêtes PostgreSQL et fournit une abstraction pour l'accès aux données. Elle permet de :

- Isoler la logique d'accès aux données
- Faciliter les tests (mocking)
- Faciliter les changements de base de données

### Repositories disponibles

- **UserRepository** : Opérations CRUD sur les utilisateurs
- **ProviderRepository** : Opérations CRUD sur les prestataires avec filtres et pagination
- **ServiceRepository** : Opérations CRUD sur les services avec recherche géographique et filtres avancés
- **BookingRepository** : Opérations CRUD sur les réservations avec vérification de disponibilité
- **PaymentRepository** : Opérations CRUD sur les paiements avec gestion des transactions PayTech

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
- Création et validation d'OTP par email
- Envoi automatique des codes OTP par email
- Gestion de l'expiration

### Password Service

- Hashage et comparaison de mots de passe
- Création et validation de tokens de réinitialisation
- Réinitialisation et changement de mot de passe

### User Service

- Gestion du profil utilisateur
- Mise à jour de la localisation
- Changement de langue
- Liste des utilisateurs (admin)

### Provider Service

- Inscription prestataire
- Gestion du profil prestataire
- Approbation/rejet de prestataires (admin)
- Liste des prestataires avec filtres

### Service Service

- Création et gestion de services agricoles
- Recherche de services avec filtres (type, prix, géolocalisation)
- Mise à jour de disponibilité
- Gestion des services par prestataire

### Booking Service

- Création de réservations avec vérification de disponibilité (anti-double réservation)
- Calcul automatique du prix total
- Confirmation, annulation et marquage comme terminé
- Gestion des statuts de réservation

### Payment Service

- Initialisation de paiements PayTech
- Vérification du statut des paiements
- Traitement des webhooks PayTech
- Mise à jour automatique des réservations après paiement

### PayTech Service

- Intégration avec l'API PayTech Mobile Money
- Génération de signatures sécurisées
- Vérification de transactions
- Gestion des webhooks

### Geolocation Service

- Calcul de distance entre deux points GPS
- Validation des coordonnées GPS
- Calcul de distances pour plusieurs services
- Tri par distance

### Search Service

- Recherche textuelle (nom, description)
- Filtres avancés (type, prix, disponibilité)
- Recherche par proximité géographique
- Tri par pertinence, distance, prix, note

### Upload Service

- Upload d'images via Cloudinary
- Upload multiple
- Suppression d'images
- Génération d'URLs optimisées

## Some Sécurité

### Some Authentification

- JWT avec expiration (7 jours)
- Refresh tokens (30 jours)
- OTP pour vérification (envoyé par email)
- Service email pour envoi de templates HTML (bienvenue, OTP, réinitialisation mot de passe)
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

## Intégrations Externes

### PayTech Mobile Money

- Intégration complète pour les paiements Mobile Money
- Support des webhooks pour confirmation automatique
- Mode simulation disponible en développement

### Cloudinary

- Upload et stockage d'images
- Compression automatique
- Génération d'URLs optimisées
- Gestion des transformations d'images

---

**Documentation mise à jour le 2025-01-01*
