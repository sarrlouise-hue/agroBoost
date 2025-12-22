import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import { FiArrowLeft, FiSave, FiCalendar, FiClock, FiTool, FiDollarSign, FiFileText } from 'react-icons/fi';

const SUCCESS_COLOR = '#4CAF50';
const PRIMARY_COLOR = '#0070AB';

function RecordMaintenancePage() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        type: 'STANDARD_SERVICE',
        description: '',
        startDate: new Date().toISOString().substring(0, 10),
        endDate: new Date().toISOString().substring(0, 10),
        cost: '',
        currentHours: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Préparation des données pour l'API
            const payload = {
                serviceId: id,
                type: formData.type,
                // On combine les heures dans la description pour garder une trace
                description: `${formData.description} (Relevé: ${formData.currentHours}h)`,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                status: 'completed', 
                cost: parseFloat(formData.cost) || 0
            };

            await api.post('/maintenances', payload);
            
            alert("Intervention enregistrée avec succès !");
            navigate(`/maintenance/${id}`); 
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Erreur lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            {/* BOUTON RETOUR*/}
            <button onClick={() => navigate(-1)} style={btnBackStyle}>
                <FiArrowLeft /> Retour à l'historique
            </button>

            <form onSubmit={handleSubmit} style={formCardStyle}>
                <header style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                    <h2 style={{ color: PRIMARY_COLOR, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiTool /> Enregistrer une Intervention
                    </h2>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>ID Équipement : {id}</p>
                </header>
                
                <div style={gridStyle}>
                    {/* COLONNE GAUCHE */}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}><FiCalendar /> Date de l'intervention</label>
                        <input 
                            type="date" 
                            name="startDate" 
                            value={formData.startDate} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle} 
                        />
                        
                        <label style={labelStyle}><FiClock /> Heures Moteur (h)</label>
                        <input 
                            type="number" 
                            name="currentHours" 
                            placeholder="Ex: 1250"
                            value={formData.currentHours} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle} 
                        />
                    </div>

                    {/* COLONNE DROITE */}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Type d'entretien</label>
                        <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                            <option value="STANDARD_SERVICE">Vidange / Entretien Standard</option>
                            <option value="REPAIR">Réparation Curative</option>
                            <option value="CHECKUP">Inspection Visuelle</option>
                            <option value="UPGRADE">Amélioration / Pièce neuve</option>
                        </select>

                        <label style={labelStyle}><FiDollarSign /> Coût total (XOF)</label>
                        <input 
                            type="number" 
                            name="cost" 
                            placeholder="0"
                            value={formData.cost} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle} 
                        />
                    </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <label style={labelStyle}><FiFileText /> Travaux effectués & Pièces changées</label>
                    <textarea 
                        name="description" 
                        placeholder="Détaillez l'intervention (ex: Changement filtre à huile, appoint liquide de refroidissement...)"
                        value={formData.description} 
                        onChange={handleChange} 
                        required 
                        style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} 
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ 
                        ...btnSaveStyle, 
                        backgroundColor: loading ? '#ccc' : SUCCESS_COLOR 
                    }}
                >
                    {loading ? 'Envoi en cours...' : <><FiSave /> Sauvegarder l'intervention</>}
                </button>
            </form>
        </div>
    );
}

// STYLES 
const containerStyle = { 
    padding: '40px', 
    maxWidth: '900px', 
    margin: '0 auto', 
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#F7FAFC',
    minHeight: '100vh'
};

const formCardStyle = { 
    backgroundColor: 'white', 
    padding: '40px', 
    borderRadius: '16px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    border: '1px solid #E2E8F0'
};

const gridStyle = { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '30px' 
};

const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column'
};

const labelStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px',
    fontWeight: '600', 
    fontSize: '14px',
    color: '#4A5568',
    marginBottom: '8px'
};

const inputStyle = { 
    width: '100%', 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #E2E8F0',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
};

const btnBackStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    border: '1px solid #E2E8F0', 
    backgroundColor: 'white', 
    color: '#4A5568', 
    cursor: 'pointer', 
    marginBottom: '25px', 
    fontWeight: '600',
    padding: '10px 18px',
    borderRadius: '10px',
    transition: 'all 0.2s'
};

const btnSaveStyle = { 
    width: '100%', 
    padding: '16px', 
    color: 'white', 
    border: 'none', 
    borderRadius: '10px', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    fontSize: '16px', 
    marginTop: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
};

export default RecordMaintenancePage;