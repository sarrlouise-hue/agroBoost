const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookings/booking.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  createBookingSchema,
  validate,
} = require('../validators/booking.validator');
const { ROLES } = require('../config/constants');

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Créer une réservation (avec vérification de disponibilité)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequest'
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
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
 *         description: Erreur de validation ou service non disponible
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       409:
 *         description: Conflit de disponibilité (double réservation)
 */
router.post(
  '/',
  authenticate,
  validate(createBookingSchema),
  bookingController.createBooking
);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Obtenir toutes les réservations
 *     tags: [Bookings]
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
 *           enum: [pending, confirmed, completed, cancelled]
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
 *       - in: query
 *         name: serviceId
 *         schema:
 *           type: string
 *         description: Filtrer par service
 *     responses:
 *       200:
 *         description: Réservations récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', authenticate, bookingController.getAllBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Obtenir une réservation par ID
 *     tags: [Bookings]
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
 *         description: Réservation récupérée avec succès
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
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings/{id}/confirm:
 *   put:
 *     summary: Confirmer une réservation (provider)
 *     tags: [Bookings]
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
  '/:id/confirm',
  authenticate,
  authorize(ROLES.PROVIDER, ROLES.ADMIN),
  bookingController.confirmBooking
);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Annuler une réservation (utilisateur ou prestataire)
 *     tags: [Bookings]
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
router.put('/:id/cancel', authenticate, bookingController.cancelBooking);

/**
 * @swagger
 * /api/bookings/{id}/complete:
 *   put:
 *     summary: Marquer une réservation comme terminée (provider)
 *     tags: [Bookings]
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
  '/:id/complete',
  authenticate,
  authorize(ROLES.PROVIDER, ROLES.ADMIN),
  bookingController.completeBooking
);

module.exports = router;

