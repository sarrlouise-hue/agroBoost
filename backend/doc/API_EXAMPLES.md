# Exemples d'utilisation de l'API - AlloTracteur

## Base URL

```
http://localhost:3000
```

## Health Check

### Vérifier le statut du serveur

```bash
curl -X GET http://localhost:3000/health
```

## Authentification

### 1. Inscription

Inscrire un nouvel utilisateur.

```bash
curl -X POST http://localhost:3000/api/auth/register \
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

### 2. Vérifier OTP

Vérifier le code OTP reçu par email et activer le compte.

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "amadou@example.com",
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

Renvoyer un nouveau code OTP par email.

```bash
curl -X POST http://localhost:3000/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "amadou@example.com"
  }'
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Code OTP envoyé par email avec succès",
  "data": null
}
```

### 4. Connexion

Connecter un utilisateur existant.

```bash
curl -X POST http://localhost:3000/api/auth/login \
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
curl -X POST http://localhost:3000/api/auth/refresh-token \
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
curl -X POST http://localhost:3000/api/auth/logout \
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

Pour les endpoints protégés, inclure le token dans le header :

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer votre-token-ici"
```

---

## Gestion des Utilisateurs

### 1. Obtenir le profil

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer votre-token-ici"
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

### 2. Mettre à jour le profil

```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer votre-token-ici" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Amadou",
    "lastName": "Diallo",
    "email": "nouveau@example.com"
  }'
```

### 3. Mettre à jour la localisation

```bash
curl -X PUT http://localhost:3000/api/users/location \
  -H "Authorization: Bearer votre-token-ici" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 14.7167,
    "longitude": -17.4677,
    "address": "Dakar, Sénégal"
  }'
```

### 4. Changer la langue

```bash
curl -X PUT http://localhost:3000/api/users/language \
  -H "Authorization: Bearer votre-token-ici" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "wolof"
  }'
```

---

## Gestion des Prestataires

### 1. Inscription prestataire

```bash
curl -X POST http://localhost:3000/api/providers/register \
  -H "Authorization: Bearer votre-token-ici" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Agri Services Sénégal",
    "description": "Services agricoles de qualité",
    "documents": ["doc1.pdf", "doc2.pdf"]
  }'
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
    "isApproved": false,
    "rating": 0,
    "totalBookings": 0
  }
}
```

### 2. Obtenir le profil prestataire

```bash
curl -X GET http://localhost:3000/api/providers/profile \
  -H "Authorization: Bearer votre-token-ici"
```

### 3. Mettre à jour le profil prestataire

```bash
curl -X PUT http://localhost:3000/api/providers/profile \
  -H "Authorization: Bearer votre-token-ici" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Nouveau nom",
    "description": "Nouvelle description"
  }'
```

### 4. Obtenir tous les prestataires

```bash
curl -X GET "http://localhost:3000/api/providers?page=1&limit=20&isApproved=true&minRating=4.0"
```

### 5. Approuver un prestataire (admin)

```bash
curl -X PUT http://localhost:3000/api/providers/provider-id-123/approve \
  -H "Authorization: Bearer votre-token-admin-ici"
```

---

## Gestion des Services Agricoles

### 1. Créer un service

```bash
curl -X POST http://localhost:3000/api/services \
  -H "Authorization: Bearer votre-token-ici" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType": "tractor",
    "name": "Tracteur John Deere 6120",
    "description": "Tracteur puissant pour travaux agricoles",
    "pricePerHour": 5000,
    "pricePerDay": 40000,
    "images": ["image1.jpg", "image2.jpg"],
    "availability": true,
    "latitude": 14.7167,
    "longitude": -17.4677
  }'
```

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
    "availability": true
  }
}
```

### 2. Obtenir tous les services avec filtres

```bash
curl -X GET "http://localhost:3000/api/services?serviceType=tractor&availability=true&minPrice=1000&maxPrice=10000&page=1&limit=20"
```

### 3. Recherche par proximité géographique

```bash
curl -X GET "http://localhost:3000/api/services?latitude=14.7167&longitude=-17.4677&radius=10&serviceType=tractor"
```

### 4. Obtenir un service par ID

```bash
curl -X GET http://localhost:3000/api/services/service-id-123
```

### 5. Obtenir mes services (prestataire)

```bash
curl -X GET http://localhost:3000/api/services/my-services \
  -H "Authorization: Bearer votre-token-ici"
```

### 6. Mettre à jour un service

```bash
curl -X PUT http://localhost:3000/api/services/service-id-123 \
  -H "Authorization: Bearer votre-token-ici" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nouveau nom",
    "pricePerHour": 6000,
    "availability": false
  }'
```

### 7. Mettre à jour la disponibilité

```bash
curl -X PUT http://localhost:3000/api/services/service-id-123/availability \
  -H "Authorization: Bearer votre-token-ici" \
  -H "Content-Type: application/json" \
  -d '{
    "availability": false
  }'
```

### 8. Supprimer un service

```bash
curl -X DELETE http://localhost:3000/api/services/service-id-123 \
  -H "Authorization: Bearer votre-token-ici"
```

### 9. Obtenir les services d'un prestataire

```bash
curl -X GET "http://localhost:3000/api/services/provider/provider-id-123?page=1&limit=10"
```

### 10. Recherche avancée de services

```bash
curl -X GET "http://localhost:3000/api/services/search?query=tracteur&latitude=14.7167&longitude=-17.4677&radius=20&sortBy=distance&page=1&limit=20"
```

### 11. Services à proximité

```bash
curl -X GET "http://localhost:3000/api/services/nearby?latitude=14.7167&longitude=-17.4677&radius=15"
```

### 12. Mettre à jour la géolocalisation du prestataire

```bash
curl -X PUT http://localhost:3000/api/providers/profile/location \
  -H "Authorization: Bearer votre-token-ici" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 14.7167,
    "longitude": -17.4677
  }'
```

---

## Gestion des Réservations

### 1. Créer une réservation

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer votre-token-ici" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "service-id-123",
    "bookingDate": "2025-01-15",
    "startTime": "08:00",
    "endTime": "17:00",
    "duration": 8,
    "latitude": 14.7167,
    "longitude": -17.4677,
    "notes": "Travaux de labour"
  }'
```

**Réponse réussie (201):**

```json
{
  "success": true,
  "message": "Réservation créée avec succès",
  "data": {
    "id": "booking-id-123",
    "serviceId": "service-id-123",
    "bookingDate": "2025-01-15",
    "startTime": "08:00",
    "endTime": "17:00",
    "totalPrice": 40000,
    "status": "pending"
  }
}
```

### 2. Obtenir toutes les réservations

```bash
curl -X GET "http://localhost:3000/api/bookings?status=pending&page=1&limit=20" \
  -H "Authorization: Bearer votre-token-ici"
```

### 3. Obtenir une réservation par ID

```bash
curl -X GET http://localhost:3000/api/bookings/booking-id-123 \
  -H "Authorization: Bearer votre-token-ici"
```

### 4. Confirmer une réservation (provider)

```bash
curl -X PUT http://localhost:3000/api/bookings/booking-id-123/confirm \
  -H "Authorization: Bearer votre-token-ici"
```

### 5. Annuler une réservation

```bash
curl -X PUT http://localhost:3000/api/bookings/booking-id-123/cancel \
  -H "Authorization: Bearer votre-token-ici"
```

### 6. Marquer une réservation comme terminée (provider)

```bash
curl -X PUT http://localhost:3000/api/bookings/booking-id-123/complete \
  -H "Authorization: Bearer votre-token-ici"
```

---

## Gestion des Paiements

### 1. Initialiser un paiement PayTech

```bash
curl -X POST http://localhost:3000/api/payments/initiate \
  -H "Authorization: Bearer votre-token-ici" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "booking-id-123",
    "phoneNumber": "+221771234567"
  }'
```

**Réponse réussie (200):**

```json
{
  "success": true,
  "message": "Paiement initialisé avec succès",
  "data": {
    "payment": {
      "id": "payment-id-123",
      "amount": 40000,
      "status": "pending",
      "transactionId": "paytech-txn-123"
    },
    "paytech": {
      "transaction_id": "paytech-txn-123",
      "payment_url": "https://paytech.sn/pay/...",
      "token": "payment-token-123"
    }
  }
}
```

### 2. Obtenir un paiement par ID

```bash
curl -X GET http://localhost:3000/api/payments/payment-id-123 \
  -H "Authorization: Bearer votre-token-ici"
```

### 3. Vérifier le statut d'un paiement

```bash
curl -X GET http://localhost:3000/api/payments/payment-id-123/status \
  -H "Authorization: Bearer votre-token-ici"
```

### 4. Obtenir tous les paiements

```bash
curl -X GET "http://localhost:3000/api/payments?status=success&page=1&limit=20" \
  -H "Authorization: Bearer votre-token-ici"
```

### 5. Webhook PayTech (côté serveur)

```bash
curl -X POST http://localhost:3000/api/payments/webhook/paytech \
  -H "Content-Type: application/json" \
  -d '{
    "token": "paytech-txn-123",
    "status": "success",
    "amount": 40000
  }'
```

---

## Codes d'erreur

- `400` - Erreur de validation ou requête invalide
- `401` - Non autorisé (token invalide ou expiré)
- `403` - Accès interdit
- `404` - Ressource non trouvée
- `409` - Conflit (utilisateur existe déjà, double réservation)
- `500` - Erreur interne du serveur

## Notes

- Tous les endpoints d'authentification sont publics (pas besoin de token)
- Le token JWT expire après 7 jours (configurable)
- Le refresh token expire après 30 jours (configurable)
- L'OTP expire après 5 minutes (configurable)
- L'OTP est envoyé par email (pas par SMS)
- L'email est requis pour l'inscription et l'authentification
- Le numéro de téléphone doit être au format international avec le préfixe `+`
- Les réservations vérifient automatiquement la disponibilité (anti-double réservation)
- Les paiements PayTech nécessitent la configuration des credentials dans les variables d'environnement
- Les images sont uploadées via Cloudinary (configuration requise)
