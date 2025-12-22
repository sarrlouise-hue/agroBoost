# Documentation Swagger - AlloTracteur API

## Accès à la Documentation

Une fois le serveur démarré, la documentation Swagger est accessible à :

```
http://localhost:3000/api-docs
```

## Fonctionnalités

### Interface Interactive
- Tester tous les endpoints directement depuis le navigateur
- Voir les schémas de requêtes et réponses
- Exemples de code pour chaque endpoint

### Documentation Complète
- Description de tous les endpoints
- Schémas de données (User, Request, Response)
- Codes de statut HTTP
- Exemples de requêtes

## Utilisation

### 1. Démarrer le serveur
```bash
npm run dev
```

### 2. Ouvrir dans le navigateur
```
http://localhost:3000/api-docs
```

### 3. Tester un endpoint
1. Cliquer sur un endpoint pour l'étendre
2. Cliquer sur "Try it out"
3. Remplir les champs requis
4. Cliquer sur "Execute"
5. Voir la réponse

## Schémas Disponibles

### Authentification
- **User** : Modèle complet de l'utilisateur avec tous les champs
- **RegisterRequest** : Schéma pour l'inscription d'un utilisateur
- **VerifyOTPRequest** : Schéma pour la vérification OTP (utilise l'email)
- **LoginRequest** : Schéma pour la connexion
- **RefreshTokenRequest** : Schéma pour le rafraîchissement de token
- **AuthResponse** : Format de réponse pour l'authentification (avec user, token, refreshToken)

### Utilisateurs
- **UpdateProfileRequest** : Schéma pour la mise à jour du profil
- **UpdateLocationRequest** : Schéma pour la mise à jour de la localisation
- **UpdateLanguageRequest** : Schéma pour le changement de langue
- **UpdateUserByAdminRequest** : Schéma pour la mise à jour d'un utilisateur par admin (inclut role, isVerified)

### Prestataires
- **Provider** : Modèle complet du prestataire
- **RegisterProviderRequest** : Schéma pour l'inscription prestataire
- **UpdateProviderRequest** : Schéma pour la mise à jour du profil prestataire
- **UpdateProviderByAdminRequest** : Schéma pour la mise à jour d'un prestataire par admin (inclut isApproved, rating)

### Services
- **Service** : Modèle complet du service agricole
- **CreateServiceRequest** : Schéma pour la création d'un service
- **UpdateServiceRequest** : Schéma pour la mise à jour d'un service
- **UpdateAvailabilityRequest** : Schéma pour la mise à jour de disponibilité

### Réservations
- **Booking** : Modèle complet de la réservation
- **CreateBookingRequest** : Schéma pour la création d'une réservation

### Paiements
- **Payment** : Modèle complet du paiement
- **InitiatePaymentRequest** : Schéma pour l'initialisation d'un paiement

### Avis
- **Review** : Modèle complet de l'avis
- **CreateReviewRequest** : Schéma pour la création d'un avis
- **UpdateReviewRequest** : Schéma pour la mise à jour d'un avis

### Notifications
- **Notification** : Modèle complet de la notification

### Réponses
- **SuccessResponse** : Format standard de réponse de succès
- **ErrorResponse** : Format standard de réponse d'erreur
- **PaginatedResponse** : Format de réponse paginée (avec pagination metadata)

## Authentification dans Swagger

Pour tester les endpoints protégés :

1. Se connecter via `/api/auth/login` ou `/api/auth/register` + `/api/auth/verify-otp` (l'OTP est envoyé par email)
2. Copier le `token` de la réponse
3. Cliquer sur le bouton "Authorize" en haut à droite de Swagger
4. Entrer le token JWT dans le champ (format: `Bearer votre-token-ici` ou juste `votre-token-ici`)
5. Cliquer sur "Authorize"
6. Tous les endpoints protégés utiliseront automatiquement ce token

**Note :** Le token persiste entre les rafraîchissements de page grâce à `persistAuthorization: true`

## Export de la Documentation

La documentation Swagger peut être exportée en JSON :

```
http://localhost:3000/api-docs.json
```

Ce fichier peut être importé dans :
- Postman
- Insomnia
- Autres outils API

## Endpoints disponibles dans Swagger

### Authentification
- POST `/api/auth/register` - Inscription
- POST `/api/auth/verify-otp` - Vérification OTP
- POST `/api/auth/resend-otp` - Renvoyer OTP par email
- POST `/api/auth/login` - Connexion
- POST `/api/auth/logout` - Déconnexion
- POST `/api/auth/refresh-token` - Rafraîchir token
- POST `/api/auth/forgot-password` - Mot de passe oublié
- POST `/api/auth/reset-password` - Réinitialiser mot de passe
- POST `/api/auth/change-password` - Changer mot de passe

### Utilisateurs
- GET `/api/users/profile` - Profil utilisateur (authentifié)
- PUT `/api/users/profile` - Mettre à jour profil (authentifié)
- PUT `/api/users/location` - Mettre à jour localisation (authentifié)
- PUT `/api/users/language` - Changer langue (authentifié)
- GET `/api/users` - Liste utilisateurs avec filtres avancés (admin)
- GET `/api/users/:id` - Voir un utilisateur spécifique (admin)
- PUT `/api/users/:id` - Modifier un utilisateur (admin)
- DELETE `/api/users/:id` - Supprimer un utilisateur (admin)

### Prestataires
- POST `/api/providers/register` - Inscription prestataire (authentifié)
- GET `/api/providers/profile` - Profil prestataire (prestataire/admin)
- GET `/api/providers/:id` - Profil par ID (public)
- PUT `/api/providers/profile` - Mettre à jour profil (prestataire/admin)
- GET `/api/providers` - Liste prestataires avec filtres avancés (public, admin peut filtrer par userId)
- GET `/api/providers/approved` - Prestataires approuvés (public)
- PUT `/api/providers/:id/approve` - Approuver (admin)
- PUT `/api/providers/:id/reject` - Rejeter (admin)
- PUT `/api/providers/:id` - Modifier un prestataire (admin)
- DELETE `/api/providers/:id` - Supprimer un prestataire (admin)

### Services Agricoles
- POST `/api/services` - Créer un service (prestataire/admin)
- GET `/api/services/:id` - Détails d'un service (public)
- GET `/api/services` - Liste avec filtres (public)
  - Filtres : `serviceType`, `availability`, `minPrice`, `maxPrice`
  - Recherche géographique : `latitude`, `longitude`, `radius`
- GET `/api/services/my-services` - Mes services (prestataire/admin)
- GET `/api/services/provider/:providerId` - Services d'un prestataire (public)
- PUT `/api/services/:id` - Mettre à jour service (propriétaire/admin)
- DELETE `/api/services/:id` - Supprimer service (propriétaire/admin)
- PUT `/api/services/:id/availability` - Mettre à jour disponibilité (propriétaire/admin)
- GET `/api/services/search` - Recherche avancée (public)
- GET `/api/services/nearby` - Services à proximité (public)

### Réservations
- POST `/api/bookings` - Créer une réservation (authentifié)
- GET `/api/bookings` - Liste des réservations avec filtres avancés (authentifié, admin voit toutes)
- GET `/api/bookings/:id` - Détails d'une réservation (authentifié)
- PUT `/api/bookings/:id/confirm` - Confirmer réservation (provider/admin)
- PUT `/api/bookings/:id/cancel` - Annuler réservation (authentifié)
- PUT `/api/bookings/:id/complete` - Marquer comme terminée (provider/admin)
- DELETE `/api/bookings/:id` - Supprimer une réservation (admin)

### Paiements
- POST `/api/payments/initiate` - Initialiser un paiement PayTech (authentifié)
- GET `/api/payments/:id` - Détails d'un paiement (authentifié)
- GET `/api/payments/:id/status` - Vérifier statut paiement (authentifié)
- GET `/api/payments` - Liste des paiements avec filtres (authentifié)
- POST `/api/payments/webhook/paytech` - Webhook PayTech (public)

### Avis
- POST `/api/reviews` - Créer un avis (authentifié)
- GET `/api/reviews/service/:serviceId` - Avis d'un service (public)
- GET `/api/reviews/provider/:providerId` - Avis d'un prestataire (public)
- PUT `/api/reviews/:id` - Modifier un avis (auteur seulement)
- DELETE `/api/reviews/:id` - Supprimer un avis (auteur ou admin)

### Notifications
- GET `/api/notifications` - Liste des notifications de l'utilisateur connecté (authentifié)
- GET `/api/notifications/all` - Liste toutes les notifications avec filtres (admin)
- GET `/api/notifications/:id` - Voir une notification spécifique (admin)
- PATCH `/api/notifications/:id/read` - Marquer comme lue (authentifié)
- PATCH `/api/notifications/read-all` - Marquer toutes comme lues (authentifié)
- DELETE `/api/notifications/:id` - Supprimer une notification (admin)

### Historique
- GET `/api/users/bookings` - Historique réservations utilisateur (authentifié)
- GET `/api/users/reviews` - Historique avis utilisateur (authentifié)
- GET `/api/providers/bookings` - Historique réservations prestataire (prestataire/admin)
- GET `/api/providers/reviews` - Historique avis prestataire (prestataire/admin)

## Mise à Jour

La documentation Swagger est générée automatiquement à partir des annotations JSDoc dans les fichiers de routes.

Pour ajouter un nouvel endpoint :
1. Ajouter l'annotation `@swagger` dans le fichier de route
2. Redémarrer le serveur
3. La documentation sera mise à jour automatiquement

---

*Documentation Swagger mise à jour automatiquement*
*Dernière mise à jour : 2025-01-15*

