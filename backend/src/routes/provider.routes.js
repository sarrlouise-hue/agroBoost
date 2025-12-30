const express = require("express");
const router = express.Router();
const providerController = require("../controllers/providers/provider.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const {
	registerProviderSchema,
	updateProviderSchema,
	validate,
} = require("../validators/provider.validator");
const { ROLES } = require("../config/constants");

/**
 * @swagger
 * /api/providers/register:
 *   post:
 *     summary: Inscription d'un prestataire (User)
 *     tags: [Providers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterProviderRequest'
 *     responses:
 *       201:
 *         description: Inscription prestataire réussie
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
 *                   example: Inscription prestataire réussie
 *                 data:
 *                   $ref: '#/components/schemas/Provider'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
// Routes spécifiques
router.post(
	"/register",
	authenticate,
	validate(registerProviderSchema),
	providerController.registerProvider
);

router.get(
	"/profile",
	authenticate,
	authorize(ROLES.PROVIDER, ROLES.ADMIN),
	providerController.getProfile
);

router.put(
	"/profile",
	authenticate,
	authorize(ROLES.PROVIDER, ROLES.ADMIN),
	validate(updateProviderSchema),
	providerController.updateProfile
);

router.put(
	"/profile/location",
	authenticate,
	authorize(ROLES.PROVIDER, ROLES.ADMIN),
	providerController.updateLocation
);

// Dashboard prestataire
router.get(
	"/dashboard",
	authenticate,
	authorize(ROLES.PROVIDER, ROLES.ADMIN),
	providerController.getDashboardStats
);

// Réservations reçues par le prestataire connecté
router.get(
	"/bookings",
	authenticate,
	authorize(ROLES.PROVIDER, ROLES.ADMIN),
	providerController.getMyBookings
);

// Avis reçus par le prestataire connecté
router.get(
	"/reviews",
	authenticate,
	authorize(ROLES.PROVIDER, ROLES.ADMIN),
	providerController.getMyReviews
);

router.get("/", providerController.getAllProviders);

router.get("/approved", providerController.getApprovedProviders);

// Routes avec ID - DOIVENT être à la fin
router.put(
	"/:id/approve",
	authenticate,
	authorize(ROLES.ADMIN),
	providerController.approveProvider
);

router.put(
	"/:id/reject",
	authenticate,
	authorize(ROLES.ADMIN),
	providerController.rejectProvider
);

router.get("/:id", providerController.getProfileById);

router.put(
	"/:id",
	authenticate,
	authorize(ROLES.ADMIN),
	providerController.updateProviderById
);

router.delete(
	"/:id",
	authenticate,
	authorize(ROLES.ADMIN),
	providerController.deleteProviderById
);

module.exports = router;
