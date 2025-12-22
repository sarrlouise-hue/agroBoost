/**
 * Script pour lister tous les administrateurs
 *
 * Usage:
 *   node scripts/list-admins.js
 */

require("dotenv").config();
const { sequelize } = require("../src/config/database");
const User = require("../src/models/User");
const { ROLES } = require("../src/config/constants");

const listAdmins = async () => {
	try {
		console.log("🔗 Connexion à la base de données...");
		await sequelize.authenticate();
		console.log("✅ Connexion établie avec succès.\n");

		// Rechercher tous les administrateurs
		const admins = await User.findAll({
			where: { role: ROLES.ADMIN },
			attributes: [
				"id",
				"phoneNumber",
				"email",
				"firstName",
				"lastName",
				"password",
				"isVerified",
				"createdAt",
			],
		});

		if (admins.length === 0) {
			console.log("⚠️  Aucun administrateur trouvé dans la base de données.");
			console.log("\n💡 Créez un administrateur avec:");
			console.log(
				"   node scripts/seed-admin.js <email> <password> <phoneNumber> [firstName] [lastName]"
			);
		} else {
			console.log(`📋 ${admins.length} administrateur(s) trouvé(s):\n`);
			admins.forEach((admin, index) => {
				console.log(`${index + 1}. ${admin.firstName} ${admin.lastName}`);
				console.log(`   ID: ${admin.id}`);
				console.log(`   Email: ${admin.email || "Non défini"}`);
				console.log(`   Téléphone: ${admin.phoneNumber || "Non défini"}`);
				console.log(
					`   Mot de passe: ${admin.password ? "✅ Défini" : "❌ Non défini"}`
				);
				console.log(`   Vérifié: ${admin.isVerified ? "Oui" : "Non"}`);
				console.log(`   Créé le: ${admin.createdAt.toLocaleString("fr-FR")}`);
				console.log("");
			});

			// Afficher les admins sans mot de passe
			const adminsWithoutPassword = admins.filter((admin) => !admin.password);
			if (adminsWithoutPassword.length > 0) {
				console.log("⚠️  Administrateurs sans mot de passe:");
				adminsWithoutPassword.forEach((admin) => {
					console.log(
						`   - ${admin.firstName} ${admin.lastName} (${
							admin.phoneNumber || admin.email
						})`
					);
				});
				console.log("\n💡 Définissez un mot de passe avec:");
				console.log(
					"   node scripts/set-user-password.js <phoneNumber> <newPassword>"
				);
			}
		}
	} catch (error) {
		console.error("\n❌ Erreur:");
		console.error(`   ${error.message}`);
		if (process.env.NODE_ENV === "development") {
			console.error(error.stack);
		}
		process.exit(1);
	} finally {
		await sequelize.close();
	}
};

// Exécuter le script
listAdmins();
