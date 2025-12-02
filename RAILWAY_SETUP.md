# Guide de Configuration Railway pour AGRO BOOST

## 🚀 Déploiement sur Railway

### 📍 Où trouver l'URL de votre backend après déploiement ?

**RÉPONSE RAPIDE** :
1. Cliquez sur votre **service backend** dans Railway
2. Allez dans **"Settings"** → Section **"Networking"** ou **"Domains"**
3. Cliquez sur **"Generate Domain"** si aucun domaine n'existe
4. **Copiez l'URL** (ex: `https://votre-service-production.up.railway.app`)
5. Utilisez cette URL comme base pour tous vos tests API

**Exemple d'URLs de test** :
- Health : `https://votre-service.up.railway.app/health`
- API : `https://votre-service.up.railway.app/api/auth/register`
- Docs : `https://votre-service.up.railway.app/api-docs`

---

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

#### 9. Obtenir l'URL de l'API pour les Tests

Une fois le déploiement réussi, voici comment obtenir l'URL de votre backend :

**Méthode 1 : Via l'onglet Settings (Recommandé)**
1. Cliquer sur votre **service backend** dans Railway
2. Aller dans l'onglet **"Settings"** (en bas du menu latéral)
3. Scroller jusqu'à la section **"Networking"** ou **"Domains"**
4. Cliquer sur **"Generate Domain"** pour créer une URL publique
5. Railway générera une URL comme : `https://votre-service-production.up.railway.app`
6. **Copier cette URL** - c'est l'URL de base de votre API

**Méthode 2 : Via l'onglet Deployments**
1. Aller dans l'onglet **"Deployments"**
2. Cliquer sur le dernier déploiement réussi
3. L'URL publique devrait être visible dans les détails du déploiement

**Méthode 3 : Domaine personnalisé (Optionnel)**
- Dans **"Settings"** → **"Custom Domain"**, vous pouvez configurer votre propre domaine (ex: `api.agroboost.com`)

#### 10. Tester l'API

Une fois que vous avez l'URL de votre backend, vous pouvez tester les endpoints :

**URL de base** : `https://votre-service-production.up.railway.app`

**Endpoints de test** :

1. **Health Check** (vérifier que l'API fonctionne) :
   ```
   GET https://votre-service-production.up.railway.app/health
   ```
   Réponse attendue :
   ```json
   {
     "status": "OK",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "environment": "production"
   }
   ```

2. **Documentation Swagger** :
   ```
   https://votre-service-production.up.railway.app/api-docs
   ```

3. **Endpoints API** :
   - Inscription : `POST https://votre-service-production.up.railway.app/api/auth/register`
   - Connexion : `POST https://votre-service-production.up.railway.app/api/auth/login`
   - Vérification OTP : `POST https://votre-service-production.up.railway.app/api/auth/verify-otp`
   - etc.

**Mettre à jour Postman pour tester avec Railway** :

**Option 1 : Modifier l'environnement existant**
1. Ouvrir Postman
2. Cliquer sur l'environnement **"AGRO BOOST - Local"** (ou créer un nouvel environnement)
3. Modifier la variable `base_url`
4. Remplacer `http://localhost:5000` par votre URL Railway : `https://votre-service-production.up.railway.app`
5. Sauvegarder l'environnement
6. Tester vos requêtes

**Option 2 : Créer un nouvel environnement Railway (Recommandé)**
1. Dans Postman, créer un nouvel environnement : **"AGRO BOOST - Railway"**
2. Ajouter la variable `base_url` avec la valeur : `https://votre-service-production.up.railway.app`
3. Ajouter les autres variables (`access_token`, `refresh_token`, etc.)
4. Sélectionner cet environnement lors des tests
5. Vous pouvez maintenant basculer entre Local et Railway facilement

**Tester rapidement** :
```bash
# Avec curl
curl https://votre-service-production.up.railway.app/health

# Devrait retourner :
# {"status":"OK","timestamp":"...","environment":"production"}
```

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

