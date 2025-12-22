const Joi = require('joi');

/**
 * Schéma de validation pour la création d'un avis
 */
const createReviewSchema = Joi.object({
  bookingId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'L\'ID de la réservation doit être un UUID valide',
      'any.required': 'L\'ID de la réservation est requis',
    }),
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': 'La note doit être un nombre entier',
      'number.min': 'La note minimale est 1',
      'number.max': 'La note maximale est 5',
      'any.required': 'La note est requise',
    }),
  comment: Joi.string()
    .max(1000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Le commentaire ne doit pas dépasser 1000 caractères',
    }),
});

/**
 * Schéma de validation pour la mise à jour d'un avis
 */
const updateReviewSchema = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .optional()
    .messages({
      'number.base': 'La note doit être un nombre entier',
      'number.min': 'La note minimale est 1',
      'number.max': 'La note maximale est 5',
    }),
  comment: Joi.string()
    .max(1000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Le commentaire ne doit pas dépasser 1000 caractères',
    }),
}).or('rating', 'comment');

/**
 * Middleware de validation générique
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
  createReviewSchema,
  updateReviewSchema,
  validate,
};


