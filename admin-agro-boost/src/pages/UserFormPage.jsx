import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaArrowLeft, FaSave, FaUserPlus } from "react-icons/fa";

const PRIMARY_COLOR = '#0070AB';
const SUCCESS_COLOR = '#4CAF50';

export default function UserFormPage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!userId;

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "", 
        role: "user", 
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            const fetchUser = async () => {
                try {
                    const response = await api.get(`/users/${userId}`); 
                    const userData = response.data.data || response.data; 

                    setFormData({
                        firstName: userData.firstName || "",
                        lastName: userData.lastName || "",
                        email: userData.email || "",
                        phoneNumber: userData.phoneNumber || "",
                        role: userData.role || "user",
                        password: "", 
                    });
                } catch (err) {
                    setSubmitError("Impossible de charger les données.");
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        }
    }, [userId, isEditMode]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitError(null);

        const url = isEditMode ? `/users/${userId}` : "/users"; 
        const method = isEditMode ? "put" : "post";
        const dataToSend = { ...formData };
        if (isEditMode && !dataToSend.password) delete dataToSend.password; 

        try {
            await api[method](url, dataToSend);
            navigate("/users");
        } catch (err) {
            setSubmitError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        /* responsive-container-form : on gère l'espace extérieur ici */
        <div className="responsive-container-form" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}> 
            
            {/* BOUTON RETOUR  */}
            <div style={{ maxWidth: '800px', margin: '0 auto 15px auto' }}>
                <button 
                    onClick={() => navigate("/users")}
                    className="btn-back"
                    style={backButtonStyle}
                >
                    <FaArrowLeft /> <span className="hide-mobile">Retour à la liste</span>
                </button>
            </div>

            <div className="form-main-card" style={containerStyle}>
                <h1 style={titleStyle}>
                    {isEditMode ? <><FaSave /> Modifier l'utilisateur</> : <><FaUserPlus /> Ajouter un utilisateur</>}
                </h1>

                {submitError && (
                    <div style={errorBannerStyle}>
                        ⚠️ {submitError}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                    
                    <div className="form-grid">
                        <div className="form-group">
                            <label style={labelStyle}>Prénom</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} required style={modernInputStyle} placeholder="Ex: Moussa" />
                        </div>
                        <div className="form-group">
                            <label style={labelStyle}>Nom de famille</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} required style={modernInputStyle} placeholder="Ex: Diop" />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label style={labelStyle}>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleFormChange} required style={modernInputStyle} placeholder="exemple@mail.com" />
                        </div>
                        <div className="form-group">
                            <label style={labelStyle}>Téléphone</label>
                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} style={modernInputStyle} placeholder="+221 ..." />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label style={labelStyle}>Rôle</label>
                            <select name="role" value={formData.role} onChange={handleFormChange} required style={modernInputStyle}>
                                <option value="user">Producteur (User)</option>
                                <option value="provider">Prestataire (Provider)</option>
                                <option value="admin">Administrateur (Admin)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={labelStyle}>
                                Mot de passe {isEditMode && <span style={{ fontWeight: 'normal', color: '#94a3b8', fontSize: '12px' }}>(Optionnel)</span>}
                            </label>
                            <input 
                                type="password" name="password" 
                                value={formData.password} onChange={handleFormChange} 
                                required={!isEditMode} style={modernInputStyle} 
                                placeholder={isEditMode ? "Laisser vide" : "Min. 6 caractères"}
                            />
                        </div>
                    </div>

                    <div style={actionContainerStyle}>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            style={{ 
                                ...btnPrimary,
                                background: loading ? '#94a3b8' : SUCCESS_COLOR, 
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? "Chargement..." : isEditMode ? "Enregistrer" : "Créer l'utilisateur"}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => navigate("/users")}
                            style={btnSecondary}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>

            <style>
                {`
                    .responsive-container-form { padding: 20px; }
                    .form-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
                    
                    @media (min-width: 640px) { 
                        .form-grid { grid-template-columns: 1fr 1fr; gap: 20px; } 
                    }
                    
                    @media (max-width: 768px) {
                        .responsive-container-form { padding: 8px; }
                        .form-main-card { padding: 15px !important; border-radius: 10px !important; }
                        .hide-mobile { display: none; }
                    }

                    .btn-back:hover { 
                        border-color: ${PRIMARY_COLOR} !important; 
                        color: ${PRIMARY_COLOR} !important;
                        background-color: #f0f9ff !important;
                    }

                    input:focus, select:focus {
                        border-color: ${PRIMARY_COLOR} !important;
                        box-shadow: 0 0 0 3px rgba(0, 112, 171, 0.1);
                    }

                    button:active { transform: scale(0.98); }
                `}
            </style>
        </div>
    );
}

// STYLES OBJETS (Mis à jour pour flexibilité mobile)
const backButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'white',
    color: '#475569',
    border: '1px solid #cbd5e1', 
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const modernInputStyle = {
    width: '100%', padding: '12px 15px', border: '1px solid #e2e8f0', 
    borderRadius: '10px', outline: 'none', fontSize: '16px', boxSizing: 'border-box'
};

const labelStyle = {
    display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px'
};

const containerStyle = {
    backgroundColor: 'white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', 
    borderRadius: '16px', padding: '40px', 
    maxWidth: '800px', margin: '0 auto', boxSizing: 'border-box', width: '100%'
};

const titleStyle = { 
    fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', fontWeight: '800', 
    marginBottom: '25px', color: PRIMARY_COLOR, textAlign: 'center',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
};

const errorBannerStyle = { 
    color: '#E53E3E', textAlign: 'center', marginBottom: '20px', 
    padding: '10px', backgroundColor: '#FFF5F5', 
    borderRadius: '10px', border: '1px solid #FEB2B2', fontSize: '13px'
};

const actionContainerStyle = { 
    display: 'flex', gap: '10px', marginTop: '10px', flexDirection: 'column' 
};

const btnPrimary = { 
    padding: '14px', color: 'white', borderRadius: '10px', fontWeight: '700', 
    border: 'none', fontSize: '16px', transition: 'all 0.2s'
};

const btnSecondary = { 
    padding: '12px', background: '#f1f5f9', color: '#64748b', 
    borderRadius: '10px', fontWeight: '600', border: 'none', 
    cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s'
};