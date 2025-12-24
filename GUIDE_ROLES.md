# Guide des Profils et Permissions - AlloTracteur

Ce document explique les différents types d'utilisateurs sur la plateforme AlloTracteur et ce que chacun peut faire.

---

## 1. L'Agriculteur (User)
C'est le **client agricole** lambda qui souhaite louer du matériel.

### ✅ Ce qu'il peut faire :
*   **Créer un compte** avec son numéro de téléphone.
*   **Parcourir le catalogue** de matériels agricoles disponibles.
*   **Rechercher** des tracteurs ou services à proximité.
*   **Réserver** un service pour une date donnée.
*   **Payer** sa réservation via Mobile Money (Wave, Orange Money).
*   **Noter et commenter** un service après utilisation.
*   **Voir son historique** de réservations et paiements.

### 🚫 Ce qu'il ne peut PAS faire :
*   Proposer du matériel à la location.
*   Accéder aux outils de maintenance.
*   Voir les statistiques globales de la plateforme.

---

## 2. Le Prestataire (Provider)
C'est un **partenaire propriétaire de matériel** (coopérative, entrepreneur privé) qui loue ses machines sur la plateforme.

### ✅ Ce qu'il peut faire :
*   **Tout ce qu'un Agriculteur fait.**
*   **Créer son profil professionnel** (Nom d'entreprise, documents légaux).
*   **Ajouter et gérer ses machines** (tracteurs, semoirs) : photos, prix, disponibilité.
*   **Recevoir des réservations** et les gérer (voir le calendrier).
*   **Suivre ses revenus** générés par les locations.
*   **Créer des demandes de maintenance** pour ses propres machines.

### 🚫 Ce qu'il ne peut PAS faire :
*   Modifier les commissions de la plateforme.
*   Voir les données des autres prestataires.
*   Valider sa propre approbation (réservé à l'Admin).

---

## 3. Le Mécanicien (Mechanic)
C'est un **technicien spécialisé** chargé de l'entretien et de la réparation du parc de machines.

### ✅ Ce qu'il peut faire :
*   **Se connecter** à l'interface de gestion.
*   **Voir la liste des maintenances** qui lui sont assignées.
*   **Démarrer une intervention** (le statut passe à "En cours").
*   **Terminer une intervention** en indiquant :
    *   La date de fin.
    *   Le coût de la réparation.
    *   Les notes techniques (pièces changées, observations).
*   **Voir l'historique** des interventions qu'il a réalisées.

### 🚫 Ce qu'il ne peut PAS faire :
*   Créer de nouvelles machines.
*   Voir les revenus financiers des prestataires.
*   Supprimer des utilisateurs (Agriculteurs).

---

## 4. L'Administrateur (Admin)
C'est le **superviseur global** de la plateforme AlloTracteur.

### ✅ Ce qu'il peut faire :
*   **Vision globale** sur toute l'activité (Dashboard complet).
*   **Gestion des Agriculteurs/Utilisateurs :** Voir, modifier, bloquer ou supprimer n'importe quel compte.
*   **Gestion des Prestataires :** Valider les dossiers d'inscription, approuver les nouveaux prestataires.
*   **Gestion des Services :** Modérer les annonces de machines.
*   **Gestion des Maintenances :**
    *   Créer des demandes de maintenance pour n'importe quelle machine.
    *   Assigner un mécanicien à une tâche.
    *   Suivre l'état de santé de tout le parc matériel.
*   **Rapports Financiers :** Voir le volume global des transactions.

### 🚫 Ce qu'il ne peut PAS faire :
*   *(Techniquement, il a presque tous les droits, sauf modifier directement la base de données sans passer par l'interface).*

---

## Résumé des Interactions

| Action | Agriculteur | Prestataire | Mécanicien | Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Réserver un tracteur** | ✅ | ✅ | ✅ | ✅ |
| **Ajouter un tracteur** | ❌ | ✅ | ❌ | ✅ |
| **Valider un prestataire** | ❌ | ❌ | ❌ | ✅ |
| **Réparer un tracteur** | ❌ | ❌ | ✅ | ✅ |
| **Voir tous les revenus** | ❌ | ❌ | ❌ | ✅ |
