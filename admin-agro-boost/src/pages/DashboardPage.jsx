import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { FaTachometerAlt } from 'react-icons/fa';
import { MdInsights } from 'react-icons/md';
import { MdNotificationsActive } from 'react-icons/md'

// IMPORTS ICÔNES (FontAwesome, Material, Feather, etc.)
import { FaUsers, FaTractor, FaLeaf, FaClock, FaMoneyBillWave } from 'react-icons/fa'; // Ajout de FaMoneyBillWave
import { MdPendingActions, MdCheckCircle, MdPersonAddAlt1 } from 'react-icons/md';
import { FiInfo } from 'react-icons/fi';

// STYLES CONSTANTS
const PRIMARY_COLOR = '#0070AB';
const SECONDARY_COLOR = '#4CAF50';
const ACCENT_COLOR = '#FF9800';
const REVENUE_COLOR = '#1976D2'; 

// Composant KPI
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
            minHeight: '120px', 
            position: 'relative',
            overflow: 'hidden'
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h4 style={{ margin: 0, color: '#666', fontSize: '0.9em', fontWeight: '600', textTransform: 'uppercase' }}>{title}</h4>
            <IconComponent size={24} color={color} style={{ opacity: 0.7 }} />
        </div>
        <div style={{ marginTop: '15px' }}>
            <span style={{ 
                fontSize: '1.5em', 
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
        // NOUVEAU STATUT POUR LE REVENU
        monthlyRevenue: 0, 
        recentActivities: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchDashboardStats = async () => {
            setStats(s => ({ ...s, loading: true, error: null })); // Réinitialisation de l'état
            
            try {
                // APPEL AU BACKEND : GET /api/admin/dashboard 
                const response = await api.get('/admin/dashboard'); 
                
                // Hypothèse : la réponse contient tous les champs, y compris le revenu.
                const data = response.data;
                
                // Formatteur pour la devise locale
                const currencyFormatter = new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF', 
                    minimumFractionDigits: 0,
                });
                
                setStats({
                    // Utilisation de .toLocaleString() pour les séparateurs de milliers
                    totalUsers: (data.users || 0).toLocaleString('fr-FR'),
                    totalProviders: (data.providers || 0).toLocaleString('fr-FR'),
                    totalServices: (data.services || 0).toLocaleString('fr-FR'),
                    reservationsPending: (data.pending || 0).toLocaleString('fr-FR'),
                    // Formatage du revenu
                    monthlyRevenue: currencyFormatter.format(data.monthlyRevenue || 0), 
                    recentActivities: data.recentActivities || [],
                    loading: false,
                    error: null,
                });

            } catch (err) {
                console.error("Erreur lors du chargement des stats:", err);
                setStats(s => ({ ...s, loading: false, error: 'Impossible de charger les statistiques du tableau de bord.' }));
                
                // GESTION DES ERREURS D'AUTHENTIFICATION (401)
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('agroboost_admin_token');
                    window.location.href = '/login'; 
                }
            }
        };

        fetchDashboardStats();
    }, []); 

    // STYLE ICÔNES ACTIVITÉS
    const getActivityStyle = (type) => {
        switch (type) {
            case 'NEW_PROVIDER': return { icon: MdPersonAddAlt1, color: PRIMARY_COLOR, background: '#E3F2FD' };
            case 'PENDING': return { icon: MdPendingActions, color: ACCENT_COLOR, background: '#FFF3E0' };
            case 'CONFIRMED': return { icon: MdCheckCircle, color: SECONDARY_COLOR, background: '#E8F5E9' };
            default: return { icon: FiInfo, color: '#555', background: '#f0f0f0' };
        }
    };

    if (stats.loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Chargement du tableau de bord...</div>;
    }

    if (stats.error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Erreur : {stats.error}</div>;
    }

    return (
        <div style={{ padding: '30px', backgroundColor: '#f5f7fa', minHeight: '90vh' }}>

            <h1 style={{ color: PRIMARY_COLOR, fontSize: '2.5em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaTachometerAlt size={40} color={PRIMARY_COLOR} />
                    Tableau de Bord AGRO BOOST
            </h1>

            <p style={{ color: '#777', marginBottom: '40px', fontSize: '1.1em' }}>Vue d'ensemble et indicateurs clés.</p>

            <hr style={{ borderTop: '1px solid #ddd', marginBottom: '30px' }} />

            {/* KPIs */}
            <h2 style={{ color: '#555', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MdInsights size={28} color={PRIMARY_COLOR} />
                Indicateurs Clés
            </h2>

            {/* Grille des KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px',marginBottom: '50px' }}>
                
                {/* NOUVELLE CARTE DE REVENU */}
                <StatCard 
                    title='Revenu du Mois' 
                    value={stats.monthlyRevenue} 
                    IconComponent={FaMoneyBillWave} 
                    color={REVENUE_COLOR} 
                    unit=''
                />
                
                {/* Anciennes cartes*/}
                <StatCard title='Total Utilisateurs' value={stats.totalUsers} IconComponent={FaUsers} color={PRIMARY_COLOR} />
                <StatCard title='Total Prestataires' value={stats.totalProviders} IconComponent={FaTractor} color={PRIMARY_COLOR} />
                <StatCard title='Services Actifs' value={stats.totalServices} IconComponent={FaLeaf} color={SECONDARY_COLOR} />
                <StatCard title='Réservations en Attente' value={stats.reservationsPending} IconComponent={FaClock} color={ACCENT_COLOR} />
            </div>

            {/* Activités */}
            <div style={{background: 'white',padding: '25px',borderRadius: '12px',boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginTop: '50px' }}>
                <h2 style={{ color: '#555', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MdNotificationsActive size={28} color={PRIMARY_COLOR} />
                    Activités Récentes
                </h2>

                <div style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    {/* Mappage des activités*/}
                    {stats.recentActivities.map(activity => {
                        const style = getActivityStyle(activity.type);
                        const Icon = style.icon;
                        return (
                            <div key={activity.id} style={{ display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                                <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: style.background, marginRight: '15px' }}>
                                    <Icon size={22} color={style.color} />
                                </div>
                                <p style={{ flexGrow: 1, margin: 0, fontWeight: '600' }}>{activity.description}</p>
                                <span style={{ fontSize: '0.9em', color: '#999' }}>{activity.date}</span>
                            </div>
                        );
                    })}
                </div>

                <Link to='/reservations' style={{ display: 'block', textAlign: 'right', marginTop: '15px', color: PRIMARY_COLOR, fontWeight: 'bold' }}>
                    Voir toutes les réservations →
                </Link>
            </div>
        </div>
    );
}

export default DashboardPage;

