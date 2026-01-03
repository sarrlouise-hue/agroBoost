import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { Link } from 'react-router-dom';
import { 
    FaTractor, FaTrash, FaEye, FaEdit, 
    FaCheckCircle, FaTimesCircle, FaFilter, FaToggleOn, FaUndo, FaTag, FaUser,
    FaWrench 
} from "react-icons/fa";

// Constantes de style pour cohérence globale
const PRIMARY_COLOR = '#3A7C35'; 
const SUCCESS_COLOR = '#4CAF50';
const DANGER_COLOR = '#E53E3E';
const WARNING_COLOR = '#F59E0B'; 
const BACKGROUND_COLOR = '#FDFAF8';

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
        <div className="main-page-wrapper">
            <div className="container-card">
                
                {/* Header */}
                <div className="header-container">
                    <div>
                        <h1 className="page-title">
                            <FaTractor style={{ color: PRIMARY_COLOR }} /> Catalogue Services
                        </h1>
                        <p className="page-subtitle">Gestion des prestations agricoles et maintenance</p>
                    </div>
                </div>

                {/* Section Filtres - */}
                <div className="filters-section">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label><FaFilter /> Type de service</label>
                            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                                <option value="">Tous les types</option>
                                <option value="tractor">Tracteur</option>
                                <option value="semoir">Semoir</option>
                                <option value="operator">Opérateur</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label><FaToggleOn /> Disponibilité</label>
                            <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
                                <option value="">Tous les statuts</option>
                                <option value="true">Disponible</option>
                                <option value="false">Indisponible</option>
                            </select>
                        </div>
                    </div>
                    {(typeFilter || availabilityFilter) && (
                        <button onClick={() => { setTypeFilter(''); setAvailabilityFilter(''); }} className="reset-btn">
                            <FaUndo /> Réinitialiser les filtres
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="loading-state">Chargement du catalogue...</div>
                ) : (
                    <div className="table-responsive">
                        {/* VERSION DESKTOP */}
                        <table className="custom-table hide-mobile">
                            <thead>
                                <tr>
                                    <th>Service</th>
                                    <th>Type</th>
                                    <th>Tarif</th>
                                    <th>Statut</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map(service => (
                                    <tr key={service.id}>
                                        <td>
                                            <div className="service-name">{service.name}</div>
                                            <div className="provider-name">{service.provider?.businessName || 'Indépendant'}</div>
                                        </td>
                                        <td><span className="badge">{service.serviceType}</span></td>
                                        <td><strong style={{color: '#1e293b'}}>{service.pricePerHour || service.pricePerDay} FCFA</strong></td>
                                        <td>
                                            {service.availability ? 
                                                <span className="status-pill available"><FaCheckCircle /> Prêt</span> : 
                                                <span className="status-pill unavailable"><FaTimesCircle /> Indisponible</span>
                                            }
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <Link to={`/maintenance/record/${service.id}`} className="action-btn maintenance" title="Intervention">
                                                    <FaWrench />
                                                </Link>
                                                <Link to={`/services/${service.id}`} className="action-btn view" title="Voir">
                                                    <FaEye />
                                                </Link>
                                                {/*<Link to={`/services/edit/${service.id}`} className="action-btn edit" title="Modifier">
                                                    <FaEdit />
                                                </Link>*/}
                                                <button onClick={() => handleDelete(service.id)} className="action-btn delete" title="Supprimer">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* VERSION MOBILE */}
                        <div className="show-only-mobile">
                            {services.map(service => (
                                <div key={service.id} className="mobile-service-card">
                                    <div className="card-header">
                                        <span className="badge">{service.serviceType}</span>
                                        <div className={`mobile-status ${service.availability ? 'text-success' : 'text-danger'}`}>
                                            {service.availability ? <FaCheckCircle /> : <FaTimesCircle />}
                                        </div>
                                    </div>
                                    
                                    <h3 className="card-title">{service.name}</h3>
                                    
                                    <div className="card-info-box">
                                        <div><FaUser size={12} /> {service.provider?.businessName || 'Prestataire'}</div>
                                        <div className="price-tag"><FaTag size={12} /> {service.pricePerHour || service.pricePerDay} FCFA</div>
                                    </div>

                                    <div className="card-actions">
                                        <Link to={`/maintenance/record/${service.id}`} className="btn-mobile-main">
                                            <FaWrench /> Maintenance
                                        </Link>
                                        <div className="btn-mobile-grid">
                                            <Link to={`/services/${service.id}`} className="btn-mobile-sub"><FaEye /></Link>
                                           {/* <Link to={`/services/edit/${service.id}`} className="btn-mobile-sub"><FaEdit /></Link>*/}
                                            <button onClick={() => handleDelete(service.id)} className="btn-mobile-sub delete"><FaTrash /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@600&display=swap');

                .main-page-wrapper {
                    background-color: ${BACKGROUND_COLOR};
                    min-height: 100vh;
                    padding: clamp(10px, 3vw, 25px);
                    font-family: 'Inter', sans-serif;
                }

                .container-card {
                    background: white;
                    padding: clamp(15px, 4vw, 35px);
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                    width: 100%;
                    box-sizing: border-box;
                }

                .page-title {
                    font-family: 'Poppins', sans-serif;
                    color: ${PRIMARY_COLOR};
                    font-size: clamp(1.4rem, 5vw, 1.8rem);
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .page-subtitle { color: #64748b; font-size: 14px; margin-top: 5px; }

                /* FILTRES */
                .filters-section {
                    background: #F8FAFC;
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid #E2E8F0;
                    margin: 25px 0;
                }
                .filters-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }
                .filter-group { display: flex; flex-direction: column; gap: 8px; }
                .filter-group label { font-size: 13px; font-weight: 700; color: #475569; display: flex; align-items: center; gap: 6px; }
                .filter-group select {
                    padding: 12px; border-radius: 10px; border: 1px solid #E2E8F0;
                    font-size: 14px; outline: none; background: white;
                }

                .reset-btn {
                    margin-top: 15px; background: none; border: none; color: ${PRIMARY_COLOR};
                    font-weight: 600; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 5px;
                }

                /* TABLE DESKTOP */
                .custom-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                .custom-table th {
                    text-align: left; padding: 16px; border-bottom: 2px solid #F1F5F9;
                    color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;
                }
                .custom-table td { padding: 16px; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
                
                .service-name { font-weight: 700; color: #1e293b; font-size: 15px; }
                .provider-name { font-size: 12px; color: #94a3b8; }

                .badge { padding: 4px 10px; background: #E8F5E9; color: ${PRIMARY_COLOR}; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; }

                .status-pill { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 20px; }
                .status-pill.available { background: #ECFDF5; color: #059669; }
                .status-pill.unavailable { background: #FEF2F2; color: #DC2626; }

                /* ACTIONS */
                .action-buttons { display: flex; gap: 8px; justify-content: flex-end; }
                .action-btn {
                    width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
                    border-radius: 10px; border: none; cursor: pointer; transition: 0.2s; background: #F8FAFC; color: #64748b;
                }
                .action-btn.maintenance { color: ${WARNING_COLOR}; background: #FFFBEB; }
                .action-btn.edit { color: ${PRIMARY_COLOR}; background: #E8F5E9; }
                .action-btn.delete { color: ${DANGER_COLOR}; background: #FEF2F2; }
                .action-btn:hover { transform: translateY(-2px); filter: brightness(0.95); }

                /* MOBILE CARDS */
                .mobile-service-card {
                    background: white; border: 1px solid #E2E8F0; padding: 18px;
                    border-radius: 12px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                }
                .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                .card-title { margin: 0 0 10px 0; font-size: 17px; color: #1e293b; font-family: 'Poppins', sans-serif; }
                .card-info-box { background: #F8FAFC; padding: 12px; border-radius: 10px; margin-bottom: 15px; font-size: 13px; color: #64748b; }
                .price-tag { margin-top: 6px; font-weight: 700; color: #1e293b; font-size: 14px; }
                
                .card-actions { display: flex; flex-direction: column; gap: 10px; }
                .btn-mobile-main {
                    background: ${PRIMARY_COLOR}; color: white; padding: 12px; border-radius: 10px;
                    text-align: center; font-weight: 600; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px;
                }
                .btn-mobile-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
                .btn-mobile-sub {
                    background: #F1F5F9; color: #475569; padding: 12px; border-radius: 10px;
                    display: flex; align-items: center; justify-content: center; text-decoration: none; border: none;
                }
                .btn-mobile-sub.delete { color: ${DANGER_COLOR}; background: #FEF2F2; }

                .loading-state { text-align: center; padding: 60px; color: #94a3b8; font-style: italic; }

                @media (max-width: 768px) {
                    .main-page-wrapper { padding: 8px; }
                    .container-card { padding: 15px; border-radius: 12px; }
                    .hide-mobile { display: none; }
                    .show-only-mobile { display: block; }
                    .filters-grid { grid-template-columns: 1fr; }
                }
                @media (min-width: 769px) {
                    .show-only-mobile { display: none; }
                }
            `}</style>
        </div>
    );
}

export default ServicesPage;