# Admin Panel - ALLO TRACTEUR

Panel d'administration pour la plateforme ALLO TRACTEUR.

## 🚀 Démarrage rapide

### Prérequis
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env
```

3. Modifier le fichier `.env` avec l'URL de votre backend :
```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

### Développement

Lancer le serveur de développement :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de production

```bash
npm run build
```

## 🔧 Configuration

### Variables d'environnement

- `VITE_API_BASE_URL` : URL de base de l'API backend
  - Développement : `http://localhost:3000/api`
  - Production : `https://votre-backend.vercel.app/api`

### Déploiement sur Vercel

1. Connectez votre repository GitHub à Vercel
2. Configurez la variable d'environnement :
   - `VITE_API_BASE_URL` = URL de votre backend en production
3. Déployez !

## 📝 Connexion

Pour vous connecter au panel admin, utilisez un compte avec le rôle `admin`.

**Compte par défaut** (si vous avez exécuté le script seed) :
- Téléphone : `771234567`
- Mot de passe : `Admin123!`

## 🛠️ Technologies utilisées

- React 19.2.0
- React Router DOM 7.9.6
- Material-UI 7.3.5
- Axios 1.13.2
- Recharts 3.6.0
- Vite 7.2.4
