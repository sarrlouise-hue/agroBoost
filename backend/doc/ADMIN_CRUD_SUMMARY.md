# Résumé des Fonctionnalités Admin CRUD - AlloTracteur

## Date de mise à jour : 2025-01-15

Ce document résume toutes les fonctionnalités CRUD admin ajoutées au backend AlloTracteur.

---

## 1. Utilisateurs (Users)

### Endpoints Admin

- **GET `/api/users`** - Liste tous les utilisateurs avec filtres avancés
  - Filtres : `role`, `isVerified`, `search`, `startDate`, `endDate`
  - Pagination : `page`, `limit`

- **GET `/api/users/:id`** - Voir un utilisateur spécifique
  - Retourne les détails complets d'un utilisateur (sans mot de passe)

- **PUT `/api/users/:id`** - Modifier un utilisateur
  - Champs modifiables : `firstName`, `lastName`, `email`, `phoneNumber`, `role`, `isVerified`, `address`, `language`
  - Validation avec Joi

- **DELETE `/api/users/:id`** - Supprimer un utilisateur
  - Suppression en cascade (Provider, Bookings, Payments, Reviews, Notifications)

---

## 2. Prestataires (Providers)

### Endpoints Admin

- **GET `/api/providers`** - Liste tous les prestataires avec filtres avancés
  - Filtres existants : `isApproved`, `minRating`
  - **Nouveaux filtres** : `search`, `userId`, `startDate`, `endDate`
  - Pagination : `page`, `limit`

- **GET `/api/providers/:id`** - Existe déjà (public)

- **PUT `/api/providers/:id`** - Modifier un prestataire (admin seulement)
  - Champs modifiables : `businessName`, `description`, `documents`, `isApproved`, `rating`

- **DELETE `/api/providers/:id`** - Supprimer un prestataire (admin seulement)
  - Suppression en cascade (Services, Bookings associés)

---

## 3. Réservations (Bookings)

### Endpoints Admin

- **GET `/api/bookings`** - Liste toutes les réservations avec filtres avancés
  - Filtres existants : `userId`, `providerId`, `serviceId`, `status`
  - **Nouveaux filtres** : `search`, `startDate`, `endDate`, `bookingDateStart`, `bookingDateEnd`
  - Pagination : `page`, `limit`
  - Admin peut voir toutes les réservations, utilisateurs normaux voient seulement les leurs

- **GET `/api/bookings/:id`** - Existe déjà

- **DELETE `/api/bookings/:id`** - Supprimer une réservation (admin seulement)
  - Suppression en cascade (Payment associé)

---

## 4. Services

### Endpoints Admin

- **GET `/api/services`** - Liste tous les services avec filtres
  - Filtres : `serviceType`, `availability`, `minPrice`, `maxPrice`, `latitude`, `longitude`, `radius`
  - Admin peut voir tous les services (y compris ceux des prestataires non approuvés)

- **DELETE `/api/services/:id`** - Existe déjà (provider/admin)

---

## 5. Avis (Reviews)

### Endpoints Admin

- **DELETE `/api/reviews/:id`** - Supprimer un avis
  - Utilisateur normal : peut supprimer seulement ses propres avis
  - **Admin : peut supprimer n'importe quel avis**
  - Recalcule automatiquement la note moyenne du prestataire

---

## 6. Notifications

### Endpoints Admin

- **GET `/api/notifications/all`** - Liste toutes les notifications (admin seulement)
  - Filtres : `userId`, `type`, `isRead`, `startDate`, `endDate`
  - Pagination : `page`, `limit`

- **GET `/api/notifications/:id`** - Voir une notification spécifique (admin seulement)

- **DELETE `/api/notifications/:id`** - Supprimer une notification (admin seulement)

---

## Filtres Avancés Disponibles

### Filtres Communs

- **`page`** : Numéro de page (défaut: 1)
- **`limit`** : Nombre d'éléments par page (défaut: 20)
- **`search`** : Recherche textuelle (nom, prénom, email, téléphone, etc.)
- **`startDate`** : Date de début (format: YYYY-MM-DD)
- **`endDate`** : Date de fin (format: YYYY-MM-DD)

### Filtres Spécifiques

#### Users
- `role` : `user`, `provider`, `admin`
- `isVerified` : `true`/`false`

#### Providers
- `isApproved` : `true`/`false`
- `minRating` : Note minimale (nombre)
- `userId` : Filtrer par ID utilisateur

#### Bookings
- `userId` : Filtrer par utilisateur
- `providerId` : Filtrer par prestataire
- `serviceId` : Filtrer par service
- `status` : `pending`, `confirmed`, `completed`, `cancelled`
- `bookingDateStart` : Date de réservation début
- `bookingDateEnd` : Date de réservation fin

#### Notifications
- `userId` : Filtrer par utilisateur
- `type` : `booking`, `payment`, `review`, `system`
- `isRead` : `true`/`false`

---

## Sécurité

Tous les endpoints admin nécessitent :
- Authentification JWT valide
- Rôle `admin` dans le token

Les endpoints sont protégés par le middleware `authorize(ROLES.ADMIN)`.

---

## Suppression en Cascade

Les suppressions admin déclenchent des suppressions en cascade :

- **User** → Provider, Bookings, Payments, Reviews, Notifications
- **Provider** → Services, Bookings
- **Booking** → Payment
- **Review** → Recalcule la note moyenne du prestataire

---

## Notes Importantes

1. **Routes spécifiques avant routes génériques** : Les routes spécifiques (ex: `/bookings`, `/reviews`) sont définies AVANT les routes avec `:id` pour éviter les conflits de routage.

2. **Validation** : Toutes les modifications admin sont validées avec Joi.

3. **Pagination** : Tous les endpoints de liste supportent la pagination.

4. **Recherche** : La recherche textuelle utilise `ILIKE` (insensible à la casse) pour PostgreSQL.

---

*Documentation générée automatiquement - Dernière mise à jour : 2025-01-15*

