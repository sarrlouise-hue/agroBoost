import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { Link } from 'react-router-dom';
import { 
  FiEye, FiClipboard, FiRefreshCcw, 
  FiFilter, FiSettings, FiUsers, FiTrash2 
} from 'react-icons/fi';

const PRIMARY_COLOR = '#0070AB'; 
const SUCCESS_COLOR = '#4CAF50';
const WARNING_COLOR = '#FF9800'; 
const DANGER_COLOR = '#F44336';  
const INFO_COLOR = '#2196F3';

function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [providersList, setProvidersList] = useState([]);
  const [usersList, setUsersList] = useState([]); 
  const [loading, setLoading] = useState(true);

  // États des filtres
  const [filterStatus, setFilterStatus] = useState('ALL'); 
  const [serviceFilter, setServiceFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [userFilter, setUserFilter] = useState(''); 

  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT = 10;

  // Chargement des référentiels (Services, Prestataires, Clients)
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
      } catch (err) { console.error("Erreur lors du chargement des refs", err); }
    };
    fetchRefs();
  }, []);

  // Chargement des réservations avec filtres
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const params = { 
        page: currentPage, 
        limit: LIMIT,
        // Ajout des filtres selon votre doc backend
        ...(filterStatus !== 'ALL' && { status: filterStatus.toLowerCase() }),
        ...(serviceFilter && { serviceId: serviceFilter }),
        ...(providerFilter && { providerId: providerFilter }),
        ...(userFilter && { userId: userFilter })
      };

      const res = await api.get('/bookings', { params });
      if (res.data.success) {
        setReservations(res.data.data || []);
        setPagination(res.data.pagination || {});
      }
    } catch (err) {
        console.error("Erreur lors de la récupération des réservations", err);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchReservations();
  }, [filterStatus, serviceFilter, providerFilter, userFilter, currentPage]);

  // Helpers pour l'affichage des noms
  const getServiceName = id => servicesList.find(s => (s._id || s.id) === id)?.name || '—';
  const getProviderName = id => {
    const p = providersList.find(p => (p._id || p.id) === id);
    return p ? (p.businessName || `${p.firstName} ${p.lastName}`) : '—';
  };
  const getUserName = id => {
    const u = usersList.find(u => (u._id || u.id) === id);
    return u ? `${u.firstName} ${u.lastName}` : '—';
  };

  const getStatusStyle = status => {
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
    <div className="page-container">
      <style>{`
        .page-container { padding: 20px; background-color: #F7FAFC; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .filters-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; background: white; padding: 25px; border-radius: 12px; margin-bottom: 25px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .table-container { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
        
        @media screen and (max-width: 992px) {
          table, thead, tbody, th, td, tr { display: block; }
          thead tr { position: absolute; top: -9999px; left: -9999px; }
          tr { border-bottom: 2px solid #EDF2F7; margin-bottom: 15px; padding: 10px; background: #fff; }
          td { 
            border: none; position: relative; padding-left: 50% !important; 
            text-align: right !important; margin-bottom: 8px; min-height: 35px;
            display: flex; align-items: center; justify-content: flex-end;
          }
          td:before { 
            position: absolute; left: 15px; width: 45%; text-align: left;
            font-weight: bold; color: #718096; font-size: 11px; content: attr(data-label);
          }
          .actions-cell { justify-content: flex-end; gap: 20px; border-top: 1px solid #f0f0f0; padding-top: 10px; }
        }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px', color: PRIMARY_COLOR, marginBottom: '30px' }}>
        <FiClipboard size={32} /> Gestion des <strong>Réservations</strong>
      </h1>

      {/* SECTION FILTRES */}
      <div className="filters-grid">
        {/* Ligne Statuts */}
        <div style={{ gridColumn: '1 / -1', marginBottom: '10px' }}>
          <label style={labelStyle}><FiSettings /> Filtrer par Statut</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
              <button key={s} onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
                style={{
                  padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                  fontWeight: '600', fontSize: '11px',
                  backgroundColor: filterStatus === s ? PRIMARY_COLOR : '#EDF2F7',
                  color: filterStatus === s ? 'white' : '#4A5568',
                  transition: 'all 0.2s'
                }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Filtre Client */}
        <div>
           <label style={labelStyle}><FiUsers /> Client</label>
           <select style={selectStyle} value={userFilter} onChange={e => setUserFilter(e.target.value)}>
             <option value="">Tous les clients</option>
             {usersList.map(u => <option key={u._id || u.id} value={u._id || u.id}>{u.firstName} {u.lastName}</option>)}
           </select>
        </div>

        {/* Filtre Prestataire (NOUVEAU) */}
        <div>
           <label style={labelStyle}><FiUsers /> Prestataire</label>
           <select style={selectStyle} value={providerFilter} onChange={e => setProviderFilter(e.target.value)}>
             <option value="">Tous les prestataires</option>
             {providersList.map(p => (
                <option key={p._id || p.id} value={p._id || p.id}>
                    {p.businessName || `${p.firstName} ${p.lastName}`}
                </option>
             ))}
           </select>
        </div>

        {/* Filtre Service */}
        <div>
           <label style={labelStyle}><FiFilter /> Service</label>
           <select style={selectStyle} value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}>
             <option value="">Tous les services</option>
             {servicesList.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>)}
           </select>
        </div>
      </div>

      {/* TABLEAU / LISTE */}
      <div className="table-container">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#F8FAFC' }}>
            <tr>
              <th style={thStyle}>SERVICE</th>
              <th style={thStyle}>CLIENT</th>
              <th style={thStyle}>PRESTATAIRE</th>
              <th style={thStyle}>DATE</th>
              <th style={thStyle}>MONTANT</th>
              <th style={thStyle}>STATUT</th>
              <th style={thStyle}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '100px' }}><FiRefreshCcw className="spin" size={30} /></td></tr>
            ) : reservations.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '50px', color: '#718096' }}>Aucune réservation trouvée.</td></tr>
            ) : reservations.map(res => (
              <tr key={res._id || res.id}>
                <td data-label="SERVICE" style={{ ...tdStyle, fontWeight: '800', color: '#000' }}>
                    {getServiceName(res.serviceId)}
                </td>
                <td data-label="CLIENT" style={tdStyle}>{getUserName(res.userId)}</td>
                <td data-label="PRESTATAIRE" style={tdStyle}>{getProviderName(res.providerId)}</td>
                <td data-label="DATE" style={tdStyle}>{new Date(res.bookingDate).toLocaleDateString('fr-FR')}</td>
                <td data-label="MONTANT" style={{ ...tdStyle, color: PRIMARY_COLOR, fontWeight: '700' }}>{res.totalPrice?.toLocaleString()} XOF</td>
                <td data-label="STATUT" style={tdStyle}>
                  <span style={getStatusStyle(res.status)}>{res.status}</span>
                </td>
                <td data-label="ACTIONS" style={tdStyle} className="actions-cell">
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <Link title="Voir détails" to={`/reservations/${res._id || res.id}`} style={{ color: PRIMARY_COLOR }}><FiEye size={20} /></Link>
                    <button title="Supprimer" onClick={() => {/* handle delete */}} style={{ border: 'none', background: 'none', color: DANGER_COLOR, cursor: 'pointer', padding: 0 }}><FiTrash2 size={20} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px', color: '#4A5568' };
const selectStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', outline: 'none' };
const thStyle = { padding: '18px 15px', textAlign: 'left', color: '#718096', fontSize: '11px', fontWeight: 'bold', borderBottom: '2px solid #EDF2F7' };
const tdStyle = { padding: '18px 15px', fontSize: '14px', borderBottom: '1px solid #EDF2F7', color: '#2D3748' };

export default ReservationsPage;