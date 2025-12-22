import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const PRIMARY_COLOR = '#0070AB';
const SUCCESS_COLOR = '#4CAF50';

const modernInputStyle = {
    width: '100%', 
    padding: '12px 15px', 
    border: '1px solid #ddd', 
    borderRadius: '8px', 
    outline: 'none',
};

const labelStyle = {
    display: 'block', 
    fontSize: '14px', 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: '6px'
};

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
                        // Conversion du rôle API vers le format attendu par le select
                        role: userData.role || "user",
                        password: "", 
                    });
                } catch (err) {
                    setSubmitError("Erreur lors du chargement des données.");
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

        // NOUVELLES ROUTES ADMIN
        const url = isEditMode ? `/users/${userId}` : "/users"; 
        const method = isEditMode ? "put" : "post";

        // Préparation des données avec les rôles attendus par l'API ("user", "provider", "admin")
        const dataToSend = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            role: formData.role, 
        };

        // On ajoute le mot de passe seulement s'il est rempli
        if (formData.password) {
            dataToSend.password = formData.password;
        }

        try {
            await api[method](url, dataToSend);
            alert(isEditMode ? "✅ Utilisateur mis à jour !" : "✅ Utilisateur créé avec succès !");
            navigate("/users");
        } catch (err) {
            const apiErrors = err.response?.data?.errors;
            setSubmitError(
                Array.isArray(apiErrors) ? apiErrors.join(', ') : 
                err.response?.data?.message || "Une erreur est survenue."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}> 
            <div style={{ backgroundColor: 'white', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', borderRadius: '12px', padding: '50px', maxWidth: '800px', margin: '30px auto' }}>
                <h1 style={{ fontSize: '1.8em', fontWeight: 'bold', marginBottom: '30px', color: PRIMARY_COLOR, textAlign: 'center' }}>
                    {isEditMode ? "Modifier un utilisateur" : "Ajouter un utilisateur (Admin)"}
                </h1>

                {submitError && (
                    <p style={{ color: '#E53E3E', textAlign: 'center', marginBottom: '20px', padding: '10px', backgroundColor: '#FEE8E8', borderRadius: '6px' }}>
                        ⚠️ {submitError}
                    </p>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        <div>
                            <label style={labelStyle}>Prénom</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} required style={modernInputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Nom de famille</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} required style={modernInputStyle} />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleFormChange} required style={modernInputStyle} />
                    </div>
                    
                    <div>
                        <label style={labelStyle}>Téléphone</label>
                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} style={modernInputStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Rôle</label>
                        <select name="role" value={formData.role} onChange={handleFormChange} required style={modernInputStyle}>
                            <option value="user">Producteur (User)</option>
                            <option value="provider">Prestataire (Provider)</option>
                            <option value="admin">Administrateur (Admin)</option>
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>
                            Mot de passe {isEditMode && <span style={{ fontWeight: 'normal', color: '#666' }}>(laisser vide pour ne pas changer)</span>}
                        </label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleFormChange} 
                            required={!isEditMode} 
                            style={modernInputStyle} 
                            placeholder={isEditMode ? "••••••••" : "Entrez un mot de passe"}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={{ padding: '12px', background: SUCCESS_COLOR, color: 'white', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
                        {loading ? "Chargement..." : isEditMode ? "💾 Sauvegarder" : "✅ Créer l'utilisateur"}
                    </button>
                </form>
            </div>
        </div>
    );
}