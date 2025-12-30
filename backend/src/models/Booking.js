const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const BOOKING_STATUS = {
	PENDING: "pending",
	CONFIRMED: "confirmed",
	IN_PROGRESS: "in_progress",
	COMPLETED: "completed",
	CANCELLED: "cancelled",
};

const Booking = sequelize.define(
	"Booking",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
			onDelete: "CASCADE",
			validate: {
				notNull: { msg: "L'ID utilisateur est requis" },
			},
		},
		serviceId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "services",
				key: "id",
			},
			onDelete: "CASCADE",
			validate: {
				notNull: { msg: "L'ID service est requis" },
			},
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
		type: {
			type: DataTypes.ENUM("daily", "hourly"),
			defaultValue: "daily",
			allowNull: false,
		},
		bookingDate: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},
		startTime: {
			type: DataTypes.TIME,
			allowNull: true,
		},
		startDate: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},
		endDate: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},
		endTime: {
			type: DataTypes.TIME,
			allowNull: true,
		},
		duration: {
			type: DataTypes.INTEGER,
			allowNull: true,
			comment: "Durée en jours",
			validate: {
				min: 1,
			},
		},
		totalPrice: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
			validate: {
				notNull: { msg: "Le prix total est requis" },
				min: 0,
			},
		},
		status: {
			type: DataTypes.ENUM(...Object.values(BOOKING_STATUS)),
			defaultValue: BOOKING_STATUS.PENDING,
			validate: {
				isIn: {
					args: [Object.values(BOOKING_STATUS)],
					msg: "Le statut de réservation n'est pas valide",
				},
			},
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
		notes: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: "bookings",
		timestamps: true,
		indexes: [
			{
				fields: ["userId"],
			},
			{
				fields: ["serviceId"],
			},
			{
				fields: ["providerId"],
			},
			{
				fields: ["status"],
			},
			{
				fields: ["bookingDate"],
			},
			{
				fields: ["bookingDate", "startTime", "serviceId"],
				name: "booking_availability_index",
			},
		],
	}
);

// Ajouter les constantes de statut au modèle
Booking.STATUS = BOOKING_STATUS;

module.exports = Booking;
