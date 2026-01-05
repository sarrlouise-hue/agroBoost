import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; 
import { 
    FiArrowLeft, FiTool, FiPlusCircle, FiCalendar, 
    FiHash, FiUser, FiDollarSign, FiFileText, FiClock
} from 'react-icons/fi';

// Palette de couleurs cohérente
const SUCCESS_COLOR = '#2ECC71';
const DARK_ACCENT = '#2D3748';
const BG_COLOR = '#F1F5F9';
const DARK_TEXT = '#1A202C';

function MaintenanceDetailPage() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/maintenances/service/${id}`);
                setHistory(response.data.data || response.data || []);
            } catch (err) {
                console.error("Erreur historique:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchHistory();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return "---";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    return (
        <div className="maintenance-detail-container">
            <style>{`
                .maintenance-detail-container { 
                    padding: 0; 
                    max-width: 1000px; 
                    margin: 0 auto; 
                    font-family: 'Inter', sans-serif;
                    background-color: ${BG_COLOR};
                    min-height: 100vh;
                }
                
                /* Bouton retour circulaire mobile */
                .btn-back-container { padding: 15px; }
                .btn-back-circle {
                    display: flex; align-items: center; justify-content: center;
                    width: 40px; height: 40px; background-color: white;
                    color: ${DARK_ACCENT}; border: 1px solid #E2E8F0;
                    border-radius: 50%; cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }
                .btn-back-circle span { display: none; }

                .header-section { 
                    padding: 0 15px 20px 15px;
                }

                .title-group h1 { 
                    color: ${SUCCESS_COLOR}; 
                    font-weight: 900; 
                    text-transform: uppercase;
                    font-size: 1.4rem;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .id-badge {
                    display: inline-block;
                    background: #EDF2F7;
                    color: ${DARK_ACCENT};
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 800;
                    margin-top: 8px;
                }

                .btn-add-new {
                    width: 100%;
                    background-color: ${SUCCESS_COLOR};
                    color: white;
                    border: none;
                    padding: 16px;
                    border-radius: 12px;
                    font-weight: 900;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 20px;
                    text-decoration: none;
                    text-transform: uppercase;
                    box-shadow: 0 4px 12px ${SUCCESS_COLOR}44;
                }

                /* Transformation du tableau en CARTES sur Mobile */
                .history-list { padding: 0 10px; }
                
                .maintenance-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 15px;
                    border: 1px solid #E2E8F0;
                    position: relative;
                }

                .card-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    font-size: 13px;
                }

                .card-label {
                    color: #718096;
                    font-weight: 800;
                    font-size: 10px;
                    text-transform: uppercase;
                }

                .card-value {
                    color: ${DARK_TEXT};
                    font-weight: 700;
                    text-align: right;
                }

                .card-description {
                    border-top: 1px solid #F1F5F9;
                    padding-top: 12px;
                    margin-top: 12px;
                }

                .status-pill {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                }
                .status-completed { background: #DCFCE7; color: #166534; }
                .status-pending { background: #FEF3C7; color: #92400E; }

                /* Desktop Adaptations */
                @media (min-width: 768px) {
                    .maintenance-detail-container { padding: 20px; }
                    .header-section { 
                        display: flex; 
                        justify-content: space-between; 
                        align-items: center;
                        padding: 0 0 30px 0;
                    }
                    .btn-add-new { width: auto; margin-top: 0; padding: 12px 24px; }
                    .btn-back-container { padding: 0 0 20px 0; }
                    .btn-back-circle { width: auto; height: auto; border-radius: 8px; padding: 10px 15px; gap: 8px; }
                    .btn-back-circle span { display: inline; font-weight: 800; font-size: 12px; }
                    
                    /* Optionnel : remettre en tableau sur desktop si nécessaire */
                    .history-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                    }
                }
            `}</style>

            {/* Retour */}
            <div className="btn-back-container">
                <button onClick={() => navigate('/maintenance')} className="btn-back-circle">
                    <FiArrowLeft size={18} /> <span>RETOUR</span>
                </button>
            </div>

            {/* Header */}
            <div className="header-section">
                <div className="title-group">
                    <h1><FiTool /> Historique</h1>
                    <div className="id-badge">ID ÉQUIPEMENT : {id}</div>
                </div>

                <Link to={`/maintenance/record/${id}`} className="btn-add-new">
                    <FiPlusCircle size={20} /> Nouvelle Intervention
                </Link>
            </div>

            {/* Liste d'historique */}
            <div className="history-list">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#A0AEC0' }}>Chargement...</div>
                ) : history.length > 0 ? (
                    <div className="history-grid">
                        {history.map(item => (
                            <div key={item._id || item.id} className="maintenance-card">
                                <div className="card-row">
                                    <div className="card-label"><FiCalendar /> Date</div>
                                    <div className="card-value">{formatDate(item.startDate)}</div>
                                </div>
                                
                                <div className="card-row">
                                    <div className="card-label"><FiUser /> Technicien</div>
                                    <div className="card-value">
                                        {item.mechanic?.name || (item.mechanic ? `${item.mechanic.firstName} ${item.mechanic.lastName}` : 'Admin')}
                                    </div>
                                </div>

                                <div className="card-row">
                                    <div className="card-label"><FiDollarSign /> Coût</div>
                                    <div className="card-value" style={{ color: SUCCESS_COLOR, fontWeight: '900' }}>
                                        {item.cost ? `${parseFloat(item.cost).toLocaleString()} XOF` : '---'}
                                    </div>
                                </div>

                                <div className="card-row">
                                    <div className="card-label">Statut</div>
                                    <div className={`status-pill status-${item.status || 'completed'}`}>
                                        {item.status === 'completed' ? 'Terminé' : 'En attente'}
                                    </div>
                                </div>

                                <div className="card-description">
                                    <div className="card-label" style={{ marginBottom: '5px' }}><FiFileText /> Travaux effectués</div>
                                    <div style={{ fontSize: '14px', color: DARK_TEXT, lineHeight: '1.4', fontWeight: '500' }}>
                                        {item.description}
                                    </div>
                                </div>
                                
                                {item.notes && (
                                    <div style={{ marginTop: '10px', fontSize: '12px', fontStyle: 'italic', color: '#718096' }}>
                                        Note: {item.notes}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '12px', color: '#A0AEC0' }}>
                        <FiFileText size={40} style={{ marginBottom: '10px' }} /><br />
                        Aucune intervention enregistrée.
                    </div>
                )}
            </div>
        </div>
    );
}

export default MaintenanceDetailPage;