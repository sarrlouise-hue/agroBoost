import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import { 
    FiArrowLeft, FiSave, FiCalendar, FiClock, 
    FiTool, FiDollarSign, FiFileText, FiUser 
} from 'react-icons/fi';

const SUCCESS_COLOR = '#4CAF50';
const PRIMARY_COLOR = '#0070AB';

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
                    padding: clamp(15px, 4vw, 40px); 
                    max-width: 900px; 
                    margin: 0 auto; 
                    background-color: #F7FAFC;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                }
                
                /* STYLE DU BOUTON RETOUR */
                .btn-back-modern {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background-color: white;
                    color: #4A5568;
                    border: 1px solid #E2E8F0;
                    padding: 10px 20px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-bottom: 25px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .btn-back-modern:hover {
                    border-color: ${PRIMARY_COLOR};
                    color: ${PRIMARY_COLOR};
                    transform: translateX(-4px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }

                .form-card { 
                    background-color: white; 
                    padding: clamp(20px, 5vw, 40px); 
                    border-radius: 20px; 
                    box-shadow: 0 15px 35px rgba(0,0,0,0.07);
                    border: 1px solid #E2E8F0;
                }

                .form-header { 
                    margin-bottom: 35px; 
                    border-bottom: 2px solid #F0F4F8; 
                    padding-bottom: 20px; 
                }

                .form-header h2 { 
                    color: ${PRIMARY_COLOR}; 
                    margin: 0; 
                    display: flex; 
                    align-items: center; 
                    gap: 12px;
                    font-weight: 800;
                    font-size: 1.7rem;
                    text-transform: uppercase;
                }

                .responsive-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                    gap: 25px; 
                }

                .input-label {
                    display: flex; 
                    align-items: center; 
                    gap: 10px;
                    font-weight: 700;
                    font-size: 14px; 
                    color: #1A202C; 
                    margin-bottom: 10px;
                }

                .custom-input {
                    width: 100%; 
                    padding: 14px; 
                    border-radius: 12px; 
                    border: 2px solid #E2E8F0;
                    font-size: 15px;
                    background-color: #F8FAFC;
                    box-sizing: border-box;
                    transition: all 0.3s ease;
                }

                .custom-input:focus {
                    border-color: ${PRIMARY_COLOR};
                    background-color: #FFF;
                    outline: none;
                    box-shadow: 0 0 0 4px rgba(0, 112, 171, 0.15);
                }

                .btn-submit {
                    width: 100%; 
                    padding: 18px; 
                    color: white; 
                    border: none; 
                    border-radius: 12px; 
                    cursor: pointer; 
                    font-weight: 800; 
                    font-size: 16px; 
                    display: flex;
                    align-items: center; 
                    justify-content: center; 
                    gap: 12px;
                    margin-top: 40px;
                    transition: transform 0.2s, background-color 0.2s;
                }

                .btn-submit:active {
                    transform: scale(0.98);
                }
            `}</style>

            {/* BOUTON RETOUR CORRIGÉ */}
            <button onClick={() => navigate(-1)} className="btn-back-modern">
                <FiArrowLeft /> <span>Retour à l'historique</span>
            </button>

            <form onSubmit={handleSubmit} className="form-card">
                <header className="form-header">
                    <h2><FiTool /> Intervention</h2>
                    <p style={{ color: '#718096', fontSize: '14px', marginTop: '10px' }}>
                        ID Équipement : <strong>{id}</strong>
                    </p>
                </header>
                
                <div className="responsive-grid">
                    <div style={{gridColumn: '1 / -1'}}>
                        <label className="input-label"><FiUser /> MÉCANICIEN RESPONSABLE</label>
                        <select 
                            name="mechanicId" 
                            value={formData.mechanicId} 
                            onChange={handleChange} 
                            required 
                            className="custom-input"
                        >
                            <option value="">-- Sélectionner l'intervenant ({mechanics.length}) --</option>
                            {mechanics.map(m => (
                                <option key={m.id || m._id} value={m.id || m._id}>
                                    {m.firstName} {m.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="input-label"><FiCalendar /> DATE DE DÉBUT</label>
                        <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} required className="custom-input" />
                    </div>

                    <div>
                        <label className="input-label"><FiCalendar /> DATE DE FIN</label>
                        <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} required className="custom-input" />
                    </div>

                    <div>
                        <label className="input-label"><FiClock /> HEURES MOTEUR (H)</label>
                        <input type="number" name="currentHours" value={formData.currentHours} onChange={handleChange} required className="custom-input" />
                    </div>

                    <div>
                        <label className="input-label"><FiDollarSign /> COÛT TOTAL (XOF)</label>
                        <input type="number" name="cost" value={formData.cost} onChange={handleChange} required className="custom-input" />
                    </div>
                </div>

                <div style={{ marginTop: '25px' }}>
                    <label className="input-label">TYPE D'ENTRETIEN</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="custom-input">
                        <option value="STANDARD_SERVICE">Vidange / Entretien Standard</option>
                        <option value="REPAIR">Réparation Curative</option>
                        <option value="CHECKUP">Inspection Visuelle</option>
                    </select>
                </div>

                <div style={{ marginTop: '25px' }}>
                    <label className="input-label"><FiFileText /> TRAVAUX EFFECTUÉS</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required 
                        className="custom-input"
                        style={{ minHeight: '120px' }} 
                        placeholder="Détaillez les réparations effectuées..."
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn-submit"
                    style={{ backgroundColor: loading ? '#CBD5E0' : SUCCESS_COLOR }}
                >
                    {loading ? 'Traitement...' : <><FiSave /> ENREGISTRER L'INTERVENTION</>}
                </button>
            </form>
        </div>
    );
}

export default RecordMaintenancePage;