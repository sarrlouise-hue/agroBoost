# Documentation - AlloTracteur Backend

Ce dossier contient toute la documentation technique du backend AlloTracteur.

## 📚 Fichiers de Documentation

### [API.md](./API.md)

Documentation complète de l'API REST :

- Liste de tous les endpoints
- Formats de requêtes et réponses
- Codes d'erreur
- Exemples d'utilisation

**Endpoints disponibles :**

- Authentification par email (register, login, OTP par email, etc.)
- Gestion des utilisateurs (profil, localisation, langue, historique réservations/avis)
- **Gestion admin des utilisateurs** (CRUD complet avec filtres avancés : role, isVerified, search, dateRange)
- Gestion des prestataires (inscription, approbation, profil, géolocalisation, historique réservations/avis)
- **Gestion admin des prestataires** (modification, suppression, filtres avancés)
- Gestion des services agricoles (CRUD complet avec recherche avancée et géographique)
- Gestion des réservations (création, confirmation, annulation avec vérification de disponibilité)
- **Gestion admin des réservations** (suppression, filtres avancés : search, dateRange, bookingDateRange)
- Gestion des paiements (PayTech Mobile Money avec webhooks)
- Gestion des avis (création, consultation, modification, suppression)
- **Gestion admin des avis** (suppression de n'importe quel avis)
- Gestion des notifications (liste, marquer comme lu, marquer tout comme lu)
- **Gestion admin des notifications** (liste complète, consultation, suppression avec filtres avancés)

### [SWAGGER.md](./SWAGGER.md)

Guide d'utilisation de Swagger :

- Accès à la documentation interactive
- Comment tester les endpoints
- Authentification dans Swagger
- Export de la documentation

**🌐 Documentation Interactive :** <http://localhost:3000/api-docs>

### [ARCHITECTURE.md](./ARCHITECTURE.md)

Architecture technique du projet :

- Structure du projet
- Flux de données
- Technologies utilisées
- Modèles de données (User, Provider, Service, Booking, Payment, OTP, etc.)
- Relations entre modèles
- Middlewares et services
- Repositories (couche d'accès aux données)
- Intégrations externes (PayTech, Cloudinary)

### [DEPLOYMENT.md](./DEPLOYMENT.md)

Guide de déploiement :

- Déploiement local
- Déploiement en production
- Configuration des variables d'environnement (PayTech, Cloudinary)
- Sécurité en production
- Monitoring et backup
- Configuration PayTech et Cloudinary

### [API_EXAMPLES.md](./API_EXAMPLES.md)

Exemples d'utilisation avec curl :

- Exemples complets pour tous les endpoints
- Requêtes avec authentification
- Gestion des erreurs

### [ADMIN_CRUD_SUMMARY.md](./ADMIN_CRUD_SUMMARY.md)

Résumé complet des fonctionnalités CRUD admin :

- Liste de tous les endpoints admin
- Filtres avancés disponibles
- Règles de suppression en cascade
- Notes importantes sur la sécurité

## 🚀 Démarrage Rapide

1. Lire [ARCHITECTURE.md](./ARCHITECTURE.md) pour comprendre la structure
2. Consulter [API.md](./API.md) ou utiliser [Swagger](http://localhost:3000/api-docs) pour tester l'API
3. Suivre [DEPLOYMENT.md](./DEPLOYMENT.md) pour déployer

## 📖 Documentation Interactive

La documentation Swagger est disponible à : **<http://localhost:3000/api-docs>**

Vous pouvez tester tous les endpoints directement depuis votre navigateur !

## 📝 Notes

- Toute la documentation est en français
- Les exemples de code sont en JavaScript/Node.js
- Les schémas JSON sont fournis pour chaque endpoint

## ✨ Fonctionnalités (Sprint 1, 2 & 3)

### Sprint 1 ✅

- Authentification complète (JWT + OTP par email)
- Gestion des utilisateurs et prestataires
- CRUD services agricoles

### Sprint 2 ✅

- Géolocalisation des prestataires
- Recherche avancée de services (texte, filtres, distance)
- Upload d'images via Cloudinary
- Gestion des réservations avec vérification de disponibilité
- Intégration PayTech Mobile Money
- Webhooks de paiement

### Sprint 3 ✅

- **Gestion des avis** : Création, consultation, modification et suppression d'avis pour les réservations terminées
- **Système de notifications** : Notifications persistantes pour les événements (réservations, paiements, avis)
- **Historique utilisateur** : Consultation de l'historique des réservations et avis donnés
- **Historique prestataire** : Consultation des réservations reçues et avis reçus
- **Mise à jour automatique des notes** : Calcul automatique de la note moyenne des prestataires
- **CRUD Admin complet** : Gestion complète des utilisateurs, prestataires, réservations, avis et notifications avec filtres avancés

---

*Documentation maintenue pour AlloTracteur - MVP*
*Dernière mise à jour : 2025-01-15*
