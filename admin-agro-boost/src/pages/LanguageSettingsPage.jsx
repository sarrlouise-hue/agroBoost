import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiGlobe, FiArrowLeft, FiCheck, FiSave } from 'react-icons/fi';

const DARK_ACCENT = '#2D3748';
const PRIMARY_GREEN = '#3A7C35';

function LanguageSettingsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState('fr');

  // Liste des langues disponibles
  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', desc: 'Langue par défaut du système' },
    { code: 'wo', name: 'Wolof', flag: '🇸🇳', desc: 'Interface disponible en Wolof' },
    { code: 'en', name: 'English', flag: '🇬🇧', desc: 'English system interface' }
  ];

  useEffect(() => {
    api.get('/api/users/profile').then(res => {
      if (res.data?.data?.language) {
        setCurrentLang(res.data.data.language);
      }
    });
  }, []);

  const handleLanguageChange = async () => {
    setLoading(true);
    try {
      await api.put('/api/users/language', { language: currentLang });
      alert("La langue a été mise à jour avec succès !");
      navigate('/settings');
    } catch (err) {
      alert("Erreur lors du changement de langue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lang-wrapper">
      <style>{`
        .lang-wrapper {
          background-color: #F8FAFC;
          min-height: calc(100vh - 80px);
          font-family: 'Inter', sans-serif;
          padding: 20px 40px; /* Espacement latéral généreux */
        }

        /* Suppression de la limite max-width pour prendre tout l'espace */
        .full-container {
          width: 100%;
          margin: 0;
        }

        .back-btn {
          background: white; 
          border: 1px solid #E2E8F0;
          padding: 10px 18px; 
          border-radius: 12px;
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          gap: 8px;
          font-size: 12px; 
          font-weight: 800; 
          color: ${DARK_ACCENT};
          text-transform: uppercase; 
          margin-bottom: 25px;
          transition: all 0.2s;
        }
        
        .back-btn:hover { background: #EDF2F7; }

        .card {
          background: white; 
          border-radius: 28px;
          border: 1px solid #E2E8F0; 
          padding: 40px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.03);
          width: 100%; /* Prend toute la largeur disponible */
        }

        .icon-header {
          width: 50px; height: 50px; background: #F0FDF4;
          color: ${PRIMARY_GREEN}; border-radius: 15px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin-bottom: 20px;
        }

        h1 { font-size: 1.8rem; font-weight: 900; color: ${DARK_ACCENT}; margin: 0; }
        .subtitle { color: #64748B; font-size: 14px; margin-bottom: 35px; }

        /* Utilisation de grid pour que les langues s'étalent sur desktop */
        .lang-list { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); 
          gap: 20px; 
          margin-bottom: 40px; 
        }

        .lang-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px; border-radius: 20px;
          border: 2px solid #F1F5F9; cursor: pointer;
          transition: all 0.2s ease;
          background: white;
        }

        .lang-item:hover { 
          border-color: #E2E8F0; 
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.02);
        }

        .lang-item.selected {
          border-color: ${PRIMARY_GREEN};
          background: #F0FDF4;
        }

        .lang-info { display: flex; align-items: center; gap: 18px; }
        .flag { font-size: 28px; }
        .lang-name { font-weight: 800; color: ${DARK_ACCENT}; font-size: 16px; display: block; }
        .lang-desc { font-size: 13px; color: #94A3B8; margin-top: 2px; }

        .check-circle {
          width: 26px; height: 26px; border-radius: 50%;
          border: 2px solid #E2E8F0; display: flex;
          align-items: center; justify-content: center; color: transparent;
          transition: all 0.2s;
        }

        .selected .check-circle {
          background: ${PRIMARY_GREEN}; border-color: ${PRIMARY_GREEN}; color: white;
        }

        .save-btn {
          width: 100%; 
          max-width: 400px; /* Le bouton ne doit pas être trop large pour rester ergonomique */
          padding: 18px; 
          background: ${PRIMARY_GREEN};
          color: white; border: none; border-radius: 18px;
          font-weight: 800; cursor: pointer; display: flex;
          align-items: center; justify-content: center; gap: 10px;
          box-shadow: 0 4px 12px rgba(58, 124, 53, 0.2);
          transition: all 0.3s;
        }

        .save-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .save-btn:disabled { background: #94A3B8; cursor: not-allowed; }

        @media (max-width: 768px) {
          .lang-wrapper { padding: 15px; }
          .lang-list { grid-template-columns: 1fr; }
          .card { padding: 30px 20px; }
          .save-btn { max-width: 100%; }
        }
      `}</style>

      <div className="full-container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FiArrowLeft size={18} /> Retour
        </button>

        <div className="card">
          <div className="icon-header"><FiGlobe /></div>
          <h1>Langue du système</h1>
          <p className="subtitle">Configurez votre préférence linguistique pour l'écosystème AGRO BOOST.</p>

          <div className="lang-list">
            {languages.map((lang) => (
              <div 
                key={lang.code} 
                className={`lang-item ${currentLang === lang.code ? 'selected' : ''}`}
                onClick={() => setCurrentLang(lang.code)}
              >
                <div className="lang-info">
                  <span className="flag">{lang.flag}</span>
                  <div>
                    <span className="lang-name">{lang.name}</span>
                    <span className="lang-desc">{lang.desc}</span>
                  </div>
                </div>
                <div className="check-circle">
                  <FiCheck size={16} />
                </div>
              </div>
            ))}
          </div>

          <button 
            className="save-btn" 
            onClick={handleLanguageChange}
            disabled={loading}
          >
            <FiSave size={20} /> {loading ? "Application..." : "Mettre à jour la langue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LanguageSettingsPage;