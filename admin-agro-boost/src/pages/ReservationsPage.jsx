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

  const [filterStatus, setFilterStatus] = useState('ALL'); 
  const [serviceFilter, setServiceFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [userFilter, setUserFilter] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT = 10;

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette réservation ?")) {
      try {
        const res = await api.delete(`/bookings/${id}`);
        if (res.data.success || res.status === 200) {
          setReservations(prev => prev.filter(item => (item._id || item.id) !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || "Erreur lors de la suppression");
      }
    }
  };

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
        page: currentPage, 
        limit: LIMIT,
        ...(filterStatus !== 'ALL' && { status: filterStatus.toLowerCase() }),
        ...(serviceFilter && { serviceId: serviceFilter }),
        ...(providerFilter && { providerId: providerFilter }),
        ...(userFilter && { userId: userFilter })
      };
      const res = await api.get('/bookings', { params });
      if (res.data.success) {
        setReservations(res.data.data || []);
      }
    } catch (err) { console.error("Erreur", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReservations(); }, [filterStatus, serviceFilter, providerFilter, userFilter, currentPage]);

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
      color: style.c, backgroundColor: style.bg, padding: '6px 12px', borderRadius: '20px', 
      fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', whiteSpace: 'nowrap'
    };
  };

  return (
    <div className="page-wrapper">
      <style>{`
        .page-wrapper { 
          padding: 15px; 
          background-color: #F7FAFC; 
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden; /* Empêche le scroll horizontal global */
        }
        
        .header-title { 
            display: flex; align-items: center; gap: 12px; color: ${PRIMARY_COLOR}; 
            margin: 0 0 20px 0; font-size: clamp(1.3rem, 5vw, 1.8rem);
        }

        .filters-grid { 
            display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 15px; background: white; padding: 15px; border-radius: 12px; margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        @media screen and (max-width: 768px) {
          .page-wrapper { padding: 10px 5px; } /* Moins de padding pour plus d'espace */
          
          table, thead, tbody, th, td, tr { display: block; width: 100%; box-sizing: border-box; }
          thead { display: none; }
          
          tr { 
            border-radius: 12px; 
            border: 1px solid #E2E8F0; 
            margin-bottom: 15px; 
            background: #fff; 
            padding: 12px 0; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.02);
          }
          
          td { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; /* Aligné en haut si le texte est long */
            padding: 8px 15px !important; 
            border: none !important;
            gap: 10px;
          }
          
          td:before { 
            content: attr(data-label); 
            font-weight: 800; 
            color: #718096; 
            font-size: 11px; 
            text-transform: uppercase;
            min-width: 90px; /* Largeur fixe pour aligner les valeurs */
            text-align: left;
          }

          /* Force le texte à rester dans la carte */
          .data-value {
            text-align: right;
            word-break: break-word; /* Casse les mots trop longs */
            font-size: 14px;
            color: #2D3748;
            flex: 1; /* Prend tout l'espace restant */
          }
          
          .actions-cell { 
            border-top: 1px solid #F1F5F9 !important; 
            margin-top: 10px; 
            padding-top: 15px !important;
            justify-content: flex-end;
          }
        }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <h1 className="header-title">
        <FiClipboard /> <span>Gestion des <strong>Réservations</strong></span>
      </h1>

      <div className="filters-grid">
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}><FiSettings /> Statut</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
              <button key={s} onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
                style={{
                  padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontWeight: '700', fontSize: '12px',
                  backgroundColor: filterStatus === s ? PRIMARY_COLOR : '#EDF2F7',
                  color: filterStatus === s ? 'white' : '#4A5568'
                }}>{s}</button>
            ))}
          </div>
        </div>

        <div>
           <label style={labelStyle}><FiUsers /> Client</label>
           <select style={selectStyle} value={userFilter} onChange={e => setUserFilter(e.target.value)}>
             <option value="">Tous les clients</option>
             {usersList.map(u => <option key={u._id || u.id} value={u._id || u.id}>{u.firstName} {u.lastName}</option>)}
           </select>
        </div>

        <div>
           <label style={labelStyle}><FiUsers /> Prestataire</label>
           <select style={selectStyle} value={providerFilter} onChange={e => setProviderFilter(e.target.value)}>
             <option value="">Tous les prestataires</option>
             {providersList.map(p => (
                <option key={p._id || p.id} value={p._id || p.id}>{p.businessName || p.firstName}</option>
             ))}
           </select>
        </div>

        <div>
           <label style={labelStyle}><FiFilter /> Service</label>
           <select style={selectStyle} value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}>
             <option value="">Tous les services</option>
             {servicesList.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>)}
           </select>
        </div>
      </div>

      <div style={{ width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#F8FAFC' }}>
            <tr style={{ background: 'white' }}>
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
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '80px' }}><FiRefreshCcw className="spin" size={32} /></td></tr>
            ) : reservations.length === 0 ? (
               <tr><td colSpan="7" style={{ textAlign: 'center', padding: '50px', color: '#718096', fontSize: '16px' }}>Aucune donnée</td></tr>
            ) : reservations.map(res => (
              <tr key={res._id || res.id}>
                <td data-label="SERVICE" style={tdStyle}><div className="data-value" style={{fontWeight:'800'}}>{getServiceName(res.serviceId)}</div></td>
                <td data-label="CLIENT" style={tdStyle}><div className="data-value">{getUserName(res.userId)}</div></td>
                <td data-label="PRESTATAIRE" style={tdStyle}><div className="data-value">{getProviderName(res.providerId)}</div></td>
                <td data-label="DATE" style={tdStyle}><div className="data-value">{new Date(res.bookingDate).toLocaleDateString('fr-FR')}</div></td>
                <td data-label="MONTANT" style={tdStyle}><div className="data-value" style={{color: PRIMARY_COLOR, fontWeight: '800'}}>{res.totalPrice?.toLocaleString()} F</div></td>
                <td data-label="STATUT" style={tdStyle}>
                  <div className="data-value">
                    <span style={getStatusStyle(res.status)}>{res.status}</span>
                  </div>
                </td>
                <td data-label="ACTIONS" style={tdStyle} className="actions-cell">
                  <div style={{ display: 'flex', gap: '25px' }}>
                    <Link to={`/reservations/${res._id || res.id}`} style={{ color: PRIMARY_COLOR }}><FiEye size={22} /></Link>
                    <button 
                      onClick={() => handleDelete(res._id || res.id)} 
                      style={{ border: 'none', background: 'none', color: DANGER_COLOR, cursor: 'pointer', padding: 0 }}
                    >
                      <FiTrash2 size={22} />
                    </button>
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

const labelStyle = { fontSize: '12px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#4A5568', textTransform: 'uppercase' };
const selectStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', outline: 'none', fontSize: '14px', color: '#2D3748', boxSizing: 'border-box' };
const thStyle = { padding: '15px', textAlign: 'left', color: '#4A5568', fontSize: '11px', fontWeight: '800', borderBottom: '2px solid #EDF2F7', textTransform: 'uppercase', background: '#F8FAFC' };
const tdStyle = { padding: '15px', fontSize: '14px', borderBottom: '1px solid #EDF2F7', color: '#2D3748', background: 'white' };

export default ReservationsPage;