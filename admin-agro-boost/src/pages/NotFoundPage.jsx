// src/pages/NotFoundPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

// Thème de couleurs
const SUCCESS_COLOR = '#2ECC71';
const DARK_ACCENT = '#2D3748';

function NotFoundPage() {
  return (
    <div className="notfound-container">
      <style>{`
        .notfound-container { 
          text-align: center; 
          padding: 20px; 
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #F8FAFC;
          font-family: 'Inter', sans-serif;
        }

        .notfound-card {
          max-width: 450px;
          width: 100%;
          background: white;
          padding: 40px 25px;
          border-radius: 24px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 10px 25px rgba(0,0,0,0.03);
        }

        .error-code { 
          font-size: clamp(4rem, 20vw, 6rem); 
          font-weight: 900;
          color: ${DARK_ACCENT}; 
          margin: 0; 
          line-height: 0.8;
          letter-spacing: -2px;
        }

        .error-badge {
          display: inline-block;
          background: #FEF2F2;
          color: #EF4444;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 15px;
        }

        .error-title { 
          color: ${DARK_ACCENT}; 
          font-size: 1.5rem;
          font-weight: 800;
          margin: 15px 0 10px 0;
          text-transform: uppercase;
        }

        .error-text { 
          color: #64748B; 
          margin: 0 0 35px 0;
          line-height: 1.6;
          font-size: 15px;
          font-weight: 500;
        }

        .btn-home { 
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 20px; 
          background: ${SUCCESS_COLOR}; 
          color: white; 
          text-decoration: none; 
          border-radius: 14px;
          font-weight: 800;
          font-size: 13px;
          text-transform: uppercase;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(46, 204, 113, 0.25);
        }

        .btn-home:active {
          transform: scale(0.98);
        }

        .icon-box {
          color: ${SUCCESS_COLOR};
          margin-bottom: 10px;
          background: #ECFDF5;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 0 auto 20px auto;
        }

        @media (max-width: 480px) {
          .notfound-container { padding: 15px; }
          .notfound-card { 
            padding: 50px 20px;
            border-radius: 30px; /* Plus arrondi sur mobile */
            border: none;
            box-shadow: none;
            background: transparent;
          }
          .btn-home { width: 100%; box-sizing: border-box; }
        }
      `}</style>

      <div className="notfound-card">
        <div className="icon-box">
          <FiAlertTriangle size={30} />
        </div>
        
        <div className="error-badge">Erreur Système</div>
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Introuvable</h2>
        
        <p className="error-text">
          Le lien que vous avez suivi est peut-être rompu ou la page a été déplacée dans la gestion <strong>AGRO BOOST</strong>.
        </p>

        <Link to="/" className="btn-home">
          <FiHome size={18} /> Retour Accueil
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;