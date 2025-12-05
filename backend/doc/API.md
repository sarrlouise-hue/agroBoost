# Documentation API - AGRO BOOST

## Base URL
```
http://localhost:5000/api
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
  "timestamp": "2024-01-01T00:00:00.000Z",
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

**Réponse réussie (201):**
```json
{
  "success": true,
  "message": "Utilisateur inscrit avec succès. Veuillez vérifier l'OTP.",
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
Vérifier le code OTP et activer le compte

**Body:**
```json
{
  "phoneNumber": "+221771234567",
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
Renvoyer un nouveau code OTP

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
  "message": "OTP envoyé avec succès",
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
- `page` (optionnel) : Numéro de page
- `limit` (optionnel) : Nombre d'éléments par page
- `isApproved` (optionnel) : Filtrer par statut d'approbation (true/false)
- `minRating` (optionnel) : Note minimale

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
- `email` : Format email valide (optionnel)
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
- `images` : Tableau de chaînes (optionnel)
- `availability` : Boolean (défaut: true)
- `latitude` : Entre -90 et 90 (optionnel)
- `longitude` : Entre -180 et 180 (optionnel)

---

*Documentation mise à jour le 2024-01-01*

