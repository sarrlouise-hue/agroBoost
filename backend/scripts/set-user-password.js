/**
 * Script pour définir/mettre à jour le mot de passe d'un utilisateur
 *
 * Usage:
 *   node scripts/set-user-password.js <phoneNumber> <newPassword>
 *   Exemple: node scripts/set-user-password.js 771234567 Admin123!
 */

require("dotenv").config();
const { sequelize } = require("../src/config/database");
const User = require("../src/models/User");

const setUserPassword = async () => {
	try {
		console.log("🔗 Connexion à la base de données...");
		await sequelize.authenticate();
		console.log("✅ Connexion établie avec succès.");

		// Récupérer les paramètres
		const phoneNumber = process.argv[2];
		const newPassword = process.argv[3];

		// Vérifier que les paramètres requis sont fournis
		if (!phoneNumber) {
			console.error("❌ Erreur: Le numéro de téléphone est requis.");
			console.log("\n💡 Usage:");
			console.log(
				"   node scripts/set-user-password.js <phoneNumber> <newPassword>"
			);
			console.log(
				"   Exemple: node scripts/set-user-password.js 771234567 Admin123!"
			);
			process.exit(1);
		}

		if (!newPassword) {
			console.error("❌ Erreur: Le nouveau mot de passe est requis.");
			console.log("\n💡 Usage:");
			console.log(
				"   node scripts/set-user-password.js <phoneNumber> <newPassword>"
			);
			console.log(
				"   Exemple: node scripts/set-user-password.js 771234567 Admin123!"
			);
			process.exit(1);
		}

		// Vérifier la longueur du mot de passe
		if (newPassword.length < 8) {
			console.error(
				"❌ Erreur: Le mot de passe doit contenir au moins 8 caractères."
			);
			process.exit(1);
		}

		// Rechercher l'utilisateur
		console.log(
			`\n🔍 Recherche de l'utilisateur avec le numéro: ${phoneNumber}...`
		);
		const user = await User.findOne({ where: { phoneNumber } });

		if (!user) {
			console.error(
				`❌ Erreur: Aucun utilisateur trouvé avec le numéro ${phoneNumber}.`
			);
			process.exit(1);
		}

		console.log(`✅ Utilisateur trouvé:`);
		console.log(`   ID: ${user.id}`);
		console.log(`   Nom: ${user.firstName} ${user.lastName}`);
		console.log(`   Email: ${user.email || "Non défini"}`);
		console.log(`   Rôle: ${user.role}`);
		console.log(
			`   Mot de passe actuel: ${user.password ? "Défini" : "Non défini"}`
		);

		// Mettre à jour le mot de passe
		console.log(`\n🔄 Mise à jour du mot de passe...`);
		user.password = newPassword; // Le hook beforeUpdate va hasher le mot de passe
		await user.save();

		console.log("\n✅ Mot de passe mis à jour avec succès!");
		console.log(`\n💡 Vous pouvez maintenant vous connecter avec:`);
		console.log(`   Téléphone: ${user.phoneNumber}`);
		console.log(`   Mot de passe: ${newPassword}`);
	} catch (error) {
		console.error("\n❌ Erreur lors de la mise à jour du mot de passe:");
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
setUserPassword();
