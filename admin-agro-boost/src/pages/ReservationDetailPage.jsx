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
                // On récupère : la réservation + les services + les utilisateurs
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

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><FiRefreshCcw className="spin-icon" size={30} /></div>;
    if (!reservation) return <div style={{ textAlign: 'center', padding: '100px' }}>Réservation introuvable.</div>;

    // LOGIQUE DE CORRESPONDANCE (ID -> NOM)
    
    // Trouver le service
    const serviceName = servicesList.find(s => (s._id || s.id) === reservation.serviceId)?.name || "Service inconnu";

    // Trouver l'utilisateur (Le Client)
    const client = usersList.find(u => (u._id || u.id) === reservation.userId);
    const clientDisplayName = client ? `${client.firstName} ${client.lastName}` : `ID: ...${reservation.userId?.slice(-6)}`;
    const clientEmail = client?.email || "Email non disponible";

    const status = reservation.status?.toLowerCase();

    return (
        <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
            <button onClick={() => navigate('/reservations')} style={{ border:'none', background:'none', color:'#718096', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', marginBottom:'20px' }}>
                <FiArrowLeft /> Retour au suivi
            </button>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #EDF2F7', paddingBottom: '20px', marginBottom: '20px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', color: '#1A202C', margin: 0 }}>Détails de la Réservation</h1>
                        <p style={{ color: '#718096', fontSize: '13px', margin: '5px 0 0 0' }}>Référence : {id}</p>
                    </div>
                    <span style={statusBadgeStyle(status)}>{reservation.status}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    
                    {/* SECTION SERVICE */}
                    <div style={sectionBox}>
                        <h3 style={sectionTitle}><FiTruck color="#0070AB" /> Service & Paiement</h3>
                        <div style={dataRow}><strong>Service:</strong> <span>{serviceName}</span></div>
                        <div style={dataRow}><strong>Prix total:</strong> <span style={{ color: '#0070AB', fontWeight: 'bold' }}>{reservation.totalPrice?.toLocaleString()} XOF</span></div>
                        <div style={dataRow}><strong>Date:</strong> <span>{new Date(reservation.bookingDate).toLocaleDateString('fr-FR')}</span></div>
                    </div>

                    {/* SECTION CLIENT */}
                    <div style={sectionBox}>
                        <h3 style={sectionTitle}><FiUser color="#0070AB" /> Informations Client</h3>
                        <div style={dataRow}><strong>Nom:</strong> <span>{clientDisplayName}</span></div>
                        <div style={dataRow}><strong>Email:</strong> <span>{clientEmail}</span></div>
                        <div style={dataRow}><strong>Notes:</strong> <span>{reservation.notes || "Aucune note"}</span></div>
                    </div>
                </div>

                {/* LOGISTIQUE */}
                <div style={{ marginTop: '20px' }}>
                     <h3 style={sectionTitle}><FiMapPin color="#0070AB" /> Logistique</h3>
                     <div style={dataRow}><strong>Coordonnées:</strong> <span>Lat: {reservation.latitude} / Long: {reservation.longitude}</span></div>
                </div>
            </div>
        </div>
    );
}

const sectionBox = { backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '8px' };
const sectionTitle = { fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: '#2D3748' };
const dataRow = { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #E2E8F0', fontSize: '14px' };

const statusBadgeStyle = (status) => {
    const colors = { pending: '#FF9800', confirmed: '#2196F3', completed: '#4CAF50', cancelled: '#F44336' };
    return { backgroundColor: colors[status] || '#CBD5E0', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', height: 'fit-content' };
};

export default ReservationDetailPage;