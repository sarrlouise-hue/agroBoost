const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin/admin.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { ROLES } = require("../config/constants");

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

module.exports = router;
