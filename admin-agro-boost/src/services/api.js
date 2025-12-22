import axios from 'axios';

// Récupère l'URL de base de l'API définie dans votre fichier .env.local
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1. Création de l'instance Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Intercepteur pour ajouter le Token JWT
// Cet intercepteur s'exécutera avant chaque requête pour ajouter le jeton,
// si l'utilisateur est connecté (sauf pour la connexion elle-même).
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agroboost_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Intercepteur de Réponse pour gérer les erreurs d'Authentification (401)
// Si le token est invalide ou expiré (réponse 401 Unauthorized), on déconnecte l'utilisateur
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Token expiré ou invalide. Déconnexion automatique.");
            // Suppression du token local et redirection vers la page de connexion
            localStorage.removeItem('agroboost_admin_token');
            // Utilisation de window.location.href 
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);


export default api;