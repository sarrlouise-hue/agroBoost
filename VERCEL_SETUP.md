# Guide de Configuration Vercel + NeonDB pour AGRO BOOST

## 🚀 Déploiement sur Vercel avec NeonDB

### 📍 Où trouver l'URL de votre backend après déploiement ?

**RÉPONSE RAPIDE** :
1. Allez sur votre projet dans le [dashboard Vercel](https://vercel.com/dashboard)
2. Cliquez sur votre projet `agroBoost`
3. L'URL de production est affichée en haut de la page (ex: `https://agroboost.vercel.app`)
4. Utilisez cette URL comme base pour tous vos tests API

**Exemple d'URLs de test** :
- Health : `https://agroboost.vercel.app/health`
- API : `https://agroboost.vercel.app/api/auth/register`
- Docs : `https://agroboost.vercel.app/api-docs`

---

### Prérequis
- Un compte Vercel (gratuit disponible)
- Un compte NeonDB (gratuit disponible)
- Un repository GitHub avec le code du projet

### Étapes de Configuration

#### 1. Créer un Projet Vercel

1. Aller sur [Vercel](https://vercel.com)
2. Se connecter avec votre compte GitHub
3. Cliquer sur **"Add New Project"**
4. Sélectionner le repository `agroBoost`
5. Vercel détectera automatiquement le fichier `backend/vercel.json`

#### 2. Créer la Base de Données NeonDB

1. Aller sur [Neon](https://neon.tech) et créer un compte (ou se connecter)
2. Cliquer sur **"Create a project"**
3. Choisir un nom pour votre projet (ex: `agroboost-production`)
4. Sélectionner une région proche de vos utilisateurs
5. Cliquer sur **"Create project"**
6. **Important** : Copier la **Connection String** fournie par NeonDB
   - Elle ressemble à : `postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require`
   - Cette chaîne contient déjà les paramètres SSL nécessaires

#### 3. Configurer les Variables d'Environnement sur Vercel

1. Dans votre projet Vercel, aller dans **"Settings"** → **"Environment Variables"**
2. Ajouter les variables suivantes :

**Variables requises** :
```env
DATABASE_URL=<votre-connection-string-neondb>
NODE_ENV=production
```

**Variables de sécurité (à générer)** :
```env
JWT_SECRET=<générer-un-secret-fort>
JWT_REFRESH_SECRET=<générer-un-secret-fort>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
OTP_EXPIRES_IN=5m
OTP_LENGTH=6
```

**Pour générer des secrets forts** :
```bash
# Sur Linux/Mac
openssl rand -base64 32

# Ou utiliser Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

3. **Important** : Sélectionner les environnements où ces variables s'appliquent :
   - ✅ Production
   - ✅ Preview (optionnel)
   - ✅ Development (optionnel)

#### 4. Configurer le Build sur Vercel

Dans les paramètres du projet :
- **Root Directory** : `backend` (important : Vercel doit pointer vers le dossier backend)
- **Framework Preset** : Other
- **Build Command** : Laisser vide
- **Output Directory** : Laisser vide
- **Install Command** : `npm install` (car on est déjà dans le dossier backend)

#### 5. Déployer

1. Vercel déploiera automatiquement à chaque push sur la branche principale
2. Pour un déploiement manuel, cliquer sur **"Deploy"** dans le dashboard
3. Vérifier les logs de déploiement pour s'assurer que tout fonctionne
4. L'URL de votre API sera disponible après le déploiement

#### 6. Vérifier le Déploiement

**Vérifier les logs** :
1. Dans le dashboard Vercel, aller dans l'onglet **"Deployments"**
2. Cliquer sur le dernier déploiement
3. Vérifier les logs pour confirmer :
   - ✅ Installation des dépendances réussie
   - ✅ Connexion à NeonDB établie
   - ✅ Serveur démarré avec succès

**Tester l'API** :
```bash
# Health check
curl https://votre-projet.vercel.app/health

# Réponse attendue
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

---

## 🔧 Configuration des Variables d'Environnement

### Variables Requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | Connection string NeonDB | `postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require` |
| `NODE_ENV` | Environnement d'exécution | `production` |

### Variables de Sécurité

| Variable | Description | Exemple |
|----------|-------------|---------|
| `JWT_SECRET` | Secret pour signer les JWT | Générer avec `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | Secret pour les refresh tokens | Générer avec `openssl rand -base64 32` |
| `JWT_EXPIRES_IN` | Durée de validité du JWT | `7d` |
| `JWT_REFRESH_EXPIRES_IN` | Durée de validité du refresh token | `30d` |
| `OTP_EXPIRES_IN` | Durée de validité de l'OTP | `5m` |
| `OTP_LENGTH` | Longueur du code OTP | `6` |

### Variables Optionnelles

| Variable | Description | Exemple |
|----------|-------------|---------|
| `FRONTEND_URL` | URL du frontend (pour CORS) | `https://agroboost-frontend.vercel.app` |
| `REDIS_URL` | URL Redis (si utilisé) | `redis://...` |
| `WAVE_API_KEY` | Clé API Wave | `...` |
| `GOOGLE_MAPS_API_KEY` | Clé API Google Maps | `...` |

---

## 📝 Utilisation de l'API en Production

### URLs de Base

**URL de base** : `https://votre-projet.vercel.app`

### Endpoints Principaux

- **Health Check** : `GET https://votre-projet.vercel.app/health`
- **Documentation** : `https://votre-projet.vercel.app/api-docs`
- **API Auth** :
  - Inscription : `POST https://votre-projet.vercel.app/api/auth/register`
  - Connexion : `POST https://votre-projet.vercel.app/api/auth/login`
  - Vérification OTP : `POST https://votre-projet.vercel.app/api/auth/verify-otp`

### Mettre à jour Postman pour tester avec Vercel

**Option 1 : Modifier l'environnement existant**
1. Ouvrir Postman
2. Sélectionner l'environnement **"AGRO BOOST - Local"**
3. Modifier la variable `base_url` :
   - Ancienne valeur : `http://localhost:5000`
   - Nouvelle valeur : `https://votre-projet.vercel.app`
4. Sauvegarder

**Option 2 : Créer un nouvel environnement Vercel (Recommandé)**
1. Dans Postman, créer un nouvel environnement : **"AGRO BOOST - Vercel"**
2. Ajouter la variable `base_url` avec la valeur : `https://votre-projet.vercel.app`
3. Ajouter les autres variables nécessaires
4. Sauvegarder
5. Vous pouvez maintenant basculer entre Local et Vercel facilement

### Tester avec cURL

```bash
# Health check
curl https://votre-projet.vercel.app/health

# Inscription
curl -X POST https://votre-projet.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone": "+221771234567", "name": "Test User"}'
```

---

## 🐛 Résolution de Problèmes

### Erreur : `DATABASE_URL non configurée`

**Cause** : La variable `DATABASE_URL` n'existe pas dans les variables d'environnement Vercel.

**Solution** :
1. Aller dans **Settings** → **Environment Variables** de votre projet Vercel
2. Vérifier que `DATABASE_URL` est bien définie
3. Vérifier que la variable est activée pour l'environnement **Production**
4. Redéployer le projet après avoir ajouté/modifié la variable

### Erreur : `Connection refused` ou `ENOTFOUND`

**Cause** : La connection string NeonDB est incorrecte ou la base de données n'est pas accessible.

**Solution** :
1. Vérifier que la connection string NeonDB est correcte dans le dashboard Neon
2. Vérifier que la base de données NeonDB est active (non suspendue)
3. Vérifier que les paramètres SSL sont inclus dans la connection string (`?sslmode=require`)
4. Vérifier les logs Vercel pour plus de détails

### Erreur : `Build failed`

**Cause** : Erreur lors de l'installation des dépendances ou du build.

**Solution** :
1. Vérifier les logs de build dans le dashboard Vercel
2. Vérifier que le fichier `vercel.json` est correctement configuré
3. Vérifier que `package.json` est présent dans le dossier `backend`
4. Vérifier que toutes les dépendances sont correctement déclarées

### Erreur : `Module not found`

**Cause** : Les dépendances ne sont pas installées correctement.

**Solution** :
1. Vérifier que le **Install Command** dans Vercel est : `cd backend && npm install`
2. Vérifier que `package.json` existe dans `backend/`
3. Vérifier les logs de build pour voir les erreurs d'installation

---

## 📝 Notes Importantes

- Vercel fournit automatiquement la variable `PORT`, ne pas la définir manuellement
- La variable `DATABASE_URL` doit être définie manuellement avec la connection string NeonDB
- NeonDB nécessite SSL pour les connexions, la configuration est automatique via la connection string
- Les logs sont disponibles en temps réel dans le dashboard Vercel
- Vercel déploie automatiquement à chaque push sur la branche principale
- Les déploiements preview sont créés automatiquement pour chaque pull request

## 🔗 Liens Utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation NeonDB](https://neon.tech/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [NeonDB Connection Strings](https://neon.tech/docs/connect/connect-from-any-app)

