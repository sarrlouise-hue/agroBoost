const Provider = require("../models/Provider");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * Repository pour les opérations sur les prestataires
 */
class ProviderRepository {
	/**
	 * Trouver un prestataire par ID
	 */
	async findById(providerId) {
		return Provider.findByPk(providerId, {
			include: [{ association: "user", attributes: { exclude: ["password"] } }],
		});
	}

	/**
	 * Trouver un prestataire par userId
	 */
	async findByUserId(userId) {
		return Provider.findOne({
			where: { userId },
			include: [{ association: "user", attributes: { exclude: ["password"] } }],
		});
	}

	/**
	 * Créer un nouveau prestataire
	 */
	async create(providerData) {
		return Provider.create(providerData, {
			include: [{ association: "user", attributes: { exclude: ["password"] } }],
		});
	}

	/**
	 * Mettre à jour un prestataire
	 */
	async updateById(providerId, updateData) {
		const provider = await Provider.findByPk(providerId);
		if (!provider) {
			return null;
		}
		await provider.update(updateData);
		return provider.reload({
			include: [{ association: "user", attributes: { exclude: ["password"] } }],
		});
	}

	/**
	 * Trouver tous les prestataires avec pagination et filtres avancés
	 */
	async findAll(options = {}) {
		const {
			page = 1,
			limit = 20,
			isApproved = null,
			minRating = null,
			search = null,
			userId = null,
			startDate = null,
			endDate = null,
		} = options;

		const where = {};
		if (isApproved !== null) {
			where.isApproved = isApproved;
		}
		if (minRating !== null) {
			where.rating = { [Op.gte]: minRating };
		}
		if (userId) {
			where.userId = userId;
		}
		if (startDate || endDate) {
			where.createdAt = {};
			if (startDate) {
				where.createdAt[Op.gte] = new Date(startDate);
			}
			if (endDate) {
				where.createdAt[Op.lte] = new Date(endDate);
			}
		}

		const includeOptions = [
			{
				association: "user",
				attributes: { exclude: ["password"] },
				where: search
					? {
							[Op.or]: [
								{ firstName: { [Op.iLike]: `%${search}%` } },
								{ lastName: { [Op.iLike]: `%${search}%` } },
								{ email: { [Op.iLike]: `%${search}%` } },
								{ phoneNumber: { [Op.iLike]: `%${search}%` } },
							],
					  }
					: undefined,
				required: !!search,
			},
		];

		// Si recherche dans businessName ou description
		if (search && !where.userId) {
			where[Op.or] = [
				{ businessName: { [Op.iLike]: `%${search}%` } },
				{ description: { [Op.iLike]: `%${search}%` } },
			];
		}

		const offset = (page - 1) * limit;

		return Provider.findAndCountAll({
			where,
			include: includeOptions,
			attributes: {
				include: [
					[
						sequelize.literal(`(
              SELECT COUNT(*)
              FROM services AS s
              WHERE s."providerId" = "Provider"."id"
            )`),
						"machineCount",
					],
					[
						sequelize.literal(`(
              SELECT COUNT(*)
              FROM reviews AS r
              WHERE r."providerId" = "Provider"."id"
            )`),
						"reviewCount",
					],
				],
			},
			limit: parseInt(limit),
			offset: parseInt(offset),
			order: [["createdAt", "DESC"]],
			distinct: true,
		});
	}

	/**
	 * Trouver les prestataires approuvés
	 */
	async findApproved(options = {}) {
		return this.findAll({ ...options, isApproved: true });
	}

	/**
	 * Sauvegarder un prestataire
	 */
	async save(provider) {
		return provider.save();
	}

	/**
	 * Supprimer un prestataire
	 */
	async deleteById(providerId) {
		const provider = await Provider.findByPk(providerId);
		if (!provider) {
			return false;
		}
		await provider.destroy();
		return true;
	}
}

module.exports = new ProviderRepository();
