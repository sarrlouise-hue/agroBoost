# Documentation Swagger - AGRO BOOST API

## Accès à la Documentation

Une fois le serveur démarré, la documentation Swagger est accessible à :

```
http://localhost:5000/api-docs
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
http://localhost:5000/api-docs
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
- **VerifyOTPRequest** : Schéma pour la vérification OTP
- **LoginRequest** : Schéma pour la connexion
- **RefreshTokenRequest** : Schéma pour le rafraîchissement de token
- **AuthResponse** : Format de réponse pour l'authentification (avec user, token, refreshToken)

### Utilisateurs
- **UpdateProfileRequest** : Schéma pour la mise à jour du profil
- **UpdateLocationRequest** : Schéma pour la mise à jour de la localisation
- **UpdateLanguageRequest** : Schéma pour le changement de langue

### Prestataires
- **Provider** : Modèle complet du prestataire
- **RegisterProviderRequest** : Schéma pour l'inscription prestataire
- **UpdateProviderRequest** : Schéma pour la mise à jour du profil prestataire

### Services
- **Service** : Modèle complet du service agricole
- **CreateServiceRequest** : Schéma pour la création d'un service
- **UpdateServiceRequest** : Schéma pour la mise à jour d'un service
- **UpdateAvailabilityRequest** : Schéma pour la mise à jour de disponibilité

### Réponses
- **SuccessResponse** : Format standard de réponse de succès
- **ErrorResponse** : Format standard de réponse d'erreur
- **PaginatedResponse** : Format de réponse paginée (avec pagination metadata)

## Authentification dans Swagger

Pour tester les endpoints protégés :

1. Se connecter via `/api/auth/login` ou `/api/auth/register` + `/api/auth/verify-otp`
2. Copier le `token` de la réponse
3. Cliquer sur le bouton "Authorize" en haut à droite de Swagger
4. Entrer le token JWT dans le champ (format: `Bearer votre-token-ici` ou juste `votre-token-ici`)
5. Cliquer sur "Authorize"
6. Tous les endpoints protégés utiliseront automatiquement ce token

**Note :** Le token persiste entre les rafraîchissements de page grâce à `persistAuthorization: true`

## Export de la Documentation

La documentation Swagger peut être exportée en JSON :

```
http://localhost:5000/api-docs.json
```

Ce fichier peut être importé dans :
- Postman
- Insomnia
- Autres outils API

## Endpoints disponibles dans Swagger

### Authentification
- POST `/api/auth/register` - Inscription
- POST `/api/auth/verify-otp` - Vérification OTP
- POST `/api/auth/resend-otp` - Renvoyer OTP
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
- GET `/api/users` - Liste utilisateurs (admin)

### Prestataires
- POST `/api/providers/register` - Inscription prestataire (authentifié)
- GET `/api/providers/profile` - Profil prestataire (prestataire/admin)
- GET `/api/providers/:id` - Profil par ID (public)
- PUT `/api/providers/profile` - Mettre à jour profil (prestataire/admin)
- GET `/api/providers` - Liste prestataires (public, avec filtres)
- GET `/api/providers/approved` - Prestataires approuvés (public)
- PUT `/api/providers/:id/approve` - Approuver (admin)
- PUT `/api/providers/:id/reject` - Rejeter (admin)

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

## Mise à Jour

La documentation Swagger est générée automatiquement à partir des annotations JSDoc dans les fichiers de routes.

Pour ajouter un nouvel endpoint :
1. Ajouter l'annotation `@swagger` dans le fichier de route
2. Redémarrer le serveur
3. La documentation sera mise à jour automatiquement

---

*Documentation Swagger mise à jour automatiquement*

