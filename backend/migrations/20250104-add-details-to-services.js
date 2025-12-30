/**
 * Migration: Ajouter les détails supplémentaires aux services
 * Date: 2025-01-04
 * Description: Ajoute les colonnes brand, model, year, condition, location et technicalSpecifications à la table services
 */

require("dotenv").config();
const { sequelize } = require("../src/config/database");
const { QueryTypes } = require("sequelize");

const migrate = async () => {
	const transaction = await sequelize.transaction();

	try {
		console.log("🔄 Début de la migration: Ajout des détails aux services");

		const columnsToAdd = [
			{ name: "brand", type: "VARCHAR(255)" },
			{ name: "model", type: "VARCHAR(255)" },
			{ name: "year", type: "INTEGER" },
			{ name: "condition", type: "VARCHAR(255)" },
			{ name: "location", type: "VARCHAR(255)" },
			{ name: "technicalSpecifications", type: "JSONB DEFAULT '{}'" },
		];

		for (const column of columnsToAdd) {
			// Vérifier si la colonne existe déjà
			const checkColumn = await sequelize.query(
				`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'services' 
        AND column_name = '${column.name}';
      `,
				{ type: QueryTypes.SELECT, transaction }
			);

			if (checkColumn && checkColumn.length > 0) {
				console.log(`⚠️  La colonne ${column.name} existe déjà. Passage.`);
			} else {
				console.log(`📝 Création de la colonne ${column.name}...`);
				await sequelize.query(
					`
          ALTER TABLE services 
          ADD COLUMN "${column.name}" ${column.type};
        `,
					{ transaction }
				);
			}
		}

		await transaction.commit();
		console.log("✅ Migration terminée avec succès!");
	} catch (error) {
		await transaction.rollback();
		console.error("❌ Erreur lors de la migration:", error);
		throw error;
	}
};

// Exécuter la migration
if (require.main === module) {
	migrate()
		.then(() => {
			console.log("✅ Migration terminée");
			process.exit(0);
		})
		.catch((error) => {
			console.error("❌ Échec de la migration:", error);
			process.exit(1);
		});
}

module.exports = migrate;
