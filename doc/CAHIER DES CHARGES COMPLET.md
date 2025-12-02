CAHIER DES CHARGES 

APPLICATION AGRO BOOST  

 1. PRÉSENTATION DU PROJET  

*Nom du projet* : AGRO BOOST   
*Type de projet* : Application mobile de réservation de tracteurs et services agricoles (Android & 
iOS)  
  
*Contexte* : Au Sénégal, l'accès aux services agricoles mécanisés reste limité et informel. Les 
producteurs doivent souvent recourir à des moyens traditionnels pour trouver un tracteur ou un 
opérateur agricole, ce qui entraîne des pertes de temps, des coûts élevés et des rendements 
limités. Actuellement, aucune plateforme numérique ne centralise les offres disponibles dans ce 
secteur spécifique.  
  
*Objectif général* : Créer une application mobile intuitive qui permet aux producteurs agricoles de 
localiser, réserver et payer des services agricoles mécanisés (tracteurs, opérateurs, autres 
machines), en quelques clics, via mobile money.  
 


 
*Objectifs spécifiques* :  
  
 Faciliter l’accès aux services agricoles modernes  
 Optimiser la disponibilité des ressources mécaniques en zone rurale  
 Offrir une visibilité accrue aux prestataires agricoles  
 Numériser la chaîne de réservation et de paiement  
  
  
*Public cible* :  
  
 Agriculteurs individuels et groupements de producteurs  
 Prestataires de services agricoles (tracteurs, opérateurs, semoirs, etc.)  
 Coopératives, ONG ou institutions de soutien au développement rural et l’Etat  
  
*Atouts de l'application* :  
  
 Première plateforme numérique dédiée à la location de services agricoles au Sénégal  
 Interface bilingue (français/wolof) avec support visuel et vocal pour utilisateurs à faible 
littératie  
 Paiement sécurisé via les principales plateformes de Mobile Money (Wave, Orange Money, Free 
Money)  
 Géolocalisation précise pour la mise en relation en temps réel  
 Notation des prestataires et historique des prestations  
 Application disponible sur Android et iOS dès la première version (MVP)  
  
---  
     
## 2. OBJECTIFS FONCTIONNELS  
  
### 2.1. Côté Utilisateur (Producteur Agricole)  
  
 Création de compte avec vérification OTP  
 Choix de langue (Français/Wolof)  

 
 Localisation automatique ou saisie manuelle  
 Recherche filtrée (type de service, disponibilité, prix)  
 Visualisation carte/liste des prestataires proches  
 Réservation avec planification de date et heure  
 Paiement intégré par mobile money  
 Suivi de commande et historique  
 Évaluation des services reçus  
  
### 2.2. Côté Prestataire (Fournisseur de services)  
*Objectifs spécifiques* :  
  
 Faciliter l’accès aux services agricoles modernes  
 Optimiser la disponibilité des ressources mécaniques en zone rurale  
 Offrir une visibilité accrue aux prestataires agricoles  
 Numériser la chaîne de réservation et de paiement  
  
  
*Public cible* :  
  
 Agriculteurs individuels et groupements de producteurs  
 Prestataires de services agricoles (tracteurs, opérateurs, semoirs, etc.)  
 Coopératives, ONG ou institutions de soutien au développement rural et l’Etat  
  
*Atouts de l'application* :  
  
 Première plateforme numérique dédiée à la location de services agricoles au Sénégal  
 Interface bilingue (français/wolof) avec support visuel et vocal pour utilisateurs à faible 
littératie  
 Paiement sécurisé via les principales plateformes de Mobile Money (Wave, Orange Money, Free 
Money)  
 Géolocalisation précise pour la mise en relation en temps réel  
 Notation des prestataires et historique des prestations  
 Application disponible sur Android et iOS dès la première version (MVP)  

 
  
---  
     
## 2. OBJECTIFS FONCTIONNELS  
  
### 2.1. Côté Utilisateur (Producteur Agricole)  
  
 Création de compte avec vérification OTP  
 Choix de langue (Français/Wolof)  
 Localisation automatique ou saisie manuelle  
 Recherche filtrée (type de service, disponibilité, prix)  
 Visualisation carte/liste des prestataires proches  
 Réservation avec planification de date et heure  
 Paiement intégré par mobile money  
 Suivi de commande et historique  
 Évaluation des services reçus  
  
### 2.2. Côté Prestataire (Fournisseur de services)  
  
 Création de compte validée par un administrateur  
 Ajout et gestion des services (tracteurs, semoirs, opérateurs...)  
 Mise à jour de la disponibilité en temps réel  
 Notifications lors de nouvelles réservations  
 Visualisation des revenus et performances  
 Consultation des avis utilisateurs  
  
### 2.3. Côté Administrateur (Plateforme)  
  
 Tableau de bord global (utilisateurs, services, statistiques)  
 Gestion des utilisateurs et des prestataires  
 Suivi des paiements et litiges  
 Envoi de messages de masse, alertes et promotions  

 
## 3. FONCTIONNALITÉS TECHNIQUES  
  
 Application mobile (Flutter, compatible Android & iOS)  
 Interface d’administration web (Vue.js ou React)  
 Base de données centralisée (Firebase/PostgreSQL)  
 Paiement intégré (Wave, Orange Money, Free Money)  
 Authentification OTP via SMS  
 API de géolocalisation (Google Maps ou OpenStreetMap)  
 Système de notification (Push + SMS)  
  
  
## 4. DESIGN & UX/UI  
  
 Interface intuitive avec navigation simple  
 Icônes explicites, textes courts et visuels pédagogiques  
 Mode hors ligne pour certaines fonctionnalités  
 Accessibilité visuelle et audio  
 Design responsive pour toutes tailles d’écran  
  
  
## 5. SÉCURITÉ  
  
 Authentification OTP sécurisée  
 Chiffrement des données utilisateurs et paiements  
 Systèmes de sauvegarde régulière  
 Mécanismes de détection de comportements anormaux  
  
  
## 6. TECHNOLOGIES RECOMMANDÉES  
  
 Frontend mobile : Flutter  
 Backend/API : Laravel ou Node.js  

 
 Base de données : Firebase/PostgreSQL  
 Paiement : Wave API, Orange Money, Free Money  
 Géolocalisation : Google Maps API  
 Interface admin : Vue.js ou React  
  
## 7. DÉPLOIEMENT & MAINTENANCE  
  
 Hébergement cloud (Firebase, OVH, Scaleway)  
 Domaine + certificat SSL  
 Publication sur Google Play Store & App Store  
 Maintenance initiale : 3 semaines après lancement  
 Support technique : WhatsApp, téléphone et email  
  
  
## 8. PLANNING PRÉVISIONNEL  
  
| Phase                             | Durée estimée |  
| --------------------------------- | ------------- |  
| Rédaction du cahier des charges   | 3 jours       |  
| Conception UI/UX                  | 4 jours       |  
| Développement MVP (Android+iOS)   | 10 jours      |  
| Phase de test (interne & terrain) | 4 jours       |  
| Déploiement                       | 2 jours       |  
| Maintenance initiale              | 5 jours       |  
*Durée totale estimée : 3 semaines*  
  
  
## 9. BUDGET PRÉVISIONNEL DÉTAILLÉ  
  
 Rédaction cahier des charges  
 Analys 
 Conception UI/UX (maquettes, prototypes) 

 
  
### 9.2. Développement Technique  
  
 Application mobile Android & iOS (Flutter)  
 Développement backend/API  
 Intégration Mobile Money (Wave)  
  
  
### 9.3. Hébergement & Services Cloud  
  
 Hébergement cloud + base de données  
 Domaine + certificat SSL  
 Services tiers (SMS, API Maps)  
  
  
### 9.4. Tests & Déploiement  
  
 Phase test terrain  
 Frais de publication (Google et Apple Store)  
  
### 9.5. Communication & Lancement  
  
 Création d’identité visuelle (logo, charte)  
 Vidéos/flyers de présentation  
 Campagne Facebook/WhatsApp  
  
### 9.6. Suivi & Maintenance  
  
 Assistance technique & support  
 Mises à jour et correc 
  
---  
  

 
*Remarque* : Ce budget permet de lancer un MVP complet, bilingue,  sécurisé et 
utilisable sur Android  et iOS.  
 Il est évolutif pour intégrer d’autres modules à l’avenir.  
 
 
* Phase test terrain  
* Frais de publication (Google et Apple Store)  
 
 
### 9.5. Communication & Lancement  
 
* Création d’identité visuelle (logo, charte) 
* Vidéos/flyers de présentation 
* Campagne Facebook/WhatsApp  
 
 
### 9.6. Suivi & Maintenance  
 
 
* Assistance technique & support 
* Mises à jour et corrections  
 
 
--- 
 
 
*Remarque* : Ce budget permet de lancer un MVP complet, bilingue, sécurisé et 
utilisable sur Android et iOS. 
Il est évolutif pour intégrer d’autres modules à l’avenir. 
