import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaTractor, FaLeaf, FaClock, FaMoneyBillWave } from "react-icons/fa";
import { MdInsights, MdNotificationsActive, MdPendingActions, MdCheckCircle, MdPersonAddAlt1 } from "react-icons/md";
import { FiInfo } from "react-icons/fi";

const StatCard = ({ title, value, unit = "", color, IconComponent }) => (
    <div className="stat-card" style={{ borderLeft: `6px solid ${color}` }}>
        <div className="stat-card-header">
            <h4 className="stat-card-title">{title}</h4>
            <IconComponent size={24} color={color} className="stat-icon" />
        </div>
        <div className="stat-card-body">
            <span className="stat-value">{value}</span>
            {unit && <span className="stat-unit">{unit}</span>}
        </div>
    </div>
);

function DashboardPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProviders: 0,
        totalServices: 0,
        reservationsPending: 0,
        monthlyRevenue: 0,
        recentActivities: [],
        loading: true,
    });

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const response = await api.get("/admin/dashboard");
                const apiData = response.data.data;

                setStats({
                    totalUsers: apiData.totalUsers || 0,
                    totalProviders: apiData.totalProviders || 0,
                    totalServices: apiData.totalServices || 0,
                    reservationsPending: apiData.pending || 0,
                    monthlyRevenue: apiData.monthlyRevenue || 0,
                    recentActivities: apiData.recentActivities || [],
                    loading: false,
                });
            } catch (err) {
                console.error("Erreur API:", err);
                setStats((s) => ({ ...s, loading: false }));
            }
        };
        fetchDashboardStats();
    }, []);

    const getActivityStyle = (type) => {
        switch (type) {
            case "USER_REGISTERED": return { icon: MdPersonAddAlt1, color: "#3A7C35", bg: "rgba(58, 124, 53, 0.1)" };
            case "NEW_BOOKING": return { icon: MdPendingActions, color: "#C2D747", bg: "rgba(194, 215, 71, 0.1)" };
            case "CONFIRMED": return { icon: MdCheckCircle, color: "#709D54", bg: "rgba(112, 157, 84, 0.1)" };
            default: return { icon: FiInfo, color: "#2B7133", bg: "rgba(43, 113, 51, 0.1)" };
        }
    };

    const formatCurrency = (val) =>
        new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "XOF",
            minimumFractionDigits: 0,
        }).format(val);

    if (stats.loading) return <div className="loading-state">Chargement...</div>;

    return (
        <div className="dashboard-wrapper">
            <style>{`

                /* ===== RESET GLOBAL (corrige espaces blancs) ===== */
                html, body, #root {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    overflow-x: hidden;
                }

                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Poppins:wght@500;600&display=swap');

                :root {
                    --font-titles: 'Poppins', sans-serif;
                    --font-body: 'Inter', sans-serif;
                    --color-main: #3A7C35;
                    --bg-page: #FDFAF8;
                    --bg-card: #FFFFFF;
                    --text-primary: #1A1A1A;
                    --text-secondary: #666666;
                    --border-light: #EEEEEE;
                }

                * { box-sizing: border-box; }

                /* ===== WRAPPER FULL WIDTH MOBILE ===== */
                .dashboard-wrapper {
                    font-family: var(--font-body);
                    background-color: var(--bg-page);
                    color: var(--text-primary);
                    padding: 16px; /* réduit mobile */
                    min-height: 100vh;
                    width: 100%;
                }

                /* desktop centré seulement */
                @media (min-width: 1024px) {
                    .dashboard-wrapper {
                        max-width: 1200px;
                        margin: auto;
                        padding: 30px;
                    }
                }

                .dashboard-header { margin-bottom: 40px; }

                .dashboard-header h1 {
                    font-family: var(--font-titles);
                    font-weight: 600;
                    color: var(--color-main);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin: 0 0 10px 0;
                    font-size: clamp(1.5rem, 4vw, 2.2rem);
                }

                /* ===== GRID MOBILE FIRST ===== */
                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr; /* 100% largeur mobile */
                    gap: 16px;
                    margin-bottom: 50px;
                }

                /* tablette */
                @media (min-width: 600px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                /* desktop */
                @media (min-width: 1024px) {
                    .stats-grid {
                        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    }
                }

                .stat-card {
                    background: var(--bg-card);
                    padding: 24px;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.03);
                }

                .stat-card-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                }

                .stat-card-title {
                    font-family: var(--font-titles);
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    color: var(--text-secondary);
                    margin: 0;
                }

                .stat-value {
                    font-weight: 700;
                    font-size: 1.8rem;
                }

                .activities-section {
                    background: var(--bg-card);
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.03);
                }

                .activity-item {
                    display: flex;
                    gap: 20px;
                    padding: 20px 0;
                    border-bottom: 1px solid var(--border-light);
                }

            `}</style>

            {/* TON CONTENU RESTE IDENTIQUE */}
            <header className="dashboard-header">
                <h1><FaTachometerAlt /> Tableau de Bord ALLO TRACTEUR</h1>
                <p>Gérez efficacement les prestataires et le suivi des réservations de machines agricoles au Sénégal.</p>
                <hr style={{border: 'none', borderTop: '1px solid var(--border-light)', margin: '30px 0'}} />
                <h2 style={{ fontFamily: "var(--font-titles)", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "10px" }}>
                    <MdInsights color="#3A7C35" /> Indicateurs Clés
                </h2>
            </header>

            <div className="stats-grid">
                <StatCard title="Revenu Mensuel" value={formatCurrency(stats.monthlyRevenue)} IconComponent={FaMoneyBillWave} color="#2B7133" />
                <StatCard title="Utilisateurs" value={stats.totalUsers.toLocaleString("fr-FR")} IconComponent={FaUsers} color="#3A7C35" />
                <StatCard title="Prestataires" value={stats.totalProviders.toLocaleString("fr-FR")} IconComponent={FaTractor} color="#709D54" />
                <StatCard title="Services Actifs" value={stats.totalServices.toLocaleString("fr-FR")} IconComponent={FaLeaf} color="#C2D747" />
                <StatCard title="En Attente" value={stats.reservationsPending.toLocaleString("fr-FR")} IconComponent={FaClock} color="#FF9800" />
            </div>

            <section className="activities-section">
                <h2 style={{fontFamily: 'var(--font-titles)', fontSize: '1.25rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <MdNotificationsActive color="#3A7C35" /> Activités Récentes
                </h2>
                {/* reste inchangé */}
                <div className="activity-list">
                    {stats.recentActivities.length > 0 ? (
                        stats.recentActivities.map((activity) => {
                            const style = getActivityStyle(activity.type);
                            const Icon = style.icon;
                            return (
                                <div key={activity.id} className="activity-item">
                                    <div style={{ backgroundColor: style.bg, padding: "12px", borderRadius: "12px", height: "fit-content" }}>
                                        <Icon size={20} color={style.color} />
                                    </div>
                                    <div className="activity-content">
                                        <p style={{margin: '0 0 5px 0', fontWeight: '500'}}>{activity.message}</p>
                                        <span style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
                                            {new Date(activity.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p style={{ textAlign: "center", color: "var(--text-secondary)", padding: "20px" }}>Aucune activité récente.</p>
                    )}
                </div>
                <Link to="/reservations" style={{display: 'block', textAlign: 'center', marginTop: '25px', color: 'var(--color-main)', textDecoration: 'none', fontWeight: '500'}}>
                    Voir toutes les réservations →
                </Link>
            </section>
        </div>
    );
}

export default DashboardPage;
