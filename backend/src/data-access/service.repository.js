const Service = require("../models/Service");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * Repository pour les opérations sur les services
 */
class ServiceRepository {
	/**
	 * Trouver un service par ID
	 */
	async findById(serviceId) {
		return Service.findByPk(serviceId, {
			include: [
				{
					association: "provider",
					include: [
						{ association: "user", attributes: { exclude: ["password"] } },
					],
				},
			],
		});
	}

	/**
	 * Créer un nouveau service
	 */
	async create(serviceData) {
		return Service.create(serviceData, {
			include: [
				{
					association: "provider",
					include: [
						{ association: "user", attributes: { exclude: ["password"] } },
					],
				},
			],
		});
	}

	/**
	 * Mettre à jour un service
	 */
	async updateById(serviceId, updateData) {
		const service = await Service.findByPk(serviceId);
		if (!service) {
			return null;
		}
		await service.update(updateData);
		return service.reload({
			include: [
				{
					association: "provider",
					include: [
						{ association: "user", attributes: { exclude: ["password"] } },
					],
				},
			],
		});
	}

	/**
	 * Trouver tous les services avec pagination et filtres
	 */
	async findAll(options = {}) {
		const {
			page = 1,
			limit = 20,
			serviceType = null,
			availability = null,
			providerId = null,
			minPrice = null,
			maxPrice = null,
			latitude = null,
			longitude = null,
			radius = null, // en km
		} = options;

		const where = {};

		if (serviceType) {
			where.serviceType = serviceType;
		}
		if (availability !== null) {
			where.availability = availability;
		}
		if (providerId) {
			where.providerId = providerId;
		}
		if (minPrice !== null || maxPrice !== null) {
			where[Op.or] = [];
			if (minPrice !== null) {
				where[Op.or].push({
					pricePerHour: { [Op.gte]: minPrice },
				});
				where[Op.or].push({
					pricePerDay: { [Op.gte]: minPrice },
				});
			}
			if (maxPrice !== null) {
				where[Op.or].push({
					pricePerHour: { [Op.lte]: maxPrice },
				});
				where[Op.or].push({
					pricePerDay: { [Op.lte]: maxPrice },
				});
			}
		}

		const offset = (page - 1) * limit;

		let query = {
			where,
			include: [
				{
					association: "provider",
					where: { isApproved: true }, // Seulement les prestataires approuvés
					include: [
						{ association: "user", attributes: { exclude: ["password"] } },
					],
					required: false, // LEFT JOIN pour éviter les problèmes avec les includes
				},
			],
			limit: parseInt(limit),
			offset: parseInt(offset),
			order: [["createdAt", "DESC"]],
			distinct: true, // Nécessaire pour éviter les doublons avec les includes
		};

		// Recherche par proximité géographique
		if (latitude && longitude && radius) {
			// Utiliser la formule de Haversine pour calculer la distance
			// Note: Cette approche nécessite que latitude et longitude soient non-null
			const lat = parseFloat(latitude);
			const lng = parseFloat(longitude);
			const rad = parseFloat(radius);

			// Ajouter une condition pour les coordonnées non-null
			query.where[Op.and] = query.where[Op.and] || [];
			query.where[Op.and].push({
				latitude: { [Op.ne]: null },
				longitude: { [Op.ne]: null },
			});

			// Calcul de distance approximative (formule simplifiée)
			// Pour une recherche plus précise, utiliser PostGIS ou une extension PostgreSQL
			// Utiliser le nom de la table Sequelize (généralement en minuscules)
			const distanceQuery = sequelize.literal(
				`(6371 * acos(
          cos(radians(${lat})) * 
          cos(radians("services"."latitude")) * 
          cos(radians("services"."longitude") - radians(${lng})) + 
          sin(radians(${lat})) * 
          sin(radians("services"."latitude"))
        )) <= ${rad}`
			);

			query.where[Op.and].push(distanceQuery);
		}

		return Service.findAndCountAll(query);
	}

	/**
	 * Trouver les services disponibles
	 */
	async findAvailable(options = {}) {
		return this.findAll({ ...options, availability: true });
	}

	/**
	 * Trouver les services d'un prestataire
	 */
	async findByProviderId(providerId, options = {}) {
		return this.findAll({ ...options, providerId });
	}

	/**
	 * Sauvegarder un service
	 */
	async save(service) {
		return service.save();
	}

	/**
	 * Supprimer un service
	 */
	async deleteById(serviceId) {
		const service = await Service.findByPk(serviceId);
		if (!service) {
			return false;
		}
		await service.destroy();
		return true;
	}
}

module.exports = new ServiceRepository();
