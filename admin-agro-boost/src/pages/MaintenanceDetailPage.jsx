import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; 
import { 
    FiTool, FiPlusCircle, FiCalendar, FiUser, FiDollarSign, FiFileText
} from 'react-icons/fi';
import { FaArrowLeft } from 'react-icons/fa';

const SUCCESS_COLOR = '#3A7C35';
const DARK_TEXT = '#1A202C';
const BG_PAGE = '#F1F5F9';

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
        <div className="maintenance-page-wrapper">
            {/* Bouton retour identique à UserFormPage */}
            <div className="header-actions">
                <button onClick={() => navigate('/maintenance')} className="back-btn">
                    <FaArrowLeft /> <span className="hide-mobile">Retour à la liste</span>
                </button>
            </div>

            {/* Carte principale */}
            <div className="container-card">
                {/* Header */}
                <div className="header-section" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '20px'
                }}>
                    {/* Titre et ID */}
                    <div className="title-group" style={{ display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{ color: SUCCESS_COLOR, display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900 }}>
                            <FiTool /> Historique
                        </h1>
                        <div style={{
                            background: '#EDF2F7',
                            color: SUCCESS_COLOR,
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 800,
                            marginTop: '8px'
                        }}>
                            ID ÉQUIPEMENT : {id}
                        </div>
                    </div>

                    {/* Bouton Nouvelle Intervention */}
                    <Link to={`/maintenance/record/${id}`} className="btn-add-new" style={{
                        backgroundColor: SUCCESS_COLOR,
                        color: 'white',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        fontWeight: 900,
                        textDecoration: 'none',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                        boxShadow: `0 4px 12px ${SUCCESS_COLOR}44`,
                        marginTop: '10px' // pour mobile seulement
                    }}>
                        <FiPlusCircle size={18} /> Nouvelle Intervention
                    </Link>
                </div>
                {/* Historique */}
                <div className="history-list">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px', color: '#A0AEC0' }}>Chargement...</div>
                    ) : history.length > 0 ? (
                        history.map(item => (
                            <div key={item._id || item.id} style={{
                                background: 'white', borderRadius: '12px', padding: '15px', marginBottom: '15px', border: '1px solid #E2E8F0'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap' }}>
                                    <div style={{ color: '#718096', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}><FiCalendar /> Date</div>
                                    <div style={{ color: DARK_TEXT, fontWeight: 700 }}>{formatDate(item.startDate)}</div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap' }}>
                                    <div style={{ color: '#718096', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}><FiUser /> Technicien</div>
                                    <div style={{ color: DARK_TEXT, fontWeight: 700 }}>
                                        {item.mechanic?.name || (item.mechanic ? `${item.mechanic.firstName} ${item.mechanic.lastName}` : 'Admin')}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap' }}>
                                    <div style={{ color: '#718096', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}><FiDollarSign /> Coût</div>
                                    <div style={{ color: SUCCESS_COLOR, fontWeight: 900 }}>
                                        {item.cost ? `${parseFloat(item.cost).toLocaleString()} XOF` : '---'}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap' }}>
                                    <div style={{ color: '#718096', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>Statut</div>
                                    <div style={{
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 900,
                                        background: item.status === 'completed' ? '#DCFCE7' : '#FEF3C7',
                                        color: item.status === 'completed' ? '#166534' : '#92400E',
                                        textTransform: 'uppercase'
                                    }}>
                                        {item.status === 'completed' ? 'Terminé' : 'En attente'}
                                    </div>
                                </div>

                                {item.description && (
                                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: '10px', fontSize: '14px', color: DARK_TEXT, lineHeight: 1.4, fontWeight: 500 }}>
                                        <FiFileText /> {item.description}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '12px', color: '#A0AEC0' }}>
                            Aucune intervention enregistrée.
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                /*.maintenance-page-wrapper { background-color: ${BG_PAGE}; min-height: 100vh; padding: 20px; font-family: 'Inter', sans-serif; }*/

                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: white;
                    border: 1px solid #E2E8F0;
                    padding: 10px 18px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 500;
                    color: #64748B;
                    transition: 0.2s;
                }
                .back-btn:hover { background: #F8FAFC; border-color: ${SUCCESS_COLOR}; color: ${SUCCESS_COLOR}; }
                .hide-mobile { display: none; }
                @media(min-width:768px){ .hide-mobile { display: inline; } }
            `}</style>
        </div>
    );
}

export default MaintenanceDetailPage;
