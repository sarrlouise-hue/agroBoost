import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiLock, FiArrowLeft, FiShield, FiEye, FiEyeOff } from 'react-icons/fi';

const SUCCESS_COLOR = '#2ECC71';
const DARK_ACCENT = '#2D3748';

function ChangePasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false); 
  const [passwords, setPasswords] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      alert("Mot de passe mis à jour avec succès !");
      navigate('/settings');
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors du changement de mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-wrapper">
      <style>{`
        .password-wrapper {
          background-color: #F8FAFC;
          min-height: calc(100vh - 80px);
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }

        .container {
          max-width: 500px;
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

        .form-card {
          background: white;
          border-radius: 28px;
          border: 1px solid #E2E8F0;
          padding: 35px;
          box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.05);
        }

        .icon-header {
          width: 54px;
          height: 54px;
          background: #F0FDF4;
          color: #3A7C35;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          margin-bottom: 22px;
        }

        h1 {
          font-size: 1.6rem;
          font-weight: 900;
          color: ${DARK_ACCENT};
          margin: 0 0 8px 0;
        }

        .subtitle {
          color: #64748B;
          font-size: 14px;
          margin-bottom: 35px;
          line-height: 1.6;
        }

        .input-group {
          margin-bottom: 22px;
        }

        .input-group label {
          display: block;
          font-size: 11px;
          font-weight: 800;
          color: #94A3B8;
          text-transform: uppercase;
          margin-bottom: 10px;
          padding-left: 4px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrapper input {
          width: 100%;
          padding: 16px 18px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          color: ${DARK_ACCENT};
          transition: all 0.2s ease;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #3A7C35;
          background: white;
          box-shadow: 0 0 0 4px rgba(58, 124, 53, 0.1);
        }

        /* L'oeil est seulement dans le premier champ */
        .toggle-pass {
          position: absolute;
          right: 18px;
          color: #94A3B8;
          cursor: pointer;
          display: flex;
          padding: 5px;
          font-size: 20px;
        }
        
        .toggle-pass:hover { color: #3A7C35; }

        .btn-submit {
          width: 100%;
          padding: 18px;
          background: #3A7C35;
          color: white;
          border: none;
          border-radius: 18px;
          font-weight: 800;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          cursor: pointer;
          margin-top: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          box-shadow: 0 4px 12px rgba(58, 124, 53, 0.2);
        }

        .btn-submit:disabled { background: #94A3B8; cursor: not-allowed; }

        @media (max-width: 480px) {
          .password-wrapper { padding: 15px; }
          .form-card { padding: 30px 20px; }
        }
      `}</style>

      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FiArrowLeft size={18} /> Retour
        </button>

        <div className="form-card">
          <div className="icon-header">
            <FiShield />
          </div>
          <h1>Sécurité</h1>
          <p className="subtitle">Gérez l'accès à votre compte AGRO BOOST en toute sécurité.</p>

          <form onSubmit={handleSubmit}>
            {/* 1. MOT DE PASSE ACTUEL (AVEC OEIL) */}
            <div className="input-group">
              <label>Mot de passe actuel</label>
              <div className="input-wrapper">
                <input 
                  type={showPass ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  style={{ paddingRight: '50px' }} // Espace pour l'oeil
                  value={passwords.currentPassword}
                  onChange={e => setPasswords({...passwords, currentPassword: e.target.value})}
                />
                <div className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>
            </div>

            {/* 2. NOUVEAU MOT DE PASSE */}
            <div className="input-group">
              <label>Nouveau mot de passe</label>
              <div className="input-wrapper">
                <input 
                  type={showPass ? "text" : "password"} 
                  required
                  placeholder="Minimum 6 caractères"
                  value={passwords.newPassword}
                  onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                />
              </div>
            </div>

            {/* 3. CONFIRMATION  */}
            <div className="input-group">
              <label>Confirmation</label>
              <div className="input-wrapper">
                <input 
                  type={showPass ? "text" : "password"} 
                  required
                  placeholder="Répétez le nouveau mot de passe"
                  value={passwords.confirmPassword}
                  onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              <FiLock /> {loading ? "Mise à jour..." : "Mettre à jour l'accès"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordPage;