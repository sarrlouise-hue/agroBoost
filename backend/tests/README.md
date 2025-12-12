# Tests - Documentation

Ce dossier contient les tests unitaires et d'intégration du backend AGRO BOOST.

## Structure

```
tests/
├── unit/                    # Tests unitaires (avec mocks)
│   └── services/
├── integration/             # Tests d'intégration
│   ├── auth.routes.test.js              # Tests avec mocks
│   └── auth.routes.integration.test.js  # Tests avec vraie base de données
├── helpers/                 # Helpers pour les tests
│   ├── database.js          # Gestion de la base de données de test
│   └── testData.js          # Données de test réutilisables
├── setup.js                 # Configuration globale des tests
└── README.md                # Cette documentation
```

## Types de tests

### Tests unitaires

Les tests unitaires (`tests/unit/`) utilisent des mocks et ne nécessitent pas de base de données réelle. Ils testent la logique métier isolément.

**Exécution :**
```bash
npm run test:unit
```

### Tests d'intégration avec mocks

Les tests d'intégration avec mocks (`tests/integration/auth.routes.test.js`) testent les routes API mais utilisent des mocks pour la base de données.

**Exécution :**
```bash
npm run test:integration
```

### Tests d'intégration avec vraie base de données

Les tests d'intégration avec vraie base de données (`tests/integration/auth.routes.integration.test.js`) se connectent à une vraie base de données PostgreSQL et créent de vraies données.

**Exécution :**
```bash
npm run test:integration:real
```

## Prérequis pour les tests avec vraie base de données

1. **PostgreSQL doit être installé et en cours d'exécution**
   - PostgreSQL doit être accessible sur `127.0.0.1:5432`
   - Ou définir les variables d'environnement (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) ou `DATABASE_URL`

2. **Base de données de test**
   - Les tests utilisent automatiquement la base de données `agroboost_test`
   - Cette base de données est automatiquement nettoyée avant chaque test
   - Aucune donnée n'est persistée entre les tests

## Configuration

### Variables d'environnement

Les tests utilisent les variables d'environnement suivantes (définies dans `tests/setup.js`) :

- `NODE_ENV=test`
- `DATABASE_URL` ou variables individuelles pour PostgreSQL
- `JWT_SECRET=test-secret-key-for-jwt-tokens`
- `JWT_REFRESH_SECRET=test-refresh-secret-key-for-refresh-tokens`
- `OTP_EXPIRES_IN=5m`
- `OTP_LENGTH=6`

### Helpers disponibles

#### `tests/helpers/database.js`

- `connectTestDB()` : Connexion à la base de données de test
- `disconnectTestDB()` : Déconnexion de la base de données de test
- `clearTestDB()` : Nettoyer toutes les tables (supprimer tous les enregistrements)
- `dropTestDB()` : Supprimer complètement la base de données de test

#### `tests/helpers/testData.js`

Contient des données de test réutilisables :
- `testUsers` : Données d'utilisateurs de test
- `testOTPs` : Données d'OTP de test

## Exécution des tests

### Tous les tests
```bash
npm test
```

### Tests unitaires uniquement
```bash
npm run test:unit
```

### Tests d'intégration (avec mocks)
```bash
npm run test:integration
```

### Tests d'intégration (avec vraie base de données)
```bash
npm run test:integration:real
```

### Tests en mode watch
```bash
npm run test:watch
```

### Tests avec couverture de code
```bash
npm run test:coverage
```

## Exemple de test avec vraie base de données

```javascript
const { connectTestDB, disconnectTestDB, clearTestDB } = require('../helpers/database');
const User = require('../../src/models/User');

describe('Mon test', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('devrait créer un utilisateur dans la base de données', async () => {
    const user = await User.create({
      phoneNumber: '+221771234567',
      firstName: 'Amadou',
      lastName: 'Diallo',
    });

    // Vérifier que l'utilisateur existe vraiment dans la base
    const userInDB = await User.findByPk(user.id);
    expect(userInDB).toBeTruthy();
    expect(userInDB.phoneNumber).toBe('+221771234567');
  });
});
```

## Notes importantes

1. **Isolation des tests** : Chaque test est isolé grâce au nettoyage de la base de données avant chaque test (`beforeEach`)

2. **Base de données séparée** : Les tests utilisent une base de données séparée (`agroboost_test`) pour ne pas affecter les données de développement

3. **Performance** : Les tests avec vraie base de données sont plus lents que les tests avec mocks, mais ils offrent une meilleure confiance dans le fonctionnement réel de l'application

4. **CI/CD** : Pour les pipelines CI/CD, assurez-vous que PostgreSQL est disponible ou utilisez un service comme PostgreSQL sur Docker ou un service cloud

## Dépannage

### Erreur de connexion à PostgreSQL

Si vous obtenez une erreur de connexion :
1. Vérifiez que PostgreSQL est en cours d'exécution : `sudo systemctl status postgresql` ou `psql -U postgres`
2. Vérifiez que l'URI de connexion ou les variables d'environnement sont correctes
3. Vérifiez les permissions d'accès à PostgreSQL
4. Vérifiez que la base de données `agroboost_test` existe ou sera créée automatiquement

### Tests qui échouent de manière aléatoire

Si les tests échouent de manière aléatoire :
1. Vérifiez que `clearTestDB()` est appelé dans `beforeEach`
2. Vérifiez qu'il n'y a pas de conflits de données entre les tests
3. Augmentez le timeout si nécessaire dans `tests/setup.js`

### Erreurs Sequelize

Si vous obtenez des erreurs Sequelize :
1. Vérifiez que les modèles sont correctement chargés
2. Vérifiez que les associations entre modèles sont définies
3. Vérifiez que les migrations/synchronisation sont exécutées
