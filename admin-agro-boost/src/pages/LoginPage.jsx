import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiPhone } from "react-icons/fi";
import api from "../services/api";
import logo from "../assets/logo.png";

const COLORS = {
    primary: "#3A7C35", // Vert principal
    darkGreen: "#2B7133",
    lightGreen: "#E8F5E9",
    lightBg: "#FDFAF8",
    textDark: "#1A1A1A",
    textLight: "#8C8C8C",
    border: "#E8E8E8",
    white: "#FFFFFF",
    error: "#E74C3C"
};

const LoginPage = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post("/auth/login", {
                phoneNumber: phone,
                password,
            });
            const token = response.data.data.token;
            if (!token) throw new Error("Token non reçu.");
            localStorage.setItem("agroboost_admin_token", token);
            localStorage.setItem("agroboost_user_data", JSON.stringify(response.data.data.user));
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Identifiants incorrects.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700;800&display=swap');
                input:focus {
                    outline: none;
                    border-color: ${COLORS.primary} !important;
                    background-color: ${COLORS.white} !important;
                    box-shadow: 0 0 0 4px rgba(58, 124, 53, 0.15);
                }
                button:active { transform: scale(0.98); }
            `}</style>

            <div style={styles.card}>
                {/* Section Header avec Logo Agrandi */}
                <div style={styles.headerSection}>
                    <div style={styles.logoCircle}>
                        <img src={logo} alt="Logo" style={styles.logoImg} />
                    </div>
                    <h1 style={styles.title}>ALLO TRACTEUR</h1>
                    <p style={styles.subtitle}>Administration & Gestion</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && (
                        <div style={styles.errorAlert}>
                            <span style={{ marginRight: "8px" }}>⚠️</span> {error}
                        </div>
                    )}

                    {/* Champ Téléphone */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Numéro de téléphone</label>
                        <div style={styles.inputWrapper}>
                            <FiPhone style={styles.inputIcon} />
                            <input
                                type="tel"
                                placeholder="77XXXXXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>

                    {/* Champ Mot de passe */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mot de passe</label>
                        <div style={styles.inputWrapper}>
                            <FiLock style={styles.inputIcon} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                                required
                            />
                            <div onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.submitBtn,
                            backgroundColor: loading ? COLORS.textLight : COLORS.primary,
                        }}
                    >
                        {loading ? "Connexion en cours..." : "SE CONNECTER"}
                    </button>
                </form>

                <div style={styles.footer}>
                    Plateforme Sécurisée Allotracteur v2.0
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: COLORS.lightBg,
        padding: "24px",
        fontFamily: "'Inter', sans-serif",
    },
    card: {
        width: "100%",
        maxWidth: "460px",
        backgroundColor: COLORS.white,
        borderRadius: "32px",
        padding: "50px 40px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.05)",
        textAlign: "center",
    },
    headerSection: {
        marginBottom: "45px",
    },
    logoCircle: {
        width: "110px", // Agrandissement du logo
        height: "110px",
        margin: "0 auto 20px",
        backgroundColor: COLORS.lightWhite, 
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "15px",
        border: `2px solid ${COLORS.primary}20`, 
    },
    logoImg: {
        width: "100%",
        height: "100%",
        objectFit: "contain",
    },
    title: {
        fontFamily: "'Poppins', sans-serif",
        fontSize: "28px", 
        fontWeight: "800",
        color: COLORS.primary, 
        margin: "0 0 5px 0",
        letterSpacing: "-0.5px",
    },
    subtitle: {
        fontSize: "15px",
        fontWeight: "500",
        color: COLORS.textLight,
        margin: 0,
    },
    form: {
        textAlign: "left",
    },
    inputGroup: {
        marginBottom: "28px",
    },
    label: {
        fontSize: "14px",
        fontWeight: "600",
        color: COLORS.textDark,
        marginBottom: "10px",
        display: "block",
        marginLeft: "4px",
    },
    inputWrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },
    inputIcon: {
        position: "absolute",
        left: "16px",
        color: COLORS.primary, 
        fontSize: "20px",
    },
    input: {
        width: "100%",
        padding: "16px 16px 16px 52px",
        fontSize: "16px",
        borderRadius: "16px",
        border: `1.5px solid ${COLORS.border}`,
        backgroundColor: "#F9F9F9",
        transition: "all 0.3s ease",
        color: COLORS.textDark,
    },
    eyeIcon: {
        position: "absolute",
        right: "16px",
        cursor: "pointer",
        color: COLORS.textLight,
        display: "flex",
        alignItems: "center",
    },
    submitBtn: {
        width: "100%",
        padding: "18px",
        borderRadius: "16px",
        border: "none",
        color: COLORS.white,
        fontSize: "16px",
        fontWeight: "700",
        fontFamily: "'Poppins', sans-serif",
        marginTop: "15px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: `0 8px 20px rgba(58, 124, 53, 0.25)`,
    },
    errorAlert: {
        backgroundColor: "#FDEDEC",
        color: COLORS.error,
        padding: "14px",
        borderRadius: "12px",
        fontSize: "13px",
        marginBottom: "25px",
        border: `1px solid rgba(231, 76, 60, 0.1)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    footer: {
        marginTop: "50px",
        fontSize: "12px",
        color: COLORS.textLight,
        fontWeight: "500",
    }
};

export default LoginPage;