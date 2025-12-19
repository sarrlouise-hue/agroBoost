const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/maintenances/maintenance.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const {
	validateCreateMaintenance,
	validateUpdateMaintenance,
	validateCompleteMaintenance,
} = require("../validators/maintenance.validator");
const { ROLES } = require("../config/constants");

/**
 * @swagger
 * /api/maintenances:
 *   post:
 *     summary: Créer une maintenance
 *     tags: [Maintenances]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceId
 *               - mechanicId
 *               - startDate
 *             properties:
 *               serviceId:
 *                 type: string
 *                 format: uuid
 *                 description: ID du service à maintenir
 *               mechanicId:
 *                 type: string
 *                 format: uuid
 *                 description: ID du mécanicien assigné
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date de début de la maintenance
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date de fin de la maintenance (optionnel)
 *               duration:
 *                 type: integer
 *                 description: Durée en heures (optionnel, calculé automatiquement si endDate fourni)
 *               description:
 *                 type: string
 *                 description: Description de la maintenance
 *               cost:
 *                 type: number
 *                 format: decimal
 *                 description: Coût de la maintenance
 *               notes:
 *                 type: string
 *                 description: Notes additionnelles
 *     responses:
 *       201:
 *         description: Maintenance créée avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/",
	authenticate,
	authorize(ROLES.PROVIDER, ROLES.ADMIN),
	validateCreateMaintenance,
	maintenanceController.createMaintenance
);

/**
 * @swagger
 * /api/maintenances:
 *   get:
 *     summary: Obtenir toutes les maintenances
 *     tags: [Maintenances]
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
 *         name: serviceId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrer par service
 *       - in: query
 *         name: mechanicId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrer par mécanicien
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed, cancelled]
 *         description: Filtrer par statut
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date de début (>=)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date de fin (<=)
 *     responses:
 *       200:
 *         description: Maintenances récupérées avec succès
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/", authenticate, maintenanceController.getAllMaintenances);

/**
 * @swagger
 * /api/maintenances/stats/reports:
 *   get:
 *     summary: Obtenir les statistiques des maintenances
 *     tags: [Maintenances]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/stats/reports",
	authenticate,
	authorize(ROLES.ADMIN, ROLES.PROVIDER),
	maintenanceController.getMaintenanceStats
);

/**
 * @swagger
 * /api/maintenances/{id}:
 *   get:
 *     summary: Obtenir une maintenance par ID
 *     tags: [Maintenances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la maintenance
 *     responses:
 *       200:
 *         description: Maintenance récupérée avec succès
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/:id", authenticate, maintenanceController.getMaintenanceById);

/**
 * @swagger
 * /api/maintenances/{id}:
 *   put:
 *     summary: Mettre à jour une maintenance
 *     tags: [Maintenances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la maintenance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mechanicId:
 *                 type: string
 *                 format: uuid
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: integer
 *               description:
 *                 type: string
 *               cost:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Maintenance mise à jour avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
	"/:id",
	authenticate,
	authorize(ROLES.PROVIDER, ROLES.ADMIN),
	validateUpdateMaintenance,
	maintenanceController.updateMaintenance
);

/**
 * @swagger
 * /api/maintenances/{id}:
 *   delete:
 *     summary: Supprimer une maintenance
 *     tags: [Maintenances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la maintenance
 *     responses:
 *       200:
 *         description: Maintenance supprimée avec succès
 *       400:
 *         description: Impossible de supprimer une maintenance en cours
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
	"/:id",
	authenticate,
	authorize(ROLES.PROVIDER, ROLES.ADMIN),
	maintenanceController.deleteMaintenance
);

/**
 * @swagger
 * /api/maintenances/service/{serviceId}:
 *   get:
 *     summary: Obtenir les maintenances d'un service
 *     tags: [Maintenances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du service
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed, cancelled]
 *     responses:
 *       200:
 *         description: Maintenances du service récupérées avec succès
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
	"/service/:serviceId",
	authenticate,
	maintenanceController.getMaintenancesByService
);

/**
 * @swagger
 * /api/maintenances/mechanic/{mechanicId}:
 *   get:
 *     summary: Obtenir les maintenances d'un mécanicien
 *     tags: [Maintenances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mechanicId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du mécanicien
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed, cancelled]
 *     responses:
 *       200:
 *         description: Maintenances du mécanicien récupérées avec succès
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
	"/mechanic/:mechanicId",
	authenticate,
	maintenanceController.getMaintenancesByMechanic
);

/**
 * @swagger
 * /api/maintenances/{id}/start:
 *   post:
 *     summary: Démarrer une maintenance
 *     tags: [Maintenances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la maintenance
 *     responses:
 *       200:
 *         description: Maintenance démarrée avec succès
 *       400:
 *         description: Seules les maintenances en attente peuvent être démarrées
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post(
	"/:id/start",
	authenticate,
	authorize(ROLES.PROVIDER, ROLES.ADMIN),
	maintenanceController.startMaintenance
);

/**
 * @swagger
 * /api/maintenances/{id}/complete:
 *   post:
 *     summary: Compléter une maintenance
 *     tags: [Maintenances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la maintenance
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: integer
 *               cost:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Maintenance complétée avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post(
	"/:id/complete",
	authenticate,
	authorize(ROLES.PROVIDER, ROLES.ADMIN),
	validateCompleteMaintenance,
	maintenanceController.completeMaintenance
);

module.exports = router;
