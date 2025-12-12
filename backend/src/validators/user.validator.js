const Joi = require('joi');

/**
 * Schéma de validation pour la mise à jour du profil
 */
const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne doit pas dépasser 50 caractères',
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne doit pas dépasser 50 caractères',
    }),
  email: Joi.string()
    .email()
    .optional()
    .allow(null, '')
    .messages({
      'string.email': 'L\'email doit être une adresse email valide',
    }),
  address: Joi.string()
    .optional()
    .allow(null, ''),
});

/**
 * Schéma de validation pour la mise à jour de la localisation
 */
const updateLocationSchema = Joi.object({
  latitude: Joi.number()
    .min(-90)
    .max(90)
    .optional()
    .messages({
      'number.min': 'La latitude doit être entre -90 et 90',
      'number.max': 'La latitude doit être entre -90 et 90',
    }),
  longitude: Joi.number()
    .min(-180)
    .max(180)
    .optional()
    .messages({
      'number.min': 'La longitude doit être entre -180 et 180',
      'number.max': 'La longitude doit être entre -180 et 180',
    }),
  address: Joi.string()
    .optional()
    .allow(null, ''),
});

/**
 * Schéma de validation pour le changement de langue
 */
const updateLanguageSchema = Joi.object({
  language: Joi.string()
    .valid('fr', 'wolof')
    .required()
    .messages({
      'any.only': 'La langue doit être "fr" ou "wolof"',
      'any.required': 'La langue est requise',
    }),
});

/**
 * Valider les données de la requête
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error: validationError } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (validationError) {
      const errors = validationError.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors,
      });
    }

    next();
  };
};

module.exports = {
  updateProfileSchema,
  updateLocationSchema,
  updateLanguageSchema,
  validate,
};

