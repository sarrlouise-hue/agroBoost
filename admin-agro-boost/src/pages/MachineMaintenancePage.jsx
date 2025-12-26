import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { Link } from 'react-router-dom';
import { 
    FiTool, FiFilter, FiPlusCircle, FiEye, 
    FiXCircle, FiRefreshCw
} from 'react-icons/fi';

const PRIMARY_COLOR = '#0070AB';
const SUCCESS_COLOR = '#4CAF50';
const BG_COLOR = '#F7FAFC';

function MachineMaintenancePage() {
    const [maintenances, setMaintenances] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedService, setSelectedService] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            if (servicesList.length === 0) {
                const servRes = await api.get('/services?limit=100');
                setServicesList(servRes.data?.data || servRes.data || []);
            }
            const params = { limit: 50 };
            if (selectedService) params.serviceId = selectedService;
            if (selectedStatus) params.status = selectedStatus;

            const maintRes = await api.get('/maintenances', { params });
            const mData = maintRes.data?.data || maintRes.data || [];
            setMaintenances(Array.isArray(mData) ? mData : []);
        } catch (err) {
            console.error("Erreur de chargement:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [selectedService, selectedStatus]);

    const formatDateTime = (dateStr) => {
        if (!dateStr || dateStr === "-") return "-";
        return new Date(dateStr).toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const resetFilters = () => {
        setSelectedService("");
        setSelectedStatus("");
    };

    // Helper pour afficher le label du statut avec icône sans background large
    const renderStatus = (status) => {
        let color = '#4A5568';
        let label = status || 'N/A';
        if(status?.toLowerCase() === 'pending') { color = '#D97706'; label = "⏳ En attente"; }
        else if(status?.toLowerCase() === 'in_progress') { color = '#2563EB'; label = "⚙️ En cours"; }
        else if(status?.toLowerCase() === 'completed') { color = '#059669'; label = "✅ Terminé"; }
        else if(status?.toLowerCase() === 'cancelled') { color = '#DC2626'; label = "❌ Annulé"; }
        
        return <span style={{ color, fontWeight: '700', fontSize: '13px' }}>{label}</span>;
    };

    return (
        <div className="maintenance-page">
            <style>{`
                .maintenance-page { 
                    padding: 20px; 
                    background-color: ${BG_COLOR}; 
                    min-height: 100vh; 
                    font-family: 'Inter', sans-serif;
                }
                .header-section { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 25px; 
                }
                .filter-bar { 
                    background: white; 
                    padding: 15px; 
                    border-radius: 12px; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05); 
                    margin-bottom: 20px; 
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    align-items: flex-end;
                }
                .table-wrapper { 
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                table { width: 100%; border-collapse: collapse; }
                
                @media screen and (max-width: 768px) {
                    .header-section { flex-direction: column; gap: 15px; }
                    thead { display: none; }
                    tr { display: block; border-bottom: 8px solid ${BG_COLOR}; padding: 15px; }
                    td { 
                        display: flex; 
                        justify-content: space-between; 
                        padding: 8px 0; 
                        border: none !important;
                    }
                    td:before { content: attr(data-label); font-weight: bold; color: #718096; }
                    .btn-details { width: 100%; justify-content: center; margin-top: 10px; }
                }

                .spin { animation: rotate 1s linear infinite; }
                @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>

            <div className="header-section">
                <h1 style={{ margin: 0, color: PRIMARY_COLOR, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiTool /> Gestion Maintenances
                </h1>
                <Link to="/services" style={{ textDecoration: 'none' }}>
                    <button style={btnCreateStyle}>
                        <FiPlusCircle /> Programmer une maintenance
                    </button>
                </Link>
            </div>

            <div className="filter-bar">
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={labelStyle}>Filtrer par Équipement</label>
                    <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} style={selectStyle}>
                        <option value="">Toutes les machines</option>
                        {servicesList.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>)}
                    </select>
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={labelStyle}>Filtrer par Statut</label>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={selectStyle}>
                        <option value="">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="in_progress">En cours</option>
                        <option value="completed">Terminé</option>
                        <option value="cancelled">Annulé</option>
                    </select>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={fetchData} style={btnRefreshStyle}>
                        <FiRefreshCw className={loading ? 'spin' : ''} />
                    </button>
                    {(selectedService || selectedStatus) && (
                        <button onClick={resetFilters} style={btnResetStyle}><FiXCircle /> Reset</button>
                    )}
                </div>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr style={theadStyle}>
                            <th style={thStyle}>Équipement</th>
                            <th style={thStyle}>Date de début</th>
                            <th style={thStyle}>Date de fin</th>
                            <th style={thStyle}>Statut</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && maintenances.map(m => (
                            <tr key={m._id || m.id} style={trStyle}>
                                <td data-label="Équipement" style={{ ...tdStyle, fontWeight: 'bold', color: '#1A202C' }}>
                                    {m.service?.name || "N/A"}
                                </td>
                                <td data-label="Date de début" style={tdStyle}>
                                    {formatDateTime(m.startDate)}
                                </td>
                                <td data-label="Date de fin" style={tdStyle}>
                                    {formatDateTime(m.endDate)}
                                </td>
                                <td data-label="Statut" style={tdStyle}>
                                    {renderStatus(m.status)}
                                </td>
                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                    <Link to={`/maintenance/${m.serviceId || m.service?._id}`} style={{ textDecoration: 'none' }}>
                                        <button style={btnDetailsStyle} className="btn-details">
                                            <FiEye /> Voir Détails
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && <div style={emptyStateStyle}>Chargement...</div>}
                {!loading && maintenances.length === 0 && <div style={emptyStateStyle}>Aucune maintenance trouvée.</div>}
            </div>
        </div>
    );
}

// Styles
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4A5568', marginBottom: '5px' };
const selectStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' };
const theadStyle = { backgroundColor: '#EDF2F7' };
const thStyle = { padding: '15px', textAlign: 'left', fontSize: '13px', color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.05em' };
const trStyle = { borderBottom: '1px solid #F1F5F9' };
const tdStyle = { padding: '15px', fontSize: '14px', color: '#4A5568' };
const btnCreateStyle = { backgroundColor: SUCCESS_COLOR, color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' };
const btnDetailsStyle = { border: `1px solid ${PRIMARY_COLOR}`, background: 'white', color: PRIMARY_COLOR, padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' };
const btnResetStyle = { backgroundColor: '#FED7D7', color: '#C53030', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const btnRefreshStyle = { background: 'white', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '8px', cursor: 'pointer', color: PRIMARY_COLOR };
const emptyStateStyle = { padding: '40px', textAlign: 'center', color: '#A0AEC0', fontWeight: 'bold' };

export default MachineMaintenancePage;