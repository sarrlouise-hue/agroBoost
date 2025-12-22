# Scripts d'initialisation de la base de données

## Scripts disponibles

### `init-db.js` - Initialisation standard

Crée les tables si elles n'existent pas déjà.

```bash
npm run init-db
```

**Ce script :**
- Se connecte à la base de données
- Vérifie si les tables existent
- Crée les tables si elles n'existent pas
- Affiche la liste des tables créées

### `init-db:force` - Recréation complète (⚠️ DANGEREUX)

Recrée toutes les tables en supprimant les données existantes.

```bash
npm run init-db:force
```

**⚠️ ATTENTION :** Ce script supprime toutes les données existantes !

### `seed-admin.js` - Création d'un compte administrateur

Crée un compte administrateur dans la base de données.

**Méthode 1 : Avec arguments de ligne de commande (recommandé)**

```bash
node scripts/seed-admin.js <email> <password> <phoneNumber> [firstName] [lastName]
```

Exemple :

```bash
node scripts/seed-admin.js admin@allotracteur.com MotDePasse123 +221771234567 Admin AlloTracteur
```

**Méthode 2 : Avec npm et arguments**

```bash
npm run seed:admin -- admin@allotracteur.com MotDePasse123 +221771234567 Admin AlloTracteur
```

**Méthode 3 : Avec variables d'environnement**

```bash
ADMIN_EMAIL=admin@allotracteur.com \
ADMIN_PASSWORD=MotDePasse123 \
ADMIN_PHONE=+221771234567 \
ADMIN_FIRST_NAME=Admin \
ADMIN_LAST_NAME=AlloTracteur \
npm run seed:admin
```

> **Note :** Si vous utilisez `npm run seed:admin` sans arguments ni variables d'environnement, le script vous demandera de fournir les paramètres requis.

**Ce script :**
- Vérifie si un administrateur avec cet email ou ce numéro de téléphone existe déjà
- Crée un compte administrateur avec le rôle `admin`
- Hash automatiquement le mot de passe
- Marque le compte comme vérifié (`isVerified: true`)
- Affiche les informations de l'administrateur créé

**Paramètres requis :**
- `email` : Email de l'administrateur (unique)
- `password` : Mot de passe (sera hashé automatiquement)
- `phoneNumber` : Numéro de téléphone (unique, format: +221771234567)

**Paramètres optionnels :**
- `firstName` : Prénom (défaut: "Admin")
- `lastName` : Nom (défaut: "AlloTracteur")

## Initialisation automatique en production

Depuis la version mise à jour, les tables sont créées **automatiquement** au premier démarrage de l'application en production si elles n'existent pas.

Cela signifie que :
- ✅ Au premier déploiement sur Vercel, les tables seront créées automatiquement
- ✅ Vous n'avez pas besoin d'exécuter manuellement le script
- ✅ Les tables existantes ne seront pas modifiées

## Utilisation manuelle

Si vous préférez créer les tables manuellement avant le déploiement :

1. **Localement avec la DATABASE_URL de production :**
   ```bash
   # Définir la DATABASE_URL de production
   export DATABASE_URL="postgresql://user:password@host:port/database"
   
   # Exécuter le script
   npm run init-db
   ```

2. **Via NeonDB Console :**
   - Connectez-vous à votre base de données NeonDB
   - Utilisez l'éditeur SQL pour exécuter les requêtes de création de tables
   - (Les requêtes SQL peuvent être générées depuis Sequelize)

## Vérification

Pour vérifier que les tables ont été créées :

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Vous devriez voir :
- `users`
- `otps`
- `password_reset_tokens`
- `providers`
- `services`

