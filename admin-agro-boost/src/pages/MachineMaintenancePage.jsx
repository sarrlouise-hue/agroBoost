import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { Link } from 'react-router-dom';
import { 
    FiTool, FiFilter, FiPlusCircle, FiEye, 
    FiCalendar, FiXCircle, FiRefreshCw 
} from 'react-icons/fi';

const PRIMARY_COLOR = '#0070AB';
const SUCCESS_COLOR = '#4CAF50';
const BG_COLOR = '#F7FAFC';

function MachineMaintenancePage() {
    const [maintenances, setMaintenances] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Chargement des machines pour le filtre
            if (servicesList.length === 0) {
                const servRes = await api.get('/services?limit=100');
                setServicesList(servRes.data?.data || servRes.data || []);
            }

            // 2. Chargement des maintenances
            const params = { limit: 50 };
            if (selectedService) params.serviceId = selectedService;

            const maintRes = await api.get('/maintenances', { params });
            const mData = maintRes.data?.data || maintRes.data || [];
            setMaintenances(Array.isArray(mData) ? mData : []);
        } catch (err) {
            console.error("Erreur de chargement:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedService]);

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div style={containerStyle}>
            {/* ENTÊTE */}
            <div style={headerStyle}>
                <h1 style={titleStyle}>
                    <FiTool size={28} /> Gestion des <strong>Maintenances</strong>
                </h1>
                <Link to="/services" style={{ textDecoration: 'none' }}>
                    <button style={btnCreateStyle}>
                        <FiPlusCircle /> Programmer une Maintenance
                    </button>
                </Link>
            </div>

            {/* BARRE DE FILTRE */}
            <div style={filterBarStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <FiFilter color={PRIMARY_COLOR} />
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Filtrer par Équipement / Machine</label>
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
                </div>
                
                {selectedService && (
                    <button onClick={() => setSelectedService("")} style={btnResetStyle}>
                        <FiXCircle /> Effacer le filtre
                    </button>
                )}

                <button onClick={fetchData} style={btnRefreshStyle} title="Actualiser">
                    <FiRefreshCw className={loading ? 'spin' : ''} />
                </button>
            </div>

            {/* TABLEAU */}
            <div style={tableContainerStyle}>
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
                            <tr>
                                <td colSpan="5" style={emptyStateStyle}>
                                    Aucune maintenance enregistrée.
                                </td>
                            </tr>
                        ) : maintenances.map(m => (
                            <tr key={m._id} style={trStyle}>
                                <td style={tdStyle}>
                                    <span style={{ fontWeight: '600', color: '#1A202C' }}>
                                        {m.service?.name || "Machine non répertoriée"}
                                    </span>
                                    <div style={idSubtitleStyle}>{m.serviceId}</div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={dateBoxStyle}><FiCalendar size={14} /> {formatDateTime(m.startDate)}</div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={dateBoxStyle}><FiCalendar size={14} /> {formatDateTime(m.endDate)}</div>
                                </td>
                                <td style={tdStyle}>
                                    <span style={statusBadgeStyle(m.status)}>{m.status}</span>
                                </td>
                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                    {/*maintenance au singulier et serviceId pour l'historique */}
                                    <Link 
                                        to={`/maintenance/${m.serviceId || m.service?._id}`} 
                                        style={{ textDecoration: 'none' }}
                                    >
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

            <style>{`
                .spin { animation: rotate 1s linear infinite; }
                @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

// Styles
const containerStyle = { padding: '40px', backgroundColor: BG_COLOR, minHeight: '100vh', fontFamily: "'Inter', sans-serif" };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' };
const titleStyle = { margin: 0, fontSize: '24px', color: PRIMARY_COLOR, display: 'flex', alignItems: 'center', gap: '15px' };
const filterBarStyle = { backgroundColor: 'white', padding: '18px 24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '25px', display: 'flex', alignItems: 'flex-end', gap: '20px' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '700', color: '#718096', marginBottom: '6px' };
const selectStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px' };
const tableContainerStyle = { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' };
const theadStyle = { backgroundColor: '#F8FAFC', borderBottom: '2px solid #EDF2F7' };
const thStyle = { padding: '18px', textAlign: 'left', color: '#4A5568', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' };
const trStyle = { borderBottom: '1px solid #F1F5F9' };
const tdStyle = { padding: '18px', fontSize: '14px' };
const idSubtitleStyle = { fontSize: '11px', color: '#A0AEC0', marginTop: '4px', fontFamily: 'monospace' };
const dateBoxStyle = { display: 'flex', alignItems: 'center', gap: '8px', color: '#4A5568' };
const btnCreateStyle = { backgroundColor: SUCCESS_COLOR, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' };
const btnDetailsStyle = { border: `1px solid ${PRIMARY_COLOR}`, background: 'transparent', color: PRIMARY_COLOR, padding: '7px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' };
const btnResetStyle = { backgroundColor: '#EDF2F7', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', color: '#4A5568' };
const btnRefreshStyle = { backgroundColor: 'white', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '8px', cursor: 'pointer', color: PRIMARY_COLOR };
const emptyStateStyle = { padding: '60px', textAlign: 'center', color: '#A0AEC0' };

const statusBadgeStyle = (status) => {
    let bg = '#EDF2F7', color = '#4A5568';
    if(status === 'pending') { bg = '#FFF3E0'; color = '#C05621'; }
    else if(status === 'in_progress') { bg = '#E3F2FD'; color = '#2B6CB0'; }
    else if(status === 'completed') { bg = '#F0FFF4'; color = '#2F855A'; }
    return { backgroundColor: bg, color: color, padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' };
};

export default MachineMaintenancePage;