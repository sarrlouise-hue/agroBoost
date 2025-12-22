const Joi = require('joi');
const { SERVICE_TYPES } = require('../config/constants');

/**
 * Schéma de validation pour la création d'un service
 */
const createServiceSchema = Joi.object({
  serviceType: Joi.string()
    .valid(...Object.values(SERVICE_TYPES))
    .required()
    .messages({
      'any.only': `Le type de service doit être l'un des suivants: ${Object.values(SERVICE_TYPES).join(', ')}`,
      'any.required': 'Le type de service est requis',
    }),
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Le nom du service doit contenir au moins 2 caractères',
      'string.max': 'Le nom du service ne doit pas dépasser 100 caractères',
      'any.required': 'Le nom du service est requis',
    }),
  description: Joi.string()
    .optional()
    .allow(null, ''),
  pricePerHour: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Le prix par heure doit être positif',
    }),
  pricePerDay: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Le prix par jour doit être positif',
    }),
  images: Joi.array()
    .items(Joi.string())
    .optional()
    .default([])
    .messages({
      'array.base': 'Les images doivent être un tableau de chaînes',
    }),
  availability: Joi.boolean()
    .optional()
    .default(true),
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
}).custom((value, helpers) => {
  // Vérifier qu'au moins un prix est défini
  if (!value.pricePerHour && !value.pricePerDay) {
    return helpers.error('any.custom', {
      message: 'Au moins un prix (par heure ou par jour) doit être défini',
    });
  }
  return value;
});

/**
 * Schéma de validation pour la mise à jour d'un service
 */
const updateServiceSchema = Joi.object({
  serviceType: Joi.string()
    .valid(...Object.values(SERVICE_TYPES))
    .optional()
    .messages({
      'any.only': `Le type de service doit être l'un des suivants: ${Object.values(SERVICE_TYPES).join(', ')}`,
    }),
  name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Le nom du service doit contenir au moins 2 caractères',
      'string.max': 'Le nom du service ne doit pas dépasser 100 caractères',
    }),
  description: Joi.string()
    .optional()
    .allow(null, ''),
  pricePerHour: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Le prix par heure doit être positif',
    }),
  pricePerDay: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Le prix par jour doit être positif',
    }),
  images: Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
      'array.base': 'Les images doivent être un tableau de chaînes',
    }),
  availability: Joi.boolean()
    .optional(),
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
});

/**
 * Schéma de validation pour la mise à jour de la disponibilité
 */
const updateAvailabilitySchema = Joi.object({
  availability: Joi.boolean()
    .required()
    .messages({
      'any.required': 'La disponibilité est requise',
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
  createServiceSchema,
  updateServiceSchema,
  updateAvailabilitySchema,
  validate,
};

