require("dotenv").config();
const { sequelize } = require("../src/config/database");

const updateRoleEnum = async () => {
	try {
		console.log("🔗 Connexion à la base de données...");
		await sequelize.authenticate();
		console.log("✅ Connexion établie.");

		console.log('🔄 Mise à jour du type ENUM "enum_users_role"...');

		// Postgres ne permet pas d'ajouter une valeur "IF NOT EXISTS" facilement dans une commande ALTER TYPE standard
		// On essaie de l'ajouter, si elle existe déjà, Postgres renverra une erreur qu'on peut ignorer
		try {
			await sequelize.query(
				"ALTER TYPE \"enum_users_role\" ADD VALUE 'mechanic';"
			);
			console.log('✅ Rôle "mechanic" ajouté avec succès au type ENUM.');
		} catch (error) {
			if (error.original && error.original.code === "42710") {
				// Code erreur Postgres pour "duplicate value" (valeur existe déjà)
				console.log('ℹ️  Le rôle "mechanic" existe déjà dans le type ENUM.');
			} else {
				throw error;
			}
		}

		console.log("\n🎉 Migration terminée avec succès !");
	} catch (error) {
		console.error("\n❌ Erreur lors de la mise à jour:", error);
	} finally {
		await sequelize.close();
	}
};

updateRoleEnum();
