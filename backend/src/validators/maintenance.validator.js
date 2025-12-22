const Joi = require('joi');
const { MAINTENANCE_STATUS } = require('../config/constants');

/**
 * Schéma de validation pour créer une maintenance
 */
const createMaintenanceSchema = Joi.object({
  serviceId: Joi.string().uuid().required().messages({
    'string.guid': 'L\'ID du service doit être un UUID valide',
    'any.required': 'L\'ID du service est requis',
  }),
  mechanicId: Joi.string().uuid().required().messages({
    'string.guid': 'L\'ID du mécanicien doit être un UUID valide',
    'any.required': 'L\'ID du mécanicien est requis',
  }),
  startDate: Joi.date().iso().required().messages({
    'date.base': 'La date de début doit être une date valide',
    'date.format': 'La date de début doit être au format ISO',
    'any.required': 'La date de début est requise',
  }),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional().messages({
    'date.base': 'La date de fin doit être une date valide',
    'date.format': 'La date de fin doit être au format ISO',
    'date.greater': 'La date de fin doit être après la date de début',
  }),
  duration: Joi.number().integer().min(0).optional().messages({
    'number.base': 'La durée doit être un nombre',
    'number.integer': 'La durée doit être un nombre entier',
    'number.min': 'La durée ne peut pas être négative',
  }),
  description: Joi.string().max(1000).optional().allow('', null).messages({
    'string.max': 'La description ne peut pas dépasser 1000 caractères',
  }),
  cost: Joi.number().min(0).precision(2).optional().messages({
    'number.base': 'Le coût doit être un nombre',
    'number.min': 'Le coût ne peut pas être négatif',
    'number.precision': 'Le coût ne peut avoir que 2 décimales maximum',
  }),
  notes: Joi.string().max(2000).optional().allow('', null).messages({
    'string.max': 'Les notes ne peuvent pas dépasser 2000 caractères',
  }),
});

/**
 * Schéma de validation pour mettre à jour une maintenance
 */
const updateMaintenanceSchema = Joi.object({
  mechanicId: Joi.string().uuid().optional().messages({
    'string.guid': 'L\'ID du mécanicien doit être un UUID valide',
  }),
  startDate: Joi.date().iso().optional().messages({
    'date.base': 'La date de début doit être une date valide',
    'date.format': 'La date de début doit être au format ISO',
  }),
  endDate: Joi.date().iso().optional().messages({
    'date.base': 'La date de fin doit être une date valide',
    'date.format': 'La date de fin doit être au format ISO',
  }),
  duration: Joi.number().integer().min(0).optional().messages({
    'number.base': 'La durée doit être un nombre',
    'number.integer': 'La durée doit être un nombre entier',
    'number.min': 'La durée ne peut pas être négative',
  }),
  description: Joi.string().max(1000).optional().allow('', null).messages({
    'string.max': 'La description ne peut pas dépasser 1000 caractères',
  }),
  cost: Joi.number().min(0).precision(2).optional().messages({
    'number.base': 'Le coût doit être un nombre',
    'number.min': 'Le coût ne peut pas être négatif',
    'number.precision': 'Le coût ne peut avoir que 2 décimales maximum',
  }),
  status: Joi.string()
    .valid(...Object.values(MAINTENANCE_STATUS))
    .optional()
    .messages({
      'any.only': `Le statut doit être l'un des suivants: ${Object.values(MAINTENANCE_STATUS).join(', ')}`,
    }),
  notes: Joi.string().max(2000).optional().allow('', null).messages({
    'string.max': 'Les notes ne peuvent pas dépasser 2000 caractères',
  }),
}).custom((value, helpers) => {
  // Vérifier que endDate est après startDate si les deux sont fournis
  if (value.endDate && value.startDate) {
    const start = new Date(value.startDate);
    const end = new Date(value.endDate);
    if (end <= start) {
      return helpers.error('date.endDate.after');
    }
  }
  return value;
}).messages({
  'date.endDate.after': 'La date de fin doit être après la date de début',
});

/**
 * Schéma de validation pour compléter une maintenance
 */
const completeMaintenanceSchema = Joi.object({
  endDate: Joi.date().iso().optional().messages({
    'date.base': 'La date de fin doit être une date valide',
    'date.format': 'La date de fin doit être au format ISO',
  }),
  duration: Joi.number().integer().min(0).optional().messages({
    'number.base': 'La durée doit être un nombre',
    'number.integer': 'La durée doit être un nombre entier',
    'number.min': 'La durée ne peut pas être négative',
  }),
  cost: Joi.number().min(0).precision(2).optional().messages({
    'number.base': 'Le coût doit être un nombre',
    'number.min': 'Le coût ne peut pas être négatif',
    'number.precision': 'Le coût ne peut avoir que 2 décimales maximum',
  }),
  notes: Joi.string().max(2000).optional().allow('', null).messages({
    'string.max': 'Les notes ne peuvent pas dépasser 2000 caractères',
  }),
});

/**
 * Middleware de validation pour créer une maintenance
 */
const validateCreateMaintenance = (req, res, next) => {
  const { error, value } = createMaintenanceSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors,
    });
  }

  req.body = value;
  next();
};

/**
 * Middleware de validation pour mettre à jour une maintenance
 */
const validateUpdateMaintenance = (req, res, next) => {
  const { error, value } = updateMaintenanceSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors,
    });
  }

  req.body = value;
  next();
};

/**
 * Middleware de validation pour compléter une maintenance
 */
const validateCompleteMaintenance = (req, res, next) => {
  const { error, value } = completeMaintenanceSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
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
  validateCreateMaintenance,
  validateUpdateMaintenance,
  validateCompleteMaintenance,
};

