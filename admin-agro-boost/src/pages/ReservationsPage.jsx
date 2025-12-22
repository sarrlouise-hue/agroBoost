import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { Link } from 'react-router-dom';
import { 
    FiEye, FiXCircle, FiClipboard, FiRefreshCcw, 
    FiFilter, FiSettings, FiCheck, FiUsers, FiTrash2 
} from 'react-icons/fi';

// CONFIGURATION DES COULEURS
const PRIMARY_COLOR = '#0070AB'; 
const SUCCESS_COLOR = '#4CAF50';
const WARNING_COLOR = '#FF9800'; 
const DANGER_COLOR = '#F44336';  
const INFO_COLOR = '#2196F3';

const selectStyle = {
    padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E0',
    backgroundColor: 'white', fontSize: '14px', outline: 'none',
    minWidth: '180px', cursor: 'pointer'
};

const labelStyle = {
    fontSize: '12px', fontWeight: '700', color: '#4A5568',
    marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px'
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
    
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const LIMIT = 10;

    // 1. Chargement des données de référence
    useEffect(() => {
        const fetchReferenceData = async () => {
            try {
                const [srvRes, provRes, userRes] = await Promise.all([
                    api.get('/services?limit=100'),
                    api.get('/users?role=provider&limit=1000'),
                    api.get('/users?role=user&limit=1000') 
                ]);
                setServicesList(srvRes.data.data || srvRes.data || []);
                setProvidersList(provRes.data.data || provRes.data || []);
                setUsersList(userRes.data.data || userRes.data || []);
            } catch (err) {
                console.error("Erreur référentiel:", err);
            }
        };
        fetchReferenceData();
    }, []);

    // 2. Chargement des réservations
    const fetchReservations = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: LIMIT,
                status: filterStatus !== 'ALL' ? filterStatus.toLowerCase() : undefined,
                serviceId: serviceFilter || undefined,
                providerId: providerFilter || undefined,
                userId: userFilter || undefined 
            };
            const response = await api.get('/bookings', { params });
            if (response.data.success) {
                setReservations(response.data.data || []);
                setPagination(response.data.pagination || { page: 1, totalPages: 1, total: 0 });
            }
        } catch (err) {
            console.error("Erreur chargement:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [filterStatus, serviceFilter, providerFilter, userFilter, currentPage]);

    // LOGIQUE DE TRAITEMENT DES NOMS
    const getServiceName = (id) => servicesList.find(s => (s._id || s.id) === id)?.name || 'Service...';
    
    const getProviderName = (id) => {
        const p = providersList.find(p => (p._id || p.id) === id);
        return p ? (p.businessName || `${p.firstName} ${p.lastName}`) : <span style={{color:'#A0AEC0'}}>Non assigné</span>;
    };

    const getUserName = (id) => {
        const u = usersList.find(u => (u._id || u.id) === id);
        return u ? `${u.firstName} ${u.lastName}` : `ID: ...${id?.slice(-5)}`;
    };

    const handleAction = async (id, action) => {
        const messages = {
            confirm: "Confirmer cette réservation ?",
            complete: "Marquer comme terminée ?",
            cancel: "Annuler cette réservation ?",
            delete: "SUPPRIMER définitivement cette réservation ?"
        };

        if (!window.confirm(messages[action])) return;

        try {
            if (action === 'delete') {
                await api.delete(`/bookings/${id}`);
            } else {
                await api.put(`/bookings/${id}/${action}`);
            }
            alert("Action effectuée !");
            fetchReservations();
        } catch (err) {
            alert(`Erreur: ${err.response?.data?.message || "Action impossible"}`);
        }
    };

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        const colors = {
            confirmed: { c: INFO_COLOR, bg: '#E3F2FD' },
            completed: { c: SUCCESS_COLOR, bg: '#E8F5E9' },
            cancelled: { c: DANGER_COLOR, bg: '#FFEBEE' },
            pending: { c: WARNING_COLOR, bg: '#FFF3E0' }
        };
        const style = colors[s] || colors.pending;
        return {
            color: style.c, backgroundColor: style.bg, padding: '5px 12px', borderRadius: '20px', 
            fontSize: '11px', fontWeight: '700', textTransform: 'uppercase'
        };
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#F7FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px', color: PRIMARY_COLOR, marginBottom: '30px' }}>
                <FiClipboard size={32} /> 
                <span>Gestion des <strong>Réservations</strong></span>
            </h1>

            {/* BARRE DE FILTRES */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '25px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-end' }}>
                <div style={{ flex: '1 1 100%' }}>
                    <label style={labelStyle}><FiSettings /> Filtrer par Statut</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
                            <button key={s} onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
                                style={{
                                    padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                                    fontWeight: '600', fontSize: '12px',
                                    backgroundColor: filterStatus === s ? PRIMARY_COLOR : '#EDF2F7',
                                    color: filterStatus === s ? 'white' : '#4A5568'
                                }}>{s === 'ALL' ? 'Tous' : s}</button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={labelStyle}><FiUsers /> Client</label>
                    <select value={userFilter} onChange={(e) => { setUserFilter(e.target.value); setCurrentPage(1); }} style={selectStyle}>
                        <option value="">Tous les clients</option>
                        {usersList.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
                    </select>
                </div>

                <div>
                    <label style={labelStyle}><FiFilter /> Service</label>
                    <select value={serviceFilter} onChange={(e) => { setServiceFilter(e.target.value); setCurrentPage(1); }} style={selectStyle}>
                        <option value="">Tous les services</option>
                        {servicesList.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                </div>
            </div>

            {/* TABLEAU */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                        <tr>
                            <th style={thStyle}>SERVICE</th>
                            <th style={thStyle}>CLIENT</th>
                            <th style={thStyle}>PRESTATAIRE</th>
                            <th style={thStyle}>DATE</th>
                            <th style={{ ...thStyle, textAlign: 'right' }}>MONTANT</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>STATUT</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ padding: '60px', textAlign: 'center' }}><FiRefreshCcw className="spin-icon" /></td></tr>
                        ) : reservations.map((res, idx) => (
                            <tr key={res._id || res.id} style={{ borderBottom: '1px solid #EDF2F7', backgroundColor: idx % 2 === 0 ? 'white' : '#FAFBFC' }}>
                                <td style={tdStyle}><strong>{getServiceName(res.serviceId)}</strong></td>
                                <td style={tdStyle}>{getUserName(res.userId)}</td>
                                <td style={tdStyle}>{getProviderName(res.providerId)}</td>
                                <td style={tdStyle}>{new Date(res.bookingDate).toLocaleDateString('fr-FR')}</td>
                                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '700', color: PRIMARY_COLOR }}>{res.totalPrice?.toLocaleString()} XOF</td>
                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                    <span style={getStatusStyle(res.status)}>{res.status}</span>
                                </td>
                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                        <Link to={`/reservations/${res._id || res.id}`}>
                                            <button title="Détails" style={iconBtnStyle}><FiEye color={PRIMARY_COLOR}/></button>
                                        </Link>
                                        {res.status?.toLowerCase() === 'pending' && (
                                            <button onClick={() => handleAction(res._id || res.id, 'confirm')} title="Confirmer" style={{ ...iconBtnStyle, background: SUCCESS_COLOR }}><FiCheck color="white"/></button>
                                        )}
                                        {res.status?.toLowerCase() === 'confirmed' && (
                                            <button onClick={() => handleAction(res._id || res.id, 'complete')} title="Terminer" style={{ ...iconBtnStyle, background: INFO_COLOR }}><FiCheck color="white"/></button>
                                        )}
                                        {(res.status?.toLowerCase() === 'pending' || res.status?.toLowerCase() === 'confirmed') && (
                                            <button onClick={() => handleAction(res._id || res.id, 'cancel')} title="Annuler" style={{ ...iconBtnStyle, background: WARNING_COLOR }}><FiXCircle color="white"/></button>
                                        )}
                                        <button onClick={() => handleAction(res._id || res.id, 'delete')} title="Supprimer" style={{ ...iconBtnStyle, background: DANGER_COLOR }}><FiTrash2 color="white"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION*/}
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                <span style={{ color: '#718096', fontSize: '14px', fontWeight: '500' }}>
                    Page <strong>{currentPage}</strong> sur <strong>{pagination.totalPages || 1}</strong>
                </span>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        type="button"
                        disabled={currentPage === 1} 
                        onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.max(1, prev - 1)); }} 
                        style={{
                            padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                            border: '1px solid #CBD5E0',
                            backgroundColor: currentPage === 1 ? '#F7FAFC' : '#FFFFFF',
                            color: currentPage === 1 ? '#A0AEC0' : '#2D3748',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            outline: 'none', boxShadow: 'none'
                        }}
                    >
                        Précédent
                    </button>

                    <button 
                        type="button"
                        disabled={currentPage >= pagination.totalPages} 
                        onClick={(e) => { e.preventDefault(); setCurrentPage(prev => prev + 1); }} 
                        style={{ 
                            padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                            border: 'none',
                            backgroundColor: currentPage >= pagination.totalPages ? '#E2E8F0' : PRIMARY_COLOR, 
                            color: '#FFFFFF', 
                            cursor: currentPage >= pagination.totalPages ? 'not-allowed' : 'pointer',
                            outline: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
}

const thStyle = { padding: '18px', textAlign: 'left', color: '#718096', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' };
const tdStyle = { padding: '16px', fontSize: '14px', color: '#2D3748' };
const iconBtnStyle = { padding: '7px', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };

export default ReservationsPage;
