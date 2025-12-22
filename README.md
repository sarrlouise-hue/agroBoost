# 🚀 ALLO TRACTEUR - Guide de Démarrage

## 📦 Structure du Projet

```
agroBoost/
├── backend/              # API Backend (Node.js + Express)
├── admin-agro-boost/    # Panel d'Administration (React + Vite)
├── agro_boost/          # Application Frontend Principale
├── package.json         # Scripts pour gérer le monorepo
└── README.md           # Ce fichier
```

---

## ⚡ Démarrage Rapide

### 1️⃣ Installation des dépendances

**Installer toutes les dépendances (backend + admin) :**
```bash
npm run install:all
```

Ou installer séparément :
```bash
# À la racine
npm install

# Backend
cd backend && npm install

# Admin
cd admin-agro-boost && npm install
```

---

### 2️⃣ Lancer Backend + Admin simultanément

**Commande unique pour tout démarrer :**
```bash
npm run dev
```

Cette commande lance :
- 🔵 **Backend** sur `http://localhost:3000` (ou port configuré dans `.env`)
- 🟣 **Admin Panel** sur `http://localhost:5173`

Les deux serveurs tournent en parallèle avec des logs colorés pour faciliter le débogage.

---

### 3️⃣ Lancer séparément

**Backend uniquement :**
```bash
npm run dev:backend
```

**Admin uniquement :**
```bash
npm run dev:admin
```

---

## 📋 Scripts Disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Lance backend + admin simultanément |
| `npm run dev:backend` | Lance uniquement le backend |
| `npm run dev:admin` | Lance uniquement le panel admin |
| `npm run install:all` | Installe toutes les dépendances |
| `npm run build:admin` | Build de production pour l'admin |
| `npm run start:backend` | Lance le backend en mode production |
| `npm run lint:backend` | Vérifie le code backend avec ESLint |
| `npm run lint:admin` | Vérifie le code admin avec ESLint |
| `npm run test:backend` | Lance les tests du backend |

---

## 🔧 Configuration

### Backend (.env)

Créez un fichier `.env` dans le dossier `backend/` :

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agroboost
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_secret_jwt
# ... autres variables
```

### Admin Panel

Le panel admin utilise Vite et se configure via `vite.config.js` si nécessaire.

---

## 🌐 URLs par défaut

- **Backend API :** http://localhost:3000
- **Backend Swagger :** http://localhost:3000/api-docs
- **Admin Panel :** http://localhost:5173
- **Frontend Principal :** (à configurer)

---

## 📚 Documentation

- **Architecture Backend :** Voir `architecture backend.md`
- **API Documentation :** Accessible via Swagger à `/api-docs`
- **Récupération des branches :** Voir `RECUPERATION_BRANCHES.md`

---

## 🛠️ Technologies

### Backend
- Node.js + Express
- PostgreSQL + Sequelize
- JWT Authentication
- Swagger Documentation
- Redis (optionnel)

### Admin Panel
- React 19.2.0
- Vite 7.2.4
- ESLint

---

## 🐛 Dépannage

### Port déjà utilisé

Si le port 5173 ou 3000 est déjà utilisé :

```bash
# Windows
npx kill-port 5173
npx kill-port 3000

# Linux/Mac
lsof -ti:5173 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Problèmes de dépendances

```bash
# Nettoyer et réinstaller
rm -rf node_modules backend/node_modules admin-agro-boost/node_modules
npm run install:all
```

---

## 👥 Équipe

- **Backend :** Revhieno
- **Admin Panel :** Gaston
- **Projet :** ALLO TRACTEUR

---

## 📄 Licence

ISC

---

**Bon développement ! 🚀**
