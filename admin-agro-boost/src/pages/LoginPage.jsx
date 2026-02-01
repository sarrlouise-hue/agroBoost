import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiPhone } from "react-icons/fi";
import api from "../services/api";
import logo from "../assets/logo.png";

const COLORS = {
    primary: "#3A7C35",
    darkGreen: "#2B7133",
    lightBg: "#F9FAF9",
    textDark: "#1A1A1A",
    textLight: "#7A7A7A",
    border: "#E0E0E0",
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
            const response = await api.post("/auth/login", { phoneNumber: phone, password });
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
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap');
                input:focus {
                    outline: none;
                    border-color: ${COLORS.primary} !important;
                    box-shadow: 0 0 0 4px rgba(58, 124, 53, 0.15);
                }
                button:active { transform: scale(0.98); }
            `}</style>

            <div style={styles.card}>
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
        padding: "16px",
        fontFamily: "'Inter', sans-serif",
    },
    card: {
        width: "100%",
        maxWidth: "400px",
        backgroundColor: COLORS.white,
        borderRadius: "24px",
        padding: "40px 30px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.05)",
        textAlign: "center",
        boxSizing: "border-box",
    },
    headerSection: {
        marginBottom: "35px",
    },
    logoCircle: {
        width: "90px",
        height: "90px",
        margin: "0 auto 20px",
        backgroundColor: COLORS.white,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `2px solid ${COLORS.primary}30`,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        padding: "8px",
    },
    logoImg: {
        width: "70px",
        height: "70px",
        objectFit: "contain",
    },
    title: {
        fontFamily: "'Poppins', sans-serif",
        fontSize: "24px",
        fontWeight: "700",
        color: COLORS.primary,
        margin: "0 0 5px 0",
    },
    subtitle: {
        fontSize: "14px",
        fontWeight: "500",
        color: COLORS.textLight,
        margin: 0,
    },
    form: {
        textAlign: "left",
    },
    inputGroup: {
        marginBottom: "22px",
    },
    label: {
        fontSize: "13px",
        fontWeight: "600",
        color: COLORS.textDark,
        marginBottom: "6px",
        display: "block",
    },
    inputWrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },
    inputIcon: {
        position: "absolute",
        left: "14px",
        color: COLORS.primary,
        fontSize: "18px",
    },
    input: {
        width: "100%",
        padding: "14px 14px 14px 46px",
        fontSize: "15px",
        borderRadius: "12px",
        border: `1.5px solid ${COLORS.border}`,
        backgroundColor: "#F9F9F9",
        transition: "all 0.3s ease",
        color: COLORS.textDark,
    },
    eyeIcon: {
        position: "absolute",
        right: "14px",
        cursor: "pointer",
        color: COLORS.textLight,
        display: "flex",
        alignItems: "center",
    },
    submitBtn: {
        width: "100%",
        padding: "16px",
        borderRadius: "12px",
        border: "none",
        color: COLORS.white,
        fontSize: "15px",
        fontWeight: "700",
        fontFamily: "'Poppins', sans-serif",
        marginTop: "15px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: `0 6px 18px rgba(58, 124, 53, 0.2)`,
    },
    errorAlert: {
        backgroundColor: "#FDEDEC",
        color: COLORS.error,
        padding: "12px",
        borderRadius: "12px",
        fontSize: "13px",
        marginBottom: "20px",
        border: `1px solid rgba(231, 76, 60, 0.1)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    footer: {
        marginTop: "35px",
        fontSize: "12px",
        color: COLORS.textLight,
        fontWeight: "500",
    },
};

export default LoginPage;
