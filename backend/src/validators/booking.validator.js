const Joi = require('joi');

/**
 * Schéma de validation pour la création d'une réservation
 */
const createBookingSchema = Joi.object({
  serviceId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'L\'ID du service doit être un UUID valide',
      'any.required': 'L\'ID du service est requis',
    }),
  bookingDate: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'La date de réservation doit être une date valide',
      'any.required': 'La date de réservation est requise',
    }),
  startTime: Joi.string()
    .pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      'string.pattern.base': 'L\'heure de début doit être au format HH:MM (24h)',
      'any.required': 'L\'heure de début est requise',
    }),
  endTime: Joi.string()
    .pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .messages({
      'string.pattern.base': 'L\'heure de fin doit être au format HH:MM (24h)',
    }),
  duration: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.base': 'La durée doit être un nombre',
      'number.integer': 'La durée doit être un nombre entier',
      'number.min': 'La durée doit être d\'au moins 1 heure',
    }),
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
  notes: Joi.string()
    .optional()
    .allow(null, ''),
}).custom((value, helpers) => {
  // Vérifier qu'au moins endTime ou duration est fourni
  if (!value.endTime && !value.duration) {
    return helpers.error('any.custom', {
      message: 'L\'heure de fin ou la durée doit être fournie',
    });
  }
  return value;
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors,
    });
  }

  req.body = value;
  next();
};

module.exports = {
  createBookingSchema,
  validate,
};

