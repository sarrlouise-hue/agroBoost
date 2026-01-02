const paymentService = require("../../services/payment/payment.service");
const { success, paginated } = require("../../utils/response");

/**
 * Initialiser un paiement
 * POST /api/payments/initiate
 */
const initiatePayment = async (req, res, next) => {
	try {
		const userId = req.user.userId;
		const { bookingId, phoneNumber, successUrl, cancelUrl } = req.body;

		const options = { successUrl, cancelUrl };
		const result = await paymentService.initiatePayment(
			userId,
			bookingId,
			phoneNumber,
			options
		);
		return success(res, result, "Paiement initialisé avec succès");
	} catch (err) {
		next(err);
	}
};

/**
 * Traiter un webhook PayTech
 * POST /api/payments/webhook/paytech
 */
const handlePayTechWebhook = async (req, res, next) => {
	try {
		console.log("PAYTECH WEBHOOK BODY:", JSON.stringify(req.body));
		const result = await paymentService.handleWebhook(req.body);

		// PayTech attend un statut 200 pour confirmer la réception
		res
			.status(200)
			.json({ success: true, message: "Webhook reçu avec succès" });
	} catch (err) {
		next(err);
	}
};

/**
 * Obtenir un paiement par ID
 * GET /api/payments/:id
 */
const getPaymentById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const payment = await paymentService.getPaymentById(id);
		return success(res, payment, "Paiement récupéré avec succès");
	} catch (err) {
		next(err);
	}
};

/**
 * Obtenir tous les paiements
 * GET /api/payments
 */
const getAllPayments = async (req, res, next) => {
	try {
		const { page, limit, userId, providerId, status } = req.query;

		// Si l'utilisateur n'est pas admin, filtrer par son ID
		const options = {
			page,
			limit,
			userId: req.user.role === "admin" ? userId : req.user.userId,
			providerId,
			status,
		};

		const result = await paymentService.getAllPayments(options);
		return paginated(
			res,
			result.payments,
			result.pagination,
			"Paiements récupérés avec succès"
		);
	} catch (err) {
		next(err);
	}
};

/**
 * Vérifier le statut d'un paiement
 * GET /api/payments/:id/status
 */
const checkPaymentStatus = async (req, res, next) => {
	try {
		const { id } = req.params;
		const payment = await paymentService.checkPaymentStatus(id);
		return success(res, payment, "Statut du paiement récupéré avec succès");
	} catch (err) {
		next(err);
	}
};

/**
 * Vérifier le statut d'un paiement via l'ID de réservation
 * GET /api/payments/bookings/:bookingId/status
 */
const checkBookingPaymentStatus = async (req, res, next) => {
	try {
		const { bookingId } = req.params;
		const payment = await paymentService.checkPaymentStatusByBookingId(
			bookingId
		);
		return success(res, payment, "Statut du paiement récupéré avec succès");
	} catch (err) {
		next(err);
	}
};

module.exports = {
	initiatePayment,
	handlePayTechWebhook,
	getPaymentById,
	getAllPayments,
	checkPaymentStatus,
	checkBookingPaymentStatus,
};
