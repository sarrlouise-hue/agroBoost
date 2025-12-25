// src/pages/NotFoundPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

function NotFoundPage() {
  return (
    <div className="notfound-container">
      <style>{`
        .notfound-container { 
          text-align: center; 
          padding: 20px; 
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #f4f7f9;
          font-family: 'Inter', sans-serif;
        }

        .notfound-card {
          max-width: 500px;
          width: 100%;
        }

        .error-code { 
          font-size: clamp(5rem, 15vw, 8rem); 
          font-weight: 800;
          color: #ff4d4f; 
          margin: 0; 
          line-height: 1;
        }

        .error-title { 
          color: #2D3748; 
          font-size: clamp(1.5rem, 5vw, 2rem);
          margin: 10px 0;
        }

        .error-text { 
          color: #718096; 
          margin: 20px 0 30px 0;
          line-height: 1.6;
          font-size: 16px;
        }

        .btn-home { 
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px; 
          background: #4CAF50; 
          color: white; 
          text-decoration: none; 
          border-radius: 12px;
          font-weight: 700;
          transition: transform 0.2s, background 0.2s;
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }

        .btn-home:hover {
          background: #43a047;
          transform: translateY(-2px);
        }

        .icon-alert {
          color: #ff4d4f;
          margin-bottom: 20px;
          opacity: 0.8;
        }

        @media (max-width: 480px) {
          .notfound-container { padding: 30px; }
          .btn-home { width: 100%; justify-content: center; box-sizing: border-box; }
        }
      `}</style>

      <div className="notfound-card">
        <FiAlertTriangle size={60} className="icon-alert" />
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Non Trouvée</h2>
        <p className="error-text">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée dans le panneau d'administration <strong>AGRO BOOST</strong>.
        </p>
        <Link to="/" className="btn-home">
          <FiHome size={20} /> Retourner au Tableau de Bord
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;