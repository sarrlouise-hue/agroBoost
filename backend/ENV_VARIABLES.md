# Variables d'environnement - AlloTracteur

Ce document liste toutes les variables d'environnement nécessaires pour configurer l'application.

Créez un fichier `.env` à la racine du dossier `backend` avec ces variables.

## 📋 Template .env

```env
# ============================================
# Configuration de l'environnement - AlloTracteur
# ============================================

# ============================================
# Environnement
# ============================================
NODE_ENV=development
PORT=3000

# ============================================
# Base de données PostgreSQL
# ============================================
# Option 1: Utiliser DATABASE_URL (recommandé)
DATABASE_URL=postgresql://postgres:password@localhost:5432/allotracteur

# Option 2: Utiliser les variables individuelles
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=allotracteur

# ============================================
# JWT (JSON Web Tokens)
# ============================================
# Générez des secrets forts et uniques pour la production
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=30d

# ============================================
# OTP (One-Time Password)
# ============================================
OTP_EXPIRES_IN=5m
OTP_LENGTH=6

# ============================================
# Redis (Optionnel - pour cache et queues)
# ============================================
REDIS_URL=redis://localhost:6379

# ============================================
# PayTech Mobile Money
# ============================================
PAYTECH_API_KEY=your_paytech_api_key
PAYTECH_API_SECRET=your_paytech_api_secret
PAYTECH_MERCHANT_ID=your_paytech_merchant_id
PAYTECH_BASE_URL=https://paytech.sn
PAYTECH_WEBHOOK_SECRET=your_paytech_webhook_secret

# ============================================
# Google Maps API
# ============================================
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# ============================================
# Firebase (Optionnel - pour notifications push)
# ============================================
FIREBASE_SERVER_KEY=your_firebase_server_key
FIREBASE_PROJECT_ID=your_firebase_project_id

# ============================================
# Upload de fichiers
# ============================================
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# ============================================
# Cloudinary (Stockage d'images)
# ============================================
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# ============================================
# Rate Limiting
# ============================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ============================================
# URLs Frontend
# ============================================
FRONTEND_URL=http://localhost:3001
ADMIN_URL=http://localhost:3002

# ============================================
# Configuration Email
# ============================================
# Configuration SMTP pour l'envoi d'emails
# Pour Gmail, vous devez créer un "Mot de passe d'application"
# https://myaccount.google.com/apppasswords

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here

# Email de l'expéditeur
EMAIL_FROM_EMAIL=your_email@gmail.com
EMAIL_FROM_NAME=AlloTracteur

# Nom de l'application (utilisé dans les emails)
EMAIL_APP_NAME=AlloTracteur

# Email de support
EMAIL_SUPPORT_EMAIL=support@allotracteur.com
```

## 📝 Description des variables

### Environnement
- `NODE_ENV`: Environnement d'exécution (`development`, `production`, `test`)
- `PORT`: Port sur lequel le serveur écoute (défaut: 3000)

### Base de données PostgreSQL
- `DATABASE_URL`: URL complète de connexion (prioritaire)
- `DB_HOST`: Adresse du serveur PostgreSQL
- `DB_PORT`: Port PostgreSQL (défaut: 5432)
- `DB_USER`: Nom d'utilisateur PostgreSQL
- `DB_PASSWORD`: Mot de passe PostgreSQL
- `DB_NAME`: Nom de la base de données

### JWT (Authentification)
- `JWT_SECRET`: Secret pour signer les tokens JWT (⚠️ Changez en production)
- `JWT_EXPIRES_IN`: Durée de validité du token (défaut: 7d)
- `JWT_REFRESH_SECRET`: Secret pour les refresh tokens
- `JWT_REFRESH_EXPIRES_IN`: Durée de validité du refresh token (défaut: 30d)

### OTP (Codes de vérification)
- `OTP_EXPIRES_IN`: Durée de validité des codes OTP (défaut: 5m)
- `OTP_LENGTH`: Longueur du code OTP (défaut: 6)

### Email
- `EMAIL_HOST`: Serveur SMTP (défaut: smtp.gmail.com)
- `EMAIL_PORT`: Port SMTP (défaut: 587)
- `EMAIL_SECURE`: Utiliser SSL/TLS (true/false, défaut: false)
- `EMAIL_USER`: Adresse email pour l'authentification SMTP
- `EMAIL_PASSWORD`: Mot de passe d'application (⚠️ Pour Gmail, utilisez un mot de passe d'application)
- `EMAIL_FROM_EMAIL`: Adresse email de l'expéditeur
- `EMAIL_FROM_NAME`: Nom de l'expéditeur (défaut: AlloTracteur)
- `EMAIL_APP_NAME`: Nom de l'application dans les emails (défaut: AlloTracteur)
- `EMAIL_SUPPORT_EMAIL`: Email de support pour les utilisateurs

### PayTech Mobile Money
- `PAYTECH_API_KEY`: Clé API PayTech
- `PAYTECH_API_SECRET`: Secret API PayTech
- `PAYTECH_MERCHANT_ID`: ID du marchand PayTech
- `PAYTECH_BASE_URL`: URL de base de l'API PayTech
- `PAYTECH_WEBHOOK_SECRET`: Secret pour valider les webhooks PayTech

### Google Maps
- `GOOGLE_MAPS_API_KEY`: Clé API Google Maps pour la géolocalisation

### Firebase
- `FIREBASE_SERVER_KEY`: Clé serveur Firebase pour les notifications push
- `FIREBASE_PROJECT_ID`: ID du projet Firebase

### Cloudinary
- `CLOUDINARY_CLOUD_NAME`: Nom du cloud Cloudinary
- `CLOUDINARY_API_KEY`: Clé API Cloudinary
- `CLOUDINARY_API_SECRET`: Secret API Cloudinary

### Rate Limiting
- `RATE_LIMIT_WINDOW_MS`: Fenêtre de temps pour le rate limiting (défaut: 900000 = 15 min)
- `RATE_LIMIT_MAX_REQUESTS`: Nombre maximum de requêtes par fenêtre (défaut: 100)

### URLs
- `FRONTEND_URL`: URL du frontend (utilisé dans les emails)
- `ADMIN_URL`: URL de l'interface d'administration

## 🔐 Sécurité

⚠️ **IMPORTANT:**
1. Ne commitez **JAMAIS** le fichier `.env` dans Git
2. Changez tous les secrets en production
3. Utilisez des secrets forts et uniques
4. Pour Gmail, créez un "Mot de passe d'application" : https://myaccount.google.com/apppasswords
5. Ne partagez jamais vos variables d'environnement

## 📚 Configuration Gmail

Pour utiliser Gmail comme serveur SMTP :

1. Activez l'authentification à deux facteurs sur votre compte Google
2. Générez un mot de passe d'application :
   - Allez sur https://myaccount.google.com/apppasswords
   - Sélectionnez "Mail" et votre appareil
   - Copiez le mot de passe généré
   - Utilisez ce mot de passe dans `EMAIL_PASSWORD`

## 🚀 Configuration rapide

```bash
# 1. Copier le template
cp ENV_VARIABLES.md .env

# 2. Éditer le fichier .env avec vos valeurs
nano .env  # ou votre éditeur préféré

# 3. Vérifier que le fichier .env est dans .gitignore
echo ".env" >> .gitignore
```

