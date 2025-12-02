# Guide de Déploiement - AGRO BOOST Backend

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
createdb agroboost
# ou via psql
psql -U postgres -c "CREATE DATABASE agroboost;"
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
CREATE USER agroboost_user WITH PASSWORD 'your-secure-password';
CREATE DATABASE agroboost OWNER agroboost_user;
GRANT ALL PRIVILEGES ON DATABASE agroboost TO agroboost_user;
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
pm2 start src/app.js --name agroboost-backend

# Sauvegarder la configuration
pm2 save
pm2 startup
```

#### 5. Configurer Nginx (reverse proxy)
```nginx
server {
    listen 80;
    server_name api.agroboost.com;

    location / {
        proxy_pass http://localhost:5000;
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
heroku create agroboost-backend
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
# ... autres variables
```

#### 5. Déployer
```bash
git push heroku main
```

### Option 3: Railway + PostgreSQL

#### 1. Créer un projet sur Railway
- Aller sur [Railway](https://railway.app)
- Créer un nouveau projet
- Connecter votre repository GitHub

#### 2. Créer une base de données PostgreSQL
- Dans votre projet Railway, cliquer sur "New" → "Database" → "Add PostgreSQL"
- Railway créera automatiquement une base de données PostgreSQL
- Notez que Railway créera automatiquement une variable `DATABASE_URL` avec l'URL de connexion

#### 3. Créer un service pour le backend
- Dans votre projet Railway, cliquer sur "New" → "GitHub Repo"
- Sélectionner votre repository `agroBoost`
- Railway détectera automatiquement le fichier `railway.toml` à la racine

#### 4. Lier la base de données au service backend
- Dans le service backend, aller dans l'onglet "Variables"
- Railway devrait automatiquement proposer de lier la variable `DATABASE_URL` de la base de données
- Si ce n'est pas le cas, cliquer sur "Add Reference" et sélectionner la variable `DATABASE_URL` de votre service PostgreSQL
- **IMPORTANT** : Assurez-vous que `DATABASE_URL` est bien liée et visible dans les variables du service backend

#### 5. Configurer les autres variables d'environnement
Dans l'onglet "Variables" du service backend, ajouter :
```env
NODE_ENV=production
JWT_SECRET=<générer-un-secret-fort>
JWT_REFRESH_SECRET=<générer-un-secret-fort>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
OTP_EXPIRES_IN=5m
OTP_LENGTH=6
```

#### 6. Déployer
- Railway déploiera automatiquement à chaque push sur la branche configurée
- Vérifier les logs de déploiement pour s'assurer que tout fonctionne
- L'URL de votre API sera disponible dans l'onglet "Settings" → "Domains"

#### 7. Vérification
- Vérifier que `DATABASE_URL` est bien définie dans les variables du service backend
- Vérifier les logs pour confirmer la connexion à PostgreSQL
- Tester l'endpoint `/health` pour vérifier que l'API fonctionne

## Variables d'Environnement Production

```env
NODE_ENV=production
PORT=3000

# PostgreSQL
# Option 1: Utiliser DATABASE_URL (recommandé)
DATABASE_URL=postgresql://user:password@host:5432/agroboost

# Option 2: Utiliser les variables individuelles
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=agroboost_user
DB_PASSWORD=your-secure-password
DB_NAME=agroboost

# JWT - Générer des secrets forts !
JWT_SECRET=generate-strong-secret-here
JWT_REFRESH_SECRET=generate-strong-refresh-secret-here

# Autres variables...
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
curl http://localhost:5000/health
```

## Backup

### PostgreSQL Backup
```bash
# Backup local
pg_dump -U postgres -d agroboost > backup_$(date +%Y%m%d).sql

# Restore
psql -U postgres -d agroboost < backup_20240101.sql

# Backup avec compression
pg_dump -U postgres -d agroboost | gzip > backup_$(date +%Y%m%d).sql.gz

# Restore depuis backup compressé
gunzip -c backup_20240101.sql.gz | psql -U postgres -d agroboost
```

### Backup automatique (cron)
```bash
# Ajouter au crontab
0 2 * * * pg_dump -U postgres -d agroboost | gzip > /backups/agroboost_$(date +\%Y\%m\%d).sql.gz
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
pm2 restart agroboost-backend

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
lsof -i :5000
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

---

*Documentation mise à jour le 2024-01-01*
