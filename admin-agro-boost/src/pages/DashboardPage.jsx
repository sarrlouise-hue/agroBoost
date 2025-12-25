import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaTractor, FaLeaf, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { MdInsights, MdNotificationsActive, MdPendingActions, MdCheckCircle, MdPersonAddAlt1 } from 'react-icons/md';
import { FiInfo } from 'react-icons/fi';

// STYLES CONSTANTS
const PRIMARY_COLOR = '#0070AB';
const SECONDARY_COLOR = '#4CAF50';
const ACCENT_COLOR = '#FF9800';
const REVENUE_COLOR = '#1976D2'; 

// Composant KPI optimisé pour la responsivité
const StatCard = ({ title, value, unit = '', color = SECONDARY_COLOR, IconComponent }) => (
    <div 
        style={{ 
            padding: '20px', 
            borderRadius: '12px', 
            background: 'white',
            borderLeft: `6px solid ${color}`, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '110px', 
            position: 'relative',
            overflow: 'hidden'
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h4 style={{ margin: 0, color: '#666', fontSize: '0.85em', fontWeight: '600', textTransform: 'uppercase' }}>{title}</h4>
            <IconComponent size={22} color={color} style={{ opacity: 0.7 }} />
        </div>
        <div style={{ marginTop: '12px' }}>
            <span style={{ 
                fontSize: '1.4em', 
                fontWeight: '800', 
                color: '#333',
                wordBreak: 'break-word' 
            }}>
                {value}
            </span>
            {unit && <span style={{ fontSize: '0.8em', color: '#888', marginLeft: '5px' }}>{unit}</span>}
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
        error: null,
    });

    useEffect(() => {
        const fetchDashboardStats = async () => {
            setStats(s => ({ ...s, loading: true, error: null }));
            try {
                const response = await api.get('/admin/dashboard'); 
                const data = response.data;
                
                const currencyFormatter = new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF', 
                    minimumFractionDigits: 0,
                });
                
                setStats({
                    totalUsers: (data.users || 0).toLocaleString('fr-FR'),
                    totalProviders: (data.providers || 0).toLocaleString('fr-FR'),
                    totalServices: (data.services || 0).toLocaleString('fr-FR'),
                    reservationsPending: (data.pending || 0).toLocaleString('fr-FR'),
                    monthlyRevenue: currencyFormatter.format(data.monthlyRevenue || 0), 
                    recentActivities: data.recentActivities || [],
                    loading: false,
                    error: null,
                });

            } catch (err) {
                console.error("Erreur stats:", err);
                setStats(s => ({ ...s, loading: false, error: 'Impossible de charger les statistiques.' }));
                if (err.response?.status === 401) {
                    localStorage.removeItem('agroboost_admin_token');
                    window.location.href = '/login'; 
                }
            }
        };
        fetchDashboardStats();
    }, []); 

    const getActivityStyle = (type) => {
        switch (type) {
            case 'NEW_PROVIDER': return { icon: MdPersonAddAlt1, color: PRIMARY_COLOR, background: '#E3F2FD' };
            case 'PENDING': return { icon: MdPendingActions, color: ACCENT_COLOR, background: '#FFF3E0' };
            case 'CONFIRMED': return { icon: MdCheckCircle, color: SECONDARY_COLOR, background: '#E8F5E9' };
            default: return { icon: FiInfo, color: '#555', background: '#f0f0f0' };
        }
    };

    if (stats.loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Chargement...</div>;
    if (stats.error) return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Erreur : {stats.error}</div>;

    return (
        <div style={{ 
            padding: '20px 15px', // Padding réduit sur les côtés pour mobile
            backgroundColor: '#f5f7fa', 
            minHeight: '90vh' 
        }}>

            <h1 style={{ 
                color: PRIMARY_COLOR, 
                fontSize: 'clamp(1.4em, 5vw, 2.2em)', 
                marginBottom: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                flexWrap: 'wrap'
            }}>
                <FaTachometerAlt size={32} color={PRIMARY_COLOR} />
                <span>Tableau de Bord AGRO BOOST</span>
            </h1>

            <p style={{ color: '#777', marginBottom: '30px', fontSize: '1em' }}>Vue d'ensemble et indicateurs clés.</p>

            <hr style={{ border: 'none', borderTop: '1px solid #ddd', marginBottom: '30px' }} />

            <h2 style={{ 
                color: '#444', 
                fontSize: '1.2em', 
                marginBottom: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
            }}>
                <MdInsights size={24} color={PRIMARY_COLOR} />
                Indicateurs Clés
            </h2>

            {/* Grille des KPIs - Ajustée pour éviter une seule ligne trop longue sur PC */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                gap: '20px',
                marginBottom: '40px' 
            }}>
                <StatCard title='Revenu du Mois' value={stats.monthlyRevenue} IconComponent={FaMoneyBillWave} color={REVENUE_COLOR} />
                <StatCard title='Total Utilisateurs' value={stats.totalUsers} IconComponent={FaUsers} color={PRIMARY_COLOR} />
                <StatCard title='Total Prestataires' value={stats.totalProviders} IconComponent={FaTractor} color={PRIMARY_COLOR} />
                <StatCard title='Services Actifs' value={stats.totalServices} IconComponent={FaLeaf} color={SECONDARY_COLOR} />
                <StatCard title='En Attente' value={stats.reservationsPending} IconComponent={FaClock} color={ACCENT_COLOR} />
            </div>

            {/* Section Activités */}
            <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
                <h2 style={{ 
                    color: '#444', 
                    fontSize: '1.2em', 
                    marginBottom: '20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px' 
                }}>
                    <MdNotificationsActive size={24} color={PRIMARY_COLOR} />
                    Activités Récentes
                </h2>

                <div style={{ overflow: 'hidden' }}>
                    {stats.recentActivities.length > 0 ? stats.recentActivities.map(activity => {
                        const style = getActivityStyle(activity.type);
                        const Icon = style.icon;
                        return (
                            <div key={activity.id} style={{ 
                                display: 'flex', 
                                alignItems: 'flex-start', // Changé de center à flex-start pour les longs textes
                                padding: '15px 0', 
                                borderBottom: '1px solid #f0f0f0',
                                gap: '15px'
                            }}>
                                <div style={{ 
                                    padding: '10px', 
                                    borderRadius: '50%', 
                                    backgroundColor: style.background,
                                    flexShrink: 0 
                                }}>
                                    <Icon size={20} color={style.color} />
                                </div>
                                <div style={{ flexGrow: 1 }}>
                                    <p style={{ margin: '0 0 4px 0', fontWeight: '600', fontSize: '0.95em' }}>{activity.description}</p>
                                    <span style={{ fontSize: '0.8em', color: '#999' }}>{activity.date}</span>
                                </div>
                            </div>
                        );
                    }) : <p style={{ color: '#999', textAlign: 'center' }}>Aucune activité récente.</p>}
                </div>

                <Link to='/reservations' style={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    marginTop: '20px', 
                    color: PRIMARY_COLOR, 
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    fontSize: '0.9em'
                }}>
                    Voir toutes les réservations →
                </Link>
            </div>
        </div>
    );
}

export default DashboardPage;