# AGRO BOOST - Backend API

Backend API pour l'application AGRO BOOST - Plateforme de réservation de services agricoles au Sénégal.

## 🎯 Phase Actuelle : Authentification

Cette version contient uniquement le système d'authentification complet avec :
- ✅ Inscription utilisateur
- ✅ Vérification OTP par SMS
- ✅ Connexion
- ✅ JWT tokens (access + refresh)
- ✅ Middleware d'authentification

## 🚀 Technologies (Stack PERN)

- **Node.js** (v18+)
- **Express.js** - Framework web
- **PostgreSQL** - Base de données relationnelle
- **Sequelize** - ORM (Object-Relational Mapping)
- **JWT** - Authentification
- **Joi** - Validation

## 📋 Prérequis

- Node.js >= 18.0.0
- PostgreSQL >= 12.0 (local ou service cloud)
- npm >= 9.0.0

## 🔧 Installation

1. Installer les dépendances
```bash
cd backend
npm install
```

2. Configurer les variables d'environnement
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

3. Démarrer PostgreSQL
```bash
# Si PostgreSQL est installé localement
# Sur Linux/Mac
sudo service postgresql start
# ou
pg_ctl -D /usr/local/var/postgres start

# Sur Windows
# Démarrer le service PostgreSQL depuis les Services Windows

# Créer la base de données
createdb agroboost
# ou via psql
psql -U postgres -c "CREATE DATABASE agroboost;"
```

4. Démarrer le serveur
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 📁 Structure du Projet

```
backend/
├── src/
│   ├── config/          # Configuration (DB, env, constants)
│   ├── models/          # Modèles Sequelize (User, OTP, PasswordResetToken)
│   ├── controllers/    # Contrôleurs (auth)
│   ├── routes/          # Routes API (auth)
│   ├── services/        # Services métier (auth)
│   ├── middleware/      # Middlewares (auth, error, rateLimit)
│   ├── validators/      # Validateurs Joi (auth)
│   ├── utils/           # Utilitaires (logger, response, errors)
│   └── app.js           # Point d'entrée
└── package.json
```

## 🔐 API Endpoints - Authentification

### POST `/api/auth/register`
Inscription d'un nouvel utilisateur
```json
{
  "phoneNumber": "+221771234567",
  "firstName": "Amadou",
  "lastName": "Diallo",
  "email": "amadou@example.com", // optionnel
  "language": "fr" // "fr" ou "wolof"
}
```

### POST `/api/auth/verify-otp`
Vérification de l'OTP et activation du compte
```json
{
  "phoneNumber": "+221771234567",
  "code": "123456"
}
```

### POST `/api/auth/resend-otp`
Renvoyer un code OTP
```json
{
  "phoneNumber": "+221771234567"
}
```

### POST `/api/auth/login`
Connexion utilisateur
```json
{
  "phoneNumber": "+221771234567"
}
```

### POST `/api/auth/refresh-token`
Rafraîchir le token d'accès
```json
{
  "refreshToken": "your-refresh-token"
}
```

### POST `/api/auth/logout`
Déconnexion (client-side)

## 🔒 Variables d'Environnement

Voir `.env.example` pour la liste complète. Les principales :

- `DATABASE_URL` ou variables individuelles (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) - Connexion PostgreSQL (ex: `postgresql://postgres:password@127.0.0.1:5432/agroboost`)
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `OTP_EXPIRES_IN`, `OTP_LENGTH`

## 🧪 Tests

```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch
```

## 📝 Scripts Disponibles

- `npm start` - Démarrer le serveur en production
- `npm run dev` - Démarrer en mode développement avec nodemon
- `npm run lint` - Vérifier le code

## 📚 Documentation

Toute la documentation technique est disponible dans le dossier [`doc/`](./doc/) :

- **[API.md](./doc/API.md)** - Documentation complète de l'API
- **[ARCHITECTURE.md](./doc/ARCHITECTURE.md)** - Architecture technique
- **[DEPLOYMENT.md](./doc/DEPLOYMENT.md)** - Guide de déploiement
- **[API_EXAMPLES.md](./doc/API_EXAMPLES.md)** - Exemples d'utilisation avec curl
- **[SWAGGER.md](./doc/SWAGGER.md)** - Guide d'utilisation de Swagger
- **[POSTMAN.md](./doc/POSTMAN.md)** - Guide d'utilisation de Postman

## 📖 Documentation Interactive (Swagger)

Une fois le serveur démarré, accédez à la documentation Swagger interactive :

```
http://localhost:5000/api-docs
```

Vous pouvez tester tous les endpoints directement depuis le navigateur !

## 🧪 Tests avec Postman

Une collection Postman est disponible pour tester facilement l'API :

1. **Importer la collection** :
   - Ouvrir Postman
   - Cliquer sur "Import"
   - Sélectionner le fichier `postman_collection.json` dans le dossier `backend/`

2. **Configurer les variables** :
   - La collection utilise `{{base_url}}` (par défaut : `http://localhost:5000`)
   - Les tokens sont automatiquement sauvegardés après connexion

3. **Guide d'utilisation** : Voir [`doc/POSTMAN.md`](./doc/POSTMAN.md) pour plus de détails

**Note** : Les tokens (`access_token`, `refresh_token`) sont automatiquement sauvegardés dans les variables de collection après une connexion réussie.

## 🔄 Prochaines Étapes

- [ ] Intégration SMS pour l'envoi d'OTP
- [ ] Gestion des utilisateurs (profil, mise à jour)
- [ ] Gestion des prestataires
- [ ] Services agricoles
- [ ] Réservations
- [ ] Paiements Mobile Money

---

*Développé pour AGRO BOOST - MVP - Phase 1 : Authentification*
