const rateLimit = require("express-rate-limit");
const { RATE_LIMIT } = require("../config/env");

// Middleware no-op pour les tests
const noOpMiddleware = (req, res, next) => next();

// Fonction pour obtenir l'IP réelle du client même avec trust proxy
const getClientIp = (req) => {
	// Essayer d'obtenir l'IP depuis les headers du proxy (Vercel, etc.)
	const forwarded = req.headers["x-forwarded-for"];
	if (forwarded) {
		// x-forwarded-for peut contenir plusieurs IPs, prendre la première
		return forwarded.split(",")[0].trim();
	}
	// Fallback sur req.ip (qui utilise trust proxy si activé)
	return req.ip || req.connection.remoteAddress || "unknown";
};

// Limiteur de taux global (désactivé en mode test)
const rateLimiter =
	process.env.NODE_ENV === "test"
		? noOpMiddleware
		: rateLimit({
				windowMs: RATE_LIMIT.WINDOW_MS,
				max: RATE_LIMIT.MAX_REQUESTS,
				message: {
					success: false,
					message:
						"Trop de requêtes depuis cette IP, veuillez réessayer plus tard.",
				},
				standardHeaders: true,
				legacyHeaders: false,
				// Désactiver la validation trust proxy pour éviter l'erreur
				// On utilise notre propre fonction pour obtenir l'IP
				validate: {
					trustProxy: false,
				},
				// Utiliser notre fonction personnalisée pour obtenir l'IP
				keyGenerator: getClientIp,
		  });

// Limiteur de taux plus strict pour les endpoints d'authentification (désactivé en mode test)
const authRateLimiter =
	process.env.NODE_ENV === "test"
		? noOpMiddleware
		: rateLimit({
				windowMs: 15 * 60 * 1000, // 15 minutes
				max: 100, // 5 requêtes par fenêtre
				message: {
					success: false,
					message:
						"Trop de tentatives d'authentification, veuillez réessayer plus tard.",
				},
				// Désactiver la validation trust proxy pour éviter l'erreur
				validate: {
					trustProxy: false,
				},
				// Utiliser notre fonction personnalisée pour obtenir l'IP
				keyGenerator: getClientIp,
		  });

module.exports = {
	rateLimiter,
	authRateLimiter,
};
