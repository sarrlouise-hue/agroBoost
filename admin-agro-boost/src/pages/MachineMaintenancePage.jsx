import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; 
import { 
    FiTool, FiPlusCircle, FiEye, 
    FiRefreshCw, FiCalendar, FiSettings
} from 'react-icons/fi';
import { FaFilter, FaSync } from "react-icons/fa";

// Thème Agricole
const PRIMARY_COLOR = '#3A7C35';
const SECONDARY_COLOR = '#709D54';
const BACKGROUND_COLOR = '#FDFAF8'; 

const getStatusBadgeStyle = (status) => {
    const s = status?.toLowerCase();
    let config = { color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0' }; 

    if (s === 'completed') {
        config = { color: '#3A7C35', bg: '#E6FFFA', border: '#3A7C35' };
    } else if (s === 'cancelled') {
        config = { color: '#E53E3E', bg: '#FFF5F5', border: '#FEB2B2' };
    } else if (s === 'pending') {
        config = { color: '#9A3412', bg: '#FFFBEB', border: '#FEF3C7' };
    } else if (s === 'in_progress') {
        config = { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' };
    }

    return {
        display: 'inline-block',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
    };
};

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
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    return (
        <div className="page-wrapper">
            <style>{`
                .page-wrapper { 
                    background-color: ${BACKGROUND_COLOR}; 
                    min-height: 100vh; 
                    padding: 30px; 
                    width: 100%; 
                    box-sizing: border-box;
                    font-family: 'Inter', sans-serif;
                }
                .container-card {
                    background-color: white; 
                    border-radius: 16px; 
                    padding: 30px; 
                    box-shadow: 0 4px 25px rgba(0,0,0,0.04); 
                    width: 100%;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin-bottom: 30px;
                }
                .filters-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
                    gap: 20px; 
                    margin-bottom: 25px;
                    background: #F8FAFC;
                    padding: 20px;
                    border-radius: 12px;
                }
                
                table { 
                    width: 100%; 
                    border-collapse: separate; 
                    border-spacing: 0 12px; 
                }
                .th-style { 
                    padding: 10px 20px; 
                    color: #64748B; 
                    font-size: 11px; 
                    font-weight: 700; 
                    text-transform: uppercase; 
                    text-align: left;
                }
                .table-row { 
                    background: white;
                    transition: all 0.2s; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .table-row td {
                    padding: 20px; 
                    border-top: 1px solid #F1F5F9;
                    border-bottom: 1px solid #F1F5F9;
                }
                .table-row td:first-child {
                    border-left: 1px solid #F1F5F9;
                    border-top-left-radius: 12px;
                    border-bottom-left-radius: 12px;
                }
                .table-row td:last-child {
                    border-right: 1px solid #F1F5F9;
                    border-top-right-radius: 12px;
                    border-bottom-right-radius: 12px;
                }
                .table-row:hover { 
                    background: #F8FAFC; 
                    transform: scale(1.002);
                }

                .action-btn { 
                    width: 38px; height: 38px; border-radius: 10px; border: none; cursor: pointer; 
                    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
                    background: #EBF8FF; color: #3182CE; text-decoration: none;
                }
                .action-btn:hover { background: #BEE3F8; }

                .btn-add { 
                    background-color: ${PRIMARY_COLOR}; 
                    color: white; border: none; 
                    padding: 12px 24px; border-radius: 12px; 
                    font-weight: 700; cursor: pointer; 
                    display: flex; align-items: center; gap: 8px;
                    transition: all 0.2s;
                }

                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media (max-width: 900px) {
                    .page-wrapper { padding: 0; }
                    .container-card { padding: 15px; border-radius: 0; }
                    table, thead, tbody, th, td, tr { display: block; width: 100%; }
                    thead { display: none; }
                    tr {
                        margin-bottom: 20px;
                        border: 1px solid #E2E8F0 !important;
                        border-radius: 15px !important;
                        padding: 15px;
                        background: #fff;
                        box-sizing: border-box;
                    }
                    .table-row td {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px 5px !important;
                        border: none !important;
                        font-size: 14px;
                    }
                    .table-row td:not(:last-child) { border-bottom: 1px solid #F1F5F9 !important; }
                    .table-row td:before {
                        content: attr(data-label);
                        font-weight: 800;
                        color: #94A3B8;
                        font-size: 10px;
                    }
                }
            `}</style>

            <div className="container-card">
                <div className="header-flex">
                    <h1 style={{ color: PRIMARY_COLOR, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontSize: '24px' }}>
                        <FiTool /> Gestion Maintenances
                    </h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={fetchData} className="btn-add" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
                            <FaSync className={loading ? 'spin' : ''} />
                        </button>
                        <Link to="/services" style={{ textDecoration: 'none' }}>
                            <button className="btn-add">
                                <FiPlusCircle size={20} /> Programmer
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="filters-grid">
                    <div>
                        <label style={labelStyle}><FiSettings /> Équipement</label>
                        <select style={selectStyle} value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                            <option value="">Toutes les machines</option>
                            {servicesList.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}><FaFilter /> Statut</label>
                        <select style={selectStyle} value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                            <option value="">Tous les statuts</option>
                            <option value="pending">⏳ En attente</option>
                            <option value="in_progress">⚙️ En cours</option>
                            <option value="completed">✅ Terminé</option>
                            <option value="cancelled">❌ Annulé</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: PRIMARY_COLOR }}>
                         <FaSync className="spin" size={30} /> <br/><br/> Chargement...
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th className="th-style">Équipement</th>
                                    <th className="th-style">Date Début</th>
                                    <th className="th-style">Date Fin</th>
                                    <th className="th-style">Statut</th>
                                    <th className="th-style" style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {maintenances.map(m => (
                                    <tr key={m._id || m.id} className="table-row">
                                        <td data-label="ÉQUIPEMENT">
                                            <div style={{ fontWeight: '800', color: PRIMARY_COLOR, fontSize: '15px' }}>
                                                {m.service?.name || "N/A"}
                                            </div>
                                        </td>
                                        <td data-label="DATE DÉBUT" style={{ color: '#475569', fontWeight: '500' }}>
                                            <FiCalendar style={{ marginRight: '5px' }} /> {formatDateTime(m.startDate)}
                                        </td>
                                        <td data-label="DATE FIN" style={{ color: '#475569' }}>
                                            {formatDateTime(m.endDate)}
                                        </td>
                                        <td data-label="STATUT">
                                            <span style={getStatusBadgeStyle(m.status)}>{m.status || 'pending'}</span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Link title="Voir Détails" className="action-btn" to={`/maintenance/${m.serviceId || m.service?._id}`}>
                                                    <FiEye />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {maintenances.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8', fontSize: '14px' }}>
                                Aucune maintenance trouvée.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const labelStyle = { 
    fontSize: '11px', fontWeight: '800', marginBottom: '10px', display: 'flex', 
    alignItems: 'center', gap: '6px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px'
};

const selectStyle = { 
    width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', 
    backgroundColor: 'white', outline: 'none', fontSize: '14px', color: '#334155',
    boxSizing: 'border-box'
};

export default MachineMaintenancePage;