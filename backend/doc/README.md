# Documentation - AGRO BOOST Backend

Ce dossier contient toute la documentation technique du backend AGRO BOOST.

## 📚 Fichiers de Documentation

### [API.md](./API.md)

Documentation complète de l'API REST :
- Liste de tous les endpoints
- Formats de requêtes et réponses
- Codes d'erreur
- Exemples d'utilisation

**Endpoints disponibles :**
- Authentification (register, login, OTP, etc.)
- Gestion des utilisateurs (profil, localisation, langue)
- Gestion des prestataires (inscription, approbation, profil)
- Gestion des services agricoles (CRUD complet avec recherche géographique)

### [SWAGGER.md](./SWAGGER.md)

Guide d'utilisation de Swagger :
- Accès à la documentation interactive
- Comment tester les endpoints
- Authentification dans Swagger
- Export de la documentation

**🌐 Documentation Interactive :** http://localhost:5000/api-docs

### [ARCHITECTURE.md](./ARCHITECTURE.md)

Architecture technique du projet :
- Structure du projet
- Flux de données
- Technologies utilisées
- Modèles de données (User, Provider, Service, OTP, etc.)
- Relations entre modèles
- Middlewares et services
- Repositories (couche d'accès aux données)

### [DEPLOYMENT.md](./DEPLOYMENT.md)

Guide de déploiement :
- Déploiement local
- Déploiement en production
- Configuration des variables d'environnement
- Sécurité en production
- Monitoring et backup

## 🚀 Démarrage Rapide

1. Lire [ARCHITECTURE.md](./ARCHITECTURE.md) pour comprendre la structure
2. Consulter [API.md](./API.md) ou utiliser [Swagger](http://localhost:5000/api-docs) pour tester l'API
3. Suivre [DEPLOYMENT.md](./DEPLOYMENT.md) pour déployer

## 📖 Documentation Interactive

La documentation Swagger est disponible à : **http://localhost:5000/api-docs**

Vous pouvez tester tous les endpoints directement depuis votre navigateur !

## 📝 Notes

- Toute la documentation est en français
- Les exemples de code sont en JavaScript/Node.js
- Les schémas JSON sont fournis pour chaque endpoint

---

*Documentation maintenue pour AGRO BOOST - MVP*

