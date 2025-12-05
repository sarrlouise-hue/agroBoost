const userService = require('../../services/user/user.service');
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
    const { page, limit } = req.query;
    const result = await userService.getAllUsers({ page, limit });
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

module.exports = {
  getProfile,
  updateProfile,
  updateLocation,
  updateLanguage,
  getAllUsers,
};

