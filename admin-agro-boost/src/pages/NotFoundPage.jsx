// src/pages/NotFoundPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px', 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f4f7f9'
    }}>
      <h1 style={{ fontSize: '5em', color: '#ff4d4f', margin: 0 }}>404</h1>
      <h2 style={{ color: '#333' }}>Page Non Trouvée</h2>
      <p style={{ color: '#777', margin: '20px 0' }}>
        Désolé, l'URL que vous avez demandée n'existe pas dans le panneau d'administration AGRO BOOST.
      </p>
      <Link to="/" style={{ 
        padding: '10px 20px', 
        background: '#4CAF50', 
        color: 'white', 
        textDecoration: 'none', 
        borderRadius: '5px' 
      }}>
        Retourner au Tableau de Bord
      </Link>
    </div>
  );
}

export default NotFoundPage;