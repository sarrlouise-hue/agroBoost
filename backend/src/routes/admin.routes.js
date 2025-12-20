const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin/admin.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { ROLES } = require("../config/constants");

const bookingController = require("../controllers/bookings/booking.controller");

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Obtenir les statistiques du tableau de bord (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     totalProviders:
 *                       type: integer
 *                     totalServices:
 *                       type: integer
 *                     pending:
 *                       type: integer
 *                     monthlyRevenue:
 *                       type: number
 *                     recentActivities:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
	"/dashboard",
	authenticate,
	authorize(ROLES.ADMIN),
	adminController.getDashboardStats
);

/**
 * @swagger
 * /api/admin/bookings/{id}/confirm:
 *   put:
 *     summary: Confirmer une réservation (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Réservation confirmée avec succès
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
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Réservation ne peut pas être confirmée
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
	"/bookings/:id/confirm",
	authenticate,
	authorize(ROLES.ADMIN),
	bookingController.confirmBooking
);

/**
 * @swagger
 * /api/admin/bookings/{id}/cancel:
 *   put:
 *     summary: Annuler une réservation (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Réservation annulée avec succès
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
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Réservation ne peut pas être annulée
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
	"/bookings/:id/cancel",
	authenticate,
	authorize(ROLES.ADMIN),
	bookingController.cancelBooking
);

/**
 * @swagger
 * /api/admin/bookings/{id}/complete:
 *   put:
 *     summary: Marquer une réservation comme terminée (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Réservation marquée comme terminée
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
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Réservation doit être confirmée avant d'être terminée
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
	"/bookings/:id/complete",
	authenticate,
	authorize(ROLES.ADMIN),
	bookingController.completeBooking
);

module.exports = router;
