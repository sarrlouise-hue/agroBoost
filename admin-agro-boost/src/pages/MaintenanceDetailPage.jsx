import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; 
import { FiArrowLeft, FiTool, FiPlusCircle, FiCalendar, FiHash } from 'react-icons/fi';

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
                //récupèrer l'historique par rapport à l'ID du service passé dans l'URL
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

    return (
        <div style={containerStyle}>
            {/* BOUTON RETOUR*/}
            <button 
                onClick={() => navigate('/maintenance')} 
                style={btnBackStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#EDF2F7'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <FiArrowLeft /> Retour à la gestion
            </button>

            <div style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={iconBoxStyle}><FiTool size={24} /></div>
                    <div>
                        <h1 style={titleStyle}>Historique de Maintenance</h1>
                        <p style={subtitleStyle}>
                            <FiHash size={12} /> ID Équipement : 
                            <span style={{ fontWeight: 'bold', marginLeft: '5px', color: '#2D3748' }}>
                                {id || "Non spécifié"}
                            </span>
                        </p>
                    </div>
                </div>

                <Link to={`/maintenance/record/${id}`} style={{ textDecoration: 'none' }}>
                    <button style={btnActionStyle}>
                        <FiPlusCircle /> Enregistrer une Intervention
                    </button>
                </Link>
            </div>

            <div style={tableContainerStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={theadStyle}>
                        <tr>
                            <th style={thStyle}>Date</th>
                            <th style={thStyle}>Type</th>
                            <th style={thStyle}>Technicien</th>
                            <th style={thStyle}>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={emptyStyle}>Chargement des données...</td></tr>
                        ) : history.length > 0 ? history.map(item => (
                            <tr key={item._id} style={trStyle}>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FiCalendar size={14} color="#A0AEC0" />
                                        {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                                    </div>
                                </td>
                                <td style={{ ...tdStyle, fontWeight: 'bold' }}>
                                    <span style={typeBadgeStyle}>{item.type || 'Intervention'}</span>
                                </td>
                                <td style={tdStyle}>{item.mechanic?.name || item.mechanicId || 'Admin'}</td>
                                <td style={{ ...tdStyle, color: '#4A5568', lineHeight: '1.4' }}>{item.description}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" style={emptyStyle}>Aucun historique enregistré pour cet équipement.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// STYLES 

const containerStyle = { 
    padding: '40px', 
    maxWidth: '1200px', 
    margin: '0 auto', 
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#F7FAFC',
    minHeight: '100vh'
};

const iconBoxStyle = {
    backgroundColor: 'white',
    padding: '12px',
    borderRadius: '12px',
    color: PRIMARY_COLOR,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const headerStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: '35px' 
};

const titleStyle = { 
    color: '#1A202C', 
    fontSize: '22px', 
    margin: 0,
    fontWeight: '700' 
};

const subtitleStyle = { 
    color: '#718096', 
    fontSize: '13px', 
    margin: '5px 0 0 0',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
};

const btnBackStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    border: '1px solid #E2E8F0', 
    backgroundColor: 'transparent', 
    color: '#4A5568', 
    cursor: 'pointer', 
    marginBottom: '25px', 
    fontWeight: '600',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s',
    fontSize: '14px'
};

const btnActionStyle = { 
    padding: '12px 24px', 
    backgroundColor: SUCCESS_COLOR, 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: '700', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px',
    boxShadow: '0 4px 6px rgba(76, 175, 80, 0.2)',
    fontSize: '14px'
};

const tableContainerStyle = { 
    backgroundColor: 'white', 
    borderRadius: '16px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)', 
    overflow: 'hidden',
    border: '1px solid #E2E8F0'
};

const theadStyle = { 
    backgroundColor: '#F8FAFC', 
    borderBottom: '2px solid #EDF2F7' 
};

const thStyle = { 
    padding: '18px', 
    textAlign: 'left', 
    color: '#718096', 
    fontSize: '11px', 
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '700'
};

const tdStyle = { 
    padding: '18px', 
    fontSize: '14px', 
    color: '#2D3748',
    verticalAlign: 'middle'
};

const trStyle = { 
    borderBottom: '1px solid #F1F5F9' 
};

const typeBadgeStyle = {
    backgroundColor: '#EBF8FF',
    color: '#2B6CB0',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px'
};

const emptyStyle = { 
    padding: '60px', 
    textAlign: 'center', 
    color: '#A0AEC0',
    fontSize: '15px'
};

export default MaintenanceDetailPage;