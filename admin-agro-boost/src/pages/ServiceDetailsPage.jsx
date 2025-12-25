import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
    FaArrowLeft, FaEdit, FaMapMarkerAlt, 
    FaCalendarCheck, FaMoneyBillWave, FaIdCard, FaInfoCircle 
} from "react-icons/fa";

const PRIMARY_COLOR = '#0070AB';

function ServiceDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const res = await api.get(`/services/${id}`);
                setService(res.data.data || res.data);
            } catch (err) {
                console.error("Erreur détails service:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServiceDetails();
    }, [id]);

    if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: '#64748b' }}>Chargement des détails...</div>;
    if (!service) return <div style={{ padding: '100px', textAlign: 'center' }}>Service introuvable.</div>;

    return (
        <div style={{ padding: 'clamp(10px, 3vw, 30px)', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                
                {/* Barre de navigation */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '20px' 
                }}>
                    <button onClick={() => navigate(-1)} style={backButtonStyle}>
                        <FaArrowLeft /> <span className="hide-mobile">Retour</span>
                    </button>
                    <Link to={`/services/edit/${id}`} style={{ textDecoration: 'none' }}>
                        <button style={editButtonStyle}>
                            <FaEdit /> Modifier
                        </button>
                    </Link>
                </div>

                {/* Conteneur Principal */}
                <div className="details-card">
                    
                    {/* Colonne Gauche : Galerie Images */}
                    <div className="image-section">
                        <div className="main-image-container">
                            {service.images && service.images.length > 0 ? (
                                <img src={service.images[0]} alt={service.name} className="main-image" />
                            ) : (
                                <div className="image-placeholder">
                                    <FaInfoCircle size={40} color="#cbd5e1" />
                                    <p>Aucune image disponible</p>
                                </div>
                            )}
                        </div>
                        
                        {service.images?.length > 1 && (
                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                                {service.images.map((img, i) => (
                                    <img key={i} src={img} alt="" style={thumbnailStyle} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Colonne Droite : Infos */}
                    <div className="info-section">
                        <span style={typeBadgeStyle}>
                            {service.serviceType}
                        </span>
                        
                        <h1 style={titleStyle}>{service.name}</h1>
                        
                        <div style={statusBadgeStyle(service.availability)}>
                            <FaCalendarCheck /> {service.availability ? 'Disponible' : 'Indisponible'}
                        </div>

                        <p style={descriptionStyle}>{service.description || "Aucune description fournie pour ce service."}</p>

                        <div style={detailsGridStyle}>
                            <div style={infoRowStyle}>
                                <div className="icon-box"><FaMoneyBillWave color={PRIMARY_COLOR} /></div>
                                <div>
                                    <div className="label">Tarification</div>
                                    <div className="value">
                                        {service.pricePerHour ? `${service.pricePerHour} FCFA / h` : `${service.pricePerDay} FCFA / jour`}
                                    </div>
                                </div>
                            </div>

                            <div style={infoRowStyle}>
                                <div className="icon-box"><FaMapMarkerAlt color="#ef4444" /></div>
                                <div>
                                    <div className="label">Localisation</div>
                                    <div className="value">{service.locationName || "Zone non spécifiée"}</div>
                                </div>
                            </div>

                            <div style={infoRowStyle}>
                                <div className="icon-box"><FaIdCard color="#64748b" /></div>
                                <div>
                                    <div className="label">Prestataire</div>
                                    <div className="value">{service.provider?.businessName || 'Prestataire indépendant'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .details-card {
                    display: flex;
                    flex-direction: column;
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
                }

                .image-section { padding: 20px; flex: 1; }
                .info-section { padding: clamp(20px, 5vw, 40px); flex: 1; background: #fff; }

                .main-image-container {
                    width: 100%;
                    height: clamp(250px, 40vh, 450px);
                    border-radius: 15px;
                    overflow: hidden;
                    background: #f1f5f9;
                }

                .main-image { width: 100%; height: 100%; object-fit: cover; }
                
                .image-placeholder {
                    height: 100%; display: flex; flex-direction: column;
                    align-items: center; justifyContent: center; color: #94a3b8; font-size: 14px;
                }

                .icon-box {
                    width: 40px; height: 40px; border-radius: 10px;
                    background: #f8fafc; display: flex; alignItems: center; justifyContent: center;
                    font-size: 18px;
                }

                .label { font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 700; }
                .value { font-size: 16px; color: #1e293b; font-weight: 600; }

                @media (min-width: 850px) {
                    .details-card { flex-direction: row; }
                    .image-section { max-width: 50%; }
                }

                @media (max-width: 600px) {
                    .hide-mobile { display: none; }
                }
            `}</style>
        </div>
    );
}

// Styles objets
const backButtonStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', border: 'none', 
    background: 'white', padding: '10px 15px', borderRadius: '10px',
    cursor: 'pointer', color: '#64748b', fontWeight: '600', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const editButtonStyle = {
    padding: '10px 20px', backgroundColor: PRIMARY_COLOR, color: 'white', 
    border: 'none', borderRadius: '10px', cursor: 'pointer', 
    display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600'
};

const typeBadgeStyle = {
    backgroundColor: '#f0f9ff', color: PRIMARY_COLOR, padding: '6px 14px', 
    borderRadius: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px'
};

const titleStyle = { fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: '#0f172a', margin: '15px 0 10px 0', fontWeight: '800' };

const descriptionStyle = { color: '#475569', lineHeight: '1.7', marginBottom: '30px', fontSize: '15px' };

const detailsGridStyle = { display: 'grid', gap: '25px' };

const infoRowStyle = { display: 'flex', alignItems: 'center', gap: '15px' };

const thumbnailStyle = { width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover', cursor: 'pointer', border: '2px solid #f1f5f9' };

const statusBadgeStyle = (isAvail) => ({
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
    backgroundColor: isAvail ? '#ecfdf5' : '#fef2f2',
    color: isAvail ? '#10b981' : '#ef4444',
    marginBottom: '20px'
});

export default ServiceDetailsPage;