const Joi = require("joi");

/**
 * Schéma de validation pour la mise à jour du profil
 */
const updateProfileSchema = Joi.object({
	firstName: Joi.string().min(2).max(50).optional().messages({
		"string.min": "Le prénom doit contenir au moins 2 caractères",
		"string.max": "Le prénom ne doit pas dépasser 50 caractères",
	}),
	lastName: Joi.string().min(2).max(50).optional().messages({
		"string.min": "Le nom doit contenir au moins 2 caractères",
		"string.max": "Le nom ne doit pas dépasser 50 caractères",
	}),
	email: Joi.string().email().optional().allow(null, "").messages({
		"string.email": "L'email doit être une adresse email valide",
	}),
	address: Joi.string().optional().allow(null, ""),
});

/**
 * Schéma de validation pour la mise à jour de la localisation
 */
const updateLocationSchema = Joi.object({
	latitude: Joi.number().min(-90).max(90).optional().messages({
		"number.min": "La latitude doit être entre -90 et 90",
		"number.max": "La latitude doit être entre -90 et 90",
	}),
	longitude: Joi.number().min(-180).max(180).optional().messages({
		"number.min": "La longitude doit être entre -180 et 180",
		"number.max": "La longitude doit être entre -180 et 180",
	}),
	address: Joi.string().optional().allow(null, ""),
});

/**
 * Schéma de validation pour le changement de langue
 */
const updateLanguageSchema = Joi.object({
	language: Joi.string().valid("fr", "wolof").required().messages({
		"any.only": 'La langue doit être "fr" ou "wolof"',
		"any.required": "La langue est requise",
	}),
});

/**
 * Schéma de validation pour la mise à jour d'un utilisateur par admin
 */
const updateUserByAdminSchema = Joi.object({
	firstName: Joi.string().min(2).max(50).optional().messages({
		"string.min": "Le prénom doit contenir au moins 2 caractères",
		"string.max": "Le prénom ne doit pas dépasser 50 caractères",
	}),
	lastName: Joi.string().min(2).max(50).optional().messages({
		"string.min": "Le nom doit contenir au moins 2 caractères",
		"string.max": "Le nom ne doit pas dépasser 50 caractères",
	}),
	email: Joi.string().email().optional().allow(null, "").messages({
		"string.email": "L'email doit être une adresse email valide",
	}),
	phoneNumber: Joi.string()
		.pattern(/^\+[1-9]\d{1,14}$/)
		.optional()
		.messages({
			"string.pattern.base":
				"Le numéro de téléphone doit être au format international avec le préfixe +",
		}),
	role: Joi.string()
		.valid("user", "provider", "admin", "mechanic")
		.optional()
		.messages({
			"any.only": 'Le rôle doit être "user", "provider", "admin" ou "mechanic"',
		}),
	isVerified: Joi.boolean().optional(),
	address: Joi.string().optional().allow(null, ""),
	language: Joi.string().valid("fr", "wolof").optional().messages({
		"any.only": 'La langue doit être "fr" ou "wolof"',
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
				message: "Erreur de validation",
				errors,
			});
		}

		next();
	};
};

/**
 * Schéma de validation pour la création d'un utilisateur par admin
 */
const createUserByAdminSchema = Joi.object({
	firstName: Joi.string().min(2).max(50).required().messages({
		"string.min": "Le prénom doit contenir au moins 2 caractères",
		"string.max": "Le prénom ne doit pas dépasser 50 caractères",
		"any.required": "Le prénom est requis",
	}),
	lastName: Joi.string().min(2).max(50).required().messages({
		"string.min": "Le nom doit contenir au moins 2 caractères",
		"string.max": "Le nom ne doit pas dépasser 50 caractères",
		"any.required": "Le nom est requis",
	}),
	email: Joi.string().email().optional().allow(null, "").messages({
		"string.email": "L'email doit être une adresse email valide",
	}),
	phoneNumber: Joi.string().required().messages({
		"any.required": "Le numéro de téléphone est requis",
	}),
	password: Joi.string().min(6).required().messages({
		"string.min": "Le mot de passe doit contenir au moins 6 caractères",
		"any.required": "Le mot de passe est requis",
	}),
	role: Joi.string()
		.valid("user", "provider", "admin", "mechanic")
		.optional()
		.messages({
			"any.only": 'Le rôle doit être "user", "provider", "admin" ou "mechanic"',
		}),
	isVerified: Joi.boolean().optional(),
	address: Joi.string().optional().allow(null, ""),
	language: Joi.string().valid("fr", "wolof").optional().messages({
		"any.only": 'La langue doit être "fr" ou "wolof"',
	}),
});

module.exports = {
	updateProfileSchema,
	updateLocationSchema,
	updateLanguageSchema,
	updateUserByAdminSchema,
	createUserByAdminSchema,
	validate,
};
