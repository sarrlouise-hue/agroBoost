import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import logo from "../assets/logo.png";

const styles = {
	container: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		minHeight: "90vh", // Utilisation de minHeight pour le scroll mobile
		backgroundColor: "#f4f7f9",
		padding: "20px", // Espace de sécurité sur les bords
	},
	card: {
		width: "100%", // Prend toute la largeur dispo
		maxWidth: "400px", // Mais s'arrête à 400px sur PC
		padding: "30px 20px", // Padding réduit pour mobile
		backgroundColor: "white",
		borderRadius: "12px",
		boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
		textAlign: "center",
	},
	logo: {
		fontSize: "clamp(1.4em, 5vw, 1.8em)", // Taille de texte fluide
		fontWeight: "bold",
		color: "#006633",
		marginBottom: "20px",
	},
	input: {
		width: "100%",
		padding: "14px", // Plus grand pour faciliter le clic au doigt
		margin: "5px 0 15px 0",
		border: "1px solid #ccc",
		borderRadius: "8px",
		boxSizing: "border-box",
		fontSize: "16px", // Évite le zoom automatique forcé sur iPhone
	},
	labelContainer: {
		textAlign: "left",
		marginBottom: "5px",
		fontWeight: "bold",
		fontSize: "14px",
		color: "#333",
	},
	button: {
		width: "100%",
		padding: "14px",
		backgroundColor: "#4CAF50",
		color: "white",
		border: "none",
		borderRadius: "8px",
		cursor: "pointer",
		marginTop: "10px",
		fontSize: "1em",
		fontWeight: "bold",
		transition: "background-color 0.3s",
	},
	// Le cercle d'icône devient plus petit sur mobile via une astuce simple
	iconCircleStyle: {
		width: "clamp(80px, 20vw, 140px)",
		height: "clamp(80px, 20vw, 140px)",
		borderRadius: "50%",
		// backgroundColor: "#E8F5E9",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		margin: "0 auto 20px auto",
	},
};

function LoginPage() {
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
			if (!token) throw new Error("Token de connexion non reçu.");

			localStorage.setItem("agroboost_admin_token", token);
			localStorage.setItem(
				"agroboost_user_data",
				JSON.stringify(response.data.data.user)
			);
			navigate("/", { replace: true });
		} catch (err) {
			setError(err.response?.data?.message || "Identifiants incorrects.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={styles.container}>
			<div style={styles.card}>
				<div style={styles.logo}>ALLO TRACTEUR Admin</div>

				<div style={styles.iconCircleStyle}>
					<img
						src={logo}
						alt="Logo"
						style={{
							width: "90%",
							height: "90%",
							objectFit: "contain",
						}}
					/>
				</div>

				<form onSubmit={handleSubmit}>
					{error && (
						<p
							style={{
								color: "#d32f2f",
								fontSize: "13px",
								marginBottom: "15px",
								backgroundColor: "#ffebee",
								padding: "10px",
								borderRadius: "4px",
							}}
						>
							⚠️ {error}
						</p>
					)}

					<div style={styles.labelContainer}>
						<label htmlFor="phone">Numéro de Téléphone</label>
						<input
							id="phone"
							type="tel"
							placeholder="Ex: 77XXXXXXX"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							style={styles.input}
							required
						/>
					</div>

					<div style={styles.labelContainer}>
						<label htmlFor="password">Mot de passe</label>
						<div style={{ position: "relative" }}>
							<input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								style={{ ...styles.input, paddingRight: "45px" }}
								required
							/>
							<div
								onClick={() => setShowPassword(!showPassword)}
								style={{
									position: "absolute",
									right: "12px",
									top: "50%",
									transform: "translateY(-50%)",
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									color: "#666",
									padding: "5px",
									marginTop: "-5px", // Ajustement pour compenser la marge de l'input
								}}
							>
								{showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
							</div>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						style={{
							...styles.button,
							backgroundColor: loading ? "#a5d6a7" : "#4CAF50",
							cursor: loading ? "not-allowed" : "pointer",
						}}
					>
						{loading ? "Connexion..." : "SE CONNECTER"}
					</button>
				</form>
			</div>
		</div>
	);
}

export default LoginPage;
