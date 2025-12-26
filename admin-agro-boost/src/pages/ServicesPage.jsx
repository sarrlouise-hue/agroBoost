import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { Link } from 'react-router-dom';
import { 
    FaTractor, FaTrash, FaEye, FaEdit, 
    FaCheckCircle, FaTimesCircle, FaFilter, FaToggleOn, FaUndo, FaTag, FaUser,
    FaWrench 
} from "react-icons/fa";

const PRIMARY_COLOR = '#0070AB';
const SUCCESS_COLOR = '#4CAF50';
const DANGER_COLOR = '#E53E3E';
const WARNING_COLOR = '#F59E0B'; 

const buttonStyle = {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
};

function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [typeFilter, setTypeFilter] = useState(''); 
    const [availabilityFilter, setAvailabilityFilter] = useState(''); 

    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = { 
                page: 1,
                limit: 50,
                ...(typeFilter && { serviceType: typeFilter }),
                ...(availabilityFilter !== '' && { availability: availabilityFilter === 'true' })
            };
            const response = await api.get('/services', { params });
            setServices(response.data.data || []);
        } catch (err) {
            setError("Impossible de charger les services.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [typeFilter, availabilityFilter]);

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return;
        try {
            await api.delete(`/services/${id}`);
            fetchServices();
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="main-page-wrapper" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <div className="content-card">
                
                {/* Header */}
                <div className="header-container" style={{ marginBottom: '25px' }}>
                    <div>
                        <h1 style={{ color: PRIMARY_COLOR, margin: 0, fontSize: 'clamp(1.3rem, 5vw, 1.8rem)', fontWeight: '800', display: 'flex', alignItems: 'center' }}>
                            <FaTractor style={{ marginRight: 12 }} /> Catalogue
                        </h1>
                        <p style={{ color: '#64748b', marginTop: '5px', fontSize: '14px' }}>Gestion des prestations agricoles</p>
                    </div>
                </div>

                {/* Filtres */}
                <div className="filters-container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}><FaFilter /> Type</label>
                            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="custom-select">
                                <option value="">Tous les types</option>
                                <option value="tractor">Tracteur</option>
                                <option value="semoir">Semoir</option>
                                <option value="operator">Opérateur</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}><FaToggleOn /> Statut</label>
                            <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)} className="custom-select">
                                <option value="">Tous les statuts</option>
                                <option value="true">Disponible</option>
                                <option value="false">Indisponible</option>
                            </select>
                        </div>
                    </div>
                    {(typeFilter || availabilityFilter) && (
                        <button onClick={() => { setTypeFilter(''); setAvailabilityFilter(''); }} className="reset-btn">
                            <FaUndo /> Réinitialiser
                        </button>
                    )}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Chargement...</div>
                ) : (
                    <>
                        {/* VERSION DESKTOP */}
                        <div className="hide-mobile" style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                        <th style={thStyle}>Service</th>
                                        <th style={thStyle}>Type</th>
                                        <th style={thStyle}>Prix</th>
                                        <th style={thStyle}>Dispo</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.map(service => (
                                        <tr key={service.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={tdStyle}>
                                                <div style={{ fontWeight: '700' }}>{service.name}</div>
                                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{service.provider?.businessName || 'Indépendant'}</div>
                                            </td>
                                            <td style={tdStyle}><span className="badge">{service.serviceType}</span></td>
                                            <td style={tdStyle}><strong>{service.pricePerHour || service.pricePerDay} F</strong></td>
                                            <td style={tdStyle}>
                                                {service.availability ? <FaCheckCircle color={SUCCESS_COLOR} /> : <FaTimesCircle color={DANGER_COLOR} />}
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <Link to={`/maintenance/record/${service.id}`} title="Intervention">
                                                        <button style={{ ...actionBtnStyle, color: WARNING_COLOR, backgroundColor: '#FFFBEB' }}><FaWrench /></button>
                                                    </Link>
                                                    <Link to={`/services/${service.id}`} title="Voir"><button style={actionBtnStyle}><FaEye /></button></Link>
                                                    <Link to={`/services/edit/${service.id}`} title="Modifier"><button style={{ ...actionBtnStyle, color: PRIMARY_COLOR }}><FaEdit /></button></Link>
                                                    <button onClick={() => handleDelete(service.id)} style={{ ...actionBtnStyle, color: DANGER_COLOR }} title="Supprimer"><FaTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* VERSION MOBILE (Corrigée avec bouton Voir) */}
                        <div className="show-only-mobile">
                            {services.map(service => (
                                <div key={service.id} className="service-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span className="badge">{service.serviceType}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span style={{fontSize: '11px', fontWeight: 'bold', color: service.availability ? SUCCESS_COLOR : DANGER_COLOR}}>
                                                {service.availability ? 'DISPONIBLE' : 'INDISPO'}
                                            </span>
                                            {service.availability ? <FaCheckCircle color={SUCCESS_COLOR} /> : <FaTimesCircle color={DANGER_COLOR} />}
                                        </div>
                                    </div>
                                    
                                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e293b' }}>{service.name}</h3>
                                    
                                    <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                                        <div style={{marginBottom: '4px'}}><FaUser size={11} style={{marginRight: '6px'}}/> {service.provider?.businessName || 'Prestataire'}</div>
                                        <div><FaTag size={11} style={{marginRight: '6px'}}/> <span style={{fontWeight: 'bold', color: '#1e293b'}}>{service.pricePerHour || service.pricePerDay} FCFA</span></div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {/* Action Principale */}
                                        <Link to={`/maintenance/record/${service.id}`} style={{ width: '100%', textDecoration: 'none' }}>
                                            <button style={{ ...buttonStyle, width: '100%', background: '#FFFBEB', color: WARNING_COLOR, border: `1px solid ${WARNING_COLOR}`, padding: '12px' }}>
                                                <FaWrench /> Nouvelle Intervention
                                            </button>
                                        </Link>

                                        {/* Actions Secondaires */}
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Link to={`/services/${service.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                                                <button style={{ ...buttonStyle, width: '100%', background: '#f1f5f9', color: '#475569', padding: '12px' }}>
                                                    <FaEye /> Voir
                                                </button>
                                            </Link>
                                            <Link to={`/services/edit/${service.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                                                <button style={{ ...buttonStyle, width: '100%', background: '#f0f9ff', color: PRIMARY_COLOR, padding: '12px' }}>
                                                    <FaEdit /> Éditer
                                                </button>
                                            </Link>
                                            <button onClick={() => handleDelete(service.id)} style={{ ...buttonStyle, flex: 1, background: '#fef2f2', color: DANGER_COLOR, padding: '12px' }}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <style>{`
                .main-page-wrapper { padding: 20px; }
                .content-card { 
                    background-color: white; padding: 25px; border-radius: 16px; 
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05); 
                }
                .hide-mobile { display: block; }
                .show-only-mobile { display: none; }
                .badge { padding: 4px 10px; background: #f1f5f9; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; color: #475569; }
                .custom-select { padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px; outline: none; width: 100%; box-sizing: border-box; }
                .reset-btn { background: none; border: none; color: #64748b; cursor: pointer; font-size: 13px; font-weight: bold; text-decoration: underline; display: flex; align-items: center; gap: 5px; margin-top: 5px; }
                .service-card { border: 1px solid #e2e8f0; padding: 15px; border-radius: 12px; margin-bottom: 15px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
                .filters-container { display: flex; flex-direction: column; gap: 15px; padding: 20px; background-color: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0; margin-bottom: 25px; }
                
                @media (max-width: 768px) {
                    .main-page-wrapper { padding: 0 !important; }
                    .content-card { 
                        padding: 12px !important; border-radius: 0 !important; 
                        box-shadow: none !important; width: 100% !important; box-sizing: border-box;
                    }
                    .hide-mobile { display: none; }
                    .show-only-mobile { display: block; }
                    .filters-container { padding: 15px !important; margin-bottom: 20px !important; border-radius: 8px !important; }
                    .service-card { margin: 0 0 15px 0 !important; width: 100% !important; box-sizing: border-box; }
                }

                @media (min-width: 769px) {
                    .header-container { display: flex; flex-direction: row; justify-content: space-between; align-items: center; }
                }
            `}</style>
        </div>
    );
}

const thStyle = { padding: '15px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle = { padding: '15px', color: '#1e293b', fontSize: '14px' };
const actionBtnStyle = { border: 'none', background: '#f8fafc', padding: '10px', borderRadius: '8px', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' };

export default ServicesPage;