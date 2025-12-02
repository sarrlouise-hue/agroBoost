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

Pour les endpoints protégés (à venir), inclure le token dans le header :

```
Authorization: Bearer votre-token-ici
```

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
- `phoneNumber` : Format international avec `+` (ex: `+221771234567`)
- `firstName` : 2-50 caractères
- `lastName` : 2-50 caractères
- `email` : Format email valide (optionnel)
- `language` : `fr` ou `wolof` (défaut: `fr`)
- `code` : 6 chiffres

---

*Documentation mise à jour le 2024-01-01*

