// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/*
 Composant de protection de route.
 Redirige l'utilisateur vers la page de connexion s'il n'est pas authentifié.
 */
function ProtectedRoute() {
  // 1. Vérifie si le Token JWT est présent
  const token = localStorage.getItem('agroboost_admin_token');

  // Si le token n'existe PAS, l'utilisateur n'est pas authentifié
  if (!token) {
    // Redirection vers la page /login
    // replace: true empêche l'utilisateur de revenir en arrière avec le bouton précédent
    return <Navigate to="/login" replace />;
  }

  // 2. Si le token EXISTE, affiche le contenu de la route enfant
  // L'élément <Outlet /> rend le composant enfant de la Route (ex: DashboardPage)
  return <Outlet />;
}

export default ProtectedRoute;