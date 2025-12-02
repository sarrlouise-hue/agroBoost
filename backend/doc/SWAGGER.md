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

### User
Modèle complet de l'utilisateur avec tous les champs

### RegisterRequest
Schéma pour l'inscription d'un utilisateur

### VerifyOTPRequest
Schéma pour la vérification OTP

### LoginRequest
Schéma pour la connexion

### RefreshTokenRequest
Schéma pour le rafraîchissement de token

### SuccessResponse
Format standard de réponse de succès

### ErrorResponse
Format standard de réponse d'erreur

### AuthResponse
Format de réponse pour l'authentification (avec user, token, refreshToken)

## Authentification dans Swagger

Pour tester les endpoints protégés (à venir) :

1. Cliquer sur le bouton "Authorize" en haut à droite
2. Entrer le token JWT obtenu lors de la connexion
3. Cliquer sur "Authorize"
4. Tous les endpoints protégés utiliseront ce token

## Export de la Documentation

La documentation Swagger peut être exportée en JSON :

```
http://localhost:5000/api-docs.json
```

Ce fichier peut être importé dans :
- Postman
- Insomnia
- Autres outils API

## Mise à Jour

La documentation Swagger est générée automatiquement à partir des annotations JSDoc dans les fichiers de routes.

Pour ajouter un nouvel endpoint :
1. Ajouter l'annotation `@swagger` dans le fichier de route
2. Redémarrer le serveur
3. La documentation sera mise à jour automatiquement

---

*Documentation Swagger mise à jour automatiquement*

