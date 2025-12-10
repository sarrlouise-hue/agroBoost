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

/**
 * @swagger
 * /api/services/search:
 *   get:
 *     summary: Recherche avancée de services avec filtres, texte et géolocalisation
 *     tags: [Services]
 *     description: Recherche textuelle, filtres avancés, calcul de distance et tri par pertinence
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Recherche textuelle (nom, description)
 *         example: tracteur
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
 *         description: Prix minimum
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Prix maximum
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude pour calcul de distance
 *         example: 14.7167
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude pour calcul de distance
 *         example: -17.4677
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           format: float
 *         description: Rayon de recherche en km (requiert latitude/longitude)
 *         example: 20
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [relevance, distance, priceAsc, priceDesc, rating]
 *           default: relevance
 *         description: Critère de tri
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
 *         description: Résultats de recherche avec distances calculées
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *             example:
 *               success: true
 *               message: Résultats de recherche récupérés avec succès
 *               data:
 *                 - id: service-id-123
 *                   name: Tracteur John Deere
 *                   distance: 5.2
 *                   ...
 *               pagination:
 *                 page: 1
 *                 limit: 20
 *                 total: 50
 *                 totalPages: 3
 */
router.get('/search', serviceController.searchServices);

/**
 * @swagger
 * /api/services/nearby:
 *   get:
 *     summary: Services à proximité (triés par distance)
 *     tags: [Services]
 *     description: Retourne les services dans un rayon spécifique, triés par distance croissante
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *           minimum: -90
 *           maximum: 90
 *         description: Latitude de la position
 *         example: 14.7167
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *           minimum: -180
 *           maximum: 180
 *         description: Longitude de la position
 *         example: -17.4677
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           format: float
 *           default: 10
 *           minimum: 0
 *         description: Rayon de recherche en km
 *         example: 15
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
 *         description: Services à proximité triés par distance
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       400:
 *         description: Coordonnées GPS requises
 */
router.get('/nearby', serviceController.getNearbyServices);

module.exports = router;

