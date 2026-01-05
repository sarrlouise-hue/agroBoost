import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { Link } from 'react-router-dom';
import { 
  FaClipboardList, FaSearch, FaEye, FaTrash, 
  FaCheckCircle, FaTimesCircle, FaFlag, FaSync,
  FaUser, FaBriefcase, FaFilter
} from "react-icons/fa";

const PRIMARY_COLOR = '#3A7C35';
const SECONDARY_COLOR = '#709D54';
const BACKGROUND_COLOR = '#FDFAF8'; 

const getStatusBadgeStyle = (status) => {
    const s = status?.toLowerCase();
    let config = { color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0' }; 

    if (s === 'confirmed' || s === 'completed') {
        config = { color: '#3A7C35', bg: '#E6FFFA', border: '#3A7C35' };
    } else if (s === 'cancelled') {
        config = { color: '#E53E3E', bg: '#FFF5F5', border: '#FEB2B2' };
    } else if (s === 'pending') {
        config = { color: '#9A3412', bg: '#FFFBEB', border: '#FEF3C7' };
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

function ReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [providersList, setProvidersList] = useState([]);
    const [usersList, setUsersList] = useState([]); 
    const [loading, setLoading] = useState(true);

    const [filterStatus, setFilterStatus] = useState('ALL'); 
    const [serviceFilter, setServiceFilter] = useState('');
    const [providerFilter, setProviderFilter] = useState('');
    const [userFilter, setUserFilter] = useState(''); 

    useEffect(() => {
        const fetchRefs = async () => {
            try {
                const [srv, prov, usr] = await Promise.all([
                    api.get('/services?limit=100'),
                    api.get('/users?role=provider&limit=1000'),
                    api.get('/users?role=user&limit=1000')
                ]);
                setServicesList(srv.data.data || []);
                setProvidersList(prov.data.data || []);
                setUsersList(usr.data.data || []);
            } catch (err) { console.error("Erreur refs", err); }
        };
        fetchRefs();
    }, []);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const params = { 
                ...(filterStatus !== 'ALL' && { status: filterStatus.toLowerCase() }),
                ...(serviceFilter && { serviceId: serviceFilter }),
                ...(providerFilter && { providerId: providerFilter }),
                ...(userFilter && { userId: userFilter })
            };
            const res = await api.get('/bookings', { params });
            const data = res.data.data || res.data;
            setReservations(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Erreur chargement", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReservations(); }, [filterStatus, serviceFilter, providerFilter, userFilter]);

    const handleAdminAction = async (id, action) => {
        if (window.confirm(`Voulez-vous vraiment ${action} cette réservation ?`)) {
            try {
                await api.put(`/admin/bookings/${id}/${action}`);
                fetchReservations();
            } catch (err) {
                alert(err.response?.data?.message || "Erreur lors de l'opération");
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer définitivement cette réservation ?")) {
            try {
                await api.delete(`/bookings/${id}`);
                setReservations(prev => prev.filter(item => (item._id || item.id) !== id));
            } catch (err) {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    const getServiceName = id => servicesList.find(s => (s._id || s.id) === id)?.name || 'Service';
    const getProviderName = id => {
        const p = providersList.find(p => (p._id || p.id) === id);
        return p ? (p.businessName || `${p.firstName} ${p.lastName}`) : '—';
    };
    const getUserName = id => {
        const u = usersList.find(u => (u._id || u.id) === id);
        return u ? `${u.firstName} ${u.lastName}` : '—';
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
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
                    gap: 20px; 
                    margin-bottom: 25px;
                    background: #F8FAFC;
                    padding: 20px;
                    border-radius: 12px;
                }
                .status-buttons {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin-bottom: 25px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #F1F5F9;
                }
                .btn-filter {
                    padding: 10px 18px;
                    border-radius: 10px;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 13px;
                    transition: all 0.2s;
                }
                
                /* TABLE SPACING LOGIC */
                table { 
                    width: 100%; 
                    border-collapse: separate; 
                    border-spacing: 0 12px; /* Créé l'espace entre les lignes */
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
                    padding: 20px; /* Augmente l'espace interne des cellules */
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

                .action-group { display: flex; gap: 8px; justify-content: flex-end; }
                .action-btn { 
                    width: 38px; height: 38px; border-radius: 10px; border: none; cursor: pointer; 
                    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
                }
                .action-btn.view { background: #EBF8FF; color: #3182CE; }
                .action-btn.confirm { background: #E6FFFA; color: #3A7C35; }
                .action-btn.cancel { background: #FFF5F5; color: #E53E3E; }
                .action-btn.complete { background: #FAF5FF; color: #805AD5; }
                .action-btn.delete { background: #F1F5F9; color: #64748B; }

                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                /* FULL SCREEN MOBILE OPTIMIZATION */
                @media (max-width: 900px) {
                    .page-wrapper { padding: 0; } /* Supprime l'espace autour sur mobile */
                    .container-card { 
                        padding: 15px; 
                        border-radius: 0; /* Prend tout l'espace */
                        box-shadow: none; 
                    }
                    .header-flex { padding: 10px; }
                    
                    table, thead, tbody, th, td, tr { display: block; width: 100%; }
                    thead { display: none; }
                    tr {
                        margin-bottom: 20px;
                        border: 1px solid #E2E8F0 !important;
                        border-radius: 15px !important;
                        padding: 15px;
                        background: #fff;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
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
                    .action-group { justify-content: center; width: 100%; margin-top: 15px; gap: 12px; }
                    .action-btn { width: 45px; height: 45px; } /* Boutons plus gros pour le tactile */
                }
            `}</style>

            <div className="container-card">
                <div className="header-flex">
                    <h1 style={{ color: PRIMARY_COLOR, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                        <FaClipboardList /> Gestion des Réservations
                    </h1>
                    <button onClick={fetchReservations} style={{ 
                        backgroundColor: SECONDARY_COLOR, color: 'white', padding: '12px 24px', 
                        borderRadius: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600'
                    }}>
                        <FaSync className={loading ? 'spin' : ''} /> Actualiser
                    </button>
                </div>

                <div className="filters-grid">
                    <div>
                        <label style={labelStyle}><FaUser /> Client</label>
                        <select style={selectStyle} value={userFilter} onChange={e => setUserFilter(e.target.value)}>
                            <option value="">Tous les clients</option>
                            {usersList.map(u => <option key={u._id || u.id} value={u._id || u.id}>{u.firstName} {u.lastName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}><FaBriefcase /> Prestataire</label>
                        <select style={selectStyle} value={providerFilter} onChange={e => setProviderFilter(e.target.value)}>
                            <option value="">Tous les prestataires</option>
                            {providersList.map(p => <option key={p._id || p.id} value={p._id || p.id}>{p.businessName || p.firstName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}><FaFilter /> Service</label>
                        <select style={selectStyle} value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}>
                            <option value="">Tous les services</option>
                            {servicesList.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="status-buttons">
                    {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
                        <button 
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className="btn-filter"
                            style={{
                                backgroundColor: filterStatus === s ? PRIMARY_COLOR : '#F1F5F9',
                                color: filterStatus === s ? 'white' : '#64748B'
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: PRIMARY_COLOR }}>
                         <FaSync className="spin" size={30} /> <br/><br/> Chargement des données...
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th className="th-style">Service / Date</th>
                                    <th className="th-style">Client</th>
                                    <th className="th-style">Prestataire</th>
                                    <th className="th-style">Montant</th>
                                    <th className="th-style">Statut</th>
                                    <th className="th-style" style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map(res => (
                                    <tr key={res._id || res.id} className="table-row">
                                        <td data-label="SERVICE">
                                            <div style={{ fontWeight: '800', color: PRIMARY_COLOR, fontSize: '15px' }}>{getServiceName(res.serviceId)}</div>
                                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{new Date(res.bookingDate).toLocaleDateString('fr-FR')}</div>
                                        </td>
                                        <td data-label="CLIENT" style={{ color: '#475569', fontWeight: '500' }}>{getUserName(res.userId)}</td>
                                        <td data-label="PRESTATAIRE" style={{ color: '#475569' }}>{getProviderName(res.providerId)}</td>
                                        <td data-label="MONTANT" style={{ fontWeight: '800', color: '#1E293B' }}>{res.totalPrice?.toLocaleString()} F</td>
                                        <td data-label="STATUT">
                                            <span style={getStatusBadgeStyle(res.status)}>{res.status}</span>
                                        </td>
                                        <td className="actions-cell">
                                            <div className="action-group">
                                                <Link to={`/reservations/${res._id || res.id}`}>
                                                    <button className="action-btn view" title="Détails"><FaEye /></button>
                                                </Link>
                                                {res.status === 'pending' && (
                                                    <button onClick={() => handleAdminAction(res._id || res.id, 'confirm')} className="action-btn confirm" title="Confirmer"><FaCheckCircle /></button>
                                                )}
                                                {res.status === 'confirmed' && (
                                                    <button onClick={() => handleAdminAction(res._id || res.id, 'complete')} className="action-btn complete" title="Terminer"><FaFlag /></button>
                                                )}
                                                {(res.status === 'pending' || res.status === 'confirmed') && (
                                                    <button onClick={() => handleAdminAction(res._id || res.id, 'cancel')} className="action-btn cancel" title="Annuler"><FaTimesCircle /></button>
                                                )}
                                                <button onClick={() => handleDelete(res._id || res.id)} className="action-btn delete" title="Supprimer"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {reservations.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8', fontSize: '14px' }}>Aucune réservation ne correspond à vos critères.</div>
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
    boxSizing: 'border-box', transition: 'border 0.2s'
};

export default ReservationsPage;