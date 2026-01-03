import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  FiBell, FiCheck, FiClock, FiArrowLeft, 
  FiInfo 
} from 'react-icons/fi';

const DARK_ACCENT = '#2D3748';
const PRIMARY_GREEN = '#3A7C35';

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/api/notifications');
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.error("Erreur chargement notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) { 
      console.error(err); 
    }
  };

  return (
    <div className="notif-wrapper">
      <style>{`
        .notif-wrapper {
          background-color: #F8FAFC;
          min-height: calc(100vh - 80px);
          font-family: 'Inter', sans-serif;
          padding: 20px 40px; /* Plus d'espace sur les côtés sur desktop */
        }

        .header-section {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
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
          transition: all 0.2s;
        }

        .back-btn:hover { background: #EDF2F7; }

        .title-group h1 {
          font-size: 1.8rem;
          font-weight: 900;
          color: ${DARK_ACCENT};
          margin: 10px 0 5px 0;
        }

        .subtitle {
          color: #64748B;
          font-size: 14px;
          margin-bottom: 30px;
        }

        /* Utilisation de grid pour occuper tout l'espace intelligemment */
        .notif-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
          width: 100%;
        }

        .notif-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          padding: 20px;
          display: flex;
          gap: 15px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .notif-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }

        .notif-card.unread {
          border-left: 6px solid ${PRIMARY_GREEN};
        }

        .icon-box {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }

        .unread .icon-box { background: #F0FDF4; color: ${PRIMARY_GREEN}; }
        .read .icon-box { background: #F1F5F9; color: #94A3B8; }

        .content-box { flex: 1; }

        .message {
          margin: 0 0 10px 0;
          font-size: 15px;
          line-height: 1.5;
          color: ${DARK_ACCENT};
          font-weight: 600;
        }

        .time {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #94A3B8;
          font-size: 12px;
        }

        .check-btn {
          background: ${PRIMARY_GREEN};
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          align-self: flex-start;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 100px 20px;
          background: white;
          border-radius: 28px;
          border: 2px dashed #E2E8F0;
        }

        /* Adaptations Mobile */
        @media (max-width: 768px) {
          .notif-wrapper { padding: 15px; }
          .notif-list { 
            grid-template-columns: 1fr; /* Une seule colonne sur mobile */
          }
          .title-group h1 { font-size: 1.5rem; }
        }
      `}</style>

      <div className="header-section">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FiArrowLeft size={18} /> Retour
        </button>
      </div>

      <div className="title-group">
        <h1>Centre de Notifications</h1>
        <p className="subtitle">Consultez l'historique complet de vos activités sur la plateforme.</p>
      </div>

      {loading ? (
        <div style={{ padding: '40px', color: '#64748B' }}>Chargement...</div>
      ) : (
        <div className="notif-list">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <FiBell size={50} color="#CBD5E1" style={{ marginBottom: '20px' }} />
              <p style={{ color: '#64748B', fontSize: '18px', fontWeight: 600 }}>
                Aucune notification enregistrée.
              </p>
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`notif-card ${n.isRead ? 'read' : 'unread'}`}>
                <div className="icon-box">
                  {n.isRead ? <FiInfo /> : <FiBell />}
                </div>
                
                <div className="content-box">
                  <p className="message">{n.message}</p>
                  <div className="time">
                    <FiClock size={14} />
                    {new Date(n.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>

                {!n.isRead && (
                  <button className="check-btn" onClick={() => markAsRead(n.id)}>
                    <FiCheck size={20} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;