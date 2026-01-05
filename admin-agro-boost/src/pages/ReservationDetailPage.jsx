import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import { 
    FiArrowLeft, FiTruck, FiUser, FiCalendar, FiRefreshCcw, FiMail, FiMapPin, FiCreditCard, FiFileText
} from 'react-icons/fi';

// Palette de couleurs Agricole 
const PRIMARY_COLOR = '#3A7C35';
const SECONDARY_COLOR = '#709D54';
const BACKGROUND_COLOR = '#FDFAF8';

function ReservationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [servicesList, setServicesList] = useState([]);
    const [usersList, setUsersList] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [resDetail, resServices, resUsers] = await Promise.all([
                    api.get(`/bookings/${id}`),
                    api.get('/services?limit=100'),
                    api.get('/users?limit=1000') 
                ]);

                setReservation(resDetail.data.data || resDetail.data);
                setServicesList(resServices.data.data || resServices.data || []);
                setUsersList(resUsers.data.data || resUsers.data || []);
            } catch (err) {
                console.error("Erreur de chargement:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '100px', backgroundColor: BACKGROUND_COLOR, minHeight: '100vh' }}>
            <FiRefreshCcw className="spin-icon" size={40} style={{ animation: 'spin 1s linear infinite', color: PRIMARY_COLOR }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
    
    if (!reservation) return <div style={{ textAlign: 'center', padding: '100px', color: '#64748B' }}>Réservation introuvable.</div>;

    const serviceName = servicesList.find(s => (s._id || s.id) === reservation.serviceId)?.name || "Service inconnu";
    const client = usersList.find(u => (u._id || u.id) === reservation.userId);
    const clientDisplayName = client ? `${client.firstName} ${client.lastName}` : `Client #${reservation.userId?.slice(-5)}`;
    const clientEmail = client?.email || "Email non disponible";
    const status = reservation.status?.toLowerCase();

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
                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background-color: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 12px;
                    color: #64748B;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    margin-bottom: 25px;
                    transition: all 0.2s;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .back-btn:hover {
                    color: ${PRIMARY_COLOR};
                    border-color: ${PRIMARY_COLOR};
                    transform: translateX(-5px);
                }
                .detail-card { 
                    background-color: white; 
                    border-radius: 20px; 
                    padding: 40px; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.04); 
                    max-width: 1000px;
                    margin: 0 auto;
                    width: 100%;
                    box-sizing: border-box;
                }
                .header-flex { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center;
                    border-bottom: 2px solid #F8FAFC; 
                    padding-bottom: 30px; 
                    margin-bottom: 35px; 
                    gap: 20px;
                }
                .info-grid { 
                    display: grid; 
                    grid-template-columns: repeat(2, 1fr); 
                    gap: 30px; 
                }
                .section-box {
                    background-color: #F8FAFC;
                    padding: 25px;
                    border-radius: 16px;
                    border: 1px solid #F1F5F9;
                }
                .section-title {
                    font-size: 14px;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                    color: ${PRIMARY_COLOR};
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .data-row { 
                    display: flex; 
                    justify-content: space-between; 
                    padding: 15px 0; 
                    border-bottom: 1px solid #E2E8F0; 
                    font-size: 14px; 
                }
                .data-row:last-child { border-bottom: none; }
                .data-row label { color: #94A3B8; font-weight: 600; }
                .data-row value { text-align: right; color: #1E293B; font-weight: 700; }

                /* RESPONSIVE MOBILE */
                @media (max-width: 900px) {
                    .page-wrapper { padding: 0; }
                    .detail-card { 
                        border-radius: 0; 
                        padding: 20px; 
                        min-height: 100vh;
                    }
                    .info-grid { grid-template-columns: 1fr; gap: 20px; }
                    .header-flex { flex-direction: column; align-items: flex-start; gap: 15px; }
                    .data-row { flex-direction: column; gap: 5px; }
                    .data-row value { text-align: left; }
                }
            `}</style>

            <div className="detail-card">
                <button className="back-btn" onClick={() => navigate('/reservations')}>
                    <FiArrowLeft size={18} /> Retour aux réservations
                </button>

                <div className="header-flex">
                    <div>
                        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: '#1E293B', margin: 0, fontWeight: '800' }}>
                            Détails de la réservation
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                            <span style={{ color: '#94A3B8', fontSize: '14px' }}>Référence :</span>
                            <code style={{ backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontSize: '13px', color: PRIMARY_COLOR, fontWeight: 'bold' }}>
                                {id}
                            </code>
                        </div>
                    </div>
                    <span style={statusBadgeStyle(status)}>{reservation.status}</span>
                </div>

                <div className="info-grid">
                    {/* COLONNE GAUCHE : SERVICE & PAIEMENT */}
                    <div className="section-box">
                        <h3 className="section-title"><FiTruck /> Service & Paiement</h3>
                        <div className="data-row">
                            <label>Service demandé</label>
                            <value style={{ color: PRIMARY_COLOR, fontSize: '16px' }}>{serviceName}</value>
                        </div>
                        <div className="data-row">
                            <label>Date prévue</label>
                            <value>{new Date(reservation.bookingDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</value>
                        </div>
                        <div className="data-row">
                            <label>Montant total</label>
                            <value style={{ fontSize: '18px', color: '#1E293B' }}>{reservation.totalPrice?.toLocaleString()} F CFA</value>
                        </div>
                        <div className="data-row">
                            <label>Mode de paiement</label>
                            <value><FiCreditCard style={{ marginRight: '5px' }} /> Mobile Money / Cash</value>
                        </div>
                    </div>

                    {/* COLONNE DROITE : CLIENT */}
                    <div className="section-box">
                        <h3 className="section-title"><FiUser /> Informations Client</h3>
                        <div className="data-row">
                            <label>Nom complet</label>
                            <value>{clientDisplayName}</value>
                        </div>
                        <div className="data-row">
                            <label>Contact Email</label>
                            <value style={{ color: SECONDARY_COLOR }}>{clientEmail}</value>
                        </div>
                        <div className="data-row">
                            <label>Notes client</label>
                            <value style={{ fontStyle: 'italic', fontWeight: '400' }}>
                                {reservation.notes || "Aucune instruction particulière"}
                            </value>
                        </div>
                    </div>
                </div>

                {/* LOGISTIQUE & LOCALISATION */}
                <div className="section-box" style={{ marginTop: '30px' }}>
                    <h3 className="section-title"><FiMapPin /> Logistique & Localisation</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <div className="data-row" style={{ borderBottom: 'none' }}>
                            <label>Coordonnées GPS</label>
                            <value>{reservation.latitude} , {reservation.longitude}</value>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <a 
                                href={`https://www.google.com/maps?q=${reservation.latitude},${reservation.longitude}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ 
                                    backgroundColor: PRIMARY_COLOR, 
                                    color: 'white', 
                                    padding: '12px 20px', 
                                    borderRadius: '10px', 
                                    textDecoration: 'none', 
                                    fontSize: '14px', 
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    boxShadow: '0 4px 12px rgba(58, 124, 53, 0.2)'
                                }}
                            >
                                <FiMapPin /> Ouvrir dans Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const statusBadgeStyle = (status) => {
    const config = {
        pending: { bg: '#FFFBEB', color: '#9A3412', border: '#FEF3C7' },
        confirmed: { bg: '#E6FFFA', color: '#3A7C35', border: '#3A7C35' },
        completed: { bg: '#F0FDF4', color: '#166534', border: '#BBF7D0' },
        cancelled: { bg: '#FFF5F5', color: '#E53E3E', border: '#FEB2B2' }
    };
    const s = config[status] || { bg: '#F1F5F9', color: '#64748B', border: '#E2E8F0' };

    return { 
        backgroundColor: s.bg, 
        color: s.color, 
        border: `1px solid ${s.border}`,
        padding: '10px 20px', 
        borderRadius: '30px', 
        fontSize: '12px', 
        fontWeight: '800', 
        textTransform: 'uppercase',
        letterSpacing: '1px',
        height: 'fit-content'
    };
};

export default ReservationDetailPage;