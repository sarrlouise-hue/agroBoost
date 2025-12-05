const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/services/service.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  createServiceSchema,
  updateServiceSchema,
  updateAvailabilitySchema,
  validate,
} = require('../validators/service.validator');
const { ROLES } = require('../config/constants');

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Créer un nouveau service (prestataire seulement)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceRequest'
 *     responses:
 *       201:
 *         description: Service créé avec succès
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
 *                   example: Service créé avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/', authenticate, authorize(ROLES.PROVIDER, ROLES.ADMIN), validate(createServiceSchema), serviceController.createService);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Obtenir tous les services avec filtres
 *     tags: [Services]
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
 *         name: serviceType
 *         schema:
 *           type: string
 *           enum: [tractor, semoir, operator, other]
 *         description: Filtrer par type de service
 *       - in: query
 *         name: availability
 *         schema:
 *           type: boolean
 *         description: Filtrer par disponibilité
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Prix minimum
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Prix maximum
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude pour recherche par proximité
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude pour recherche par proximité
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           format: float
 *         description: Rayon de recherche en km (requiert latitude/longitude)
 *     responses:
 *       200:
 *         description: Services récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get('/', serviceController.getAllServices);

/**
 * @swagger
 * /api/services/my-services:
 *   get:
 *     summary: Obtenir les services du prestataire connecté
 *     tags: [Services]
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
 *     responses:
 *       200:
 *         description: Services récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/my-services', authenticate, authorize(ROLES.PROVIDER, ROLES.ADMIN), serviceController.getMyServices);

/**
 * @swagger
 * /api/services/provider/{providerId}:
 *   get:
 *     summary: Obtenir les services d'un prestataire
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du prestataire
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
 *     responses:
 *       200:
 *         description: Services du prestataire récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get('/provider/:providerId', serviceController.getServicesByProvider);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Obtenir un service par ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du service
 *     responses:
 *       200:
 *         description: Service récupéré avec succès
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
 *                   example: Service récupéré avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', serviceController.getServiceById);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Mettre à jour un service (prestataire seulement)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateServiceRequest'
 *     responses:
 *       200:
 *         description: Service mis à jour avec succès
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
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', authenticate, authorize(ROLES.PROVIDER, ROLES.ADMIN), validate(updateServiceSchema), serviceController.updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Supprimer un service (prestataire seulement)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du service
 *     responses:
 *       200:
 *         description: Service supprimé avec succès
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
router.delete('/:id', authenticate, authorize(ROLES.PROVIDER, ROLES.ADMIN), serviceController.deleteService);

/**
 * @swagger
 * /api/services/{id}/availability:
 *   put:
 *     summary: Mettre à jour la disponibilité d'un service (prestataire seulement)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAvailabilityRequest'
 *     responses:
 *       200:
 *         description: Disponibilité mise à jour avec succès
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
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id/availability', authenticate, authorize(ROLES.PROVIDER, ROLES.ADMIN), validate(updateAvailabilitySchema), serviceController.updateAvailability);

module.exports = router;

