# Guide de Configuration Railway pour AGRO BOOST

## 🚀 Déploiement sur Railway

### Prérequis
- Un compte Railway (gratuit disponible)
- Un repository GitHub avec le code du projet

### Étapes de Configuration

#### 1. Créer un Projet Railway

1. Aller sur [Railway](https://railway.app)
2. Se connecter avec votre compte GitHub
3. Cliquer sur "New Project"
4. Sélectionner "Deploy from GitHub repo"
5. Choisir le repository `agroBoost`

#### 2. Créer la Base de Données PostgreSQL

1. Dans votre projet Railway, cliquer sur **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway créera automatiquement une base de données PostgreSQL
3. **Important** : Railway créera automatiquement une variable d'environnement `DATABASE_URL` avec l'URL de connexion complète

#### 3. Configurer le Service Backend

1. Dans votre projet Railway, vous devriez voir un service créé automatiquement depuis votre repository GitHub
2. Si ce n'est pas le cas, cliquer sur **"+ New"** → **"GitHub Repo"** et sélectionner votre repository
3. Railway détectera automatiquement le fichier `railway.toml` à la racine du projet

#### 4. Lier la Base de Données au Service Backend

**⚠️ ÉTAPE CRUCIALE** : C'est cette étape qui résout l'erreur `ENOTFOUND postgres.railway.internal`

1. Cliquer sur votre **service backend** (pas la base de données)
2. Aller dans l'onglet **"Variables"**
3. Vous devriez voir une section **"Add Reference"** ou **"Connect Database"**
4. Cliquer sur **"Add Reference"** ou **"Connect Database"**
5. Sélectionner votre service PostgreSQL
6. Railway proposera automatiquement de lier la variable `DATABASE_URL`
7. **Accepter** pour lier la variable
8. Vérifier que `DATABASE_URL` apparaît maintenant dans les variables du service backend avec une valeur comme : `postgresql://postgres:password@hostname:5432/railway`

#### 5. Configurer les Autres Variables d'Environnement

Dans l'onglet **"Variables"** du service backend, ajouter les variables suivantes :

```env
NODE_ENV=production
JWT_SECRET=<générer-un-secret-fort-avec-openssl-rand-base64-32>
JWT_REFRESH_SECRET=<générer-un-autre-secret-fort>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
OTP_EXPIRES_IN=5m
OTP_LENGTH=6
```

**Pour générer des secrets forts** :
```bash
openssl rand -base64 32
```

#### 6. Vérifier la Configuration

1. Dans l'onglet **"Variables"** du service backend, vérifier que :
   - ✅ `DATABASE_URL` est présente et liée à la base de données PostgreSQL
   - ✅ `NODE_ENV=production`
   - ✅ `JWT_SECRET` et `JWT_REFRESH_SECRET` sont définis
   - ✅ `PORT` est automatiquement défini par Railway (ne pas le modifier)

2. Vérifier que le **Root Directory** est configuré sur `backend` (si nécessaire dans les settings du service)

#### 7. Déployer

1. Railway déploiera automatiquement à chaque push sur la branche configurée
2. Aller dans l'onglet **"Deployments"** pour voir les logs de déploiement
3. Vérifier que le build et le démarrage se passent sans erreur

#### 8. Vérifier les Logs

1. Aller dans l'onglet **"Deployments"** ou **"Logs"**
2. Vérifier que vous voyez :
   - ✅ `🔗 Tentative de connexion à PostgreSQL: ...`
   - ✅ `✅ Connexion à PostgreSQL établie avec succès.`
   - ✅ `🚀 Serveur démarré sur le port ...`

#### 9. Obtenir l'URL de l'API

1. Aller dans l'onglet **"Settings"** du service backend
2. Cliquer sur **"Generate Domain"** pour obtenir une URL publique
3. Ou configurer un domaine personnalisé dans **"Custom Domain"**

## 🔧 Résolution de Problèmes

### Erreur : `ENOTFOUND postgres.railway.internal`

**Cause** : La variable `DATABASE_URL` n'est pas correctement liée au service backend.

**Solution** :
1. Vérifier que la base de données PostgreSQL est créée
2. Dans le service backend, aller dans **"Variables"**
3. Cliquer sur **"Add Reference"** ou **"Connect Database"**
4. Sélectionner votre service PostgreSQL
5. Accepter de lier la variable `DATABASE_URL`
6. Redéployer le service

### Erreur : `DATABASE_URL non configurée`

**Cause** : La variable `DATABASE_URL` n'existe pas dans les variables du service backend.

**Solution** :
1. Vérifier que la base de données PostgreSQL est créée
2. Lier la variable `DATABASE_URL` comme expliqué ci-dessus
3. Vérifier que la variable apparaît bien dans les variables du service backend

### Erreur : `npm: command not found`

**Cause** : Le fichier `railway.toml` n'est pas correctement configuré.

**Solution** :
1. Vérifier que le fichier `railway.toml` existe à la racine du projet
2. Vérifier qu'il contient `rootDirectory = "backend"`
3. Si nécessaire, redéployer le service

## 📝 Notes Importantes

- Railway fournit automatiquement la variable `PORT`, ne pas la définir manuellement
- La variable `DATABASE_URL` doit être **liée** (référencée) depuis le service PostgreSQL, pas copiée manuellement
- Railway utilise SSL pour les connexions PostgreSQL en production, la configuration est automatique
- Les logs sont disponibles en temps réel dans l'onglet "Deployments" ou "Logs"

## 🔗 Liens Utiles

- [Documentation Railway](https://docs.railway.app)
- [Railway PostgreSQL](https://docs.railway.app/databases/postgresql)
- [Variables d'environnement Railway](https://docs.railway.app/develop/variables)

