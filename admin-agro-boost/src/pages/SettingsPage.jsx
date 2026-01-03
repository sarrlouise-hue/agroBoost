import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiUser, FiBell, FiLock, FiGlobe, FiMapPin, 
  FiChevronRight, FiLogOut, FiUsers, FiSettings, FiCheckCircle
} from "react-icons/fi";
import api from "../services/api"; // 

const SUCCESS_COLOR = '#2ECC71';
const DARK_ACCENT = '#2D3748';

function SettingsPage() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Charger le nombre de notifications non lues au montage
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/api/notifications');
        const unread = res.data?.data?.filter(n => !n.isRead).length || 0;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Erreur notifications", err);
      }
    };
    fetchNotifications();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      navigate('/login');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/api/notifications/read-all');
      setUnreadCount(0);
      alert("Toutes les notifications ont été marquées comme lues.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="settings-page-container">
      <style>{`
        .settings-page-container {
          background-color: #F8FAFC;
          min-height: calc(100vh - 120px); /* Ajuste selon la taille de header/footer */
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }

        .settings-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 25px;
        }

        .settings-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
        }

        .card-header {
          padding: 20px;
          border-bottom: 1px solid #F1F5F9;
          background: #FBFCFE;
        }

        .card-header h2 {
          margin: 0;
          font-size: 14px;
          font-weight: 800;
          color: ${DARK_ACCENT};
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .settings-list { list-style: none; margin: 0; padding: 0; }

        .setting-item {
          display: flex;
          align-items: center;
          padding: 18px 20px;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 1px solid #F1F5F9;
          background: white;
        }

        .setting-item:hover { background: #F8FAFC; }
        .setting-item:last-child { border-bottom: none; }

        .icon-wrapper {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 18px;
        }

        .text-group { flex: 1; }
        .text-main { display: block; font-size: 15px; font-weight: 700; color: ${DARK_ACCENT}; }
        .text-sub { display: block; font-size: 12px; color: #64748B; font-weight: 500; margin-top: 2px; }

        .badge-count {
          background: #EF4444;
          color: white;
          font-size: 10px;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 20px;
          margin-left: 8px;
        }

        .action-button {
          width: 100%;
          padding: 15px;
          border: none;
          background: transparent;
          color: ${SUCCESS_COLOR};
          font-weight: 800;
          font-size: 12px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-top: 1px solid #F1F5F9;
        }

        .btn-logout-admin {
          max-width: 1200px;
          margin: 30px auto 0;
          padding: 18px;
          background: #FFEEF0;
          color: #EF4444;
          border: 1px solid #FCA5A530;
          border-radius: 15px;
          width: 100%;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .settings-page-container { padding: 10px; }
          .settings-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="settings-grid">
        
        {/* SECTION 1: ADMINISTRATION SYSTEME */}
        <div className="settings-card">
          <div className="card-header">
            <h2><FiUsers color={SUCCESS_COLOR} /> Gestion Utilisateurs</h2>
          </div>
          <div className="settings-list">
            <div className="setting-item" onClick={() => navigate('/users')}>
              <div className="icon-wrapper" style={{background: '#E0F2FE', color: '#0284C7'}}><FiUsers /></div>
              <div className="text-group">
                <span className="text-main">Annuaire Global</span>
                <span className="text-sub">Voir et gérer tous les utilisateurs</span>
              </div>
              <FiChevronRight color="#CBD5E1" />
            </div>
            <div className="setting-item" onClick={() => navigate('/profile')}>
              <div className="icon-wrapper" style={{background: '#F1F5F9', color: DARK_ACCENT}}><FiUser /></div>
              <div className="text-group">
                <span className="text-main">Mon Profil Admin</span>
                <span className="text-sub">Mettre à jour mes informations</span>
              </div>
              <FiChevronRight color="#CBD5E1" />
            </div>
          </div>
        </div>

        {/* SECTION 2: COMMUNICATIONS */}
        <div className="settings-card">
          <div className="card-header">
            <h2><FiBell color="#F59E0B" /> Centre de Notifications</h2>
          </div>
          <div className="settings-list">
            <div className="setting-item" onClick={() => navigate('/notifications')}>
              <div className="icon-wrapper" style={{background: '#FEF3C7', color: '#D97706'}}><FiBell /></div>
              <div className="text-group">
                <span className="text-main">Notifications {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}</span>
                <span className="text-sub">Alertes système et réservations</span>
              </div>
              <FiChevronRight color="#CBD5E1" />
            </div>
            <button className="action-button" onClick={markAllAsRead}>
              <FiCheckCircle /> Tout marquer comme lu
            </button>
          </div>
        </div>

        {/* SECTION 3: CONFIGURATION */}
        <div className="settings-card">
          <div className="card-header">
            <h2><FiSettings color="#6366F1" /> Préférences & Sécurité</h2>
          </div>
          <div className="settings-list">
            <div className="setting-item" onClick={() => navigate('/language')}>
              <div className="icon-wrapper" style={{background: '#EEF2FF', color: '#4F46E5'}}><FiGlobe /></div>
              <div className="text-group">
                <span className="text-main">Langue du Système</span>
                <span className="text-sub">Français / Wolof</span>
              </div>
              <FiChevronRight color="#CBD5E1" />
            </div>
            <div className="setting-item" onClick={() => navigate('/change-password')}>
              <div className="icon-wrapper" style={{background: '#F8FAFC', color: DARK_ACCENT}}><FiLock /></div>
              <div className="text-group">
                <span className="text-main">Sécurité</span>
                <span className="text-sub">Changer le mot de passe admin</span>
              </div>
              <FiChevronRight color="#CBD5E1" />
            </div>
          </div>
        </div>

      </div>

      <button className="btn-logout-admin" onClick={handleLogout}>
        <FiLogOut /> Déconnexion de la session Admin
      </button>
    </div>
  );
}

export default SettingsPage;