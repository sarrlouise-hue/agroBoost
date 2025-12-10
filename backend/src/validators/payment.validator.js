const Joi = require('joi');

/**
 * Schéma de validation pour l'initialisation d'un paiement
 */
const initiatePaymentSchema = Joi.object({
  bookingId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'L\'ID de réservation doit être un UUID valide',
      'any.required': 'L\'ID de réservation est requis',
    }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Le numéro de téléphone doit être valide',
      'any.required': 'Le numéro de téléphone est requis',
    }),
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
  initiatePaymentSchema,
  validate,
};

