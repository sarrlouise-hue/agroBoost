const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providers/provider.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  registerProviderSchema,
  updateProviderSchema,
  validate,
} = require('../validators/provider.validator');
const { ROLES } = require('../config/constants');

/**
 * @swagger
 * /api/providers/register:
 *   post:
 *     summary: Inscription d'un prestataire
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
router.post('/register', authenticate, validate(registerProviderSchema), providerController.registerProvider);

/**
 * @swagger
 * /api/providers/profile:
 *   get:
 *     summary: Obtenir le profil du prestataire connecté
 *     tags: [Providers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil prestataire récupéré avec succès
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
 *                   example: Profil prestataire récupéré avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Provider'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/profile', authenticate, authorize(ROLES.PROVIDER, ROLES.ADMIN), providerController.getProfile);

/**
 * @swagger
 * /api/providers/{id}:
 *   get:
 *     summary: Obtenir le profil d'un prestataire par ID
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du prestataire
 *     responses:
 *       200:
 *         description: Profil prestataire récupéré avec succès
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
 *                   example: Profil prestataire récupéré avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Provider'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', providerController.getProfileById);

/**
 * @swagger
 * /api/providers/profile:
 *   put:
 *     summary: Mettre à jour le profil du prestataire connecté
 *     tags: [Providers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProviderRequest'
 *     responses:
 *       200:
 *         description: Profil prestataire mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.put('/profile', authenticate, authorize(ROLES.PROVIDER, ROLES.ADMIN), validate(updateProviderSchema), providerController.updateProfile);

/**
 * @swagger
 * /api/providers:
 *   get:
 *     summary: Obtenir tous les prestataires
 *     tags: [Providers]
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
 *         name: isApproved
 *         schema:
 *           type: boolean
 *         description: Filtrer par statut d'approbation
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           format: float
 *         description: Note minimale
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche dans nom d'entreprise, description, nom/prénom/email utilisateur
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filtrer par ID utilisateur (admin seulement)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début pour filtrer par date de création
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin pour filtrer par date de création
 *     responses:
 *       200:
 *         description: Prestataires récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get('/', providerController.getAllProviders);

/**
 * @swagger
 * /api/providers/approved:
 *   get:
 *     summary: Obtenir les prestataires approuvés
 *     tags: [Providers]
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
 *         name: minRating
 *         schema:
 *           type: number
 *           format: float
 *         description: Note minimale
 *     responses:
 *       200:
 *         description: Prestataires approuvés récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get('/approved', providerController.getApprovedProviders);

// Routes spécifiques AVANT les routes avec :id pour éviter les conflits
/**
 * @swagger
 * /api/providers/{id}/approve:
 *   put:
 *     summary: Approuver un prestataire (admin seulement)
 *     tags: [Providers, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du prestataire
 *     responses:
 *       200:
 *         description: Prestataire approuvé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id/approve', authenticate, authorize(ROLES.ADMIN), providerController.approveProvider);

/**
 * @swagger
 * /api/providers/{id}/reject:
 *   put:
 *     summary: Rejeter un prestataire (admin seulement)
 *     tags: [Providers, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du prestataire
 *     responses:
 *       200:
 *         description: Prestataire rejeté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id/reject', authenticate, authorize(ROLES.ADMIN), providerController.rejectProvider);

/**
 * @swagger
 * /api/providers/{id}:
 *   put:
 *     summary: Mettre à jour un prestataire (admin seulement)
 *     tags: [Providers, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du prestataire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessName:
 *                 type: string
 *               description:
 *                 type: string
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *               isApproved:
 *                 type: boolean
 *               rating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Prestataire mis à jour avec succès
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', authenticate, authorize(ROLES.ADMIN), providerController.updateProviderById);

/**
 * @swagger
 * /api/providers/{id}:
 *   delete:
 *     summary: Supprimer un prestataire (admin seulement)
 *     tags: [Providers, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du prestataire
 *     responses:
 *       200:
 *         description: Prestataire supprimé avec succès
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), providerController.deleteProviderById);

/**
 * @swagger
 * /api/providers/profile/location:
 *   put:
 *     summary: Mettre à jour la géolocalisation du prestataire
 *     tags: [Providers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *             properties:
 *               latitude:
 *                 type: number
 *                 format: float
 *                 minimum: -90
 *                 maximum: 90
 *                 description: Latitude GPS
 *                 example: 14.7167
 *               longitude:
 *                 type: number
 *                 format: float
 *                 minimum: -180
 *                 maximum: 180
 *                 description: Longitude GPS
 *                 example: -17.4677
 *     responses:
 *       200:
 *         description: Géolocalisation mise à jour avec succès
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
 *                   $ref: '#/components/schemas/Provider'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.put(
  '/profile/location',
  authenticate,
  authorize(ROLES.PROVIDER, ROLES.ADMIN),
  providerController.updateLocation
);

// Réservations reçues par le prestataire connecté
router.get(
  '/bookings',
  authenticate,
  authorize(ROLES.PROVIDER, ROLES.ADMIN),
  providerController.getMyBookings
);

// Avis reçus par le prestataire connecté
router.get(
  '/reviews',
  authenticate,
  authorize(ROLES.PROVIDER, ROLES.ADMIN),
  providerController.getMyReviews
);

module.exports = router;

