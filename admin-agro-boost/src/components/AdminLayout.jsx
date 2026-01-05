import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
    FaUser, FaTractor, FaUsers, FaClipboardList, FaTools, 
    FaSignOutAlt, FaBell, FaChartBar, FaTimes, FaBars,
    FaChevronRight, FaChevronLeft, FaSun, FaMoon, FaCog
} from "react-icons/fa";

const COLORS = {
    primary: "#3A7C35",
    secondary: "#709D54",   
    accent: "#C2D747",      
    darkGreen: "#2B7133",
    lightBg: "#FDFAF8",     
    darkBg: "#121212",      
    white: "#FFFFFF"
};

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // États
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // États API
    const [adminData, setAdminData] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // 1. Récupérer le Profil et les Notifications
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("agroboost_admin_token");
            if (!token) { navigate("/login"); return; }

            const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

            try {
                // Récupérer Profil
                const resProfile = await fetch("/api/users/profile", { headers });
                const dataProfile = await resProfile.json();
                if (dataProfile.success) setAdminData(dataProfile.data);

                // Récupérer Notifications (Admin)
                const resNotif = await fetch("/api/notifications/all", { headers });
                const dataNotif = await resNotif.json();
                if (dataNotif.success) setNotifications(dataNotif.data || []);
            } catch (err) {
                console.error("Erreur chargement données:", err);
            }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
            localStorage.removeItem("agroboost_admin_token");
            navigate("/login");
        }
    };

    return (
        <div className={`layout-container ${isDarkMode ? "dark-mode" : ""}`}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Poppins:wght@500;600&display=swap');
                :root { --sidebar-full: 280px; --sidebar-collapsed: 85px; --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
                
                .layout-container { display: flex; min-height: 100vh; background: ${isDarkMode ? COLORS.darkBg : COLORS.lightBg}; color: ${isDarkMode ? "#ffffff" : "#333333"}; }

                /* SIDEBAR */
                .sidebar {
                    width: ${isCollapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-full)"};
                    background: ${COLORS.darkGreen}; color: white;
                    position: fixed; top: 0; bottom: 0; left: 0; z-index: 1100;
                    display: flex; flex-direction: column; transition: var(--transition);
                }

                .nav-item {
                    display: flex; align-items: center; padding: 15px 25px;
                    color: rgba(255,255,255,0.7); text-decoration: none;
                    font-family: 'Poppins', sans-serif; transition: 0.2s;
                }
                .nav-item:hover { background: rgba(255,255,255,0.1); color: white; }
                .nav-item.active { background: ${COLORS.primary}; color: white; border-left: 6px solid ${COLORS.accent}; }

                /* HEADER & ICONS */
                .header {
                    height: 80px; background: ${isDarkMode ? "#1e1e1e" : "white"};
                    padding: 0 30px; display: flex; align-items: center; justify-content: space-between;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 1000;
                }

                .action-icon {
                    width: 45px; height: 45px; display: flex; align-items: center; justify-content: center;
                    border-radius: 12px; cursor: pointer; border: none; outline: none;
                    background: ${isDarkMode ? "#333" : "#f5f5f5"};
                    color: ${isDarkMode ? COLORS.accent : COLORS.darkGreen};
                    transition: transform 0.1s;
                }
                /* Ombre uniquement lors du clic */
                .action-icon:active { transform: scale(0.92); box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); }

                /* NOTIFICATIONS RESPONSIVE */
                .notif-dropdown {
                    width: 400px; position: absolute; top: 70px; right: 0;
                    background: ${isDarkMode ? "#252525" : "white"};
                    border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.2);
                    border: 1px solid ${isDarkMode ? "#444" : "#eee"}; overflow: hidden;
                }

                @media (max-width: 992px) {
                    .sidebar { transform: translateX(${isMobileMenuOpen ? "0" : "-100%"}); width: var(--sidebar-full) !important; }
                    .main-content { margin-left: 0 !important; }
                    .mobile-toggle { display: block !important; cursor: pointer; background: none; border: none; margin-right: 15px; }
                    
                    /* Correction débordement boîte notification sur mobile */
                    .notif-dropdown { 
                        width: calc(100vw - 40px); 
                        position: fixed; 
                        left: 20px; 
                        right: 20px; 
                        top: 85px; 
                        max-height: 70vh;
                        overflow-y: auto;
                    }
                }
            `}</style>

            {/* Overlay Mobile */}
            {isMobileMenuOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050 }} onClick={() => setIsMobileMenuOpen(false)} />
            )}

            <aside className="sidebar">
                <button style={{
                    position: 'absolute', right: '-12px', top: '48px', width: '26px', height: '26px',
                    background: COLORS.accent, borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', border: 'none', color: COLORS.darkGreen, zIndex: 1200
                }} onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <FaChevronRight size={14}/> : <FaChevronLeft size={14}/>}
                </button>

                <div style={{ padding: '40px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src="/logo.jpeg" alt="Logo" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                    {!isCollapsed && <div style={{ fontFamily: 'Poppins', fontSize: '22px', fontWeight: 600 }}><span style={{ color: COLORS.accent }}>ALLO</span> TRACTEUR</div>}
                </div>

                <nav style={{ flexGrow: 1, marginTop: "20px" }}>
                    {[
                        { name: "Tableau de bord", path: "/", icon: <FaClipboardList /> },
                        { name: "Utilisateurs", path: "/users", icon: <FaUsers /> },
                        { name: "Services", path: "/services", icon: <FaTractor /> },
                        { name: "Réservations", path: "/reservations", icon: <FaClipboardList /> },
                        { name: "Entretien", path: "/maintenance", icon: <FaTools /> },
                        { name: "Rapports", path: "/maintenance/reports", icon: <FaChartBar /> },
                    ].map((item) => (
                        <Link key={item.path} to={item.path} className={`nav-item ${location.pathname === item.path ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
                            <span style={{ minWidth: "30px", fontSize: "20px" }}>{item.icon}</span>
                            {!isCollapsed && <span style={{ marginLeft: "15px" }}>{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div style={{ paddingBottom: "20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    <Link to="/settings" className={`nav-item ${location.pathname === "/settings" ? "active" : ""}`} style={{ marginTop: "10px" }}>
                        <span style={{ minWidth: "30px", fontSize: "20px" }}><FaCog /></span>
                        {!isCollapsed && <span style={{ marginLeft: "15px" }}>Paramètres</span>}
                    </Link>
                    <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', width: '100%', color: '#ffccc7', cursor: 'pointer', textAlign: 'left' }}>
                        <span style={{ minWidth: "30px", fontSize: "20px" }}><FaSignOutAlt /></span>
                        {!isCollapsed && <span style={{ marginLeft: "15px" }}>Déconnexion</span>}
                    </button>
                </div>
            </aside>

            <main className="main-content" style={{ flexGrow: 1, marginLeft: isCollapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-full)", transition: "var(--transition)" }}>
                <header className="header">
                    <button className="mobile-toggle" style={{ display: 'none' }} onClick={() => setIsMobileMenuOpen(true)}>
                        <FaBars size={24} color={COLORS.darkGreen} />
                    </button>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginLeft: 'auto' }}>
                        {/* Switch Thème */}
                        <div className="action-icon" onClick={() => setIsDarkMode(!isDarkMode)}>
                            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                        </div>

                        {/* Notifications */}
                        <div style={{ position: 'relative' }}>
                            <div className="action-icon" onClick={() => setShowNotifications(!showNotifications)}>
                                <FaBell size={20} />
                                {notifications.filter(n => !n.isRead).length > 0 && (
                                    <span style={{ position: 'absolute', top: 10, right: 10, width: 10, height: 10, background: 'red', borderRadius: '50%', border: '2px solid white' }}></span>
                                )}
                            </div>

                            {showNotifications && (
                                <div className="notif-dropdown">
                                    <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${isDarkMode ? "#444" : "#eee"}` }}>
                                        <span style={{ fontWeight: 600 }}>Notifications ({notifications.length})</span>
                                        <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowNotifications(false)} />
                                    </div>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {notifications.length > 0 ? (
                                            notifications.map((n, i) => (
                                                <div key={i} style={{ padding: '12px 20px', borderBottom: `1px solid ${isDarkMode ? "#333" : "#f9f9f9"}`, fontSize: '13px' }}>
                                                    {n.message}
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>Aucune notification</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profil Admin */}
                        <div 
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '5px 10px', borderRadius: '12px' }}
                            onClick={() => navigate("/profile")}
                            onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#333' : '#f5f5f5'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <div style={{ textAlign: 'right', display: window.innerWidth > 768 ? 'block' : 'none' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600 }}>
                                    {adminData ? `${adminData.firstName} ${adminData.lastName}` : "Admin"}
                                </div>
                                <div style={{ fontSize: '11px', color: COLORS.primary }}>Gérer mon profil</div>
                            </div>
                            <div style={{ width: 42, height: 42, borderRadius: '12px', background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <FaUser size={18} />
                            </div>
                        </div>
                    </div>
                </header>

                <div style={{ padding: "30px", minHeight: "calc(100vh - 160px)" }}>
                    <Outlet />
                </div>

                <footer style={{ padding: "20px", textAlign: "center", fontSize: "12px", opacity: 0.6, borderTop: `1px solid ${isDarkMode ? "#333" : "#eee"}` }}>
                    © {new Date().getFullYear()} <b style={{ color: COLORS.primary }}>ALLOTRACTEUR</b> - Secteur Agricole Moderne.
                </footer>
            </main>
        </div>
    );
}

export default AdminLayout;