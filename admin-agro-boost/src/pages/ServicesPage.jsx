import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { Link } from 'react-router-dom';
import { 
    FaTractor, FaPlus, FaTrash, FaEye, FaEdit, 
    FaCheckCircle, FaTimesCircle, FaUserTie, FaFilter 
} from "react-icons/fa";

// Couleurs de la charte graphique
const PRIMARY_COLOR = '#0070AB';
const SUCCESS_COLOR = '#4CAF50';
const DANGER_COLOR = '#E53E3E';

// Styles réutilisables
const buttonStyle = {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
};

const selectStyle = {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E0',
    backgroundColor: 'white',
    fontSize: '14px',
    color: '#2D3748',
    outline: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234A5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    minWidth: '220px'
};

const labelStyle = {
    fontSize: '13px',
    fontWeight: '700',
    color: '#4A5568',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
};

function ServicesPage() {
    const [services, setServices] = useState([]);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filtres
    const [typeFilter, setTypeFilter] = useState(''); 
    const [providerFilter, setProviderFilter] = useState(''); 

    const columns = ['Nom du Service', 'Type', 'Prestataire', 'Prix', 'Dispo.', 'Actions'];

    // Charger les prestataires au montage
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await api.get('/users?role=provider');
                const data = response.data.data || response.data;
                setProviders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Erreur prestataires:", err);
            }
        };
        fetchProviders();
    }, []);

    // Charger les services selon les filtres
    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            let url = `/services`;
            let params = { 
                serviceType: typeFilter || undefined,
                limit: 50 
            };

            // Utilisation de l'endpoint spécifique si un prestataire est sélectionné
            if (providerFilter) {
                url = `/services/provider/${providerFilter}`;
            }

            const response = await api.get(url, { params });
            setServices(response.data.data || []);
        } catch (err) {
            setError("Impossible de charger les services.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [typeFilter, providerFilter]);

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return;
        try {
            await api.delete(`/services/${id}`);
            alert("Service supprimé avec succès.");
            fetchServices();
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h1 style={{ color: PRIMARY_COLOR, margin: 0, fontSize: '1.8em', fontWeight: '800' }}>
                            <FaTractor style={{ marginRight: 12, color: PRIMARY_COLOR }} /> Catalogue des Services
                        </h1>
                        <p style={{ color: '#718096', margin: '5px 0 0 40px' }}>Gérez vos prestations et équipements agricoles</p>
                    </div>
                    <Link to="/services/add" style={{ textDecoration: 'none' }}>
                        <button style={{ ...buttonStyle, background: SUCCESS_COLOR, color: 'white' }}>
                            <FaPlus /> Nouveau Service
                        </button>
                    </Link>
                </div>

                {/* Section Filtres */}
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '20px', 
                    marginBottom: '30px', 
                    padding: '20px', 
                    backgroundColor: '#F8FAFC', 
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0',
                    alignItems: 'flex-end'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={labelStyle}><FaFilter size={12} /> Type de service</label>
                        <select 
                            value={typeFilter} 
                            onChange={(e) => setTypeFilter(e.target.value)}
                            style={selectStyle}
                            onFocus={(e) => e.target.style.borderColor = PRIMARY_COLOR}
                            onBlur={(e) => e.target.style.borderColor = '#CBD5E0'}
                        >
                            <option value="">Tous les types</option>
                            <option value="tractor">Tracteur</option>
                            <option value="semoir">Semoir</option>
                            <option value="operator">Opérateur</option>
                            <option value="other">Autre</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={labelStyle}><FaUserTie size={12} /> Prestataire</label>
                        <select 
                            value={providerFilter} 
                            onChange={(e) => setProviderFilter(e.target.value)}
                            style={selectStyle}
                            onFocus={(e) => e.target.style.borderColor = PRIMARY_COLOR}
                            onBlur={(e) => e.target.style.borderColor = '#CBD5E0'}
                        >
                            <option value="">Tous les prestataires</option>
                            {providers.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.businessName || `${p.firstName} ${p.lastName}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {(typeFilter || providerFilter) && (
                        <button 
                            onClick={() => { setTypeFilter(''); setProviderFilter(''); }}
                            style={{ 
                                background: 'none', border: 'none', color: DANGER_COLOR, 
                                fontWeight: '600', cursor: 'pointer', paddingBottom: '12px', fontSize: '14px' 
                            }}
                        >
                            Réinitialiser
                        </button>
                    )}
                </div>

                {/* Table des résultats */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>Chargement des données...</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', backgroundColor: '#EDF2F7' }}>
                                    {columns.map((col, index) => (
                                        <th key={col} style={{ 
                                            padding: '15px', 
                                            fontSize: '13px', 
                                            textTransform: 'uppercase', 
                                            letterSpacing: '0.05em',
                                            color: '#4A5568',
                                            borderTopLeftRadius: index === 0 ? '8px' : '0',
                                            borderBottomLeftRadius: index === 0 ? '8px' : '0',
                                            borderTopRightRadius: index === columns.length - 1 ? '8px' : '0',
                                            borderBottomRightRadius: index === columns.length - 1 ? '8px' : '0',
                                        }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {services.map(service => (
                                    <tr key={service.id} style={{ transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7FAFC'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td style={{ padding: '15px', borderBottom: '1px solid #E2E8F0' }}>
                                            <div style={{ fontWeight: '700', color: '#2D3748' }}>{service.name}</div>
                                        </td>
                                        <td style={{ padding: '15px', borderBottom: '1px solid #E2E8F0' }}>
                                            <span style={{ padding: '4px 10px', backgroundColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', textTransform: 'capitalize' }}>
                                                {service.serviceType}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', borderBottom: '1px solid #E2E8F0', color: '#4A5568' }}>
                                            {service.provider?.businessName || 'N/A'}
                                        </td>
                                        <td style={{ padding: '15px', borderBottom: '1px solid #E2E8F0', fontWeight: '600' }}>
                                            {service.pricePerHour ? `${service.pricePerHour} F/h` : `${service.pricePerDay} F/j`}
                                        </td>
                                        <td style={{ padding: '15px', borderBottom: '1px solid #E2E8F0', textAlign: 'center' }}>
                                            {service.availability ? 
                                                <FaCheckCircle color={SUCCESS_COLOR} size={18} /> : 
                                                <FaTimesCircle color={DANGER_COLOR} size={18} />
                                            }
                                        </td>
                                        <td style={{ padding: '15px', borderBottom: '1px solid #E2E8F0' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <Link to={`/services/${service.id}`}>
                                                    <button style={{ ...buttonStyle, background: '#EDF2F7', color: '#4A5568', padding: '8px' }} title="Détails">
                                                        <FaEye />
                                                    </button>
                                                </Link>
                                                <Link to={`/services/edit/${service.id}`}>
                                                    <button style={{ ...buttonStyle, background: PRIMARY_COLOR, color: 'white', padding: '8px' }} title="Modifier">
                                                        <FaEdit />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(service.id)}
                                                    style={{ ...buttonStyle, background: '#FFF5F5', color: DANGER_COLOR, padding: '8px', border: `1px solid ${DANGER_COLOR}` }} 
                                                    title="Supprimer"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {services.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#A0AEC0' }}>
                                Aucun service ne correspond à vos critères.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ServicesPage;