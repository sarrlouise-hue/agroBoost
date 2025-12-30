const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookings/booking.controller");
const { authenticate } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/producteur/dashboard:
 *   get:
 *     summary: Statistiques pour le tableau de bord du producteur
 *     tags: [Producteur]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 */
router.get(
	"/dashboard",
	authenticate,
	bookingController.getProducteurDashboardStats
);

module.exports = router;
