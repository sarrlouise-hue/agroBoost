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
- Gestion des utilisateurs (profil, localisation, langue)
- Gestion des prestataires (inscription, approbation, profil, géolocalisation)
- Gestion des services agricoles (CRUD complet avec recherche avancée et géographique)
- Gestion des réservations (création, confirmation, annulation avec vérification de disponibilité)
- Gestion des paiements (PayTech Mobile Money avec webhooks)

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

## ✨ Fonctionnalités (Sprint 1 & 2)

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

---

*Documentation maintenue pour AlloTracteur - MVP*
*Dernière mise à jour : 2025-01-01*
