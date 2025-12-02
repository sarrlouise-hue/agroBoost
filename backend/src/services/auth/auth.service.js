const jwt = require('jsonwebtoken');
const userRepository = require('../../data-access/user.repository');
const { JWT } = require('../../config/env');
const { AppError, ERROR_MESSAGES } = require('../../utils/errors');
const logger = require('../../utils/logger');
const { comparePassword } = require('./password.service');

/**
 * Générer un token JWT
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    JWT.SECRET,
    { expiresIn: JWT.EXPIRES_IN }
  );
};

/**
 * Générer un refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    JWT.REFRESH_SECRET,
    { expiresIn: JWT.REFRESH_EXPIRES_IN }
  );
};

/**
 * Vérifier un token JWT
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT.SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError(ERROR_MESSAGES.TOKEN_EXPIRED, 401);
    }
    throw new AppError(ERROR_MESSAGES.INVALID_TOKEN, 401);
  }
};

/**
 * Vérifier un refresh token
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT.REFRESH_SECRET);
  } catch (error) {
    throw new AppError(ERROR_MESSAGES.INVALID_TOKEN, 401);
  }
};

/**
 * Inscrire un nouvel utilisateur
 */
const register = async (userData) => {
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await userRepository.findByPhoneNumber(userData.phoneNumber);

    if (existingUser) {
      throw new AppError('Un utilisateur existe déjà avec ce numéro de téléphone', 409);
    }

    // Créer l'utilisateur
    const user = await userRepository.create({
      phoneNumber: userData.phoneNumber,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email || undefined,
      language: userData.language || 'fr',
      role: 'user',
      isVerified: false,
    });

    logger.info(`Utilisateur inscrit: ${user.phoneNumber}`);

    // Générer les tokens
    const token = generateToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        language: user.language,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
      refreshToken,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    // Gérer les erreurs de validation Sequelize
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message).join(', ');
      throw new AppError(messages, 400);
    }
    if (error.code === 11000) {
      throw new AppError('Un utilisateur existe déjà avec ce numéro de téléphone', 409);
    }
    logger.error('Erreur lors de l\'inscription:', error);
    throw new AppError('Échec de l\'inscription de l\'utilisateur', 500);
  }
};

/**
 * Connecter un utilisateur avec numéro de téléphone (sans mot de passe)
 */
const login = async (phoneNumber) => {
  try {
    const user = await userRepository.findByPhoneNumber(phoneNumber);

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Générer les tokens
    const token = generateToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    logger.info(`Utilisateur connecté: ${user.phoneNumber}`);

    return {
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        language: user.language,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
      refreshToken,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Erreur lors de la connexion:', error);
    throw new AppError('Échec de la connexion de l\'utilisateur', 500);
  }
};

/**
 * Connecter un utilisateur avec numéro de téléphone et mot de passe
 */
const loginWithPassword = async (phoneNumber, password) => {
  try {
    // Trouver l'utilisateur avec le mot de passe
    const user = await userRepository.findByPhoneNumberWithPassword(phoneNumber);

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Vérifier si l'utilisateur a un mot de passe
    if (!user.password) {
      throw new AppError('Aucun mot de passe défini. Utilisez la connexion par OTP.', 400);
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Mot de passe incorrect', 401);
    }

    // Générer les tokens
    const token = generateToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    logger.info(`Utilisateur connecté avec mot de passe: ${user.phoneNumber}`);

    return {
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        language: user.language,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
      refreshToken,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Erreur lors de la connexion avec mot de passe:', error);
    throw new AppError('Échec de la connexion de l\'utilisateur', 500);
  }
};

/**
 * Rafraîchir le token d'accès
 */
const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    const token = generateToken(user.id, user.role);

    return { token };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Échec du rafraîchissement du token', 500);
  }
};

/**
 * Vérifier le numéro de téléphone de l'utilisateur
 */
const verifyUser = async (userId) => {
  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    user.isVerified = true;
    await userRepository.save(user);

    logger.info(`Utilisateur vérifié: ${user.phoneNumber}`);

    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Échec de la vérification de l\'utilisateur', 500);
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  register,
  login,
  loginWithPassword,
  refreshAccessToken,
  verifyUser,
};
