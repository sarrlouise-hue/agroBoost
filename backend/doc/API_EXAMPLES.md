# Exemples d'utilisation de l'API - AGRO BOOST

## Base URL
```
http://localhost:5000
```

## Health Check

### Vérifier le statut du serveur
```bash
curl -X GET http://localhost:5000/health
```

## Authentification

### 1. Inscription

Inscrire un nouvel utilisateur.

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+221771234567",
    "firstName": "Amadou",
    "lastName": "Diallo",
    "email": "amadou@example.com",
    "language": "fr"
  }'
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

### 2. Vérifier OTP

Vérifier le code OTP reçu par SMS et activer le compte.

```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+221771234567",
    "code": "123456"
  }'
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

**Réponse d'erreur (400):**
```json
{
  "success": false,
  "message": "OTP invalide ou expiré"
}
```

### 3. Renvoyer OTP

Renvoyer un nouveau code OTP.

```bash
curl -X POST http://localhost:5000/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+221771234567"
  }'
```

**Réponse réussie (200):**
```json
{
  "success": true,
  "message": "OTP envoyé avec succès",
  "data": null
}
```

### 4. Connexion

Connecter un utilisateur existant.

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+221771234567"
  }'
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

### 5. Rafraîchir Token

Rafraîchir le token d'accès avec le refresh token.

```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "votre-refresh-token-ici"
  }'
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

### 6. Déconnexion

Déconnecter un utilisateur (suppression du token côté client).

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Content-Type: application/json"
```

**Réponse réussie (200):**
```json
{
  "success": true,
  "message": "Déconnexion réussie",
  "data": null
}
```

## Utilisation du Token

Pour les endpoints protégés (à venir), inclure le token dans le header :

```bash
curl -X GET http://localhost:5000/api/protected-endpoint \
  -H "Authorization: Bearer votre-token-ici"
```

## Codes d'erreur

- `400` - Erreur de validation ou requête invalide
- `401` - Non autorisé (token invalide ou expiré)
- `404` - Ressource non trouvée
- `409` - Conflit (utilisateur existe déjà)
- `500` - Erreur interne du serveur

## Notes

- Tous les endpoints d'authentification sont publics (pas besoin de token)
- Le token JWT expire après 7 jours (configurable)
- Le refresh token expire après 30 jours (configurable)
- L'OTP expire après 5 minutes (configurable)
- Le numéro de téléphone doit être au format international avec le préfixe `+`

