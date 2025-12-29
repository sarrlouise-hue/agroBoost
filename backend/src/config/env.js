require("dotenv").config();

module.exports = {
	NODE_ENV: process.env.NODE_ENV || "development",
	PORT: process.env.PORT || 3000,

	// Database PostgreSQL
	DB: {
		URI:
			process.env.DATABASE_URL ||
			process.env.DB_URI ||
			(() => {
				const user = process.env.DB_USER || "postgres";
				const password = String(process.env.DB_PASSWORD || "");
				const host = process.env.DB_HOST || "127.0.0.1";
				const port = process.env.DB_PORT || 5432;
				const name = process.env.DB_NAME || "agroboost";
				// Encoder le mot de passe pour l'URL si nécessaire
				const encodedPassword = encodeURIComponent(password);
				return `postgresql://${user}:${encodedPassword}@${host}:${port}/${name}`;
			})(),
		HOST: process.env.DB_HOST || "127.0.0.1",
		PORT: process.env.DB_PORT || 5432,
		USER: process.env.DB_USER || "postgres",
		PASSWORD: String(process.env.DB_PASSWORD || ""), // S'assurer que c'est toujours une chaîne
		NAME: process.env.DB_NAME || "agroboost",
	},

	// JWT
	JWT: {
		SECRET: process.env.JWT_SECRET || "your-secret-key",
		EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
		REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your-refresh-secret",
		REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
	},

	// OTP
	OTP: {
		EXPIRES_IN: process.env.OTP_EXPIRES_IN || "5m",
		LENGTH: parseInt(process.env.OTP_LENGTH, 10) || 6,
	},

	// Redis
	REDIS: {
		URL: process.env.REDIS_URL || "redis://localhost:6379",
	},

	// PayTech Mobile Money
	PAYTECH: {
		API_KEY: process.env.PAYTECH_API_KEY || "",
		API_SECRET: process.env.PAYTECH_API_SECRET || "",
		MERCHANT_ID: process.env.PAYTECH_MERCHANT_ID || "",
		BASE_URL: process.env.PAYTECH_BASE_URL || "https://paytech.sn",
		WEBHOOK_SECRET:
			process.env.PAYTECH_WEBHOOK_SECRET ||
			process.env.PAYTECH_CALLBACK_SECRET ||
			"",
		IPN_URL: process.env.PAYTECH_IPN_URL || "",
	},

	// Google Maps
	GOOGLE_MAPS: {
		API_KEY: process.env.GOOGLE_MAPS_API_KEY || "",
	},

	// Firebase
	FIREBASE: {
		SERVER_KEY: process.env.FIREBASE_SERVER_KEY || "",
		PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "",
	},

	// File Upload
	UPLOAD: {
		MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880, // 5MB
		PATH: process.env.UPLOAD_PATH || "./uploads",
	},

	// Cloudinary
	CLOUDINARY: {
		CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
		API_KEY: process.env.CLOUDINARY_API_KEY || "",
		API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
	},

	// Rate Limiting
	RATE_LIMIT: {
		WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
		MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
	},

	// URLs
	API_URL: process.env.API_URL || "http://localhost:3000",
	FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3001",
	ADMIN_URL: process.env.ADMIN_URL || "http://localhost:3002",

	// Email
	EMAIL: {
		HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
		PORT: parseInt(process.env.EMAIL_PORT, 10) || 587,
		SECURE: process.env.EMAIL_SECURE === "true" || false, // true pour 465, false pour les autres ports
		USER: process.env.EMAIL_USER || "",
		PASSWORD: process.env.EMAIL_PASSWORD || "",
		FROM_EMAIL: process.env.EMAIL_FROM_EMAIL || process.env.EMAIL_USER || "",
		FROM_NAME: process.env.EMAIL_FROM_NAME || "AlloTracteur",
		APP_NAME: process.env.EMAIL_APP_NAME || "AlloTracteur",
		SUPPORT_EMAIL:
			process.env.EMAIL_SUPPORT_EMAIL || process.env.EMAIL_USER || "",
		FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3001",
	},
};
