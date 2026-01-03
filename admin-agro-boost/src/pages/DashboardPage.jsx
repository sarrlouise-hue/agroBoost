import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import {
    FaTachometerAlt,
    FaUsers,
    FaTractor,
    FaLeaf,
    FaClock,
    FaMoneyBillWave,
} from "react-icons/fa";
import {
    MdInsights,
    MdNotificationsActive,
    MdPendingActions,
    MdCheckCircle,
    MdPersonAddAlt1,
} from "react-icons/md";
import { FiInfo } from "react-icons/fi";


 /* PALETTE DE COULEURS OFFICIELLE 
  Vert Olive: #709D54
  Vert Tendre: #C2D747
  Vert Forêt: #3A7C35
  Vert Foncé: #2B7133
  Blanc Cassé: #FDFAF8
 */

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
                const data = response.data;
                const currencyFormatter = new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "XOF",
                    minimumFractionDigits: 0,
                });
                setStats({
                    totalUsers: (data.users || 0).toLocaleString("fr-FR"),
                    totalProviders: (data.providers || 0).toLocaleString("fr-FR"),
                    totalServices: (data.services || 0).toLocaleString("fr-FR"),
                    reservationsPending: (data.pending || 0).toLocaleString("fr-FR"),
                    monthlyRevenue: currencyFormatter.format(data.monthlyRevenue || 0),
                    recentActivities: data.recentActivities || [],
                    loading: false,
                });
            } catch (err) {
                setStats((s) => ({ ...s, loading: false }));
            }
        };
        fetchDashboardStats();
    }, []);

    const getActivityStyle = (type) => {
        switch (type) {
            case "NEW_PROVIDER": return { icon: MdPersonAddAlt1, color: "#3A7C35", bg: "rgba(58, 124, 53, 0.1)" };
            case "PENDING": return { icon: MdPendingActions, color: "#C2D747", bg: "rgba(194, 215, 71, 0.1)" };
            case "CONFIRMED": return { icon: MdCheckCircle, color: "#709D54", bg: "rgba(112, 157, 84, 0.1)" };
            default: return { icon: FiInfo, color: "#2B7133", bg: "rgba(43, 113, 51, 0.1)" };
        }
    };

    if (stats.loading) return <div className="loading-state">Chargement...</div>;

    return (
        <div className="dashboard-wrapper">
            {/* Import des polices Google Fonts */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Poppins:wght@500;600&display=swap');

                :root {
                    --font-titles: 'Poppins', sans-serif;
                    --font-body: 'Inter', sans-serif;
                    --color-main: #3A7C35;
                    --color-dark: #2B7133;
                    --bg-page: #FDFAF8;
                    --bg-card: #FFFFFF;
                    --text-primary: #1A1A1A;
                    --text-secondary: #666666;
                    --border-light: #EEEEEE;
                }

                /* Support du Thème (si activé sur le body) */
                .dark-theme {
                    --bg-page: #121212;
                    --bg-card: #1E1E1E;
                    --text-primary: #FDFAF8;
                    --text-secondary: #AAAAAA;
                    --border-light: #333333;
                }

                .dashboard-wrapper {
                    font-family: var(--font-body);
                    background-color: var(--bg-page);
                    color: var(--text-primary);
                    padding: 30px;
                    min-height: 100vh;
                    transition: all 0.3s ease;
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

                .dashboard-header p {
                    color: var(--text-secondary);
                    font-weight: 400;
                    max-width: 700px;
                    line-height: 1.6;
                }

                .section-divider {
                    border: none;
                    border-top: 1px solid var(--border-light);
                    margin: 30px 0;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 25px;
                    margin-bottom: 50px;
                }

                .stat-card {
                    background: var(--bg-card);
                    padding: 24px;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.03);
                    transition: transform 0.2s ease;
                }

                .stat-card:hover { transform: translateY(-5px); }

                .stat-card-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                }

                .stat-card-title {
                    font-family: var(--font-titles);
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: var(--text-secondary);
                    margin: 0;
                }

                .stat-value {
                    font-family: var(--font-body);
                    font-weight: 700;
                    font-size: 1.8rem;
                    color: var(--text-primary);
                }

                .activities-section {
                    background: var(--bg-card);
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.03);
                }

                .activities-section h2 {
                    font-family: var(--font-titles);
                    font-weight: 600;
                    font-size: 1.25rem;
                    margin-bottom: 25px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .activity-item {
                    display: flex;
                    gap: 20px;
                    padding: 20px 0;
                    border-bottom: 1px solid var(--border-light);
                }

                .activity-item:last-child { border-bottom: none; }

                .activity-content p {
                    margin: 0 0 5px 0;
                    font-weight: 500;
                    color: var(--text-primary);
                }

                .activity-date {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                }

                .btn-view-all {
                    display: block;
                    text-align: center;
                    margin-top: 25px;
                    font-family: var(--font-titles);
                    font-weight: 500;
                    color: var(--color-main);
                    text-decoration: none;
                    transition: opacity 0.2s;
                }

                .btn-view-all:hover { opacity: 0.8; }

                @media (max-width: 768px) {
                    .dashboard-wrapper { padding: 15px; }
                    .stats-grid { 
                        grid-template-columns: 1fr 1fr; 
                        gap: 12px; 
                    }
                    .stat-card { padding: 15px; }
                    .stat-value { font-size: 1.3rem; }
                    .activities-section { border-radius: 12px; padding: 20px; }
                }
            `}</style>

            <header className="dashboard-header">
                <h1><FaTachometerAlt /> Tableau de Bord ALLO TRACTEUR</h1>
                <p>Gérez efficacement les prestataires et le suivi des réservations de machines agricoles au Sénégal.</p>
                <hr className="section-divider" />
                <h2 style={{ fontFamily: "var(--font-titles)", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "10px" }}>
                    <MdInsights color="#3A7C35" /> Indicateurs Clés
                </h2>
            </header>

            <div className="stats-grid">
                <StatCard title="Revenu Mensuel" value={stats.monthlyRevenue} IconComponent={FaMoneyBillWave} color="#2B7133" />
                <StatCard title="Utilisateurs" value={stats.totalUsers} IconComponent={FaUsers} color="#3A7C35" />
                <StatCard title="Prestataires" value={stats.totalProviders} IconComponent={FaTractor} color="#709D54" />
                <StatCard title="Services Actifs" value={stats.totalServices} IconComponent={FaLeaf} color="#C2D747" />
                <StatCard title="En Attente" value={stats.reservationsPending} IconComponent={FaClock} color="#FF9800" />
            </div>

            <section className="activities-section">
                <h2><MdNotificationsActive color="#3A7C35" /> Activités Récentes</h2>
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
                                        <p>{activity.description}</p>
                                        <span className="activity-date">{activity.date}</span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p style={{ textAlign: "center", color: "var(--text-secondary)", padding: "20px" }}>Aucune activité récente.</p>
                    )}
                </div>
                <Link to="/reservations" className="btn-view-all">
                    Voir toutes les réservations →
                </Link>
            </section>
        </div>
    );
}

export default DashboardPage;