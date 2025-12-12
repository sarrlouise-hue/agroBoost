# Guide d'utilisation de Postman

Ce guide explique comment utiliser la collection Postman pour tester l'API AlloTracteur.

## Installation

1. **Télécharger Postman** : [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

2. **Importer la collection** :
   - Ouvrir Postman
   - Cliquer sur "Import"
   - Sélectionner le fichier `postman_collection.json` dans le dossier `backend/`
   - La collection "AlloTracteur API" apparaîtra dans votre workspace

3. **Importer l'environnement (optionnel mais recommandé)** :
   - Cliquer sur "Import"
   - Sélectionner le fichier `postman_environment.json` dans le dossier `backend/`
   - Sélectionner l'environnement "AlloTracteur - Local" dans le menu déroulant en haut à droite

## Configuration

### Variables d'environnement

La collection utilise des variables pour faciliter les tests :

- `base_url` : URL de base de l'API (par défaut : `http://localhost:3000`)
- `access_token` : Token JWT d'accès (sauvegardé automatiquement après connexion)
- `refresh_token` : Token de rafraîchissement (sauvegardé automatiquement après connexion)
- `reset_token` : Token de réinitialisation de mot de passe (sauvegardé automatiquement)
- `user_id` : ID de l'utilisateur connecté
- `provider_id` : ID du prestataire (si applicable)
- `service_id` : ID du service (pour les tests de services)

### Modifier l'URL de base

**Option 1 : Variables de collection** (si vous n'utilisez pas d'environnement)

1. Cliquer sur la collection "AlloTracteur API"
2. Aller dans l'onglet "Variables"
3. Modifier la valeur de `base_url` si nécessaire (ex: `http://localhost:3000`)

**Option 2 : Variables d'environnement** (recommandé)

1. Cliquer sur l'environnement "AlloTracteur - Local" (en haut à droite)
2. Cliquer sur l'icône d'édition (œil)
3. Modifier la valeur de `base_url` si nécessaire

## Flux de test recommandé

### 1. Vérifier que le serveur fonctionne

- Exécuter la requête **"Health Check"**
- Devrait retourner `{"status": "OK", ...}`

### 2. Inscription d'un nouvel utilisateur

- Exécuter **"Inscription"**
- Modifier le `email` dans le body si nécessaire (l'email est requis)
- Le serveur retournera un `token` et `refreshToken`
- Un code OTP sera envoyé par email (et visible dans les logs du serveur en développement si l'email n'est pas configuré)

### 3. Vérifier l'OTP

- Exécuter **"Vérifier OTP"**
- Fournir l'`email` et le `code` OTP reçu par email
- Le compte sera activé (`isVerified: true`)

### 4. Connexion

- **Option A** : **"Connexion (sans mot de passe)"** - Utilise le numéro de téléphone ou l'email
- **Option B** : **"Connexion (avec mot de passe)"** - Utilise le numéro/email et le mot de passe
- Les tokens seront automatiquement sauvegardés dans les variables de collection

### 5. Utiliser les tokens

- Les tokens sont automatiquement sauvegardés après une connexion réussie
- Les requêtes suivantes utilisent automatiquement `{{access_token}}` dans l'en-tête Authorization

### 6. Rafraîchir le token

- Exécuter **"Rafraîchir Token"**
- Utilise le `refresh_token` sauvegardé
- Retourne un nouveau `access_token`

### 7. Changer le mot de passe

- Exécuter **"Changer mot de passe"**
- Nécessite d'être authentifié (token dans l'en-tête)
- Fournir l'ancien et le nouveau mot de passe

### 8. Mot de passe oublié

- Exécuter **"Mot de passe oublié"**
- Un token de réinitialisation sera créé
- Le token sera sauvegardé automatiquement dans `reset_token`

### 9. Réinitialiser le mot de passe

- Exécuter **"Réinitialiser mot de passe"**
- Utilise le `reset_token` sauvegardé
- Fournir le nouveau mot de passe

### 10. Déconnexion

- Exécuter **"Déconnexion"**
- Nécessite d'être authentifié

### 11. Gestion du profil utilisateur

- **"Obtenir profil"** - Récupérer le profil de l'utilisateur connecté
- **"Mettre à jour profil"** - Modifier les informations du profil
- **"Mettre à jour localisation"** - Mettre à jour la position géographique
- **"Changer langue"** - Changer la langue de l'interface (fr/wolof)

### 12. Géolocalisation prestataire

- **"Mettre à jour géolocalisation prestataire"** - Mettre à jour les coordonnées GPS du prestataire

### 13. Recherche avancée de services

- **"Recherche services"** - Recherche avec filtres, texte et géolocalisation
- **"Services à proximité"** - Services dans un rayon spécifique

### 14. Gestion des réservations

- **"Créer réservation"** - Créer une nouvelle réservation (avec vérification de disponibilité)
- **"Obtenir réservations"** - Liste des réservations avec filtres
- **"Obtenir réservation"** - Détails d'une réservation
- **"Confirmer réservation"** - Confirmer une réservation (provider)
- **"Annuler réservation"** - Annuler une réservation
- **"Terminer réservation"** - Marquer une réservation comme terminée (provider)

### 15. Gestion des paiements

- **"Initialiser paiement PayTech"** - Créer un paiement pour une réservation
- **"Obtenir paiement"** - Détails d'un paiement
- **"Vérifier statut paiement"** - Vérifier le statut auprès de PayTech
- **"Obtenir paiements"** - Liste des paiements avec filtres

### 12. Gestion des prestataires

- **"Inscription prestataire"** - Devenir prestataire (nécessite d'être utilisateur)
- **"Obtenir profil prestataire"** - Récupérer le profil prestataire
- **"Mettre à jour profil prestataire"** - Modifier les informations du prestataire
- **"Liste prestataires"** - Obtenir tous les prestataires avec filtres
- **"Prestataires approuvés"** - Obtenir uniquement les prestataires approuvés
- **"Approuver prestataire"** - Approuver un prestataire (admin seulement)
- **"Rejeter prestataire"** - Rejeter un prestataire (admin seulement)

### 13. Gestion des services agricoles

- **"Créer service"** - Créer un nouveau service (prestataire seulement)
- **"Obtenir service"** - Récupérer les détails d'un service
- **"Liste services"** - Obtenir tous les services avec filtres (type, prix, géolocalisation)
- **"Mes services"** - Obtenir les services du prestataire connecté
- **"Services d'un prestataire"** - Obtenir les services d'un prestataire spécifique
- **"Mettre à jour service"** - Modifier un service (propriétaire seulement)
- **"Mettre à jour disponibilité"** - Changer la disponibilité d'un service
- **"Supprimer service"** - Supprimer un service (propriétaire seulement)

## Scripts automatiques

La collection inclut un script de test qui :

- Sauvegarde automatiquement les tokens après une connexion réussie
- Sauvegarde le `reset_token` après une demande de réinitialisation

## Exemples de réponses

### Inscription réussie (201)

```json
{
  "success": true,
  "message": "Utilisateur inscrit avec succès. Veuillez vérifier votre email pour le code OTP.",
  "data": {
    "user": {
      "id": "...",
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

### Connexion réussie (200)

```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": { ... },
    "token": "...",
    "refreshToken": "..."
  }
}
```

### Erreur (400/401/404)

```json
{
  "success": false,
  "message": "Message d'erreur"
}
```

## Conseils

1. **Variables** : Utilisez des emails différents pour chaque test
2. **OTP** : L'OTP est envoyé par email. En développement, si l'email n'est pas configuré, l'OTP sera visible dans les logs du serveur
3. **Tokens** : Les tokens sont automatiquement sauvegardés, pas besoin de les copier manuellement
4. **Environnement** : Utilisez l'environnement Postman pour facilement basculer entre dev, staging, prod
5. **Tests** : Les scripts de test sauvegardent automatiquement les tokens dans les variables
6. **Collection Runner** : Utilisez le Collection Runner pour exécuter tous les tests en séquence

## Dépannage

### Erreur 401 (Non autorisé)

- Vérifier que le token est valide et non expiré
- Vérifier que l'en-tête Authorization contient `Bearer {{access_token}}`

### Erreur 409 (Conflit)

- L'utilisateur existe déjà avec ce numéro de téléphone ou cet email
- Utiliser un autre numéro de téléphone ou un autre email

### Erreur 429 (Trop de requêtes)

- Rate limiting activé
- Attendre quelques minutes avant de réessayer

### Erreur de connexion

- Vérifier que le serveur est démarré (`npm start` ou `npm run dev`)
- Vérifier que l'URL dans `base_url` est correcte
- Vérifier que PostgreSQL est en cours d'exécution
