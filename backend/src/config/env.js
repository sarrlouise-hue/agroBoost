require("dotenv").config();

module.exports = {
	NODE_ENV: process.env.NODE_ENV || "production",
	PORT: process.env.PORT || 3000,

	// Database PostgreSQL (SUPABASE / PROD)
	DB: {
		URI:
			process.env.DATABASE_URL ||
			process.env.DB_URI ||
			(() => {
				const user = process.env.DB_USER || "postgres";
				const password = String(process.env.DB_PASSWORD || "");
				const host = process.env.DB_HOST || "db.gyhtitfioznegorynesn.supabase.co";
				const port = process.env.DB_PORT || 5432;
				const name = process.env.DB_NAME || "postgres";

				const encodedPassword = encodeURIComponent(password);

				return `postgresql://${user}:${encodedPassword}@${host}:${port}/${name}`;
			})(),
		HOST: process.env.DB_HOST || "db.gyhtitfioznegorynesn.supabase.co",
		PORT: process.env.DB_PORT || 5432,
		USER: process.env.DB_USER || "postgres",
		PASSWORD: String(process.env.DB_PASSWORD || ""),
		NAME: process.env.DB_NAME || "postgres",
	},

	// JWT
	JWT: {
		SECRET: process.env.JWT_SECRET || "CHANGE_ME_STRONG_SECRET",
		EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
		REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "CHANGE_ME_REFRESH_SECRET",
		REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
	},

	// OTP
	OTP: {
		EXPIRES_IN: process.env.OTP_EXPIRES_IN || "5m",
		LENGTH: parseInt(process.env.OTP_LENGTH, 10) || 6,
	},

	// Redis (optionnel prod)
	REDIS: {
		URL: process.env.REDIS_URL || "",
	},

	// PayTech
	PAYTECH: {
		API_KEY: process.env.PAYTECH_API_KEY || "",
		API_SECRET: process.env.PAYTECH_API_SECRET || "",
		BASE_URL: process.env.PAYTECH_BASE_URL || "https://paytech.sn",
		ENV: process.env.PAYTECH_ENV || "production",
		IPN_URL: process.env.PAYTECH_IPN_URL || "",
		SUCCESS_URL: process.env.PAYTECH_SUCCESS_URL || "",
		CANCEL_URL: process.env.PAYTECH_CANCEL_URL || "",
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

	// Upload
	UPLOAD: {
		MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880,
		PATH: process.env.UPLOAD_PATH || "./uploads",
	},

	// Cloudinary
	CLOUDINARY: {
		CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
		API_KEY: process.env.CLOUDINARY_API_KEY || "",
		API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
	},

	// Rate Limit
	RATE_LIMIT: {
		WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
		MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
	},

	// URLs PRODUCTION
	API_URL: process.env.API_URL || "https://agro-boost-ruddy.vercel.app",
	FRONTEND_URL: process.env.FRONTEND_URL || "https://allotracteur.com",
	ADMIN_URL: process.env.ADMIN_URL || "https://admin.allotracteur.com/",

	// Email (PRODUCTION)
	EMAIL: {
		HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
		PORT: parseInt(process.env.EMAIL_PORT, 10) || 587,
		SECURE: process.env.EMAIL_SECURE === "true",
		USER: process.env.EMAIL_USER || "",
		PASSWORD: process.env.EMAIL_PASSWORD || "",
		FROM_EMAIL: process.env.EMAIL_FROM_EMAIL || process.env.EMAIL_USER || "",
		FROM_NAME: process.env.EMAIL_FROM_NAME || "AlloTracteur",
		APP_NAME: process.env.EMAIL_APP_NAME || "AlloTracteur",
		SUPPORT_EMAIL: process.env.EMAIL_SUPPORT_EMAIL || "",
		FRONTEND_URL: process.env.FRONTEND_URL || "https://allotracteur.com",
	},
};
