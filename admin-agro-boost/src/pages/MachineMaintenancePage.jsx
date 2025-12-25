import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { Link } from 'react-router-dom';
import { 
    FiTool, FiFilter, FiPlusCircle, FiEye, 
    FiCalendar, FiXCircle, FiRefreshCw, FiCheckCircle 
} from 'react-icons/fi';

const PRIMARY_COLOR = '#0070AB';
const SUCCESS_COLOR = '#4CAF50';
const BG_COLOR = '#F7FAFC';

function MachineMaintenancePage() {
    const [maintenances, setMaintenances] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // ÉTATS DES FILTRES
    const [selectedService, setSelectedService] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(""); // Nouveau filtre statut

    const fetchData = async () => {
        setLoading(true);
        try {
            // Charger la liste des services une seule fois
            if (servicesList.length === 0) {
                const servRes = await api.get('/services?limit=100');
                setServicesList(servRes.data?.data || servRes.data || []);
            }

            // Construction des paramètres de requête
            const params = { limit: 50 };
            if (selectedService) params.serviceId = selectedService;
            if (selectedStatus) params.status = selectedStatus; // Ajout du statut aux params

            const maintRes = await api.get('/maintenances', { params });
            const mData = maintRes.data?.data || maintRes.data || [];
            setMaintenances(Array.isArray(mData) ? mData : []);
        } catch (err) {
            console.error("Erreur de chargement:", err);
        } finally {
            setLoading(false);
        }
    };

    // Déclencher la recherche quand l'un des filtres change
    useEffect(() => {
        fetchData();
    }, [selectedService, selectedStatus]);

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const resetFilters = () => {
        setSelectedService("");
        setSelectedStatus("");
    };

    return (
        <div className="maintenance-page">
            <style>{`
                .maintenance-page { padding: clamp(15px, 4vw, 40px); background-color: ${BG_COLOR}; min-height: 100vh; font-family: 'Inter', sans-serif; }
                .header-section { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 35px; }
                .title-container { margin: 0; font-size: clamp(1.2rem, 5vw, 1.5rem); color: ${PRIMARY_COLOR}; display: flex; align-items: center; gap: 15px; }
                
                .filter-bar { 
                    background-color: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.04); 
                    margin-bottom: 25px; display: flex; flex-wrap: wrap; align-items: flex-end; gap: 20px; 
                }
                .filter-group { flex: 1; min-width: 200px; }
                
                .table-wrapper { background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden; }

                @media screen and (max-width: 850px) {
                    .header-section { flex-direction: column; align-items: flex-start; }
                    .btn-create { width: 100%; justify-content: center; }
                    table, thead, tbody, th, td, tr { display: block; }
                    thead tr { position: absolute; top: -9999px; left: -9999px; }
                    tr { border-bottom: 2px solid #EDF2F7; padding: 15px 10px; }
                    td { border: none; position: relative; padding-left: 50% !important; text-align: right !important; margin-bottom: 10px; display: flex; align-items: center; justify-content: flex-end; }
                    td:before { position: absolute; left: 10px; width: 45%; text-align: left; font-weight: 700; color: #718096; font-size: 11px; content: attr(data-label); text-transform: uppercase; }
                    .actions-cell { justify-content: center !important; padding-left: 0 !important; margin-top: 15px; border-top: 1px dashed #E2E8F0; padding-top: 15px !important; }
                }
                .spin { animation: rotate 1s linear infinite; }
                @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>

            <div className="header-section">
                <h1 className="title-container">
                    <FiTool size={28} /> Gestion des <strong>Maintenances</strong>
                </h1>
                <Link to="/services" style={{ textDecoration: 'none' }}>
                    <button style={btnCreateStyle} className="btn-create">
                        <FiPlusCircle /> Programmer une Maintenance
                    </button>
                </Link>
            </div>

            {/* BARRE DE FILTRE MISE À JOUR */}
            <div className="filter-bar">
                {/* Filtre Machine */}
                <div className="filter-group">
                    <label style={labelStyle}><FiFilter size={12} /> Machine / Équipement</label>
                    <select 
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">Toutes les machines</option>
                        {servicesList.map(s => (
                            <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                {/* Filtre Statut */}
                <div className="filter-group">
                    <label style={labelStyle}><FiCheckCircle size={12} /> État / Statut</label>
                    <select 
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">Tous les statuts</option>
                        <option value="pending">⏳ En attente (Pending)</option>
                        <option value="in_progress">⚙️ En cours (In Progress)</option>
                        <option value="completed">✅ Terminé (Completed)</option>
                        <option value="cancelled">❌ Annulé (Cancelled)</option>
                    </select>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    {(selectedService || selectedStatus) && (
                        <button onClick={resetFilters} style={btnResetStyle}>
                            <FiXCircle /> Reset
                        </button>
                    )}
                    <button onClick={fetchData} style={btnRefreshStyle} title="Actualiser">
                        <FiRefreshCw className={loading ? 'spin' : ''} />
                    </button>
                </div>
            </div>

            <div className="table-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={theadStyle}>
                            <th style={thStyle}>Équipement</th>
                            <th style={thStyle}>Début Prévu</th>
                            <th style={thStyle}>Fin Prévue</th>
                            <th style={thStyle}>Statut</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={emptyStateStyle}>Chargement des données...</td></tr>
                        ) : maintenances.length === 0 ? (
                            <tr><td colSpan="5" style={emptyStateStyle}>Aucune maintenance trouvée.</td></tr>
                        ) : maintenances.map(m => (
                            <tr key={m._id} style={trStyle}>
                                <td data-label="Équipement" style={tdStyle}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#1A202C' }}>
                                            {m.service?.name || "Machine non répertoriée"}
                                        </div>
                                        <div style={idSubtitleStyle}>{m.serviceId}</div>
                                    </div>
                                </td>
                                <td data-label="Début Prévu" style={tdStyle}>
                                    <div style={dateBoxStyle}><FiCalendar size={14} /> {formatDateTime(m.startDate)}</div>
                                </td>
                                <td data-label="Fin Prévue" style={tdStyle}>
                                    <div style={dateBoxStyle}><FiCalendar size={14} /> {formatDateTime(m.endDate)}</div>
                                </td>
                                <td data-label="Statut" style={tdStyle}>
                                    <span style={statusBadgeStyle(m.status)}>{m.status.replace('_', ' ')}</span>
                                </td>
                                <td data-label="Actions" className="actions-cell" style={tdStyle}>
                                    <Link to={`/maintenance/${m._id}`} style={{ textDecoration: 'none' }}>
                                        <button style={btnDetailsStyle}>
                                            <FiEye /> Détails
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// STYLES
const labelStyle = { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '800', color: '#718096', marginBottom: '8px', textTransform: 'uppercase' };
const selectStyle = { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', backgroundColor: '#F8FAFC', cursor: 'pointer' };
const theadStyle = { backgroundColor: '#F8FAFC', borderBottom: '2px solid #EDF2F7' };
const thStyle = { padding: '18px', textAlign: 'left', color: '#4A5568', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' };
const trStyle = { borderBottom: '1px solid #F1F5F9' };
const tdStyle = { padding: '18px', fontSize: '14px' };
const idSubtitleStyle = { fontSize: '11px', color: '#A0AEC0', marginTop: '4px', fontFamily: 'monospace' };
const dateBoxStyle = { display: 'flex', alignItems: 'center', gap: '8px', color: '#4A5568' };
const btnCreateStyle = { backgroundColor: SUCCESS_COLOR, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' };
const btnDetailsStyle = { border: `1px solid ${PRIMARY_COLOR}`, background: 'transparent', color: PRIMARY_COLOR, padding: '7px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' };
const btnResetStyle = { backgroundColor: '#FFF5F5', border: '1px solid #FEB2B2', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', color: '#E53E3E', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' };
const btnRefreshStyle = { backgroundColor: 'white', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '8px', cursor: 'pointer', color: PRIMARY_COLOR, display: 'flex', alignItems: 'center' };
const emptyStateStyle = { padding: '80px', textAlign: 'center', color: '#A0AEC0', fontSize: '16px' };

const statusBadgeStyle = (status) => {
    let bg = '#EDF2F7', color = '#4A5568';
    if(status === 'pending') { bg = '#FEF3C7'; color = '#92400E'; }
    else if(status === 'in_progress') { bg = '#DBEAFE'; color = '#1E40AF'; }
    else if(status === 'completed') { bg = '#D1FAE5'; color = '#065F46'; }
    else if(status === 'cancelled') { bg = '#FEE2E2'; color = '#991B1B'; }
    return { backgroundColor: bg, color: color, padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', whiteSpace: 'nowrap' };
};

export default MachineMaintenancePage;