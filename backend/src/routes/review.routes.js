const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviews/review.controller");
const { authenticate } = require("../middleware/auth.middleware");
const {
	createReviewSchema,
	updateReviewSchema,
	validate,
} = require("../validators/review.validator");

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Créer un avis pour une réservation terminée
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewRequest'
 *     responses:
 *       201:
 *         description: Avis créé avec succès
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
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
	"/",
	authenticate,
	validate(createReviewSchema),
	reviewController.createReview
);

/**
 * @swagger
 * /api/reviews/service/{serviceId}:
 *   get:
 *     summary: Obtenir les avis d'un service
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Avis du service récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get("/service/:serviceId", reviewController.getServiceReviews);

/**
 * @swagger
 * /api/reviews/provider/{providerId}:
 *   get:
 *     summary: Obtenir les avis d'un prestataire
 *     tags: [Reviews]
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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Avis du prestataire récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get("/provider/:providerId", reviewController.getProviderReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Mettre à jour un avis
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'avis
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReviewRequest'
 *     responses:
 *       200:
 *         description: Avis mis à jour avec succès
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     summary: Supprimer un avis (User/Admin)
 *     tags: [Reviews, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'avis
 *     responses:
 *       200:
 *         description: Avis supprimé avec succès
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
	"/:id",
	authenticate,
	validate(updateReviewSchema),
	reviewController.updateReview
);
router.delete("/:id", authenticate, reviewController.deleteReview);

module.exports = router;
