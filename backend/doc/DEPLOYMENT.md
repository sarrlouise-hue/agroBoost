# Guide de Déploiement - AlloTracteur Backend

## Prérequis

- Node.js >= 18.0.0
- PostgreSQL >= 12.0 (local ou service cloud)
- npm >= 9.0.0
- Git

## Déploiement Local

### 1. Cloner le repository

```bash
git clone <repository-url>
cd agroBoost/backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'environnement

```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

### 4. Démarrer PostgreSQL

```bash
# Sur Linux/Mac
sudo service postgresql start
# ou
pg_ctl -D /usr/local/var/postgres start

# Sur Windows
# Démarrer le service PostgreSQL depuis les Services Windows

# Créer la base de données
createdb allotracteur
# ou via psql
psql -U postgres -c "CREATE DATABASE allotracteur;"
```

### 5. Démarrer le serveur

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## Déploiement Production

### Option 1: VPS/Cloud (DigitalOcean, AWS, etc.)

#### 1. Préparer le serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Démarrer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 2. Configurer PostgreSQL

```bash
# Créer un utilisateur et une base de données
sudo -u postgres psql
CREATE USER allotracteur_user WITH PASSWORD 'your-secure-password';
CREATE DATABASE allotracteur OWNER allotracteur_user;
GRANT ALL PRIVILEGES ON DATABASE allotracteur TO allotracteur_user;
\q
```

#### 3. Cloner et configurer

```bash
git clone <repository-url>
cd agroBoost/backend
npm install --production
cp .env.example .env
# Éditer .env avec les valeurs de production
```

#### 4. Utiliser PM2 pour la gestion du processus

```bash
# Installer PM2
npm install -g pm2

# Démarrer l'application
pm2 start src/app.js --name allotracteur-backend

# Sauvegarder la configuration
pm2 save
pm2 startup
```

#### 5. Configurer Nginx (reverse proxy)

```nginx
server {
    listen 80;
    server_name api.allotracteur.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Heroku

#### 1. Installer Heroku CLI

```bash
# Voir: https://devcenter.heroku.com/articles/heroku-cli
```

#### 2. Créer l'application

```bash
heroku create allotracteur-backend
```

#### 3. Ajouter PostgreSQL

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

#### 4. Configurer les variables d'environnement

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku config:set JWT_REFRESH_SECRET=your-refresh-secret
heroku config:set PAYTECH_API_KEY=your-paytech-api-key
heroku config:set PAYTECH_API_SECRET=your-paytech-api-secret
heroku config:set PAYTECH_MERCHANT_ID=your-paytech-merchant-id
heroku config:set CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
heroku config:set CLOUDINARY_API_KEY=your-cloudinary-api-key
heroku config:set CLOUDINARY_API_SECRET=your-cloudinary-api-secret
# ... autres variables
```

#### 5. Déployer

```bash
git push heroku main
```

### Option 3: Vercel + NeonDB

#### 1. Créer un projet sur Vercel

- Aller sur [Vercel](https://vercel.com)
- Se connecter avec votre compte GitHub
- Cliquer sur "Add New Project"
- Sélectionner votre repository `agroBoost`

#### 2. Créer une base de données NeonDB

- Aller sur [Neon](https://neon.tech) et créer un compte
- Créer un nouveau projet
- Créer une nouvelle base de données PostgreSQL
- **Important** : Copier la `Connection String` (DATABASE_URL) fournie par NeonDB
- La chaîne de connexion ressemble à : `postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require`

#### 3. Configurer les variables d'environnement sur Vercel

Dans les paramètres du projet Vercel, aller dans "Environment Variables" et ajouter :

```env
DATABASE_URL=<votre-connection-string-neondb>
NODE_ENV=production
JWT_SECRET=<générer-un-secret-fort>
JWT_REFRESH_SECRET=<générer-un-secret-fort>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
OTP_EXPIRES_IN=5m
OTP_LENGTH=6

# PayTech Mobile Money
PAYTECH_API_KEY=<votre-paytech-api-key>
PAYTECH_API_SECRET=<votre-paytech-api-secret>
PAYTECH_MERCHANT_ID=<votre-paytech-merchant-id>
PAYTECH_BASE_URL=https://paytech.sn
PAYTECH_WEBHOOK_SECRET=<votre-paytech-webhook-secret>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<votre-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<votre-cloudinary-api-key>
CLOUDINARY_API_SECRET=<votre-cloudinary-api-secret>

# URLs
FRONTEND_URL=<url-frontend>
API_URL=<url-api-vercel>
```

#### 4. Configurer le projet Vercel

- **Root Directory** : `backend` (important : Vercel doit pointer vers le dossier backend)
- **Framework Preset** : Other
- **Build Command** : Laisser vide (pas nécessaire pour un projet Node.js simple)
- **Output Directory** : Laisser vide
- **Install Command** : `npm install` (car on est déjà dans le dossier backend)

#### 5. Déployer

- Vercel déploiera automatiquement à chaque push sur la branche principale
- Vérifier les logs de déploiement dans le dashboard Vercel
- L'URL de votre API sera disponible après le déploiement (ex: `https://allotracteur.vercel.app`)

#### 6. Vérification

- Vérifier que `DATABASE_URL` est bien définie dans les variables d'environnement Vercel
- Vérifier les logs pour confirmer la connexion à NeonDB
- Tester l'endpoint `/health` pour vérifier que l'API fonctionne : `https://votre-projet.vercel.app/health`

## Variables d'Environnement Production

```env
NODE_ENV=production
PORT=3000

# PostgreSQL
# Option 1: Utiliser DATABASE_URL (recommandé)
DATABASE_URL=postgresql://user:password@host:5432/allotracteur

# Option 2: Utiliser les variables individuelles
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=allotracteur_user
DB_PASSWORD=your-secure-password
DB_NAME=allotracteur

# JWT - Générer des secrets forts !
JWT_SECRET=generate-strong-secret-here
JWT_REFRESH_SECRET=generate-strong-refresh-secret-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# OTP
OTP_EXPIRES_IN=5m
OTP_LENGTH=6

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-app
EMAIL_FROM_EMAIL=noreply@allotracteur.com
EMAIL_FROM_NAME=AlloTracteur
EMAIL_APP_NAME=AlloTracteur
EMAIL_SUPPORT_EMAIL=support@allotracteur.com
EMAIL_FRONTEND_URL=http://localhost:3000

# PayTech Mobile Money
PAYTECH_API_KEY=your-paytech-api-key
PAYTECH_API_SECRET=your-paytech-api-secret
PAYTECH_MERCHANT_ID=your-paytech-merchant-id
PAYTECH_BASE_URL=https://paytech.sn
PAYTECH_WEBHOOK_SECRET=your-paytech-webhook-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# URLs
FRONTEND_URL=https://your-frontend-url.com
API_URL=https://your-api-url.com
```

## Sécurité Production

### 1. Secrets

- Générer des secrets JWT forts :

  ```bash
  openssl rand -base64 32
  ```

### 2. PostgreSQL

- Utiliser des mots de passe forts
- Limiter les connexions réseau (firewall)
- Activer SSL/TLS pour les connexions
- Utiliser des utilisateurs avec privilèges limités

### 3. HTTPS

- Configurer SSL/TLS avec Let's Encrypt
- Rediriger HTTP vers HTTPS

### 4. Rate Limiting

- Ajuster les limites selon vos besoins
- Utiliser Redis pour le rate limiting distribué

## Monitoring

### PM2 Monitoring

```bash
pm2 monit
pm2 logs
```

### Health Check

```bash
curl http://localhost:3000/health
```

## Backup

### PostgreSQL Backup

```bash
# Backup local
pg_dump -U postgres -d allotracteur > backup_$(date +%Y%m%d).sql

# Restore
psql -U postgres -d allotracteur < backup_20250101.sql

# Backup avec compression
pg_dump -U postgres -d allotracteur | gzip > backup_$(date +%Y%m%d).sql.gz

# Restore depuis backup compressé
gunzip -c backup_20250101.sql.gz | psql -U postgres -d allotracteur
```

### Backup automatique (cron)

```bash
# Ajouter au crontab
0 2 * * * pg_dump -U postgres -d allotracteur | gzip > /backups/allotracteur_$(date +\%Y\%m\%d).sql.gz
```

## Mises à jour

### Processus de mise à jour

```bash
# 1. Pull les dernières modifications
git pull origin main

# 2. Installer les nouvelles dépendances
npm install

# 3. Exécuter les migrations (si nécessaire)
# Les modèles Sequelize se synchronisent automatiquement en développement
# En production, utiliser des migrations Sequelize

# 4. Redémarrer l'application
pm2 restart allotracteur-backend

# Ou avec Heroku
git push heroku main
```

## Troubleshooting

### Problèmes courants

#### Erreur de connexion PostgreSQL

- Vérifier que PostgreSQL est démarré : `sudo systemctl status postgresql`
- Vérifier l'URI de connexion ou les variables d'environnement
- Vérifier les permissions d'accès à PostgreSQL
- Vérifier le fichier `pg_hba.conf` pour les règles d'authentification

#### Port déjà utilisé

```bash
# Trouver le processus
lsof -i :3000
# Tuer le processus
kill -9 <PID>
```

#### Erreurs de mémoire

- Augmenter la mémoire Node.js :

  ```bash
  NODE_OPTIONS=--max-old-space-size=4096 npm start
  ```

#### Erreurs de connexion Sequelize

- Vérifier que la base de données existe
- Vérifier les identifiants de connexion
- Vérifier que PostgreSQL accepte les connexions depuis l'application

## Configuration PayTech

1. Créer un compte sur [PayTech](https://paytech.sn)
2. Obtenir vos credentials API (API_KEY, API_SECRET, MERCHANT_ID)
3. Configurer l'URL du webhook : `https://votre-api.com/api/payments/webhook/paytech`
4. Configurer le WEBHOOK_SECRET pour la vérification des signatures

## Configuration Cloudinary

1. Créer un compte sur [Cloudinary](https://cloudinary.com)
2. Obtenir vos credentials (CLOUD_NAME, API_KEY, API_SECRET)
3. Configurer les options d'upload (compression, transformations, etc.)

## Configuration Email (Nodemailer)

L'application utilise Nodemailer pour envoyer des emails (bienvenue, OTP, réinitialisation de mot de passe).

### Configuration Gmail

1. Activer l'authentification à deux facteurs sur votre compte Gmail
2. Générer un mot de passe d'application :
   - Aller dans [Paramètres Google](https://myaccount.google.com/apppasswords)
   - Créer un mot de passe d'application pour "Mail"
   - Utiliser ce mot de passe dans `EMAIL_PASSWORD`

### Configuration SMTP personnalisé

Pour utiliser un autre fournisseur SMTP (SendGrid, Mailgun, etc.) :

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=votre-api-key-sendgrid
EMAIL_FROM_EMAIL=noreply@allotracteur.com
EMAIL_FROM_NAME=AlloTracteur
EMAIL_APP_NAME=AlloTracteur
EMAIL_SUPPORT_EMAIL=support@allotracteur.com
EMAIL_FRONTEND_URL=https://votre-frontend.com
```

### Note importante

Si les credentials email ne sont pas configurés, l'application continuera de fonctionner mais les emails ne seront pas envoyés. Un avertissement sera affiché dans les logs au démarrage.

---

**Documentation mise à jour le 2025-01-15*
