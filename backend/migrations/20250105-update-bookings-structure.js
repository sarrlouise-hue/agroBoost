/**
 * Migration: Modifier la table bookings pour supporter les réservations par jour et par heure
 * Date: 2025-01-05
 */

require("dotenv").config();
const { sequelize } = require("../src/config/database");
const { QueryTypes } = require("sequelize");

const migrate = async () => {
	const transaction = await sequelize.transaction();

	try {
		console.log("🔄 Début de la migration: Mise à jour structure bookings");

		// 1. Ajouter les colonnes startDate et endDate
		const columnsToAdd = [
			{ name: "startDate", type: "DATE" },
			{ name: "endDate", type: "DATE" },
		];

		for (const column of columnsToAdd) {
			const checkColumn = await sequelize.query(
				`SELECT column_name FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = '${column.name}'`,
				{ type: QueryTypes.SELECT, transaction }
			);

			if (checkColumn.length === 0) {
				console.log(`📝 Ajout colonne ${column.name}...`);
				await sequelize.query(
					`ALTER TABLE bookings ADD COLUMN "${column.name}" ${column.type}`,
					{ transaction }
				);
			}
		}

		// 2. Rendre les anciennes colonnes optionnelles
		const columnsToAlter = ["bookingDate", "startTime"];

		for (const col of columnsToAlter) {
			console.log(`📝 Modification colonne ${col} pour accepter NULL...`);
			await sequelize.query(
				`ALTER TABLE bookings ALTER COLUMN "${col}" DROP NOT NULL`,
				{ transaction }
			);
		}

		await transaction.commit();
		console.log("✅ Migration terminée avec succès!");
	} catch (error) {
		await transaction.rollback();
		console.error("❌ Erreur lors de la migration:", error);
		process.exit(1);
	}
};

if (require.main === module) {
	migrate().then(() => process.exit(0));
}

module.exports = migrate;
