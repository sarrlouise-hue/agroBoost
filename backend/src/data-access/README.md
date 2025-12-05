# Couche Data Access (Repository/DAO)

Cette couche encapsule toutes les requêtes PostgreSQL et fournit une abstraction pour l'accès aux données.

## Principe

**Toutes les requêtes SQL doivent être encapsulées ici, sans logique métier.**

## Architecture

```
Routes -> Controllers -> Services -> Data-Access -> PostgreSQL
```

## Repositories disponibles

### `user.repository.js`

- `findByPhoneNumber(phoneNumber)` : Trouver un utilisateur par numéro de téléphone
- `findById(userId)` : Trouver un utilisateur par ID
- `findByIdWithPassword(userId)` : Trouver un utilisateur par ID avec mot de passe
- `findByPhoneNumberWithPassword(phoneNumber)` : Trouver un utilisateur par numéro avec mot de passe
- `create(userData)` : Créer un nouvel utilisateur
- `updateById(userId, updateData)` : Mettre à jour un utilisateur
- `save(user)` : Sauvegarder un utilisateur (modifications sur instance existante)
- `existsByPhoneNumber(phoneNumber)` : Vérifier si un utilisateur existe
- `findByEmail(email)` : Trouver un utilisateur par email

### `otp.repository.js`

- `findByPhoneNumberAndCode(phoneNumber, code)` : Trouver un OTP par numéro et code
- `findValidByPhoneNumber(phoneNumber)` : Trouver un OTP valide par numéro
- `create(otpData)` : Créer un nouvel OTP
- `invalidateByPhoneNumber(phoneNumber)` : Invalider tous les OTP précédents
- `markAsUsed(otpId)` : Marquer un OTP comme utilisé
- `save(otp)` : Sauvegarder un OTP

### `passwordResetToken.repository.js`

- `findValidByToken(token)` : Trouver un token valide
- `create(tokenData)` : Créer un nouveau token
- `invalidateByUserId(userId)` : Invalider tous les tokens précédents
- `markAsUsed(tokenId)` : Marquer un token comme utilisé
- `save(token)` : Sauvegarder un token

## Utilisation

```javascript
// ❌ MAUVAIS : Accès direct au modèle dans un service
const User = require('../models/User');
const user = await User.findOne({ where: { phoneNumber } });

// ✅ BON : Utilisation du repository
const userRepository = require('../data-access/user.repository');
const user = await userRepository.findByPhoneNumber(phoneNumber);
```

## Avantages

1. **Séparation des préoccupations** : La logique d'accès aux données est isolée
2. **Testabilité** : Facile de mocker les repositories dans les tests
3. **Maintenabilité** : Changements de schéma DB centralisés
4. **Flexibilité** : Facile de changer de base de données sans modifier les services
