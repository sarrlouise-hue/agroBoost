# ARCHITECTURE BACKEND - AGRO BOOST

## Application Node.js

---

## 1. VUE D'ENSEMBLE

**Stack Technique :**

- Runtime : Node.js (v18+)
- Framework : Express.js
- Base de données : PostgreSQL
- ORM : Sequelize ou Prisma
- Authentification : JWT + OTP
- Cache : Redis (optionnel)
- File Storage : AWS S3 ou local
- Queue : Bull (pour les tâches asynchrones)

---

## 2. STRUCTURE DES DOSSIERS

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   ├── env.js
│   │   └── constants.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Provider.js
│   │   ├── Service.js
│   │   ├── Booking.js
│   │   ├── Payment.js
│   │   ├── Review.js
│   │   ├── Notification.js
│   │   ├── Location.js
│   │   └── Admin.js
│   │
│   ├── controllers/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   └── otp.controller.js
│   │   ├── users/
│   │   │   └── user.controller.js
│   │   ├── providers/
│   │   │   └── provider.controller.js
│   │   ├── services/
│   │   │   └── service.controller.js
│   │   ├── bookings/
│   │   │   └── booking.controller.js
│   │   ├── payments/
│   │   │   └── payment.controller.js
│   │   ├── reviews/
│   │   │   └── review.controller.js
│   │   ├── locations/
│   │   │   └── location.controller.js
│   │   └── admin/
│   │       └── admin.controller.js
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── provider.routes.js
│   │   ├── service.routes.js
│   │   ├── booking.routes.js
│   │   ├── payment.routes.js
│   │   ├── review.routes.js
│   │   ├── location.routes.js
│   │   └── admin.routes.js
│   │
│   ├── services/
│   │   ├── auth/
│   │   │   ├── auth.service.js
│   │   │   └── otp.service.js
│   │   ├── payment/
│   │   │   ├── payment.service.js
│   │   │   ├── wave.service.js
│   │   │   ├── orangeMoney.service.js
│   │   │   └── freeMoney.service.js
│   │   ├── notification/
│   │   │   ├── notification.service.js
│   │   │   ├── push.service.js
│   │   │   └── sms.service.js
│   │   ├── location/
│   │   │   └── geolocation.service.js
│   │   ├── search/
│   │   │   └── search.service.js
│   │   └── file/
│   │       └── upload.service.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   ├── language.middleware.js
│   │   └── role.middleware.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── provider.validator.js
│   │   ├── service.validator.js
│   │   ├── booking.validator.js
│   │   ├── payment.validator.js
│   │   └── review.validator.js
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   ├── response.js
│   │   ├── errors.js
│   │   ├── helpers.js
│   │   └── translations.js
│   │
│   ├── jobs/
│   │   ├── notification.job.js
│   │   ├── payment.job.js
│   │   └── cleanup.job.js
│   │
│   ├── queues/
│   │   ├── notification.queue.js
│   │   └── payment.queue.js
│   │
│   └── app.js
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── migrations/
├── seeders/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 3. MODÈLES DE DONNÉES

### 3.1. User (Utilisateur/Producteur)

- id (UUID)
- phoneNumber (unique)
- firstName
- lastName
- email (optional)
- language (fr/wolof)
- location (lat/lng)
- address
- isVerified
- role (user/provider/admin)
- createdAt, updatedAt

### 3.2. Provider (Prestataire)

- id (UUID)
- userId (FK -> User)
- businessName
- description
- documents (array)
- isApproved (boolean)
- rating (average)
- totalBookings
- createdAt, updatedAt

### 3.3. Service (Service Agricole)

- id (UUID)
- providerId (FK -> Provider)
- serviceType (tractor/semoir/operator/etc)
- name
- description
- pricePerHour
- pricePerDay
- images (array)
- availability (boolean)
- location (lat/lng)
- createdAt, updatedAt

### 3.4. Booking (Réservation)

- id (UUID)
- userId (FK -> User)
- serviceId (FK -> Service)
- providerId (FK -> Provider)
- bookingDate
- startTime
- endTime
- duration
- totalPrice
- status (pending/confirmed/completed/cancelled)
- location (lat/lng)
- notes
- createdAt, updatedAt

### 3.5. Payment (Paiement)

- id (UUID)
- bookingId (FK -> Booking)
- userId (FK -> User)
- providerId (FK -> Provider)
- amount
- paymentMethod (wave/orangeMoney/freeMoney)
- transactionId
- status (pending/success/failed)
- paymentDate
- createdAt, updatedAt

### 3.6. Review (Avis/Évaluation)

- id (UUID)
- bookingId (FK -> Booking)
- userId (FK -> User)
- providerId (FK -> Provider)
- serviceId (FK -> Service)
- rating (1-5)
- comment
- createdAt, updatedAt

### 3.7. Notification

- id (UUID)
- userId (FK -> User)
- type (booking/payment/review/etc)
- title
- message
- isRead (boolean)
- createdAt, updatedAt

### 3.8. OTP (One-Time Password)

- id (UUID)
- phoneNumber
- code
- expiresAt
- isUsed (boolean)
- createdAt

### 3.9. Admin

- id (UUID)
- userId (FK -> User)
- permissions (array)
- createdAt, updatedAt

---

## 4. ROUTES API

### 4.1. Authentification (`/api/auth`)

- POST `/register` - Création de compte
- POST `/verify-otp` - Vérification OTP
- POST `/resend-otp` - Renvoyer OTP
- POST `/login` - Connexion
- POST `/logout` - Déconnexion
- POST `/refresh-token` - Rafraîchir token

### 4.2. Utilisateurs (`/api/users`)

- GET `/profile` - Profil utilisateur
- PUT `/profile` - Mettre à jour profil
- PUT `/location` - Mettre à jour localisation
- PUT `/language` - Changer langue
- GET `/bookings` - Historique des réservations
- GET `/reviews` - Avis donnés

### 4.3. Prestataires (`/api/providers`)

- POST `/register` - Inscription prestataire
- GET `/profile` - Profil prestataire
- PUT `/profile` - Mettre à jour profil
- GET `/services` - Liste des services
- GET `/bookings` - Réservations reçues
- GET `/revenue` - Revenus et statistiques
- GET `/reviews` - Avis reçus

### 4.4. Services (`/api/services`)

- GET `/` - Liste des services (avec filtres)
- GET `/search` - Recherche avancée
- GET `/nearby` - Services à proximité
- GET `/:id` - Détails d'un service
- POST `/` - Créer un service (provider)
- PUT `/:id` - Mettre à jour service (provider)
- DELETE `/:id` - Supprimer service (provider)
- PUT `/:id/availability` - Mettre à jour disponibilité

### 4.5. Réservations (`/api/bookings`)

- POST `/` - Créer une réservation
- GET `/` - Liste des réservations
- GET `/:id` - Détails d'une réservation
- PUT `/:id/confirm` - Confirmer réservation (provider)
- PUT `/:id/cancel` - Annuler réservation
- PUT `/:id/complete` - Marquer comme terminée (provider)
- GET `/:id/track` - Suivi en temps réel

### 4.6. Paiements (`/api/payments`)

- POST `/initiate` - Initier un paiement
- POST `/webhook/wave` - Webhook Wave
- POST `/webhook/orange` - Webhook Orange Money
- POST `/webhook/free` - Webhook Free Money
- GET `/:id` - Statut du paiement
- GET `/history` - Historique des paiements

### 4.7. Avis (`/api/reviews`)

- POST `/` - Créer un avis
- GET `/service/:serviceId` - Avis d'un service
- GET `/provider/:providerId` - Avis d'un prestataire
- PUT `/:id` - Modifier un avis
- DELETE `/:id` - Supprimer un avis

### 4.8. Géolocalisation (`/api/locations`)

- GET `/nearby-services` - Services à proximité
- POST `/calculate-distance` - Calculer distance
- GET `/directions` - Itinéraire

### 4.9. Administration (`/api/admin`)

- GET `/dashboard` - Tableau de bord
- GET `/users` - Liste utilisateurs
- GET `/providers` - Liste prestataires
- PUT `/providers/:id/approve` - Approuver prestataire
- PUT `/providers/:id/reject` - Rejeter prestataire
- GET `/bookings` - Toutes les réservations
- GET `/payments` - Tous les paiements
- GET `/statistics` - Statistiques globales
- POST `/notifications/broadcast` - Notification de masse
- GET `/disputes` - Litiges
- PUT `/disputes/:id/resolve` - Résoudre litige

---

## 5. SERVICES

### 5.1. Auth Service

- Génération OTP
- Vérification OTP
- Génération JWT
- Vérification JWT
- Hash password (si nécessaire)

### 5.2. Payment Services

- **Wave Service** : Intégration API Wave
- **Orange Money Service** : Intégration Orange Money
- **Free Money Service** : Intégration Free Money
- Gestion des webhooks
- Vérification des transactions

### 5.3. Notification Service

- **Push Service** : Notifications push (Firebase Cloud Messaging)
- **SMS Service** : Envoi SMS (via API SMS)
- Création de notifications
- Envoi groupé

### 5.4. Geolocation Service

- Calcul de distance
- Recherche par proximité
- Intégration Google Maps API
- Calcul d'itinéraire

### 5.5. Search Service

- Recherche filtrée
- Recherche par texte
- Tri et pagination
- Cache des résultats

### 5.6. Upload Service

- Upload d'images
- Compression
- Génération de thumbnails
- Stockage (S3 ou local)

---

## 6. MIDDLEWARES

### 6.1. Auth Middleware

- Vérification JWT
- Extraction user depuis token
- Gestion des tokens expirés

### 6.2. Role Middleware

- Vérification des rôles (user/provider/admin)
- Autorisation par route

### 6.3. Validation Middleware

- Validation des données d'entrée
- Utilisation de Joi ou express-validator

### 6.4. Language Middleware

- Détection de la langue
- Traduction des messages d'erreur

### 6.5. Rate Limit Middleware

- Limitation des requêtes
- Protection contre les abus

### 6.6. Error Middleware

- Gestion centralisée des erreurs
- Format de réponse standardisé

---

## 7. VALIDATEURS

### 7.1. Auth Validators

- Validation inscription
- Validation OTP
- Validation login

### 7.2. User Validators

- Validation profil
- Validation localisation

### 7.3. Provider Validators

- Validation inscription prestataire
- Validation documents

### 7.4. Service Validators

- Validation création service
- Validation mise à jour

### 7.5. Booking Validators

- Validation réservation
- Validation dates

### 7.6. Payment Validators

- Validation initiation paiement
- Validation webhook

### 7.7. Review Validators

- Validation avis
- Validation rating

---

## 8. JOBS & QUEUES

### 8.1. Notification Queue

- Envoi de notifications asynchrones
- Retry en cas d'échec

### 8.2. Payment Queue

- Traitement des paiements
- Vérification des transactions

### 8.3. Cleanup Jobs

- Nettoyage des OTP expirés
- Archivage des anciennes données

---

## 9. CONFIGURATION

### 9.1. Variables d'Environnement

```env
NODE_ENV=development|production
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agroboost
DB_USER=postgres
DB_PASSWORD=
JWT_SECRET=
JWT_EXPIRES_IN=7d
OTP_EXPIRES_IN=5m
REDIS_URL=
WAVE_API_KEY=
WAVE_API_SECRET=
ORANGE_MONEY_API_KEY=
FREE_MONEY_API_KEY=
GOOGLE_MAPS_API_KEY=
FIREBASE_SERVER_KEY=
SMS_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
```

### 9.2. Base de Données

- PostgreSQL comme base principale
- Redis pour le cache (optionnel)
- Migrations avec Sequelize/Prisma
- Seeders pour données initiales

---

## 10. SÉCURITÉ

### 10.1. Authentification

- JWT pour les tokens
- OTP pour la vérification
- Refresh tokens
- Expiration des tokens

### 10.2. Autorisation

- Rôles (user, provider, admin)
- Permissions par route
- Vérification de propriété

### 10.3. Protection

- Rate limiting
- CORS configuré
- Helmet.js pour headers sécurisés
- Validation des entrées
- Chiffrement des données sensibles

---

## 11. LOGGING & MONITORING

### 11.1. Logging

- Winston ou Pino pour les logs
- Niveaux de log (error, warn, info, debug)
- Rotation des logs

### 11.2. Monitoring

- Health check endpoint
- Métriques de performance
- Suivi des erreurs

---

## 12. TESTS

### 12.1. Tests Unitaires

- Tests des services
- Tests des utilitaires
- Tests des validators

### 12.2. Tests d'Intégration

- Tests des routes
- Tests des contrôleurs
- Tests de la base de données

### 12.3. Tests E2E

- Scénarios complets
- Tests de flux utilisateur

---

## 13. DÉPLOIEMENT

### 13.1. Environnements

- Development
- Staging
- Production

### 13.2. CI/CD

- GitHub Actions ou GitLab CI
- Tests automatiques
- Déploiement automatique

### 13.3. Hébergement

- Serveur Node.js
- Base de données PostgreSQL
- Redis (si utilisé)
- SSL/TLS

---

## 14. DOCUMENTATION API

### 14.1. Swagger/OpenAPI

- Documentation interactive
- Exemples de requêtes
- Schémas de données

### 14.2. Postman Collection

- Collection d'endpoints
- Variables d'environnement
- Exemples de requêtes

---

## 15. ÉVOLUTIVITÉ

### 15.1. Scalabilité

- Architecture modulaire
- Séparation des préoccupations
- Cache pour optimiser les performances
- Queue pour les tâches lourdes

### 15.2. Extensibilité

- Structure modulaire
- Facile d'ajouter de nouvelles fonctionnalités
- Support multilingue (fr/wolof)
- Prêt pour d'autres méthodes de paiement

---

## 16. NOTES IMPORTANTES

- **Bilingue** : Tous les messages doivent supporter français et wolof
- **Mobile Money** : Intégration prioritaire de Wave, puis Orange Money et Free Money
- **Géolocalisation** : Essentiel pour la recherche de services à proximité
- **Notifications** : Push + SMS pour garantir la réception
- **Validation Prestataires** : Processus d'approbation par admin
- **Sécurité** : Chiffrement des données sensibles, validation stricte

---

---

*Document créé pour le projet AGRO BOOST - MVP*
