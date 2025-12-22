const { sequelize } = require("../../config/database");
const { Op } = require("sequelize");
const User = require("../../models/User");
const Provider = require("../../models/Provider");
const Service = require("../../models/Service");
const Booking = require("../../models/Booking");
const Payment = require("../../models/Payment");
const { success } = require("../../utils/response");

/**
 * Get admin dashboard statistics
 * GET /api/admin/dashboard
 */
const getDashboardStats = async (req, res, next) => {
	try {
		const today = new Date();
		const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

		// Run queries in parallel for performance
		const [
			totalUsers,
			totalProviders,
			totalServices,
			pendingBookings,
			monthlyRevenue,
			recentUsers,
			recentBookings,
		] = await Promise.all([
			// a) Total Users
			User.count(),

			// b) Total Providers (assuming Provider model tracks approved providers or distinct role)
			// If Provider model exists, use it, otherwise check User role.
			// Based on file list, Provider.js exists.
			Provider.count(),

			// c) Total Services
			Service.count(),

			// d) Pending Bookings
			Booking.count({
				where: { status: "pending" }, // Adjust status string based on constants if needed
			}),

			// e) Monthly Revenue
			Payment.sum("amount", {
				where: {
					status: "success", // Correct status from Payment model
					createdAt: {
						[Op.between]: [startOfMonth, endOfMonth],
					},
				},
			}),

			// f) Recent Activities (Users)
			User.findAll({
				limit: 5,
				order: [["createdAt", "DESC"]],
				attributes: ["id", "firstName", "lastName", "createdAt", "role"],
			}),

			// f) Recent Activities (Bookings)
			Booking.findAll({
				limit: 5,
				order: [["createdAt", "DESC"]],
				include: [
					{ model: User, as: "user", attributes: ["firstName", "lastName"] },
				],
			}),
		]);

		// Combine recent activities
		const recentActivities = [
			...recentUsers.map((u) => ({
				type: "USER_REGISTERED",
				message: `Nouvel utilisateur: ${u.firstName} ${u.lastName} (${u.role})`,
				date: u.createdAt,
				id: u.id,
			})),
			...recentBookings.map((b) => ({
				type: "NEW_BOOKING",
				message: `Nouvelle réservation par ${
					b.user ? b.user.firstName + " " + b.user.lastName : "Inconnu"
				}`,
				date: b.createdAt,
				id: b.id,
			})),
		]
			.sort((a, b) => new Date(b.date) - new Date(a.date))
			.slice(0, 5);

		return success(
			res,
			{
				totalUsers,
				totalProviders,
				totalServices,
				pending: pendingBookings,
				monthlyRevenue: monthlyRevenue || 0,
				recentActivities,
			},
			"Statistiques du tableau de bord récupérées avec succès"
		);
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getDashboardStats,
};
