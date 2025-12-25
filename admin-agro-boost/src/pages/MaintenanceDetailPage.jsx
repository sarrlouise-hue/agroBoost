import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; 
import { 
    FiArrowLeft, FiTool, FiPlusCircle, FiCalendar, 
    FiHash, FiUser, FiDollarSign, FiFileText 
} from 'react-icons/fi';

const PRIMARY_COLOR = '#0070AB';
const SUCCESS_COLOR = '#4CAF50';

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
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    return (
        <div className="maintenance-detail-container">
            <style>{`
                .maintenance-detail-container { 
                    padding: clamp(15px, 4vw, 40px); 
                    max-width: 1200px; 
                    margin: 0 auto; 
                    font-family: 'Inter', sans-serif;
                    background-color: #F7FAFC;
                    min-height: 100vh;
                }
                
                .header-flex { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center;
                    margin-bottom: 35px;
                    gap: 20px;
                    flex-wrap: wrap;
                }

                .title-group { display: flex; align-items: center; gap: 15px; }

                .table-card { 
                    background-color: white; 
                    border-radius: 16px; 
                    box-shadow: 0 4px 20px rgba(0,0,0,0.04); 
                    overflow: hidden;
                    border: 1px solid #E2E8F0;
                }

                .status-badge {
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 700;
                    white-space: nowrap;
                }
                .status-pending { background: #FEF3C7; color: #92400E; }
                .status-completed { background: #DCFCE7; color: #166534; }
                .status-in_progress { background: #DBEAFE; color: #1E40AF; }

                @media screen and (max-width: 992px) {
                    .header-flex { flex-direction: column; align-items: stretch; text-align: center; }
                    .title-group { flex-direction: column; }
                    .btn-action { width: 100%; justify-content: center; }
                    
                    table, thead, tbody, th, td, tr { display: block; }
                    thead tr { position: absolute; top: -9999px; left: -9999px; }
                    tr { border-bottom: 2px solid #EDF2F7; padding: 20px 15px; }
                    td { 
                        border: none; position: relative; padding-left: 45% !important; 
                        text-align: right !important; margin-bottom: 12px; min-height: 30px;
                        display: flex; align-items: center; justify-content: flex-end;
                    }
                    td:before { 
                        position: absolute; left: 0; width: 40%; text-align: left;
                        font-weight: 800; color: #2D3748; font-size: 11px; content: attr(data-label);
                        text-transform: uppercase;
                    }
                    .description-cell { 
                        text-align: left !important; padding-left: 0 !important; 
                        flex-direction: column; align-items: flex-start; 
                        margin-top: 10px; border-top: 1px dashed #E2E8F0; padding-top: 15px !important; 
                    }
                    .description-cell:before { position: static; margin-bottom: 8px; }
                }
            `}</style>

            <button 
                onClick={() => navigate('/maintenance')} 
                style={btnBackStyle}
                className="btn-back"
            >
                <FiArrowLeft /> Retour à la gestion
            </button>

            <div className="header-flex">
                <div className="title-group">
                    <div style={iconBoxStyle}><FiTool size={24} /></div>
                    <div>
                        <h1 style={titleStyle}>Historique d'Interventions</h1>
                        <p style={subtitleStyle}>
                            <FiHash size={12} /> ID Équipement : 
                            <span style={{ fontWeight: 'bold', marginLeft: '5px', color: '#2D3748' }}>
                                {id || "Non spécifié"}
                            </span>
                        </p>
                    </div>
                </div>

                <Link to={`/maintenance/record/${id}`} style={{ textDecoration: 'none' }}>
                    <button style={btnActionStyle} className="btn-action">
                        <FiPlusCircle /> Enregistrer une Intervention
                    </button>
                </Link>
            </div>

            <div className="table-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={theadStyle}>
                        <tr>
                            <th style={thStyle}>Période</th>
                            <th style={thStyle}>Description</th>
                            <th style={thStyle}>Technicien</th>
                            <th style={thStyle}>Coût</th>
                            <th style={thStyle}>Notes</th>
                            <th style={thStyle}>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={emptyStyle}>Chargement des données...</td></tr>
                        ) : history.length > 0 ? history.map(item => (
                            <tr key={item._id || item.id} style={trStyle}>
                                <td data-label="Période" style={tdStyle}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <span style={{ fontSize: '13px' }}><strong>Début:</strong> {formatDate(item.startDate || item.createdAt)}</span>
                                        <span style={{ fontSize: '11px', color: '#718096' }}><strong>Fin:</strong> {formatDate(item.endDate)}</span>
                                    </div>
                                </td>
                                <td data-label="Description" style={{ ...tdStyle, fontWeight: '500' }}>
                                    {item.description}
                                </td>
                                <td data-label="Technicien" style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <FiUser size={14} color="#A0AEC0" />
                                        {item.mechanic?.name || (item.mechanic ? `${item.mechanic.firstName} ${item.mechanic.lastName}` : 'Admin')}
                                    </div>
                                </td>
                                <td data-label="Coût" style={{ ...tdStyle, color: PRIMARY_COLOR, fontWeight: '800' }}>
                                    {item.cost ? `${parseFloat(item.cost).toLocaleString()} FCFA` : '---'}
                                </td>
                                <td data-label="Notes" className="description-cell" style={{ ...tdStyle, color: '#4A5568', fontSize: '13px' }}>
                                    {item.notes || 'Aucune note'}
                                </td>
                                <td data-label="Statut" style={tdStyle}>
                                    <span className={`status-badge status-${item.status || 'pending'}`}>
                                        {item.status === 'completed' ? 'Terminé' : 
                                         item.status === 'in_progress' ? 'En cours' : 'En attente'}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" style={emptyStyle}>Aucun historique pour cet équipement.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// STYLES MIS À JOUR
const iconBoxStyle = {
    backgroundColor: 'white', padding: '12px', borderRadius: '12px', color: PRIMARY_COLOR,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const titleStyle = { color: '#1A202C', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', margin: 0, fontWeight: '800' };

const subtitleStyle = { color: '#718096', fontSize: '13px', margin: '5px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' };

const btnBackStyle = { 
    display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #E2E8F0', 
    backgroundColor: 'white', color: '#4A5568', cursor: 'pointer', marginBottom: '25px', 
    fontWeight: '700', padding: '10px 18px', borderRadius: '8px', fontSize: '14px'
};

const btnActionStyle = { 
    padding: '12px 24px', backgroundColor: SUCCESS_COLOR, color: 'white', border: 'none', 
    borderRadius: '8px', cursor: 'pointer', fontWeight: '800', display: 'flex', 
    alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)', fontSize: '14px'
};

const theadStyle = { backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' };

const thStyle = { 
    padding: '18px', 
    textAlign: 'left', 
    color: '#2D3748', // Couleur plus sombre pour plus de contraste
    fontSize: '12px', 
    textTransform: 'uppercase', 
    letterSpacing: '0.05em', 
    fontWeight: '900' // Titres de colonnes en GRAS (Bold)
};

const tdStyle = { padding: '18px', fontSize: '14px', color: '#2D3748' };

const trStyle = { borderBottom: '1px solid #F1F5F9' };

const emptyStyle = { padding: '60px', textAlign: 'center', color: '#A0AEC0', fontSize: '15px' };

export default MaintenanceDetailPage;