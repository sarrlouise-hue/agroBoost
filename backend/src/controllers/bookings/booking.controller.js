const bookingService = require('../../services/booking/booking.service');
const { success, paginated } = require('../../utils/response');

/**
 * Créer une réservation
 * POST /api/bookings
 */
const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const booking = await bookingService.createBooking(userId, req.body);
    return success(res, booking, 'Réservation créée avec succès', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir une réservation par ID
 * GET /api/bookings/:id
 */
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);
    return success(res, booking, 'Réservation récupérée avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir toutes les réservations
 * GET /api/bookings
 */
const getAllBookings = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      userId,
      providerId,
      serviceId,
      status,
      search,
      startDate,
      endDate,
      bookingDateStart,
      bookingDateEnd,
    } = req.query;

    // Si l'utilisateur n'est pas admin, filtrer par son ID
    const options = {
      page,
      limit,
      userId: req.user.role === 'admin' ? userId : req.user.userId,
      providerId,
      serviceId,
      status,
      search,
      startDate,
      endDate,
      bookingDateStart,
      bookingDateEnd,
    };

    const result = await bookingService.getAllBookings(options);
    return paginated(
      res,
      result.bookings,
      result.pagination,
      'Réservations récupérées avec succès'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Supprimer une réservation (admin seulement)
 * DELETE /api/bookings/:id
 */
const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await bookingService.deleteBooking(id);
    return success(res, result, 'Réservation supprimée avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Confirmer une réservation (provider)
 * PUT /api/bookings/:id/confirm
 */
const confirmBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const providerId = req.user.userId;
    const booking = await bookingService.confirmBooking(id, providerId);
    return success(res, booking, 'Réservation confirmée avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Annuler une réservation
 * PUT /api/bookings/:id/cancel
 */
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const booking = await bookingService.cancelBooking(id, userId);
    return success(res, booking, 'Réservation annulée avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Marquer une réservation comme terminée (provider)
 * PUT /api/bookings/:id/complete
 */
const completeBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const providerId = req.user.userId;
    const booking = await bookingService.completeBooking(id, providerId);
    return success(res, booking, 'Réservation marquée comme terminée');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getAllBookings,
  confirmBooking,
  cancelBooking,
  completeBooking,
  deleteBooking,
};

