const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { SERVICE_TYPES } = require("../config/constants");

const Service = sequelize.define(
	"Service",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		providerId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "providers",
				key: "id",
			},
			onDelete: "CASCADE",
			validate: {
				notNull: { msg: "L'ID prestataire est requis" },
			},
		},
		serviceType: {
			type: DataTypes.ENUM(...Object.values(SERVICE_TYPES)),
			allowNull: false,
			validate: {
				notNull: { msg: "Le type de service est requis" },
				isIn: {
					args: [Object.values(SERVICE_TYPES)],
					msg: "Le type de service n'est pas valide",
				},
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: { msg: "Le nom du service est requis" },
				len: {
					args: [2, 100],
					msg: "Le nom du service doit contenir entre 2 et 100 caractères",
				},
			},
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		pricePerHour: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: true,
			validate: {
				min: 0,
			},
		},
		pricePerDay: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: true,
			validate: {
				min: 0,
			},
		},
		images: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
			defaultValue: [],
		},
		availability: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		latitude: {
			type: DataTypes.DECIMAL(10, 8),
			allowNull: true,
			validate: {
				min: -90,
				max: 90,
			},
		},
		longitude: {
			type: DataTypes.DECIMAL(11, 8),
			allowNull: true,
			validate: {
				min: -180,
				max: 180,
			},
		},
		brand: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		model: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		condition: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		location: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		technicalSpecifications: {
			type: DataTypes.JSONB,
			allowNull: true,
			defaultValue: {},
		},
	},
	{
		tableName: "services",
		timestamps: true,
		indexes: [
			{
				fields: ["providerId"],
			},
			{
				fields: ["serviceType"],
			},
			{
				fields: ["availability"],
			},
			{
				fields: ["latitude", "longitude"],
			},
		],
	}
);

// Les associations seront définies dans un fichier séparé pour éviter les dépendances circulaires

module.exports = Service;
