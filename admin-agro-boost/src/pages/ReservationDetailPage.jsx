import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import { 
    FiArrowLeft, FiTruck, FiUser, FiCalendar, FiRefreshCcw, FiMail, FiMapPin 
} from 'react-icons/fi';

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
        <div style={{ textAlign: 'center', padding: '100px' }}>
            <FiRefreshCcw className="spin-icon" size={30} style={{ animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
    
    if (!reservation) return <div style={{ textAlign: 'center', padding: '100px' }}>Réservation introuvable.</div>;

    const serviceName = servicesList.find(s => (s._id || s.id) === reservation.serviceId)?.name || "Service inconnu";
    const client = usersList.find(u => (u._id || u.id) === reservation.userId);
    const clientDisplayName = client ? `${client.firstName} ${client.lastName}` : `ID: ...${reservation.userId?.slice(-6)}`;
    const clientEmail = client?.email || "Email non disponible";
    const status = reservation.status?.toLowerCase();

    return (
        <div className="detail-container">
            <style>{`
                .detail-container { 
                    padding: 15px; 
                    max-width: 900px; 
                    margin: 0 auto; 
                    font-family: 'Inter', sans-serif;
                    box-sizing: border-box;
                    width: 100%;
                }
                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    background-color: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 8px;
                    color: #4A5568;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-bottom: 20px;
                    transition: all 0.2s;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .back-btn:hover {
                    background-color: #F7FAFC;
                    border-color: #CBD5E0;
                    color: #2D3748;
                }
                .card { 
                    background-color: white; 
                    border-radius: 12px; 
                    padding: clamp(15px, 4vw, 30px); 
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    box-sizing: border-box;
                    width: 100%;
                }
                .header-flex { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center;
                    border-bottom: 1px solid #EDF2F7; 
                    padding-bottom: 20px; 
                    margin-bottom: 20px; 
                    gap: 15px;
                }
                .grid-info { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
                    gap: 20px; 
                }
                .data-row { 
                    display: flex; 
                    justify-content: space-between; 
                    padding: 12px 0; 
                    border-bottom: 1px solid #E2E8F0; 
                    font-size: 14px; 
                    gap: 10px;
                    word-break: break-word;
                }
                .data-row:last-child { border-bottom: none; }
                .data-row strong { color: #718096; min-width: 100px; }
                .data-row span { text-align: right; color: #2D3748; font-weight: 500; }

                @media (max-width: 600px) {
                    .detail-container { padding: 10px; }
                    .header-flex { flex-direction: column; align-items: flex-start; }
                    .data-row { flex-direction: column; gap: 4px; }
                    .data-row span { text-align: left; }
                    .grid-info { grid-template-columns: 1fr; }
                }
            `}</style>

            <button className="back-btn" onClick={() => navigate('/reservations')}>
                <FiArrowLeft size={18} /> Retour au suivi
            </button>

            <div className="card">
                <div className="header-flex">
                    <div>
                        <h1 style={{ fontSize: 'clamp(1.2rem, 5vw, 1.6rem)', color: '#1A202C', margin: 0 }}>Détails Réservation</h1>
                        <p style={{ color: '#718096', fontSize: '13px', marginTop: '5px' }}>Réf: {id}</p>
                    </div>
                    <span style={statusBadgeStyle(status)}>{reservation.status}</span>
                </div>

                <div className="grid-info">
                    {/* SECTION SERVICE */}
                    <div style={sectionBox}>
                        <h3 style={sectionTitle}><FiTruck color="#0070AB" /> Service & Paiement</h3>
                        <div className="data-row"><strong>Service</strong> <span>{serviceName}</span></div>
                        <div className="data-row"><strong>Prix total</strong> <span style={{ color: '#0070AB', fontWeight: 'bold' }}>{reservation.totalPrice?.toLocaleString()} XOF</span></div>
                        <div className="data-row"><strong>Date</strong> <span>{new Date(reservation.bookingDate).toLocaleDateString('fr-FR')}</span></div>
                    </div>

                    {/* SECTION CLIENT */}
                    <div style={sectionBox}>
                        <h3 style={sectionTitle}><FiUser color="#0070AB" /> Informations Client</h3>
                        <div className="data-row"><strong>Nom</strong> <span>{clientDisplayName}</span></div>
                        <div className="data-row"><strong>Email</strong> <span>{clientEmail}</span></div>
                        <div className="data-row"><strong>Notes</strong> <span>{reservation.notes || "Aucune note"}</span></div>
                    </div>
                </div>

                {/* LOGISTIQUE */}
                <div style={{ marginTop: '20px', ...sectionBox }}>
                     <h3 style={sectionTitle}><FiMapPin color="#0070AB" /> Logistique</h3>
                     <div className="data-row">
                        <strong>Coordonnées</strong> 
                        <span>Lat: {reservation.latitude} / Long: {reservation.longitude}</span>
                     </div>
                     <div className="data-row">
                        <strong>Lieu</strong> 
                        <a 
                            href={`https://www.google.com/maps?q=${reservation.latitude},${reservation.longitude}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#0070AB', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            <FiMapPin /> Voir sur Google Maps
                        </a>
                     </div>
                </div>
            </div>
        </div>
    );
}

const sectionBox = { backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '10px', border: '1px solid #EDF2F7', boxSizing: 'border-box' };
const sectionTitle = { fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: '#2D3748' };

const statusBadgeStyle = (status) => {
    const colors = { pending: '#FF9800', confirmed: '#2196F3', completed: '#4CAF50', cancelled: '#F44336' };
    return { 
        backgroundColor: colors[status] || '#CBD5E0', 
        color: 'white', 
        padding: '8px 16px', 
        borderRadius: '20px', 
        fontSize: '12px', 
        fontWeight: 'bold', 
        height: 'fit-content',
        whiteSpace: 'nowrap' 
    };
};

export default ReservationDetailPage;