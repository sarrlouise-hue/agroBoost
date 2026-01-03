import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import { 
    FiArrowLeft, FiSave, FiCalendar, FiClock, 
    FiTool, FiDollarSign, FiFileText, FiUser, FiSettings 
} from 'react-icons/fi';

const SUCCESS_COLOR = '#3A7C35';
const DARK_ACCENT = '#2D3748'; 
const BG_COLOR = '#F1F5F9';
const DARK_TEXT = '#1A202C';

function RecordMaintenancePage() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [mechanics, setMechanics] = useState([]);

    const [formData, setFormData] = useState({
        mechanicId: '',
        type: 'STANDARD_SERVICE',
        description: '',
        startDate: new Date().toISOString().substring(0, 16),
        endDate: new Date(new Date().getTime() + 3600000).toISOString().substring(0, 16),
        cost: '',
        currentHours: '',
        notes: ''
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                const fetchedData = response.data.data || response.data;
                if (Array.isArray(fetchedData)) {
                    const filtered = fetchedData.filter(user => {
                        const role = user.role ? user.role.toLowerCase() : '';
                        return role === 'mechanic' || role === 'mecanicien'; 
                    });
                    setMechanics(filtered);
                }
            } catch (err) {
                console.error("Erreur lors du chargement des mécaniciens:", err);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.mechanicId) {
            alert("Veuillez sélectionner un mécanicien.");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                serviceId: id,
                mechanicId: formData.mechanicId,
                type: formData.type,
                description: `${formData.description} (Relevé: ${formData.currentHours}h)`,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                status: 'completed', 
                cost: parseFloat(formData.cost) || 0,
                notes: formData.notes
            };
            await api.post('/maintenances', payload);
            alert("Intervention enregistrée avec succès !");
            navigate(`/maintenance/${id}`); 
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="record-page-container">
            <style>{`
                .record-page-container { 
                    padding: 0; 
                    width: 100%;
                    max-width: 1000px; 
                    margin: 0 auto; 
                    background-color: ${BG_COLOR};
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                }
                
                /* Bouton retour : icône seule sur mobile, avec texte sur desktop */
                .btn-back-container {
                    padding: 15px;
                }

                .btn-back-circle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background-color: white;
                    color: ${DARK_ACCENT};
                    border: 1px solid #E2E8F0;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }

                .btn-back-circle span { display: none; } /* Caché par défaut (mobile) */

                .form-card { 
                    background-color: white; 
                    padding: 20px 15px; 
                    border-radius: 0; 
                    border: none;
                    min-height: 100vh;
                }

                .form-header { 
                    margin-bottom: 30px; 
                    border-bottom: 3px solid #EDF2F7; 
                    padding-bottom: 15px; 
                }

                /* Titre et Icône en VERT */
                .form-header h2 { 
                    color: ${SUCCESS_COLOR}; 
                    margin: 0; 
                    display: flex; 
                    align-items: center; 
                    gap: 12px;
                    font-weight: 900;
                    font-size: 1.5rem;
                    text-transform: uppercase;
                }

                .responsive-grid { 
                    display: grid; 
                    grid-template-columns: 1fr; 
                    gap: 20px; 
                }

                @media (min-width: 768px) {
                    .record-page-container { padding: 20px; }
                    .form-card { 
                        padding: 40px; 
                        border-radius: 12px; 
                        min-height: auto;
                        border: 1px solid #E2E8F0;
                    }
                    .btn-back-container { padding: 0 0 20px 0; }
                    .btn-back-circle { 
                        width: auto; 
                        height: auto; 
                        padding: 10px 20px; 
                        border-radius: 8px; 
                        gap: 8px;
                    }
                    .btn-back-circle span { display: inline; font-weight: 700; font-size: 13px; }
                    .responsive-grid { grid-template-columns: 1fr 1fr; }
                    .full-width { grid-column: span 2; }
                }

                .input-group { margin-bottom: 5px; }

                .input-label {
                    display: flex; 
                    align-items: center; 
                    gap: 8px;
                    font-weight: 800;
                    font-size: 11px; 
                    color: #718096; 
                    margin-bottom: 8px;
                    text-transform: uppercase;
                }

                .custom-input {
                    width: 100%;
                    padding: 16px; 
                    border-radius: 8px; 
                    border: 2px solid #E2E8F0;
                    font-size: 16px;
                    background-color: #F8FAFC;
                    outline: none;
                    color: ${DARK_TEXT};
                }

                .custom-input:focus { border-color: ${SUCCESS_COLOR}; }

                .btn-submit {
                    width: 100%; 
                    padding: 20px; 
                    color: white; 
                    border: none; 
                    border-radius: 12px; 
                    cursor: pointer; 
                    font-weight: 900; 
                    font-size: 16px; 
                    display: flex;
                    align-items: center; 
                    justify-content: center; 
                    gap: 12px;
                    margin-top: 30px;
                    text-transform: uppercase;
                    background-color: ${SUCCESS_COLOR};
                    box-shadow: 0 4px 12px ${SUCCESS_COLOR}44;
                }
            `}</style>

            <div className="btn-back-container">
                <button onClick={() => navigate(-1)} className="btn-back-circle">
                    <FiArrowLeft size={20} /> <span>RETOUR</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="form-card">
                <header className="form-header">
                    <h2><FiTool /> Intervention</h2>
                    <div style={{ marginTop: '10px' }}>
                         <span style={{ background: '#F0FFF4', color: SUCCESS_COLOR, padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '900', border: `1px solid ${SUCCESS_COLOR}33` }}>
                            ID ÉQUIPEMENT : {id}
                         </span>
                    </div>
                </header>
                
                <div className="responsive-grid">
                    <div className="input-group full-width">
                        <label className="input-label"><FiUser /> MÉCANICIEN RESPONSABLE</label>
                        <select 
                            name="mechanicId" 
                            value={formData.mechanicId} 
                            onChange={handleChange} 
                            required 
                            className="custom-input"
                        >
                            <option value="">-- CHOISIR L'INTERVENANT --</option>
                            {mechanics.map(m => (
                                <option key={m.id || m._id} value={m.id || m._id}>
                                    {m.firstName?.toUpperCase()} {m.lastName?.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label"><FiCalendar /> DATE DE DÉBUT</label>
                        <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} required className="custom-input" />
                    </div>

                    <div className="input-group">
                        <label className="input-label"><FiCalendar /> DATE DE FIN</label>
                        <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} required className="custom-input" />
                    </div>

                    <div className="input-group">
                        <label className="input-label"><FiClock /> HEURES MOTEUR (H)</label>
                        <input type="number" name="currentHours" placeholder="0" value={formData.currentHours} onChange={handleChange} required className="custom-input" />
                    </div>

                    <div className="input-group">
                        <label className="input-label"><FiDollarSign /> COÛT TOTAL (XOF)</label>
                        <input type="number" name="cost" placeholder="0" value={formData.cost} onChange={handleChange} required className="custom-input" />
                    </div>

                    <div className="input-group full-width">
                        <label className="input-label"><FiSettings /> TYPE D'ENTRETIEN</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="custom-input">
                            <option value="STANDARD_SERVICE">VIDANGE / ENTRETIEN STANDARD</option>
                            <option value="REPAIR">RÉPARATION CURATIVE</option>
                            <option value="CHECKUP">INSPECTION VISUELLE</option>
                        </select>
                    </div>

                    <div className="input-group full-width">
                        <label className="input-label"><FiFileText /> TRAVAUX EFFECTUÉS</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            required 
                            className="custom-input"
                            style={{ minHeight: '150px', resize: 'none' }} 
                            placeholder="Détails de l'intervention..."
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn-submit"
                    style={{ 
                        backgroundColor: loading ? '#A0AEC0' : SUCCESS_COLOR,
                        boxShadow: loading ? 'none' : '0 4px 12px rgba(46, 204, 113, 0.3)'
                    }}
                >
                    {loading ? 'ENREGISTREMENT...' : <><FiSave size={20} /> ENREGISTRER L'ENTRETIEN</>}
                </button>
            </form>
        </div>
    );
}

export default RecordMaintenancePage;