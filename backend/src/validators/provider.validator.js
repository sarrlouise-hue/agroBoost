const Joi = require('joi');

/**
 * Schéma de validation pour l'inscription prestataire
 */
const registerProviderSchema = Joi.object({
  businessName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Le nom de l\'entreprise doit contenir au moins 2 caractères',
      'string.max': 'Le nom de l\'entreprise ne doit pas dépasser 100 caractères',
      'any.required': 'Le nom de l\'entreprise est requis',
    }),
  description: Joi.string()
    .optional()
    .allow(null, ''),
  documents: Joi.array()
    .items(Joi.string())
    .optional()
    .default([])
    .messages({
      'array.base': 'Les documents doivent être un tableau de chaînes',
    }),
});

/**
 * Schéma de validation pour la mise à jour du profil prestataire
 */
const updateProviderSchema = Joi.object({
  businessName: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Le nom de l\'entreprise doit contenir au moins 2 caractères',
      'string.max': 'Le nom de l\'entreprise ne doit pas dépasser 100 caractères',
    }),
  description: Joi.string()
    .optional()
    .allow(null, ''),
  documents: Joi.array()
    .items(Joi.string())
    .optional()
    .messages({
      'array.base': 'Les documents doivent être un tableau de chaînes',
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
  registerProviderSchema,
  updateProviderSchema,
  validate,
};

