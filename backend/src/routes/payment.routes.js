const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payments/payment.controller");
const { authenticate } = require("../middleware/auth.middleware");
const {
	initiatePaymentSchema,
	validate,
} = require("../validators/payment.validator");

/**
 * @swagger
 * /api/payments/initiate:
 *   post:
 *     summary: Initialiser un paiement PayTech (User/Provider/Admin)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InitiatePaymentRequest'
 *     responses:
 *       200:
 *         description: Paiement initialisé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Paiement initialisé avec succès
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       $ref: '#/components/schemas/Payment'
 *                     paytech:
 *                       type: object
 *                       properties:
 *                         transaction_id:
 *                           type: string
 *                         payment_url:
 *                           type: string
 *                         token:
 *                           type: string
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post(
	"/initiate",
	authenticate,
	validate(initiatePaymentSchema),
	paymentController.initiatePayment
);

/**
 * @swagger
 * /api/payments/webhook/paytech:
 *   post:
 *     summary: Webhook PayTech (pas d'authentification requise)
 *     tags: [Payments]
 *     description: Endpoint appelé par PayTech pour confirmer un paiement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token de transaction PayTech
 *               status:
 *                 type: string
 *                 enum: [success, failed, pending]
 *                 description: Statut du paiement
 *               amount:
 *                 type: number
 *                 description: Montant du paiement
 *               custom_field:
 *                 type: string
 *                 description: Données personnalisées (JSON stringifié)
 *     responses:
 *       200:
 *         description: Webhook reçu avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Signature invalide
 *       404:
 *         description: Paiement non trouvé
 */
router.post("/webhook/paytech", paymentController.handlePayTechWebhook);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Obtenir un paiement par ID (User/Provider/Admin)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du paiement
 *     responses:
 *       200:
 *         description: Paiement récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/:id", authenticate, paymentController.getPaymentById);

/**
 * @swagger
 * /api/payments/{id}/status:
 *   get:
 *     summary: Vérifier le statut d'un paiement (User/Provider/Admin)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du paiement
 *     responses:
 *       200:
 *         description: Statut du paiement récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/:id/status", authenticate, paymentController.checkPaymentStatus);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Obtenir tous les paiements (User/Provider/Admin)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, success, failed, cancelled]
 *         description: Filtrer par statut
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filtrer par utilisateur (admin seulement)
 *       - in: query
 *         name: providerId
 *         schema:
 *           type: string
 *         description: Filtrer par prestataire
 *     responses:
 *       200:
 *         description: Paiements récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/", authenticate, paymentController.getAllPayments);

module.exports = router;
