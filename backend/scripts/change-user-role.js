/**
 * Script pour changer le rôle d'un utilisateur
 *
 * Usage:
 *   node scripts/change-user-role.js <phoneNumber> <newRole>
 *   Exemple: node scripts/change-user-role.js +221771234567 admin
 */

require("dotenv").config();
const { sequelize } = require("../src/config/database");
const User = require("../src/models/User");
const { ROLES } = require("../src/config/constants");

const changeUserRole = async () => {
	try {
		console.log("🔗 Connexion à la base de données...");
		await sequelize.authenticate();
		console.log("✅ Connexion établie avec succès.");

		// Récupérer les paramètres
		const phoneNumber = process.argv[2];
		const newRole = process.argv[3];

		// Vérifier que les paramètres requis sont fournis
		if (!phoneNumber) {
			console.error("❌ Erreur: Le numéro de téléphone est requis.");
			console.log("\n💡 Usage:");
			console.log(
				"   node scripts/change-user-role.js <phoneNumber> <newRole>"
			);
			console.log(
				"   Exemple: node scripts/change-user-role.js +221771234567 admin"
			);
			console.log("\n📋 Rôles disponibles:", Object.values(ROLES).join(", "));
			process.exit(1);
		}

		if (!newRole) {
			console.error("❌ Erreur: Le nouveau rôle est requis.");
			console.log("\n💡 Usage:");
			console.log(
				"   node scripts/change-user-role.js <phoneNumber> <newRole>"
			);
			console.log(
				"   Exemple: node scripts/change-user-role.js +221771234567 admin"
			);
			console.log("\n📋 Rôles disponibles:", Object.values(ROLES).join(", "));
			process.exit(1);
		}

		// Vérifier que le rôle est valide
		if (!Object.values(ROLES).includes(newRole)) {
			console.error(`❌ Erreur: Le rôle "${newRole}" n'est pas valide.`);
			console.log("\n📋 Rôles disponibles:", Object.values(ROLES).join(", "));
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
		console.log(`   Rôle actuel: ${user.role}`);

		if (user.role === newRole) {
			console.log(`\n⚠️  L'utilisateur a déjà le rôle "${newRole}".`);
			process.exit(0);
		}

		// Mettre à jour le rôle
		console.log(
			`\n🔄 Changement du rôle de "${user.role}" vers "${newRole}"...`
		);
		user.role = newRole;
		await user.save();

		console.log("\n✅ Rôle mis à jour avec succès!");
		console.log(`   Nouveau rôle: ${user.role}`);
	} catch (error) {
		console.error("\n❌ Erreur lors du changement de rôle:");
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
changeUserRole();
