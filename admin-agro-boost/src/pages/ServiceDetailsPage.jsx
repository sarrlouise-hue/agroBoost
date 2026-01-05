import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
    FaArrowLeft, FaEdit, FaMapMarkerAlt, 
    FaCalendarCheck, FaMoneyBillWave, FaIdCard, FaInfoCircle, FaTractor
} from "react-icons/fa";

// Constantes de style harmonisées
const PRIMARY_COLOR = '#3A7C35'; 
const BACKGROUND_COLOR = '#FDFAF8';

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

    if (loading) return <div className="loading-state">Chargement des détails...</div>;
    if (!service) return <div className="loading-state">Service introuvable.</div>;

    return (
        <div className="details-page-wrapper">
            <div className="container-max">
                
                {/* Barre de navigation */}
                <div className="nav-bar">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        <FaArrowLeft /> <span>Retour</span>
                    </button>
                    {/*<Link to={`/services/edit/${id}`} className="edit-link">
                        <button className="edit-btn">
                            <FaEdit /> Modifier le service
                        </button>
                    </Link>*/}
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
                                    <FaTractor size={50} color="#e2e8f0" />
                                    <p>Aucun visuel disponible</p>
                                </div>
                            )}
                        </div>
                        
                        {service.images?.length > 1 && (
                            <div className="thumbnail-list">
                                {service.images.map((img, i) => (
                                    <img key={i} src={img} alt="" className="thumbnail-img" />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Colonne Droite : Infos */}
                    <div className="info-section">
                        <div className="badge-type">{service.serviceType}</div>
                        
                        <h1 className="service-title">{service.name}</h1>
                        
                        <div className={`status-pill ${service.availability ? 'available' : 'unavailable'}`}>
                            <FaCalendarCheck /> {service.availability ? 'Disponible immédiatement' : 'Actuellement indisponible'}
                        </div>

                        <div className="description-box">
                            <h3 className="section-label">Description</h3>
                            <p>{service.description || "Aucune description détaillée n'a été fournie pour ce service."}</p>
                        </div>

                        <div className="details-grid">
                            <div className="info-item">
                                <div className="icon-wrapper price"><FaMoneyBillWave /></div>
                                <div className="info-content">
                                    <span className="label">Tarification</span>
                                    <span className="value">
                                        {service.pricePerHour ? `${service.pricePerHour} FCFA / heure` : `${service.pricePerDay} FCFA / jour`}
                                    </span>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="icon-wrapper geo"><FaMapMarkerAlt /></div>
                                <div className="info-content">
                                    <span className="label">Zone d'intervention</span>
                                    <span className="value">{service.locationName || "Non spécifiée"}</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="icon-wrapper provider"><FaIdCard /></div>
                                <div className="info-content">
                                    <span className="label">Prestataire</span>
                                    <span className="value">{service.provider?.businessName || 'Indépendant'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap');

                .details-page-wrapper {
                    background-color: ${BACKGROUND_COLOR};
                    min-height: 100vh;
                    padding: clamp(10px, 3vw, 30px);
                    font-family: 'Inter', sans-serif;
                }

                .container-max {
                    max-width: 1100px;
                    margin: 0 auto;
                }

                .nav-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                }

                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border: 1px solid #E2E8F0;
                    background: white;
                    padding: 10px 18px;
                    border-radius: 12px;
                    cursor: pointer;
                    color: #64748b;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .back-btn:hover { background: #f8fafc; color: ${PRIMARY_COLOR}; }

                .edit-btn {
                    background-color: ${PRIMARY_COLOR};
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 12px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(58, 124, 53, 0.2);
                }

                .details-card {
                    display: flex;
                    flex-direction: column;
                    background: white;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.04);
                    border: 1px solid #F1F5F9;
                }

                /* IMAGE SECTION */
                .image-section { flex: 1; padding: 25px; }
                .main-image-container {
                    width: 100%;
                    height: 400px;
                    border-radius: 18px;
                    overflow: hidden;
                    background: #f8fafc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .main-image { width: 100%; height: 100%; object-fit: cover; }
                .image-placeholder { text-align: center; color: #94a3b8; }
                
                .thumbnail-list {
                    display: flex; gap: 12px; margin-top: 15px; overflow-x: auto; padding-bottom: 5px;
                }
                .thumbnail-img {
                    width: 70px; height: 70px; border-radius: 10px; 
                    object-fit: cover; border: 2px solid #F1F5F9; cursor: pointer;
                }

                /* INFO SECTION */
                .info-section { padding: 40px; flex: 1; display: flex; flex-direction: column; }
                
                .badge-type {
                    background: #E8F5E9;
                    color: ${PRIMARY_COLOR};
                    padding: 6px 14px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    align-self: flex-start;
                }

                .service-title {
                    font-family: 'Poppins', sans-serif;
                    font-size: clamp(1.8rem, 4vw, 2.4rem);
                    color: #1e293b;
                    margin: 15px 0 10px 0;
                    line-height: 1.2;
                }

                .status-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 16px;
                    border-radius: 30px;
                    font-size: 13px;
                    font-weight: 600;
                    margin-bottom: 25px;
                    align-self: flex-start;
                }
                .status-pill.available { background: #ECFDF5; color: #059669; }
                .status-pill.unavailable { background: #FEF2F2; color: #DC2626; }

                .section-label { font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
                .description-box p { color: #475569; lineHeight: 1.7; font-size: 15px; margin: 0; }
                .description-box { margin-bottom: 30px; }

                /* GRID INFO */
                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: auto;
                    padding-top: 20px;
                    border-top: 1px solid #F1F5F9;
                }

                .info-item { display: flex; align-items: center; gap: 15px; }
                .icon-wrapper {
                    width: 45px; height: 45px; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center; font-size: 18px;
                }
                .icon-wrapper.price { background: #E8F5E9; color: ${PRIMARY_COLOR}; }
                .icon-wrapper.geo { background: #FFF1F2; color: #E11D48; }
                .icon-wrapper.provider { background: #F1F5F9; color: #64748b; }

                .info-content { display: flex; flex-direction: column; }
                .info-content .label { font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
                .info-content .value { font-size: 15px; color: #1e293b; font-weight: 600; }

                .loading-state { padding: 100px; text-align: center; color: #64748b; font-weight: 600; }

                /* RESPONSIVE */
                @media (min-width: 900px) {
                    .details-card { flex-direction: row; }
                    .image-section { max-width: 450px; border-right: 1px solid #F1F5F9; }
                }

                @media (max-width: 768px) {
                    .details-page-wrapper { padding: 10px; }
                    .nav-bar { padding: 5px; }
                    .details-card { border-radius: 16px; }
                    .info-section { padding: 25px; }
                    .main-image-container { height: 300px; }
                    .back-btn span { display: none; }
                    .edit-btn { font-size: 14px; padding: 10px 15px; }
                }
            `}</style>
        </div>
    );
}

export default ServiceDetailsPage;