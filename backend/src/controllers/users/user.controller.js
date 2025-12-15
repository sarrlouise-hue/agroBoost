const userService = require('../../services/user/user.service');
const bookingService = require('../../services/booking/booking.service');
const reviewService = require('../../services/review/review.service');
const { success, paginated } = require('../../utils/response');
const { AppError } = require('../../utils/errors');

/**
 * Obtenir le profil de l'utilisateur connecté
 * GET /api/users/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await userService.getProfile(userId);
    return success(res, user, 'Profil récupéré avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Mettre à jour le profil de l'utilisateur connecté
 * PUT /api/users/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const updatedUser = await userService.updateProfile(userId, req.body);
    return success(res, updatedUser, 'Profil mis à jour avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Mettre à jour la localisation de l'utilisateur
 * PUT /api/users/location
 */
const updateLocation = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const updatedUser = await userService.updateLocation(userId, req.body);
    return success(res, updatedUser, 'Localisation mise à jour avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Changer la langue de l'utilisateur
 * PUT /api/users/language
 */
const updateLanguage = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { language } = req.body;
    const updatedUser = await userService.updateLanguage(userId, language);
    return success(res, updatedUser, 'Langue mise à jour avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir tous les utilisateurs (admin seulement)
 * GET /api/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, role, isVerified, search, startDate, endDate } = req.query;
    const result = await userService.getAllUsers({
      page,
      limit,
      role,
      isVerified: isVerified !== undefined ? isVerified === 'true' : null,
      search,
      startDate,
      endDate,
    });
    return paginated(
      res,
      result.users,
      result.pagination,
      'Utilisateurs récupérés avec succès'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir un utilisateur par ID (admin seulement)
 * GET /api/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    return success(res, user, 'Utilisateur récupéré avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Mettre à jour un utilisateur (admin seulement)
 * PUT /api/users/:id
 */
const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = await userService.updateUserById(id, req.body);
    return success(res, updatedUser, 'Utilisateur mis à jour avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Supprimer un utilisateur (admin seulement)
 * DELETE /api/users/:id
 */
const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUserById(id);
    return success(res, result, 'Utilisateur supprimé avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Historique des réservations de l'utilisateur connecté
 * GET /api/users/bookings
 */
const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page, limit, status } = req.query;
    const result = await bookingService.getAllBookings({
      page,
      limit,
      userId,
      status,
    });
    return paginated(
      res,
      result.bookings,
      result.pagination,
      'Historique des réservations récupéré avec succès'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Historique des avis donnés par l'utilisateur connecté
 * GET /api/users/reviews
 */
const getMyReviews = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page, limit } = req.query;
    const result = await reviewService.getUserReviews(userId, { page, limit });
    return paginated(
      res,
      result.reviews,
      result.pagination,
      'Historique des avis récupéré avec succès'
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateLocation,
  updateLanguage,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getMyBookings,
  getMyReviews,
};

