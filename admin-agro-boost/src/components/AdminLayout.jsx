import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import {
	FaUser,
	FaTractor,
	FaUsers,
	FaClipboardList,
	FaTools,
	FaSignOutAlt,
	FaBell,
	FaChartBar,
	FaTimes,
	FaBars,
} from "react-icons/fa";

const COLOR_BLUE_DARK = "#002534";
const COLOR_BLUE_LIGHT_ACTIVE = "#003E57";
const COLOR_BLUE_LOGO = "#0070AB";

const NAV_ITEMS = [
	{ name: "Tableau de bord", path: "/", icon: <FaClipboardList /> },
	{ name: "Utilisateurs", path: "/users", icon: <FaUsers /> },
	{ name: "Services", path: "/services", icon: <FaTractor /> },
	{ name: "Réservations", path: "/reservations", icon: <FaClipboardList /> },
	{ name: "Entretien machines", path: "/maintenance", icon: <FaTools /> },
	{
		name: "Rapports Maintenance",
		path: "/maintenance/reports",
		icon: <FaChartBar />,
	},
];

function AdminLayout() {
	const navigate = useNavigate();
	const location = useLocation();
	const [notifications, setNotifications] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const prevCountRef = useRef(0);
	const dropdownRef = useRef(null);

	const fetchNotifications = async () => {
		try {
			const response = await api.get("/notifications");
			const data = response.data.data || response.data || [];
			const currentUnread = data.filter((n) => !n.isRead).length;
			if (currentUnread > prevCountRef.current) {
				const audio = new Audio(
					"https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
				);
				audio.play().catch(() => {});
			}
			prevCountRef.current = currentUnread;
			setNotifications(data);
		} catch (error) {
			console.error("Erreur notifications:", error);
		}
	};

	const markAllAsRead = async () => {
		try {
			await api.put("/notifications/mark-all-read");
			setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
		} catch (error) {
			console.error("Erreur marquage lu:", error);
		}
	};

	useEffect(() => {
		fetchNotifications();
		const interval = setInterval(fetchNotifications, 30000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		setIsSidebarOpen(false);
	}, [location.pathname]);

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	const handleLogout = () => {
		if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
			localStorage.removeItem("agroboost_admin_token");
			navigate("/login", { replace: true });
		}
	};

	return (
		<div className="layout-container">
			<style>{`
                .layout-container { display: flex; min-height: 100vh; background: #f4f7f9; }
                
                .sidebar {
                    width: 240px; background: ${COLOR_BLUE_DARK}; color: white;
                    display: flex; flex-direction: column; position: fixed;
                    top: 0; bottom: 0; left: 0; z-index: 1000;
                    transition: transform 0.3s ease;
                    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
                }

                .sidebar-logo {
                    padding: 30px 20px; text-align: center; font-weight: 800; 
                    font-size: 1.3rem; letter-spacing: 1.5px; border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                .main-content { 
                    flex-grow: 1; margin-left: 240px; 
                    display: flex; flex-direction: column; min-width: 0; 
                    transition: margin 0.3s ease;
                }

                /* --- NOTIFICATIONS AMÉLIORÉES --- */
                .notif-dropdown {
                    position: absolute; top: 50px; right: 0; 
                    width: 420px; /* Taille augmentée pour desktop */
                    background: white; border-radius: 12px; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                    border: 1px solid #eef0f2; z-index: 2000; overflow: hidden;
                }

                .notif-header {
                    padding: 15px 20px; font-weight: 700; border-bottom: 1px solid #f0f0f0;
                    display: flex; justify-content: space-between; align-items: center; 
                    background: #fff; color: ${COLOR_BLUE_DARK};
                }

                .notif-list { max-height: 400px; overflow-y: auto; }

                .notif-item { 
                    padding: 16px 20px; border-bottom: 1px solid #f8f9fa; 
                    font-size: 14px; color: #434343; line-height: 1.5;
                    transition: background 0.2s; position: relative;
                }

                .notif-item:hover { background: #fcfcfc; }

                .notif-item.unread { 
                    background: #f0f7ff; font-weight: 500; 
                    border-left: 4px solid ${COLOR_BLUE_LOGO}; 
                }
                
                .notif-empty { padding: 40px 20px; text-align: center; color: #bfbfbf; }

                /* --- RESPONSIVE MOBILE --- */
                @media (max-width: 992px) {
                    .sidebar { transform: translateX(${
											isSidebarOpen ? "0" : "-240px"
										}); }
                    .main-content { margin-left: 0; }
                    .sidebar-overlay {
                        display: ${isSidebarOpen ? "block" : "none"};
                        position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 900;
                    }
                    .content-wrapper { padding: 10px !important; }
                    .header { padding: 0 15px !important; }
                    .notif-dropdown { width: calc(100vw - 20px); right: -10px; position: fixed; top: 60px; left: 10px; }
                }

                /* --- AUTRES STYLES --- */
                .nav-item { 
                    margin: 4px 0; padding: 12px 25px; transition: 0.2s; 
                    cursor: pointer; display: flex; align-items: center; 
                    color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.95rem;
                }
                .nav-item:hover { color: white; background: rgba(255,255,255,0.05); }
                .nav-item.active { 
                    background: ${COLOR_BLUE_LIGHT_ACTIVE}; color: white; 
                    border-left: 4px solid ${COLOR_BLUE_LOGO}; 
                }
                .header { 
                    height: 65px; background: white; padding: 0 30px; 
                    display: flex; align-items: center; 
                    position: sticky; top: 0; z-index: 800; 
                    border-bottom: 1px solid #eee;
                }
                .mobile-toggle { display: none; background: none; border: none; font-size: 22px; cursor: pointer; }
                @media (max-width: 992px) { .mobile-toggle { display: block; } }
                
                .header-actions { display: flex; align-items: center; gap: 20px; }
                .profile-badge {
                    display: flex; align-items: center; gap: 10px; 
                    background: #f0f2f5; padding: 6px 12px; 
                    border-radius: 20px; cursor: pointer; border: 1px solid #eef0f2;
                }
                .notif-badge {
                    position: absolute; top: -7px; right: -7px; 
                    background: #FF4D4F; color: white; font-size: 10px; 
                    min-width: 18px; height: 18px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    border: 2px solid white; font-weight: bold;
                }
            `}</style>

			<div
				className="sidebar-overlay"
				onClick={() => setIsSidebarOpen(false)}
			></div>

			<aside className="sidebar">
				<div
					className="sidebar-logo"
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "10px",
					}}
				>
					<img
						src="/logo.jpeg"
						alt="Logo"
						style={{ width: "40px", height: "40px", borderRadius: "50%" }}
					/>
					<div style={{ textAlign: "left" }}>
						<span style={{ color: COLOR_BLUE_LOGO }}>ALLO</span> TRACTEUR
					</div>
				</div>
				<nav style={{ flexGrow: 1, marginTop: "10px" }}>
					{NAV_ITEMS.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							className={`nav-item ${
								location.pathname === item.path ? "active" : ""
							}`}
						>
							<span style={{ marginRight: "15px", fontSize: "18px" }}>
								{item.icon}
							</span>
							{item.name}
						</Link>
					))}
				</nav>
				<div
					style={{
						padding: "20px",
						borderTop: "1px solid rgba(255,255,255,0.05)",
					}}
				>
					<button
						onClick={handleLogout}
						style={{
							background: "none",
							border: "none",
							color: "#ff7875",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "10px",
							fontWeight: "600",
							width: "100%",
						}}
					>
						<FaSignOutAlt /> Déconnexion
					</button>
				</div>
			</aside>

			<main className="main-content">
				<header className="header">
					<button
						className="mobile-toggle"
						onClick={() => setIsSidebarOpen(true)}
					>
						<FaBars />
					</button>
					<div style={{ flexGrow: 1 }}></div>
					<div className="header-actions">
						<div style={{ position: "relative" }} ref={dropdownRef}>
							<div
								style={{ cursor: "pointer", position: "relative" }}
								onClick={() => {
									if (!showDropdown && unreadCount > 0) markAllAsRead();
									setShowDropdown(!showDropdown);
								}}
							>
								<FaBell color="#595959" size={20} />
								{unreadCount > 0 && (
									<span className="notif-badge">{unreadCount}</span>
								)}
							</div>

							{showDropdown && (
								<div className="notif-dropdown">
									<div className="notif-header">
										<span>Notifications</span>
										<FaTimes
											style={{ cursor: "pointer", color: "#999" }}
											onClick={() => setShowDropdown(false)}
										/>
									</div>
									<div className="notif-list">
										{notifications.length > 0 ? (
											notifications.map((n, i) => (
												<div
													key={i}
													className={`notif-item ${!n.isRead ? "unread" : ""}`}
												>
													{n.message}
												</div>
											))
										) : (
											<div className="notif-empty">
												<FaBell
													size={30}
													style={{ marginBottom: "10px", opacity: 0.2 }}
												/>
												<p>Aucune notification</p>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
						<div className="profile-badge">
							<div
								style={{
									background: "#d9d9d9",
									borderRadius: "50%",
									width: "26px",
									height: "26px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<FaUser color="white" size={14} />
							</div>
							<span
								style={{
									fontSize: "13px",
									fontWeight: "600",
									color: "#262626",
								}}
							>
								Admin
							</span>
						</div>
					</div>
				</header>

				<div
					className="content-wrapper"
					style={{ padding: "30px", flexGrow: 1, overflowY: "auto" }}
				>
					<Outlet />
				</div>

				<footer
					style={{
						padding: "20px 30px",
						borderTop: "1px solid #eee",
						textAlign: "center",
						fontSize: "12px",
						color: "#bfbfbf",
						background: "white",
					}}
				>
					© {new Date().getFullYear()} ALLOTRACTEUR - Propulsé par AGROTECH.
				</footer>
			</main>
		</div>
	);
}

export default AdminLayout;
