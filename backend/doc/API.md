# Documentation API - AlloTracteur

## Base URL

```
http://localhost:3000/api
```

## Authentification

Tous les endpoints d'authentification sont publics et ne nécessitent pas de token.

---

## Endpoints

### 1. Health Check

#### GET `/health`

Vérifier le statut du serveur

**Réponse (200):**

```json
{
  "status": "OK",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "environment": "development"
}
```

---

### 2. Inscription

#### POST `/auth/register`

Inscrire un nouvel utilisateur

**Body:**

```json
{
  "phoneNumber": "+221771234567",
  "firstName": "Amadou",
  "lastName": "Diallo",
  "email": "amadou@example.com",
  "language": "fr"
}
```

**Note:** L'email est requis. Un code OTP sera envoyé par email et un email de bienvenue sera également envoyé.

**Réponse réussie (201):**

```json
{
  "success": true,
  "message": "Utilisateur inscrit avec succès. Veuillez vérifier votre email pour le code OTP.",
  "data": {
    "user": {
      "id": "user-id-123",
      "phoneNumber": "+221771234567",
      "firstName": "Amadou",
      "lastName": "Diallo",
      "email": "amadou@example.com",
      "language": "fr",
      "role": "user",
      "isVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erreurs possibles:**

- `400` - Erreur de validation
- `409` - Utilisateur existe déjà

---

### 3. Vérifier OTP

#### POST `/auth/verify-otp`

Vérifier le code OTP reçu par email et activer le compte

**Body:**

```json
{
  "email": "amadou@example.com",
  "code": "123456"
}
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "OTP vérifié avec succès. Compte activé.",
  "data": {
    "user": {
      "id": "user-id-123",
      "phoneNumber": "+221771234567",
      "firstName": "Amadou",
      "lastName": "Diallo",
      "email": "amadou@example.com",
      "language": "fr",
      "role": "user",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erreurs possibles:**

- `400` - OTP invalide ou expiré
- `404` - Utilisateur non trouvé

---

### 4. Renvoyer OTP

#### POST `/auth/resend-otp`

Renvoyer un nouveau code OTP par email

**Body:**

```json
{
  "email": "amadou@example.com"
}
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Code OTP envoyé par email avec succès",
  "data": null
}
```

**Erreurs possibles:**

- `400` - Erreur de validation

---

### 5. Connexion

#### POST `/auth/login`

Connecter un utilisateur existant

**Body:**

```json
{
  "phoneNumber": "+221771234567"
}
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": "user-id-123",
      "phoneNumber": "+221771234567",
      "firstName": "Amadou",
      "lastName": "Diallo",
      "email": "amadou@example.com",
      "language": "fr",
      "role": "user",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erreurs possibles:**

- `400` - Erreur de validation
- `404` - Utilisateur non trouvé

---

### 6. Rafraîchir Token

#### POST `/auth/refresh-token`

Rafraîchir le token d'accès

**Body:**

```json
{
  "refreshToken": "votre-refresh-token-ici"
}
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Token rafraîchi avec succès",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erreurs possibles:**

- `400` - Refresh token requis
- `401` - Token invalide ou expiré
- `404` - Utilisateur non trouvé

---

### 7. Déconnexion

#### POST `/auth/logout`

Déconnecter un utilisateur (suppression du token côté client)

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Déconnexion réussie",
  "data": null
}
```

---

## Utilisation du Token

Pour les endpoints protégés, inclure le token dans le header :

```
Authorization: Bearer votre-token-ici
```

---

## 8. Gestion des Utilisateurs

### GET `/users/profile`

Obtenir le profil de l'utilisateur connecté

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Profil récupéré avec succès",
  "data": {
    "id": "user-id-123",
    "phoneNumber": "+221771234567",
    "firstName": "Amadou",
    "lastName": "Diallo",
    "email": "amadou@example.com",
    "language": "fr",
    "latitude": 14.7167,
    "longitude": -17.4677,
    "address": "Dakar, Sénégal",
    "role": "user",
    "isVerified": true
  }
}
```

**Erreurs possibles:**

- `401` - Non autorisé

---

### PUT `/users/profile`

Mettre à jour le profil de l'utilisateur connecté

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Body:**

```json
{
  "firstName": "Amadou",
  "lastName": "Diallo",
  "email": "nouveau@example.com",
  "address": "Nouvelle adresse"
}
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Profil mis à jour avec succès",
  "data": { ... }
}
```

**Erreurs possibles:**

- `400` - Erreur de validation
- `401` - Non autorisé

---

### PUT `/users/location`

Mettre à jour la localisation de l'utilisateur

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Body:**

```json
{
  "latitude": 14.7167,
  "longitude": -17.4677,
  "address": "Dakar, Sénégal"
}
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Localisation mise à jour avec succès",
  "data": { ... }
}
```

**Erreurs possibles:**

- `400` - Erreur de validation (latitude/longitude invalides)
- `401` - Non autorisé

---

### PUT `/users/language`

Changer la langue de l'utilisateur

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Body:**

```json
{
  "language": "wolof"
}
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Langue mise à jour avec succès",
  "data": { ... }
}
```

**Erreurs possibles:**

- `400` - Langue non supportée (doit être "fr" ou "wolof")
- `401` - Non autorisé

---

### GET `/users`

Obtenir tous les utilisateurs (admin seulement)

**Headers:**

```
Authorization: Bearer votre-token-admin-ici
```

**Query Parameters:**

- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 20)

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Utilisateurs récupérés avec succès",
  "data": [
    { ... },
    { ... }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit (admin seulement)

---

### GET `/users/:id`

Obtenir un utilisateur spécifique par ID (admin seulement).

**Headers:**

```
Authorization: Bearer votre-token-admin-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Utilisateur récupéré avec succès",
  "data": {
    "id": "user-id-123",
    "phoneNumber": "+221771234567",
    "firstName": "Amadou",
    "lastName": "Diallo",
    "email": "amadou@example.com",
    "role": "user",
    "isVerified": true,
    ...
  }
}
```

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit (admin seulement)
- `404` - Utilisateur non trouvé

---

### PUT `/users/:id`

Mettre à jour un utilisateur (admin seulement).

**Headers:**

```
Authorization: Bearer votre-token-admin-ici
```

**Body:**

```json
{
  "firstName": "Nouveau prénom",
  "lastName": "Nouveau nom",
  "email": "nouveau@example.com",
  "phoneNumber": "+221771234568",
  "role": "provider",
  "isVerified": true,
  "address": "Nouvelle adresse",
  "language": "wolof"
}
```

**Champs modifiables :** `firstName`, `lastName`, `email`, `phoneNumber`, `role`, `isVerified`, `address`, `language`

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Utilisateur mis à jour avec succès",
  "data": { ... }
}
```

**Erreurs possibles:**

- `400` - Erreur de validation
- `401` - Non autorisé
- `403` - Accès interdit (admin seulement)
- `404` - Utilisateur non trouvé

---

### DELETE `/users/:id`

Supprimer un utilisateur (admin seulement).

**Headers:**

```
Authorization: Bearer votre-token-admin-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Utilisateur supprimé avec succès",
  "data": {
    "deleted": true,
    "userId": "user-id-123"
  }
}
```

**Note:** La suppression est en cascade. Tous les éléments associés (Provider, Bookings, Payments, Reviews, Notifications) seront également supprimés.

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit (admin seulement)
- `404` - Utilisateur non trouvé

---

### GET `/users/bookings`

Obtenir l'historique des réservations de l'utilisateur connecté.

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Query Parameters:**

- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 20)
- `status` (optionnel) : Filtrer par statut (`pending`, `confirmed`, `completed`, `cancelled`)

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Historique des réservations récupéré avec succès",
  "data": [
    {
      "id": "booking-id-123",
      "serviceId": "service-id-123",
      "providerId": "provider-id-123",
      "bookingDate": "2025-01-15",
      "startTime": "08:00",
      "endTime": "17:00",
      "totalPrice": 40000,
      "status": "completed",
      "service": { ... },
      "provider": { ... }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

**Erreurs possibles:**

- `401` - Non autorisé

---

### GET `/users/reviews`

Obtenir l'historique des avis donnés par l'utilisateur connecté.

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Query Parameters:**

- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 20)

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Historique des avis récupéré avec succès",
  "data": [
    {
      "id": "review-id-123",
      "bookingId": "booking-id-123",
      "serviceId": "service-id-123",
      "providerId": "provider-id-123",
      "rating": 5,
      "comment": "Excellent service",
      "service": { ... },
      "provider": { ... },
      "booking": { ... }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1
  }
}
```

**Erreurs possibles:**

- `401` - Non autorisé

---

Obtenir l'historique des avis laissés par l'utilisateur connecté.

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Query params (optionnels):**

- `page`, `limit` – pagination

**Réponse réussie (200):**

Retourne une liste paginée d'avis (schéma `Review`) avec pagination.

---

## 9. Gestion des Prestataires

### POST `/providers/register`

Inscription d'un prestataire (utilisateur connecté)

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Body:**

```json
{
  "businessName": "Agri Services Sénégal",
  "description": "Services agricoles de qualité",
  "documents": ["doc1.pdf", "doc2.pdf"]
}
```

**Réponse réussie (201):**

```json
{
  "success": true,
  "message": "Inscription prestataire réussie",
  "data": {
    "id": "provider-id-123",
    "userId": "user-id-123",
    "businessName": "Agri Services Sénégal",
    "description": "Services agricoles de qualité",
    "documents": ["doc1.pdf", "doc2.pdf"],
    "isApproved": false,
    "rating": 0,
    "totalBookings": 0,
    "user": { ... }
  }
}
```

**Erreurs possibles:**

- `400` - Erreur de validation ou utilisateur déjà prestataire
- `401` - Non autorisé
- `404` - Utilisateur non trouvé

---

### GET `/providers/profile`

Obtenir le profil du prestataire connecté

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Profil prestataire récupéré avec succès",
  "data": {
    "id": "provider-id-123",
    "businessName": "Agri Services Sénégal",
    "description": "Services agricoles de qualité",
    "isApproved": true,
    "rating": 4.5,
    "totalBookings": 25,
    "user": { ... }
  }
}
```

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit (prestataire ou admin seulement)
- `404` - Prestataire non trouvé

---

### GET `/providers/:id`

Obtenir le profil d'un prestataire par ID

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Profil prestataire récupéré avec succès",
  "data": { ... }
}
```

**Erreurs possibles:**

- `404` - Prestataire non trouvé

---

### PUT `/providers/profile`

Mettre à jour le profil du prestataire connecté

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Body:**

```json
{
  "businessName": "Nouveau nom",
  "description": "Nouvelle description",
  "documents": ["nouveau-doc.pdf"]
}
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Profil prestataire mis à jour avec succès",
  "data": { ... }
}
```

**Erreurs possibles:**

- `400` - Erreur de validation
- `401` - Non autorisé
- `403` - Accès interdit

---

### GET `/providers`

Obtenir tous les prestataires

**Query Parameters:**

- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 20)
- `isApproved` (optionnel) : Filtrer par statut d'approbation (true/false)
- `minRating` (optionnel) : Note minimale
- `search` (optionnel) : Recherche dans nom d'entreprise, description, nom/prénom/email utilisateur
- `userId` (optionnel) : Filtrer par ID utilisateur (admin seulement)
- `startDate` (optionnel) : Date de début pour filtrer par date de création (format: YYYY-MM-DD)
- `endDate` (optionnel) : Date de fin pour filtrer par date de création (format: YYYY-MM-DD)

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Prestataires récupérés avec succès",
  "data": [ ... ],
  "pagination": { ... }
}
```

---

### PUT `/providers/:id`

Mettre à jour un prestataire (admin seulement)

**Headers:**

```
Authorization: Bearer votre-token-admin-ici
```

**Body:**

```json
{
  "businessName": "Nouveau nom",
  "description": "Nouvelle description",
  "documents": ["nouveau-doc.pdf"],
  "isApproved": true,
  "rating": 4.5
}
```

**Champs modifiables :** `businessName`, `description`, `documents`, `isApproved`, `rating`

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Prestataire mis à jour avec succès",
  "data": { ... }
}
```

**Erreurs possibles:**

- `400` - Erreur de validation
- `401` - Non autorisé
- `403` - Accès interdit (admin seulement)
- `404` - Prestataire non trouvé

---

### DELETE `/providers/:id`

Supprimer un prestataire (admin seulement)

**Headers:**

```
Authorization: Bearer votre-token-admin-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Prestataire supprimé avec succès",
  "data": {
    "deleted": true,
    "providerId": "provider-id-123"
  }
}
```

**Note:** La suppression est en cascade. Tous les services et réservations associés seront également supprimés.

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit (admin seulement)
- `404` - Prestataire non trouvé

---

### GET `/providers/approved`

Obtenir les prestataires approuvés

**Query Parameters:**

- `page` (optionnel)
- `limit` (optionnel)
- `minRating` (optionnel)

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Prestataires approuvés récupérés avec succès",
  "data": [ ... ],
  "pagination": { ... }
}
```

---

### PUT `/providers/:id/approve`

Approuver un prestataire (admin seulement)

**Headers:**

```
Authorization: Bearer votre-token-admin-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Prestataire approuvé avec succès",
  "data": { ... }
}
```

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit (admin seulement)
- `404` - Prestataire non trouvé

---

### PUT `/providers/:id/reject`

Rejeter un prestataire (admin seulement)

**Headers:**

```
Authorization: Bearer votre-token-admin-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Prestataire rejeté avec succès",
  "data": { ... }
}
```

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit (admin seulement)
- `404` - Prestataire non trouvé

---

### GET `/providers/bookings`

Obtenir l'historique des réservations reçues par le prestataire connecté.

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Query Parameters:**

- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 20)
- `status` (optionnel) : Filtrer par statut (`pending`, `confirmed`, `completed`, `cancelled`)

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Historique des réservations récupéré avec succès",
  "data": [
    {
      "id": "booking-id-123",
      "userId": "user-id-123",
      "serviceId": "service-id-123",
      "bookingDate": "2025-01-15",
      "startTime": "08:00",
      "endTime": "17:00",
      "totalPrice": 40000,
      "status": "completed",
      "user": { ... },
      "service": { ... }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit (prestataire ou admin seulement)

---

### GET `/providers/reviews`

Obtenir l'historique des avis reçus par le prestataire connecté.

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Query Parameters:**

- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 20)

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Historique des avis récupéré avec succès",
  "data": [
    {
      "id": "review-id-123",
      "bookingId": "booking-id-123",
      "userId": "user-id-123",
      "serviceId": "service-id-123",
      "rating": 5,
      "comment": "Excellent service",
      "user": { ... },
      "service": { ... },
      "booking": { ... }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 32,
    "totalPages": 2
  }
}
```

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit (prestataire ou admin seulement)

---

### PUT `/providers/profile/location`

Mettre à jour la géolocalisation du prestataire

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Body:**

```json
{
  "latitude": 14.7167,
  "longitude": -17.4677
}
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Géolocalisation mise à jour avec succès",
  "data": {
    "id": "provider-id-123",
    "latitude": 14.7167,
    "longitude": -17.4677,
    ...
  }
}
```

**Erreurs possibles:**

- `400` - Coordonnées GPS invalides
- `401` - Non autorisé
- `403` - Accès interdit (prestataire seulement)

---

### GET `/providers/bookings`

Obtenir les réservations reçues par le prestataire connecté.

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Query params (optionnels):**

- `page`, `limit` – pagination
- `status` – filtrer par statut de réservation

**Réponse réussie (200):**

Retourne une liste paginée de réservations (`Booking`) pour le prestataire.

---

### GET `/providers/reviews`

Obtenir les avis reçus par le prestataire connecté.

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Query params (optionnels):**

- `page`, `limit` – pagination

**Réponse réussie (200):**

Retourne une liste paginée d'avis (`Review`) pour le prestataire.

---


## 10. Gestion des Services Agricoles

### POST `/services`

Créer un nouveau service (prestataire seulement)

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Body:**

```json
{
  "serviceType": "tractor",
  "name": "Tracteur John Deere 6120",
  "description": "Tracteur puissant pour travaux agricoles",
  "pricePerHour": 5000,
  "pricePerDay": 40000,
  "images": ["image1.jpg", "image2.jpg"],
  "availability": true,
  "latitude": 14.7167,
  "longitude": -17.4677
}
```

**Types de services disponibles:**

- `tractor` - Tracteur
- `semoir` - Semoir
- `operator` - Opérateur
- `other` - Autre

**Réponse réussie (201):**

```json
{
  "success": true,
  "message": "Service créé avec succès",
  "data": {
    "id": "service-id-123",
    "providerId": "provider-id-123",
    "serviceType": "tractor",
    "name": "Tracteur John Deere 6120",
    "description": "Tracteur puissant pour travaux agricoles",
    "pricePerHour": 5000,
    "pricePerDay": 40000,
    "images": ["image1.jpg", "image2.jpg"],
    "availability": true,
    "latitude": 14.7167,
    "longitude": -17.4677,
    "provider": { ... }
  }
}
```

**Erreurs possibles:**

- `400` - Erreur de validation (au moins un prix requis)
- `401` - Non autorisé
- `403` - Accès interdit (prestataire seulement) ou prestataire non approuvé

---

## 16. Gestion des Avis

### POST `/reviews`

Créer un avis pour une réservation terminée (utilisateur connecté).

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Body:**

```json
{
  "bookingId": "booking-id-123",
  "rating": 5,
  "comment": "Très bon service"
}
```

**Réponse réussie (201):**

```json
{
  "success": true,
  "message": "Avis créé avec succès",
  "data": {
    "id": "review-id-123",
    "bookingId": "booking-id-123",
    "userId": "user-id-123",
    "providerId": "provider-id-123",
    "serviceId": "service-id-123",
    "rating": 5,
    "comment": "Très bon service",
    "booking": { ... },
    "service": { ... },
    "provider": { ... }
  }
}
```

**Erreurs possibles:**

- `400` - Erreur de validation, réservation non terminée, ou avis déjà existant pour cette réservation
- `401` - Non autorisé
- `404` - Réservation non trouvée

**Note:** La note moyenne du prestataire est automatiquement recalculée après la création d'un avis.

---

### GET `/reviews/service/:serviceId`

Lister les avis d'un service donné (public).

**Query Parameters:**

- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 20)

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Avis du service récupérés avec succès",
  "data": [
    {
      "id": "review-id-123",
      "userId": "user-id-123",
      "rating": 5,
      "comment": "Excellent service",
      "user": {
        "firstName": "Amadou",
        "lastName": "Diallo"
      },
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

---

### GET `/reviews/provider/:providerId`

Lister les avis d'un prestataire donné (public).

**Query Parameters:**

- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 20)

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Avis du prestataire récupérés avec succès",
  "data": [
    {
      "id": "review-id-123",
      "userId": "user-id-123",
      "serviceId": "service-id-123",
      "rating": 5,
      "comment": "Excellent service",
      "user": {
        "firstName": "Amadou",
        "lastName": "Diallo"
      },
      "service": {
        "name": "Tracteur John Deere"
      },
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "totalPages": 2
  }
}
```

---

### PUT `/reviews/:id`

Mettre à jour un avis existant de l'utilisateur connecté.

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Body:**

```json
{
  "rating": 4,
  "comment": "Service correct mais peut être amélioré"
}
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Avis mis à jour avec succès",
  "data": {
    "id": "review-id-123",
    "rating": 4,
    "comment": "Service correct mais peut être amélioré",
    ...
  }
}
```

**Erreurs possibles:**

- `400` - Erreur de validation
- `401` - Non autorisé
- `403` - Accès interdit (vous n'êtes pas l'auteur de cet avis)
- `404` - Avis non trouvé

**Note:** La note moyenne du prestataire est automatiquement recalculée après la mise à jour.

---

### DELETE `/reviews/:id`

Supprimer un avis.

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Avis supprimé avec succès",
  "data": null
}
```

**Règles d'autorisation:**

- **Utilisateur normal** : Peut supprimer seulement ses propres avis
- **Admin** : Peut supprimer n'importe quel avis

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit (utilisateur normal ne peut pas supprimer l'avis d'un autre)
- `404` - Avis non trouvé

**Note:** La note moyenne du prestataire est automatiquement recalculée après la suppression.

---

## 17. Gestion des Notifications

### GET `/notifications`

Récupérer les notifications de l'utilisateur connecté.

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Query Parameters:**

- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 20)
- `isRead` (optionnel) : Filtrer par notifications lues (`true`) ou non lues (`false`)

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Notifications récupérées avec succès",
  "data": [
    {
      "id": "notification-id-123",
      "type": "booking",
      "title": "Nouvelle réservation",
      "message": "Vous avez reçu une nouvelle réservation pour votre service",
      "isRead": false,
      "metadata": {
        "bookingId": "booking-id-123",
        "serviceId": "service-id-123"
      },
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

**Types de notifications disponibles:**

- `booking` - Notifications liées aux réservations (création, confirmation, annulation, complétion)
- `payment` - Notifications liées aux paiements (paiement réussi, échec)
- `review` - Notifications liées aux avis (nouvel avis reçu)
- `system` - Notifications système

**Erreurs possibles:**

- `401` - Non autorisé

---

### PATCH `/notifications/:id/read`

Marquer une notification spécifique comme lue.

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Notification marquée comme lue",
  "data": {
    "id": "notification-id-123",
    "isRead": true,
    ...
  }
}
```

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit (notification n'appartient pas à l'utilisateur)
- `404` - Notification non trouvée

---

### PATCH `/notifications/read-all`

Marquer toutes les notifications de l'utilisateur connecté comme lues.

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Toutes les notifications ont été marquées comme lues",
  "data": {
    "updatedCount": 15
  }
}
```

**Erreurs possibles:**

- `401` - Non autorisé

---

### GET `/notifications/all`

Obtenir toutes les notifications (admin seulement)

**Headers:**

```
Authorization: Bearer votre-token-admin-ici
```

**Query Parameters:**

- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 20)
- `userId` (optionnel) : Filtrer par ID utilisateur
- `type` (optionnel) : Filtrer par type (`booking`, `payment`, `review`, `system`)
- `isRead` (optionnel) : Filtrer par statut de lecture (`true`/`false`)
- `startDate` (optionnel) : Date de début pour filtrer par date de création (format: YYYY-MM-DD)
- `endDate` (optionnel) : Date de fin pour filtrer par date de création (format: YYYY-MM-DD)

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Notifications récupérées avec succès",
  "data": [ ... ],
  "pagination": { ... }
}
```

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit (admin seulement)

---

### GET `/notifications/:id`

Obtenir une notification spécifique par ID (admin seulement)

**Headers:**

```
Authorization: Bearer votre-token-admin-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Notification récupérée avec succès",
  "data": {
    "id": "notification-id-123",
    "userId": "user-id-123",
    "type": "booking",
    "title": "Nouvelle réservation",
    "message": "Vous avez reçu une nouvelle réservation",
    "isRead": false,
    "metadata": { ... },
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
}
```

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit (admin seulement)
- `404` - Notification non trouvée

---

### DELETE `/notifications/:id`

Supprimer une notification (admin seulement)

**Headers:**

```
Authorization: Bearer votre-token-admin-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Notification supprimée avec succès",
  "data": {
    "deleted": true,
    "notificationId": "notification-id-123"
  }
}
```

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit (admin seulement)
- `404` - Notification non trouvée

---

### GET `/services/:id`

Obtenir un service par ID

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Service récupéré avec succès",
  "data": {
    "id": "service-id-123",
    "serviceType": "tractor",
    "name": "Tracteur John Deere 6120",
    "description": "...",
    "pricePerHour": 5000,
    "pricePerDay": 40000,
    "availability": true,
    "provider": {
      "id": "provider-id-123",
      "businessName": "Agri Services",
      "isApproved": true,
      "rating": 4.5,
      "user": { ... }
    }
  }
}
```

**Erreurs possibles:**

- `404` - Service non trouvé

---

### GET `/services`

Obtenir tous les services avec filtres

**Query Parameters:**

- `page` (optionnel) : Numéro de page
- `limit` (optionnel) : Nombre d'éléments par page
- `serviceType` (optionnel) : Filtrer par type (tractor, semoir, operator, other)
- `availability` (optionnel) : Filtrer par disponibilité (true/false)
- `minPrice` (optionnel) : Prix minimum
- `maxPrice` (optionnel) : Prix maximum
- `latitude` (optionnel) : Latitude pour recherche par proximité
- `longitude` (optionnel) : Longitude pour recherche par proximité
- `radius` (optionnel) : Rayon de recherche en km (requiert latitude/longitude)

**Exemple avec recherche par proximité:**

```
GET /api/services?latitude=14.7167&longitude=-17.4677&radius=10&serviceType=tractor
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Services récupérés avec succès",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

### GET `/services/my-services`

Obtenir les services du prestataire connecté

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Query Parameters:**

- `page` (optionnel)
- `limit` (optionnel)

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Vos services récupérés avec succès",
  "data": [ ... ],
  "pagination": { ... }
}
```

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit (prestataire seulement)

---

### GET `/services/provider/:providerId`

Obtenir les services d'un prestataire

**Query Parameters:**

- `page` (optionnel)
- `limit` (optionnel)

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Services du prestataire récupérés avec succès",
  "data": [ ... ],
  "pagination": { ... }
}
```

---

### PUT `/services/:id`

Mettre à jour un service (prestataire seulement)

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Body:**

```json
{
  "name": "Nouveau nom",
  "description": "Nouvelle description",
  "pricePerHour": 6000,
  "availability": false
}
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Service mis à jour avec succès",
  "data": { ... }
}
```

**Erreurs possibles:**

- `400` - Erreur de validation
- `401` - Non autorisé
- `403` - Accès interdit ou service n'appartient pas au prestataire
- `404` - Service non trouvé

---

### DELETE `/services/:id`

Supprimer un service (prestataire seulement)

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Service supprimé avec succès",
  "data": null
}
```

**Erreurs possibles:**

- `401` - Non autorisé
- `403` - Accès interdit ou service n'appartient pas au prestataire
- `404` - Service non trouvé

---

### PUT `/services/:id/availability`

Mettre à jour la disponibilité d'un service

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Body:**

```json
{
  "availability": false
}
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Disponibilité mise à jour avec succès",
  "data": { ... }
}
```

**Erreurs possibles:**

- `400` - Erreur de validation
- `401` - Non autorisé
- `403` - Accès interdit

---

### GET `/services/search`

Recherche avancée de services

**Query Parameters:**

- `query` (optionnel) : Recherche textuelle (nom, description)
- `serviceType` (optionnel) : Filtrer par type
- `availability` (optionnel) : Filtrer par disponibilité
- `minPrice` (optionnel) : Prix minimum
- `maxPrice` (optionnel) : Prix maximum
- `latitude` (optionnel) : Latitude pour calcul de distance
- `longitude` (optionnel) : Longitude pour calcul de distance
- `radius` (optionnel) : Rayon de recherche en km
- `sortBy` (optionnel) : `relevance`, `distance`, `priceAsc`, `priceDesc`, `rating` (défaut: `relevance`)
- `page` (optionnel) : Numéro de page
- `limit` (optionnel) : Nombre d'éléments par page

**Exemple:**

```
GET /api/services/search?query=tracteur&latitude=14.7167&longitude=-17.4677&radius=20&sortBy=distance
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Résultats de recherche récupérés avec succès",
  "data": [
    {
      "id": "service-id-123",
      "name": "Tracteur John Deere",
      "distance": 5.2,
      ...
    }
  ],
  "pagination": { ... }
}
```

---

### GET `/services/nearby`

Services à proximité

**Query Parameters:**

- `latitude` (requis) : Latitude
- `longitude` (requis) : Longitude
- `radius` (optionnel) : Rayon en km (défaut: 10)
- Autres filtres disponibles (serviceType, availability, etc.)

**Exemple:**

```
GET /api/services/nearby?latitude=14.7167&longitude=-17.4677&radius=15
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Services à proximité récupérés avec succès",
  "data": [
    {
      "id": "service-id-123",
      "name": "Tracteur",
      "distance": 2.5,
      ...
    }
  ],
  "pagination": { ... }
}
```

**Erreurs possibles:**

- `400` - Coordonnées GPS requises

---

## 11. Gestion des Réservations (Bookings)

### POST `/bookings`

Créer une réservation

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Body:**

```json
{
  "serviceId": "service-id-123",
  "bookingDate": "2025-01-15",
  "startTime": "08:00",
  "endTime": "17:00",
  "duration": 8,
  "latitude": 14.7167,
  "longitude": -17.4677,
  "notes": "Travaux de labour"
}
```

**Note:** Soit `endTime` soit `duration` doit être fourni.

**Réponse réussie (201):**

```json
{
  "success": true,
  "message": "Réservation créée avec succès",
  "data": {
    "id": "booking-id-123",
    "userId": "user-id-123",
    "serviceId": "service-id-123",
    "providerId": "provider-id-123",
    "bookingDate": "2025-01-15",
    "startTime": "08:00",
    "endTime": "17:00",
    "duration": 8,
    "totalPrice": 40000,
    "status": "pending",
    "service": { ... },
    "provider": { ... }
  }
}
```

**Erreurs possibles:**

- `400` - Erreur de validation ou service non disponible
- `401` - Non autorisé
- `409` - Conflit de disponibilité (double réservation)

---

### GET `/bookings`

Obtenir toutes les réservations

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Query Parameters:**

- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 20)
- `status` (optionnel) : Filtrer par statut (`pending`, `confirmed`, `completed`, `cancelled`)
- `userId` (optionnel) : Filtrer par utilisateur (admin seulement)
- `providerId` (optionnel) : Filtrer par prestataire
- `serviceId` (optionnel) : Filtrer par service
- `search` (optionnel) : Recherche dans nom/prénom/email/téléphone de l'utilisateur
- `startDate` (optionnel) : Date de début pour filtrer par date de création (format: YYYY-MM-DD)
- `endDate` (optionnel) : Date de fin pour filtrer par date de création (format: YYYY-MM-DD)
- `bookingDateStart` (optionnel) : Date de début pour filtrer par date de réservation (format: YYYY-MM-DD)
- `bookingDateEnd` (optionnel) : Date de fin pour filtrer par date de réservation (format: YYYY-MM-DD)

**Note:** Les utilisateurs normaux voient seulement leurs propres réservations. Les admins peuvent voir toutes les réservations.

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Réservations récupérées avec succès",
  "data": [ ... ],
  "pagination": { ... }
}
```

---

### GET `/bookings/:id`

Obtenir une réservation par ID

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Réservation récupérée avec succès",
  "data": {
    "id": "booking-id-123",
    "status": "confirmed",
    "service": { ... },
    "provider": { ... },
    "user": { ... },
    "payment": { ... }
  }
}
```

---

### PUT `/bookings/:id/confirm`

Confirmer une réservation (provider)

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Réservation confirmée avec succès",
  "data": {
    "id": "booking-id-123",
    "status": "confirmed",
    ...
  }
}
```

**Erreurs possibles:**

- `400` - Réservation ne peut pas être confirmée
- `401` - Non autorisé
- `403` - Vous n'êtes pas autorisé à confirmer cette réservation

---

### PUT `/bookings/:id/cancel`

Annuler une réservation

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Réservation annulée avec succès",
  "data": { ... }
}
```

**Erreurs possibles:**

- `400` - Réservation ne peut pas être annulée
- `403` - Vous n'êtes pas autorisé à annuler cette réservation

---

### PUT `/bookings/:id/complete`

Marquer une réservation comme terminée (provider)

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Réservation marquée comme terminée",
  "data": { ... }
}
```

---

## 12. Gestion des Paiements (Payments)

### POST `/payments/initiate`

Initialiser un paiement PayTech

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Body:**

```json
{
  "bookingId": "booking-id-123",
  "phoneNumber": "+221771234567"
}
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Paiement initialisé avec succès",
  "data": {
    "payment": {
      "id": "payment-id-123",
      "bookingId": "booking-id-123",
      "amount": 40000,
      "status": "pending",
      "transactionId": "paytech-txn-123",
      ...
    },
    "paytech": {
      "transaction_id": "paytech-txn-123",
      "payment_url": "https://paytech.sn/pay/...",
      "token": "payment-token-123"
    }
  }
}
```

**Erreurs possibles:**

- `400` - Erreur de validation
- `401` - Non autorisé
- `404` - Réservation non trouvée
- `400` - Réservation déjà payée

---

### GET `/payments/:id`

Obtenir un paiement par ID

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Paiement récupéré avec succès",
  "data": {
    "id": "payment-id-123",
    "status": "success",
    "amount": 40000,
    "paymentMethod": "paytech",
    "paymentDate": "2025-01-15T10:30:00.000Z",
    "booking": { ... }
  }
}
```

---

### GET `/payments/:id/status`

Vérifier le statut d'un paiement

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Statut du paiement récupéré avec succès",
  "data": {
    "id": "payment-id-123",
    "status": "success",
    ...
  }
}
```

**Note:** Cette méthode vérifie également le statut auprès de PayTech.

---

### GET `/payments`

Obtenir tous les paiements

**Headers:**

```
Authorization: Bearer votre-token-ici
```

**Query Parameters:**

- `page` (optionnel)
- `limit` (optionnel)
- `status` (optionnel) : `pending`, `success`, `failed`
- `userId` (optionnel) : Admin seulement
- `providerId` (optionnel)

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Paiements récupérés avec succès",
  "data": [ ... ],
  "pagination": { ... }
}
```

---

### POST `/payments/webhook/paytech`

Webhook PayTech (pas d'authentification requise)

**Body:** (Données envoyées par PayTech)

```json
{
  "token": "paytech-txn-123",
  "status": "success",
  "amount": 40000,
  "custom_field": "{...}"
}
```

**Réponse (200):**

```json
{
  "success": true,
  "message": "Webhook reçu avec succès"
}
```

**Note:** Ce webhook met automatiquement à jour le statut du paiement et de la réservation associée.

---

## Codes de Statut HTTP

- `200` - Succès
- `201` - Créé avec succès
- `400` - Erreur de validation ou requête invalide
- `401` - Non autorisé (token invalide ou expiré)
- `403` - Accès interdit
- `404` - Ressource non trouvée
- `409` - Conflit (ressource existe déjà)
- `500` - Erreur interne du serveur

---
---

## 10. Administration

### GET `/admin/dashboard`

Obtenir les statistiques globales du tableau de bord.

**Headers:**
`Authorization: Bearer <admin_token>`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalProviders": 20,
    "totalServices": 45,
    "pending": 5,
    "monthlyRevenue": 1500000,
    "recentActivities": [
       { "type": "NEW_BOOKING", "message": "...", "date": "..." }
    ]
  }
}
```

### POST `/users` (Admin Création)

Créer un utilisateur manuellement (Admin seulement).

**Headers:**
`Authorization: Bearer <admin_token>`

**Body:**
```json
{
  "firstName": "Moussa",
  "lastName": "Diop",
  "phoneNumber": "+221770000000",
  "password": "password123",
  "role": "admin",
  "isVerified": true
}
```

---

## 11. Maintenance

### GET `/maintenances/stats/reports`

Obtenir les rapports statistiques des maintenances.

**Headers:**
`Authorization: Bearer <admin_token>`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "costByMonth": [
        { "month": "2025-01-01...", "totalCost": 50000 }
    ],
    "countByType": [
        { "serviceType": "tractor", "count": 10 }
    ]
  }
}
```

## Format des Réponses

### Succès

```json
{
  "success": true,
  "message": "Message de succès",
  "data": { ... }
}
```

### Erreur

```json
{
  "success": false,
  "message": "Message d'erreur"
}
```

---

## Rate Limiting

- **Endpoints d'authentification** : 5 requêtes par 15 minutes
- **Autres endpoints** : 100 requêtes par 15 minutes

---

## Validation

Tous les champs sont validés avec Joi :

### Champs utilisateur

- `phoneNumber` : Format international avec `+` (ex: `+221771234567`)
- `firstName` : 2-50 caractères
- `lastName` : 2-50 caractères
- `email` : Format email valide (requis pour l'authentification par OTP)
- `language` : `fr` ou `wolof` (défaut: `fr`)
- `code` : 6 chiffres
- `latitude` : Entre -90 et 90
- `longitude` : Entre -180 et 180

### Champs prestataire

- `businessName` : 2-100 caractères (requis)
- `description` : Texte libre (optionnel)
- `documents` : Tableau de chaînes (optionnel)

### Champs service

- `serviceType` : `tractor`, `semoir`, `operator`, ou `other` (requis)
- `name` : 2-100 caractères (requis)
- `description` : Texte libre (optionnel)
- `pricePerHour` : Nombre positif (optionnel, mais au moins un prix requis)
- `pricePerDay` : Nombre positif (optionnel, mais au moins un prix requis)
- `images` : Tableau de chaînes (optionnel) - URLs Cloudinary
- `availability` : Boolean (défaut: true)
- `latitude` : Entre -90 et 90 (optionnel)
- `longitude` : Entre -180 et 180 (optionnel)

### Champs réservation

- `serviceId` : UUID (requis)
- `bookingDate` : Date ISO (requis, ex: "2025-01-15")
- `startTime` : Format HH:MM (requis, ex: "08:00")
- `endTime` : Format HH:MM (optionnel si duration fournie)
- `duration` : Nombre entier d'heures (optionnel si endTime fourni, min: 1)
- `latitude` : Entre -90 et 90 (optionnel)
- `longitude` : Entre -180 et 180 (optionnel)
- `notes` : Texte libre (optionnel)

### Champs paiement

- `bookingId` : UUID (requis)
- `phoneNumber` : Format international avec `+` (requis)

---

## Upload d'Images

Les images des services sont uploadées via Cloudinary. Les URLs des images uploadées doivent être fournies dans le champ `images` lors de la création/mise à jour d'un service.

### Processus recommandé

1. Uploader l'image sur Cloudinary (via votre frontend)
2. Récupérer l'URL sécurisée fournie par Cloudinary
3. Ajouter cette URL dans le champ `images` lors de la création du service

---

*Documentation mise à jour le 2025-01-15*
