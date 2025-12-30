const Joi = require("joi");

/**
 * Schéma de validation pour la création d'une réservation
 */
const createBookingSchema = Joi.object({
	serviceId: Joi.string().uuid().required().messages({
		"string.guid": "L'ID du service doit être un UUID valide",
		"any.required": "L'ID du service est requis",
	}),
	type: Joi.string().valid("daily", "hourly").required().messages({
		"any.only": 'Le type de réservation doit être "daily" ou "hourly"',
		"any.required": "Le type de réservation est requis",
	}),
	// Champs jour
	startDate: Joi.date()
		.iso()
		.when("type", { is: "daily", then: Joi.required() }),
	endDate: Joi.date()
		.iso()
		.min(Joi.ref("startDate"))
		.when("type", { is: "daily", then: Joi.required() }),

	// Champs heure
	bookingDate: Joi.date()
		.iso()
		.when("type", { is: "hourly", then: Joi.required() }),
	startTime: Joi.string()
		.pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
		.when("type", { is: "hourly", then: Joi.required() }),
	duration: Joi.number()
		.integer()
		.min(1)
		.when("type", { is: "hourly", then: Joi.optional() }),
	endTime: Joi.string()
		.pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
		.when("type", { is: "hourly", then: Joi.optional() }),

	notes: Joi.string().optional().allow(null, ""),
}).custom((value, helpers) => {
	if (value.type === "hourly" && !value.endTime && !value.duration) {
		return helpers.error("any.custom", {
			message:
				"Pour une réservation à l'heure, vous devez fournir soit la durée, soit l'heure de fin",
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
			field: detail.path.join("."),
			message: detail.message,
		}));

		return res.status(400).json({
			success: false,
			message: "Erreur de validation",
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
