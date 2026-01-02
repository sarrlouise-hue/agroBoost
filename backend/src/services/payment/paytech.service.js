const axios = require("axios");
const crypto = require("crypto");
const { PAYTECH } = require("../../config/env");
const { AppError } = require("../../utils/errors");
const logger = require("../../utils/logger");

/**
 * Service d'intégration PayTech pour Mobile Money
 * Basé EXCLUSIVEMENT sur la documentation officielle : https://doc.intech.sn/doc_paytech.php
 */
class PayTechService {
	/**
	 * Initialiser un paiement PayTech
	 * @param {object} paymentData - Données du paiement
	 * @returns {Promise<object>} Réponse de PayTech
	 */
	async initiatePayment(paymentData) {
		try {
			const {
				amount,
				phoneNumber,
				fullName,
				description = "Paiement ALLO TRACTEUR",
				bookingId,
				userId,
			} = paymentData;

			if (!PAYTECH.API_KEY || !PAYTECH.API_SECRET) {
				throw new AppError(
					"Configuration PayTech incomplète (API_KEY ou API_SECRET manquante)",
					500
				);
			}

			const sanitizeUrl = (url, fallback) => {
				if (!url) return fallback;
				// PayTech rejette souvent les URLs localhost/127.0.0.1
				if (url.includes("localhost") || url.includes("127.0.0.1")) {
					logger.warn(
						`L'URL PayTech ${url} contient localhost. Substitution par le fallback: ${fallback}`
					);
					return fallback;
				}
				return url;
			};

			const defaultSuccessUrl =
				PAYTECH.SUCCESS_URL ||
				"https://agro-boost-ruddy.vercel.app/payment-success";
			const defaultCancelUrl =
				PAYTECH.CANCEL_URL ||
				"https://agro-boost-ruddy.vercel.app/payment-cancel";

			const appendParam = (url, param, value) => {
				const u = new URL(url);
				u.searchParams.set(param, value);
				return u.toString();
			};

			let successUrl = sanitizeUrl(paymentData.successUrl, defaultSuccessUrl);
			let cancelUrl = sanitizeUrl(paymentData.cancelUrl, defaultCancelUrl);

			// S'assurer que bookingId est dans les URLs de retour
			if (!successUrl.includes("booking=")) {
				successUrl = appendParam(successUrl, "booking", bookingId);
			}
			if (!cancelUrl.includes("booking=")) {
				cancelUrl = appendParam(cancelUrl, "booking", bookingId);
			}

			const requestData = {
				item_name: description,
				item_price: parseFloat(amount),
				currency: "XOF",
				ref_command: bookingId,
				command_name: `Réservation ${bookingId}`,
				env: PAYTECH.ENV || "test",
				ipn_url: PAYTECH.IPN_URL,
				success_url: successUrl,
				cancel_url: cancelUrl,
				custom_field: JSON.stringify({
					bookingId,
					userId,
					phoneNumber,
				}),
			};

			const apiUrl = "https://paytech.sn/api/payment/request-payment";

			logger.info(
				`Envoi requête PayTech (${
					requestData.env
				}) pour ${bookingId}: ${JSON.stringify(requestData)}`
			);

			const response = await axios.post(apiUrl, requestData, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					API_KEY: PAYTECH.API_KEY,
					API_SECRET: PAYTECH.API_SECRET,
				},
				timeout: 30000,
			});

			if (response.data && response.data.success === 1) {
				let redirectUrl = response.data.redirect_url;

				// Facultatif : Enrichir l'URL pour le pré-remplissage (Autofill)
				// fn = full name, pn = phone number
				const url = new URL(redirectUrl);
				if (fullName) url.searchParams.append("fn", fullName);
				if (phoneNumber) url.searchParams.append("pn", phoneNumber);

				return {
					success: true,
					token: response.data.token,
					payment_url: url.toString(),
					message: "Paiement initialisé avec succès",
				};
			}

			throw new AppError(
				response.data?.message ||
					"Échec de l'initialisation du paiement PayTech",
				400
			);
		} catch (error) {
			logger.error("Erreur PayTech initiatePayment:", error);

			if (error.response) {
				throw new AppError(
					error.response.data?.message ||
						"Erreur lors de l'initialisation du paiement",
					error.response.status || 500
				);
			}

			throw new AppError(
				`Erreur de communication avec PayTech: ${error.message}`,
				500
			);
		}
	}

	/**
	 * Vérifier le statut d'un paiement PayTech
	 * @param {string} token - Token de la transaction (si disponible)
	 * @returns {Promise<object>} Statut du paiement
	 */
	async verifyPayment(token) {
		try {
			// Correction: Le token doit être passé en paramètre de requête
			const apiUrl = `https://paytech.sn/api/payment/get-status?token_payment=${token}`;

			const response = await axios.get(apiUrl, {
				headers: {
					API_KEY: PAYTECH.API_KEY,
					API_SECRET: PAYTECH.API_SECRET,
				},
				timeout: 30000,
			});

			logger.info(
				`PayTech Response [${token}]: ${JSON.stringify(response.data)}`
			);

			return {
				success:
					response.data &&
					(response.data.success === 1 ||
						response.data.success === "1" ||
						response.data.success === true),
				status: (response.data?.status || "pending").toLowerCase(),
				transaction_id: response.data?.transaction_id,
				token: token,
				amount: response.data?.item_price,
				currency: response.data?.currency,
				type_event: response.data?.type_event,
			};
		} catch (error) {
			logger.error("Erreur PayTech verifyPayment:", error);
			throw new AppError("Erreur lors de la vérification du paiement", 500);
		}
	}

	/**
	 * Vérifier la signature d'un webhook PayTech (IPN)
	 * Formule : hash_hmac('sha256', item_price|ref_command|api_key, api_secret)
	 * @param {object} webhookData - Données du webhook
	 * @param {string} receivedSignature - Signature reçue (hash)
	 * @returns {boolean} True si la signature est valide
	 */
	verifyWebhookSignature(webhookData) {
		const { item_price, ref_command, hmac_compute } = webhookData;

		if (!item_price || !ref_command || !hmac_compute) return false;

		const message = `${item_price}|${ref_command}|${PAYTECH.API_KEY}`;

		const calculatedSignature = crypto
			.createHmac("sha256", PAYTECH.API_SECRET)
			.update(message)
			.digest("hex");

		return calculatedSignature === hmac_compute;
	}
}

module.exports = new PayTechService();
