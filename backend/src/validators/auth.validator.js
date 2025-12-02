const Joi = require('joi');

/**
 * Schéma de validation pour l'inscription
 */
const registerSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[0-9+]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Le numéro de téléphone ne doit contenir que des chiffres et +',
      'any.required': 'Le numéro de téléphone est requis',
    }),
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne doit pas dépasser 50 caractères',
      'any.required': 'Le prénom est requis',
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne doit pas dépasser 50 caractères',
      'any.required': 'Le nom est requis',
    }),
  email: Joi.string()
    .email()
    .optional()
    .allow(null, '')
    .messages({
      'string.email': 'L\'email doit être une adresse email valide',
    }),
  language: Joi.string()
    .valid('fr', 'wolof')
    .optional()
    .default('fr'),
});

/**
 * Schéma de validation pour la vérification OTP
 */
const verifyOTPSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[0-9+]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Le numéro de téléphone ne doit contenir que des chiffres et +',
      'any.required': 'Le numéro de téléphone est requis',
    }),
  code: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.length': 'Le code OTP doit contenir 6 chiffres',
      'string.pattern.base': 'Le code OTP ne doit contenir que des chiffres',
      'any.required': 'Le code OTP est requis',
    }),
});

/**
 * Schéma de validation pour le renvoi d'OTP
 */
const resendOTPSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[0-9+]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Le numéro de téléphone ne doit contenir que des chiffres et +',
      'any.required': 'Le numéro de téléphone est requis',
    }),
});

/**
 * Schéma de validation pour la connexion
 */
const loginSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[0-9+]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Le numéro de téléphone ne doit contenir que des chiffres et +',
      'any.required': 'Le numéro de téléphone est requis',
    }),
  password: Joi.string()
    .min(6)
    .optional()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
    }),
});

/**
 * Schéma de validation pour le refresh token
 */
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Le refresh token est requis',
    }),
});

/**
 * Schéma de validation pour la demande de réinitialisation de mot de passe
 */
const forgotPasswordSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[0-9+]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Le numéro de téléphone ne doit contenir que des chiffres et +',
      'any.required': 'Le numéro de téléphone est requis',
    }),
});

/**
 * Schéma de validation pour la réinitialisation de mot de passe
 */
const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Le token de réinitialisation est requis',
    }),
  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'any.required': 'Le nouveau mot de passe est requis',
    }),
});

/**
 * Schéma de validation pour le changement de mot de passe
 */
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Le mot de passe actuel est requis',
    }),
  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Le nouveau mot de passe doit contenir au moins 6 caractères',
      'any.required': 'Le nouveau mot de passe est requis',
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
  registerSchema,
  verifyOTPSchema,
  resendOTPSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  validate,
};

