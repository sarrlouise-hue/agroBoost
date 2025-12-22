const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const providerRoutes = require("./provider.routes");
const serviceRoutes = require("./service.routes");
const bookingRoutes = require("./booking.routes");
const paymentRoutes = require("./payment.routes");
const maintenanceRoutes = require("./maintenance.routes");
const reviewRoutes = require("./review.routes");
const notificationRoutes = require("./notification.routes");
const adminRoutes = require("./admin.routes");

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/providers", providerRoutes);
router.use("/services", serviceRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/maintenances", maintenanceRoutes);
router.use("/reviews", reviewRoutes);
router.use("/notifications", notificationRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
