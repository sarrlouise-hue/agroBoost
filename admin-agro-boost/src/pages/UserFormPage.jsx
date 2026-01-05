import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaArrowLeft, FaSave, FaUserPlus, FaEye, FaEyeSlash, FaPhoneAlt } from "react-icons/fa";

const PRIMARY_COLOR = '#3A7C35';
const BACKGROUND_COLOR = '#FDFAF8';

export default function UserFormPage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!userId;

    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", phoneNumber: "", role: "user", password: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            api.get(`/users/${userId}`).then(res => {
                const data = res.data.data || res.data;
                setFormData({ ...data, password: "" });
            }).finally(() => setLoading(false));
        }
    }, [userId, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitError(null);
        try {
            const method = isEditMode ? "put" : "post";
            const url = isEditMode ? `/users/${userId}` : "/users";
            await api[method](url, formData);
            navigate("/users");
        } catch (err) {
            setSubmitError("Erreur lors de l'enregistrement.");
        } finally { setLoading(false); }
    };

    return (
        <div className="form-page-wrapper">
            <div className="header-actions">
                <button onClick={() => navigate("/users")} className="back-btn">
                    <FaArrowLeft /> <span className="hide-mobile">Retour à la liste</span>
                </button>
            </div>

            <div className="container-card">
                <h1 className="form-title">
                    {isEditMode ? <><FaSave /> Modifier l'utilisateur</> : <><FaUserPlus /> Nouveau Utilisateur</>}
                </h1>

                {submitError && <div className="error-banner">{submitError}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Prénom</label>
                            <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required placeholder="Ex: Jean" />
                        </div>

                        <div className="form-group">
                            <label>Nom</label>
                            <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required placeholder="Ex: Dupont" />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required placeholder="exemple@mail.com" />
                        </div>

                        <div className="form-group">
                            <label>Numéro de téléphone</label>
                            <div className="input-with-icon">
                                <FaPhoneAlt className="input-icon" />
                                <input 
                                    type="tel" 
                                    value={formData.phoneNumber} 
                                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} 
                                    required 
                                    placeholder="Ex: +221 77..." 
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Rôle sur la plateforme</label>
                            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                                <option value="user">Producteur (Agriculteur)</option>
                                <option value="provider">Prestataire de services</option>
                                <option value="mechanic">Mécanicien</option>
                                <option value="admin">Administrateur</option>
                            </select>
                        </div>

                        <div className="form-group password-group">
                            <label>Mot de passe</label>
                            <div className="input-with-icon">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder={isEditMode ? "Laisser vide si inchangé" : "6 caractères min."}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required={!isEditMode}
                                />
                                <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading} className="btn-submit">
                            {loading ? "Chargement..." : isEditMode ? "Enregistrer" : "Créer l'utilisateur"}
                        </button>
                        <button type="button" onClick={() => navigate("/users")} className="btn-cancel">
                            Annuler
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .form-page-wrapper {
                    background-color: ${BACKGROUND_COLOR};
                    min-height: 100vh;
                    padding: 20px;
                }

                .header-actions { margin-bottom: 20px; }

                /* Style bouton retour harmonisé */
                .back-btn {
                    display: flex; align-items: center; gap: 8px; background: white; 
                    border: 1px solid #E2E8F0; padding: 10px 18px; border-radius: 10px; 
                    cursor: pointer; font-weight: 500; color: #64748B; transition: 0.2s;
                }
                .back-btn:hover { background: #F8FAFC; border-color: ${PRIMARY_COLOR}; color: ${PRIMARY_COLOR}; }

                /* Carte identique à la page liste */
                .container-card {
                    background: white;
                    padding: clamp(20px, 5vw, 40px);
                    border-radius: 16px; /* Arrondi conservé partout */
                    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                    width: 100%;
                }

                .form-title { 
                    color: ${PRIMARY_COLOR}; 
                    font-size: clamp(1.4rem, 5vw, 1.8rem); 
                    margin-bottom: 30px; 
                    display: flex; align-items: center; gap: 15px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 25px;
                    margin-bottom: 35px;
                }

                .form-group { display: flex; flex-direction: column; gap: 8px; }
                .form-group label { font-size: 14px; font-weight: 600; color: #475569; }

                input, select {
                    width: 100%; padding: 12px; border-radius: 10px; 
                    border: 1px solid #E2E8F0; font-size: 15px; outline: none;
                    transition: 0.2s;
                }
                input:focus { border-color: ${PRIMARY_COLOR}; box-shadow: 0 0 0 3px rgba(58, 124, 53, 0.1); }

                .input-with-icon { position: relative; width: 100%; }
                .input-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #94A3B8; }
                .eye-icon { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #94A3B8; }

                .form-actions { display: flex; gap: 15px; flex-wrap: wrap; }

                .btn-submit {
                    flex: 1.5; padding: 14px; background: ${PRIMARY_COLOR}; color: white;
                    border: none; border-radius: 10px; font-weight: 600; cursor: pointer;
                    font-size: 16px; transition: 0.2s;
                }
                .btn-cancel {
                    flex: 1.5; padding: 14px; background: #F1F5F9; color: #64748B;
                    border: none; border-radius: 10px; font-weight: 600; cursor: pointer;
                    font-size: 16px;
                }

                @media (max-width: 850px) {
                    .form-page-wrapper { padding: 10px; }
                    .container-card { border-radius: 12px; padding: 20px; } /* Arrondi légèrement réduit mais présent */
                    .form-grid { grid-template-columns: 1fr; gap: 15px; }
                    .hide-mobile { display: none; }
                    .btn-submit, .btn-cancel { flex: 1 1 100%; }
                }
            `}</style>
        </div>
    );
}