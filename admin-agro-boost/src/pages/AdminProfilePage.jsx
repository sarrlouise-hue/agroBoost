import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  FiUser, FiMail, FiPhone, FiEdit3, 
  FiArrowLeft, FiSave, FiX, FiCheckCircle 
} from 'react-icons/fi';

const DARK_ACCENT = '#2D3748';
const PRIMARY_GREEN = '#3A7C35';

function AdminProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Admin'
  });

  const [formData, setFormData] = useState({ ...profile });

  // Récupération des données depuis l'API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/users/profile');
        const data = res.data?.data || res.data;
        setProfile(data);
        setFormData(data);
      } catch (err) {
        console.error("Erreur profil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/users/profile', formData);
      setProfile(formData);
      setIsEditing(false);
      alert("Profil mis à jour !");
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Chargement...</div>;

  return (
    <div className="profile-wrapper">
      <style>{`
        .profile-wrapper {
          background-color: #F8FAFC;
          min-height: calc(100vh - 80px);
          font-family: 'Inter', sans-serif;
          padding: 20px 40px;
        }

        .container {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
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
        }

        .profile-card {
          background: white;
          border-radius: 28px;
          border: 1px solid #E2E8F0;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
        }

        .profile-header {
          background: linear-gradient(135deg, ${PRIMARY_GREEN}, #2D5A29);
          padding: 40px;
          display: flex;
          align-items: center;
          gap: 25px;
          color: white;
        }

        .avatar-circle {
          width: 100px;
          height: 100px;
          background: rgba(255,255,255,0.2);
          border: 4px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
        }

        .header-info h1 { margin: 0; font-size: 24px; font-weight: 900; }
        .header-info p { margin: 5px 0 0 0; opacity: 0.9; font-size: 14px; }

        .profile-body { padding: 40px; }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: #F8FAFC;
          border-radius: 18px;
          border: 1px solid #EDF2F7;
        }

        .info-icon {
          width: 45px;
          height: 45px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${PRIMARY_GREEN};
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }

        .info-content label {
          display: block;
          font-size: 11px;
          font-weight: 800;
          color: #94A3B8;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .info-content p {
          margin: 0;
          font-weight: 700;
          color: ${DARK_ACCENT};
          font-size: 16px;
        }

        .edit-input {
          width: 100%;
          padding: 12px 15px;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-family: inherit;
          font-weight: 600;
          margin-top: 5px;
        }

        .actions {
          margin-top: 40px;
          display: flex;
          gap: 15px;
        }

        .btn {
          padding: 15px 30px;
          border-radius: 15px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          text-transform: uppercase;
          font-size: 13px;
          transition: all 0.2s;
        }

        .btn-primary { background: ${PRIMARY_GREEN}; color: white; border: none; }
        .btn-outline { background: white; border: 1.5px solid #E2E8F0; color: ${DARK_ACCENT}; }

        @media (max-width: 768px) {
          .profile-wrapper { padding: 15px; }
          .profile-header { padding: 30px 20px; flex-direction: column; text-align: center; }
          .profile-body { padding: 25px 20px; }
          .info-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FiArrowLeft size={18} /> Retour
        </button>

        <div className="profile-card">
          {/* HEADER */}
          <div className="profile-header">
            <div className="avatar-circle">
              <FiUser />
            </div>
            <div className="header-info">
              <h1>{profile.name}</h1>
              <p>Administrateur AGRO BOOST</p>
            </div>
          </div>

          {/* BODY */}
          <div className="profile-body">
            <form onSubmit={handleUpdate}>
              <div className="info-grid">
                {/* NOM */}
                <div className="info-item">
                  <div className="info-icon"><FiUser /></div>
                  <div className="info-content">
                    <label>Nom complet</label>
                    {isEditing ? (
                      <input 
                        className="edit-input"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    ) : <p>{profile.name}</p>}
                  </div>
                </div>

                {/* EMAIL */}
                <div className="info-item">
                  <div className="info-icon"><FiMail /></div>
                  <div className="info-content">
                    <label>Adresse Email</label>
                    {isEditing ? (
                      <input 
                        className="edit-input"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    ) : <p>{profile.email}</p>}
                  </div>
                </div>

                {/* TELEPHONE */}
                <div className="info-item">
                  <div className="info-icon"><FiPhone /></div>
                  <div className="info-content">
                    <label>Téléphone</label>
                    {isEditing ? (
                      <input 
                        className="edit-input"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    ) : <p>{profile.phone || 'Non renseigné'}</p>}
                  </div>
                </div>

                {/* ROLE (Lecture seule) */}
                <div className="info-item">
                  <div className="info-icon"><FiCheckCircle /></div>
                  <div className="info-content">
                    <label>Statut du compte</label>
                    <p style={{ color: PRIMARY_GREEN }}>Compte Vérifié</p>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="actions">
                {!isEditing ? (
                  <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
                    <FiEdit3 /> Modifier mon profil
                  </button>
                ) : (
                  <>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      <FiSave /> {saving ? 'Enregistrement...' : 'Sauvegarder'}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={() => {
                      setIsEditing(false);
                      setFormData(profile); // Annuler les changements
                    }}>
                      <FiX /> Annuler
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfilePage;