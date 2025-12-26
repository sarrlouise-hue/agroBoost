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
                /* Global Reset pour éviter les débordements */
                * {
                    box-sizing: border-box;
                }

                .record-page-container { 
                    padding: 10px 5px; /* Très peu d'espace sur les bords mobile */
                    max-width: 700px; /* Plus étroit sur desktop pour éviter l'étirement */
                    margin: 0 auto; 
                    background-color: #F7FAFC;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                }
                
                .btn-back-modern {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background-color: white;
                    color: #4A5568;
                    border: 1px solid #E2E8F0;
                    padding: 10px 15px;
                    border-radius: 10px;
                    font-weight: 700; /* Titre du bouton en bold */
                    font-size: 14px;
                    cursor: pointer;
                    margin-bottom: 15px;
                    margin-left: 5px;
                }

                .form-card { 
                    background-color: white; 
                    padding: 20px 15px; /* Padding ajusté */
                    border-radius: 12px; 
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    border: 1px solid #E2E8F0;
                    width: 98%; /* Occupe presque tout l'espace mobile */
                    margin: 0 auto;
                }

                /* Desktop : Réduction de l'espace environnant */
                @media (min-width: 768px) {
                    .record-page-container { padding: 20px 0; }
                    .form-card { padding: 30px; width: 100%; }
                    .responsive-grid { 
                        display: grid; 
                        grid-template-columns: 1fr 1fr; 
                        gap: 20px; 
                    }
                }

                .form-header { 
                    margin-bottom: 25px; 
                    border-bottom: 2px solid #F0F4F8; 
                    padding-bottom: 15px; 
                }

                .form-header h2 { 
                    color: ${PRIMARY_COLOR}; 
                    margin: 0; 
                    display: flex; 
                    align-items: center; 
                    gap: 10px;
                    font-weight: 900;
                    font-size: 1.5rem;
                    text-transform: uppercase;
                }

                .input-group { margin-bottom: 20px; width: 100%; }

                .input-label {
                    display: flex; 
                    align-items: center; 
                    gap: 8px;
                    font-weight: 800; /* LABEL EN BOLD */
                    font-size: 13px; 
                    color: #1A202C; 
                    margin-bottom: 8px;
                    text-transform: uppercase;
                }

                .custom-input {
                    width: 100%; /* Ne dépassera plus grâce au border-box global */
                    padding: 14px; 
                    border-radius: 8px; 
                    border: 2px solid #E2E8F0;
                    font-size: 16px;
                    background-color: #F8FAFC;
                    transition: all 0.2s ease;
                    outline: none;
                }

                .custom-input:focus {
                    border-color: ${PRIMARY_COLOR};
                    background-color: #FFF;
                    box-shadow: 0 0 0 3px rgba(0, 112, 171, 0.1);
                }

                .btn-submit {
                    width: 100%; 
                    padding: 16px; 
                    color: white; 
                    border: none; 
                    border-radius: 10px; 
                    cursor: pointer; 
                    font-weight: 800; 
                    font-size: 16px; 
                    display: flex;
                    align-items: center; 
                    justify-content: center; 
                    gap: 10px;
                    margin-top: 20px;
                }
            `}</style>

            <button onClick={() => navigate(-1)} className="btn-back-modern">
                <FiArrowLeft /> <span>RETOUR</span>
            </button>

            <form onSubmit={handleSubmit} className="form-card">
                <header className="form-header">
                    <h2><FiTool /> Intervention</h2>
                    <p style={{ color: '#718096', fontSize: '13px', marginTop: '5px', fontWeight: '600' }}>
                        ID Équipement : <strong>{id}</strong>
                    </p>
                </header>
                
                <div className="responsive-grid">
                    <div style={{gridColumn: '1 / -1'}} className="input-group">
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
                        <input type="number" name="currentHours" value={formData.currentHours} onChange={handleChange} required className="custom-input" />
                    </div>

                    <div className="input-group">
                        <label className="input-label"><FiDollarSign /> COÛT TOTAL (XOF)</label>
                        <input type="number" name="cost" value={formData.cost} onChange={handleChange} required className="custom-input" />
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">TYPE D'ENTRETIEN</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="custom-input">
                        <option value="STANDARD_SERVICE">Vidange / Entretien Standard</option>
                        <option value="REPAIR">Réparation Curative</option>
                        <option value="CHECKUP">Inspection Visuelle</option>
                    </select>
                </div>

                <div className="input-group">
                    <label className="input-label"><FiFileText /> TRAVAUX EFFECTUÉS</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required 
                        className="custom-input"
                        style={{ minHeight: '120px', resize: 'vertical' }} 
                        placeholder="Détails des réparations..."
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn-submit"
                    style={{ backgroundColor: loading ? '#CBD5E0' : SUCCESS_COLOR }}
                >
                    {loading ? 'EN COURS...' : <><FiSave /> ENREGISTRER</>}
                </button>
            </form>
        </div>
    );
}

export default RecordMaintenancePage;