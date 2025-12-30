/**
 * Migration: Ajouter la colonne type à la table bookings
 * Date: 2025-01-06
 */

require("dotenv").config();
const { sequelize } = require("../src/config/database");
const { QueryTypes } = require("sequelize");

const migrate = async () => {
	const transaction = await sequelize.transaction();

	try {
		console.log("🔄 Début de la migration: Ajout colonne type à bookings");

		// Vérifier si la colonne existe
		const checkColumn = await sequelize.query(
			`SELECT column_name FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'type'`,
			{ type: QueryTypes.SELECT, transaction }
		);

		if (checkColumn.length === 0) {
			console.log(`📝 Ajout colonne type...`);
			await sequelize.query(
				`ALTER TABLE bookings ADD COLUMN "type" VARCHAR(20) DEFAULT 'daily' NOT NULL`,
				{ transaction }
			);
		} else {
			console.log(`⚠️ La colonne type existe déjà.`);
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
