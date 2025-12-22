import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api'; 
import { 
    FaUser, FaTractor, FaUsers, FaClipboardList, 
    FaTools, FaSignOutAlt, FaBell, FaChartBar, FaTimes 
} from 'react-icons/fa';

// Couleurs & Styles 
const COLOR_BLUE_DARK = '#002534';
const COLOR_BLUE_LIGHT_ACTIVE = '#003E57';
const COLOR_BLUE_LOGO = '#0070AB';

const sidebarStyle = {
    width: '240px',
    minHeight: '100vh',
    background: COLOR_BLUE_DARK,
    color: 'white',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
};

const navItemStyle = {
    margin: '5px 0',
    padding: '10px 15px',
    borderRadius: '0 40px 40px 0',
    transition: 'background-color 0.2s',
};

const navLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
    fontSize: '15px',
};

const headerStyle = {
    background: 'white',
    padding: '10px 30px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    position: 'relative',
};

const NAV_ITEMS = [
    { name: 'Tableau de bord', path: '/', icon: <FaClipboardList /> },
    { name: 'Utilisateurs', path: '/users', icon: <FaUsers /> },
    { name: 'Services', path: '/services', icon: <FaTractor /> },
    { name: 'Réservations', path: '/reservations', icon: <FaClipboardList /> },
    { name: 'Entretien machines', path: '/maintenance', icon: <FaTools /> },
    { name: 'Rapports Maintenance', path: '/maintenance/reports', icon: <FaChartBar /> },
];

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    
    // Référence pour garder trace du nombre précédent 
    const prevCountRef = useRef(0);

    // 1. Charger les notifications
    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            const data = response.data.data || response.data || [];
            
            // Jouer un son si le nombre de notifications non lues augmente
            const currentUnread = data.filter(n => !n.isRead).length;
            if (currentUnread > prevCountRef.current) {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
                audio.play().catch(e => console.log("Audio bloqué par le navigateur"));
            }
            prevCountRef.current = currentUnread;
            
            setNotifications(data);
        } catch (error) {
            console.error("Erreur notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Toutes les 30s
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleLogout = async () => {
        if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
            try { await api.post('/auth/logout'); } 
            catch (e) { console.error(e); } 
            finally {
                localStorage.removeItem('agroboost_admin_token');
                navigate('/login', { replace: true });
            }
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            fetchNotifications();
        } catch (error) { console.error(error); }
    };

    //  (SUPPRESSION)
    const deleteNotification = async (id, e) => {
        e.stopPropagation(); // Empêche de déclencher le clic sur la notification elle-même
        try {
            
            await api.delete(`/notifications/${id}`);
            // Mise à jour immédiate de l'interface
            setNotifications(prev => prev.filter(n => (n._id || n.id) !== id));
        } catch (error) {
            console.error("Erreur suppression:", error);
            alert("Impossible de supprimer la notification");
        }
    };

    const handleNotificationClick = async (notif) => {
        const id = notif._id || notif.id;
        try {
            if (!notif.isRead) {
                await api.patch(`/notifications/${id}/read`);
                fetchNotifications();
            }
            setShowDropdown(false);
            if(notif.type === 'booking') navigate('/reservations');
            if(notif.type === 'provider') navigate('/users');
        } catch (error) { console.error(error); }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f9' }}>
            
            {/* SIDEBAR */}
            <aside style={sidebarStyle}>
                <div style={{ padding: '20px 0', textAlign: 'center' }}>
                    <span style={{ color: COLOR_BLUE_LOGO, fontWeight: '900', fontSize: '24px', border: '2px solid '+COLOR_BLUE_LOGO, borderRadius: '50%', padding: '3px 8px', marginRight: '5px' }}>O</span>
                    <span style={{ fontWeight: 'bold', color: 'white' }}>ALLOTRACTEUR</span>
                </div>

                <nav style={{ flexGrow: 1, paddingRight: '20px', marginTop: '30px' }}>
                    {NAV_ITEMS.map(item => {
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (
                            <div key={item.path} style={{ ...navItemStyle, backgroundColor: isActive ? COLOR_BLUE_LIGHT_ACTIVE : 'transparent', borderLeft: isActive ? '3px solid white' : 'none' }}>
                                <Link to={item.path} style={navLinkStyle}>
                                    <span style={{ marginRight: '10px', fontSize: '18px', opacity: 0.8 }}>{item.icon}</span>
                                    {item.name}
                                </Link>
                            </div>
                        );
                    })}
                </nav>

                <div style={{ padding: '20px 15px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FaUser style={{ fontSize: '24px', marginRight: '10px' }} /> 
                        <span style={{ fontWeight: 'bold' }}>Admin</span>
                    </div>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }}><FaSignOutAlt /></button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <header style={headerStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        
                        {/* Cloche */}
                        <div onClick={() => setShowDropdown(!showDropdown)} style={{ position: 'relative', cursor: 'pointer', marginRight: '20px' }}>
                            <FaBell style={{ fontSize: '20px', color: '#666' }} />
                            {unreadCount > 0 && (
                                <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#FF4D4F', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold', border: '2px solid white' }}>
                                    {unreadCount}
                                </span>
                            )}
                        </div>

                        {/* Dropdown */}
                        {showDropdown && (
                            <div style={{ position: 'absolute', top: '45px', right: '50px', width: '320px', backgroundColor: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', borderRadius: '12px', zIndex: 1000, border: '1px solid #eee' }}>
                                <div style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <b style={{fontSize: '14px'}}>Notifications ({unreadCount})</b>
                                    <button onClick={markAllAsRead} style={{fontSize: '11px', border: 'none', background: 'none', color: COLOR_BLUE_LOGO, cursor: 'pointer', fontWeight: 'bold'}}>Tout lire</button>
                                </div>
                                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <p style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '13px' }}>Aucune notification</p>
                                    ) : (
                                        notifications.map(n => (
                                            <div 
                                                key={n._id || n.id} 
                                                onClick={() => handleNotificationClick(n)}
                                                style={{ padding: '12px 15px', borderBottom: '1px solid #f0f0f0', backgroundColor: n.isRead ? 'white' : '#f0f7ff', cursor: 'pointer', position: 'relative' }}
                                            >
                                                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#333', paddingRight: '20px' }}>{n.title}</div>
                                                <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>{n.message}</div>
                                                <div style={{ fontSize: '10px', color: '#aaa', marginTop: '5px' }}>{new Date(n.createdAt).toLocaleString()}</div>
                                                
                                                {/* BOUTON */}
                                                <div 
                                                    onClick={(e) => deleteNotification(n._id || n.id, e)}
                                                    style={{ position: 'absolute', top: '10px', right: '10px', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: '0.2s' }}
                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ffeeee'}
                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    <FaTimes style={{ color: '#ccc', fontSize: '12px' }} />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Profil */}
                        <div style={{ display: 'flex', alignItems: 'center', padding: '5px 12px', borderRadius: '20px', backgroundColor: '#f8f8f8' }}>
                            <span style={{ fontSize: '14px', marginRight: '10px', color: '#333', fontWeight: '500' }}>Admin</span>
                            <FaUser style={{ width: '25px', height: '25px', color: '#ccc' }} />
                        </div>
                    </div>
                </header>

                <div style={{ padding: '30px 40px', flexGrow: 1, overflowY: 'auto' }}>
                    <Outlet />
                </div>

                <footer style={{ padding: '15px 40px', borderTop: '1px solid #eee', textAlign: 'center', fontSize: '12px', color: '#999', background: 'white' }}>
                    © {new Date().getFullYear()} ALLOTRACTEUR - Propulsé par AGROTECH.
                </footer>
            </main>
        </div>
    );
}

export default AdminLayout;

     