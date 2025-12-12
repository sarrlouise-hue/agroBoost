/**
 * Script de création d'un compte administrateur
 * 
 * Ce script crée un compte administrateur dans la base de données.
 * 
 * Usage:
 *   node scripts/seed-admin.js
 *   ou avec variables d'environnement:
 *   ADMIN_EMAIL=admin@allotracteur.com ADMIN_PASSWORD=MotDePasse123 ADMIN_PHONE=+221771234567 ADMIN_FIRST_NAME=Admin ADMIN_LAST_NAME=AlloTracteur node scripts/seed-admin.js
 *   ou
 *   npm run seed:admin
 */

require('dotenv').config();
const { sequelize } = require('../src/config/database');
const User = require('../src/models/User');
const { ROLES } = require('../src/config/constants');

const createAdmin = async () => {
  try {
    console.log('🔗 Connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion établie avec succès.');

    // Récupérer les paramètres depuis les variables d'environnement ou les arguments
    const email = process.env.ADMIN_EMAIL || process.argv[2];
    const password = process.env.ADMIN_PASSWORD || process.argv[3];
    const phoneNumber = process.env.ADMIN_PHONE || process.argv[4];
    const firstName = process.env.ADMIN_FIRST_NAME || process.argv[5] || 'Admin';
    const lastName = process.env.ADMIN_LAST_NAME || process.argv[6] || 'AlloTracteur';

    // Vérifier que les paramètres requis sont fournis
    if (!email) {
      console.error('❌ Erreur: L\'email est requis.');
      console.log('\n💡 Usage:');
      console.log('   node scripts/seed-admin.js <email> <password> [phoneNumber] [firstName] [lastName]');
      console.log('   ou');
      console.log('   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=password123 node scripts/seed-admin.js');
      process.exit(1);
    }

    if (!password) {
      console.error('❌ Erreur: Le mot de passe est requis.');
      console.log('\n💡 Usage:');
      console.log('   node scripts/seed-admin.js <email> <password> [phoneNumber] [firstName] [lastName]');
      console.log('   ou');
      console.log('   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=password123 node scripts/seed-admin.js');
      process.exit(1);
    }

    if (!phoneNumber) {
      console.error('❌ Erreur: Le numéro de téléphone est requis.');
      console.log('\n💡 Usage:');
      console.log('   node scripts/seed-admin.js <email> <password> <phoneNumber> [firstName] [lastName]');
      process.exit(1);
    }

    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      if (existingUserByEmail.role === ROLES.ADMIN) {
        console.log('⚠️  Un administrateur avec cet email existe déjà.');
        console.log(`   Email: ${existingUserByEmail.email}`);
        console.log(`   Nom: ${existingUserByEmail.firstName} ${existingUserByEmail.lastName}`);
        console.log(`   Rôle: ${existingUserByEmail.role}`);
        process.exit(0);
      } else {
        console.error('❌ Erreur: Un utilisateur avec cet email existe déjà mais n\'est pas administrateur.');
        console.log(`   Email: ${existingUserByEmail.email}`);
        console.log(`   Rôle actuel: ${existingUserByEmail.role}`);
        process.exit(1);
      }
    }

    // Vérifier si un utilisateur avec ce numéro de téléphone existe déjà
    const existingUserByPhone = await User.findOne({ where: { phoneNumber } });
    if (existingUserByPhone) {
      if (existingUserByPhone.role === ROLES.ADMIN) {
        console.log('⚠️  Un administrateur avec ce numéro de téléphone existe déjà.');
        console.log(`   Téléphone: ${existingUserByPhone.phoneNumber}`);
        console.log(`   Nom: ${existingUserByPhone.firstName} ${existingUserByPhone.lastName}`);
        console.log(`   Rôle: ${existingUserByPhone.role}`);
        process.exit(0);
      } else {
        console.error('❌ Erreur: Un utilisateur avec ce numéro de téléphone existe déjà mais n\'est pas administrateur.');
        console.log(`   Téléphone: ${existingUserByPhone.phoneNumber}`);
        console.log(`   Rôle actuel: ${existingUserByPhone.role}`);
        process.exit(1);
      }
    }

    // Créer l'administrateur
    console.log('\n📝 Création de l\'administrateur...');
    console.log(`   Email: ${email}`);
    console.log(`   Téléphone: ${phoneNumber}`);
    console.log(`   Nom: ${firstName} ${lastName}`);
    console.log(`   Rôle: ${ROLES.ADMIN}`);

    const admin = await User.create({
      email,
      phoneNumber,
      firstName,
      lastName,
      password, // Le mot de passe sera hashé automatiquement par le hook beforeCreate
      role: ROLES.ADMIN,
      isVerified: true, // L'admin est automatiquement vérifié
      language: 'fr',
    });

    console.log('\n✅ Administrateur créé avec succès!');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Téléphone: ${admin.phoneNumber}`);
    console.log(`   Nom: ${admin.firstName} ${admin.lastName}`);
    console.log(`   Rôle: ${admin.role}`);
    console.log(`   Vérifié: ${admin.isVerified ? 'Oui' : 'Non'}`);
    console.log('\n💡 Vous pouvez maintenant vous connecter avec cet email et ce mot de passe.');

  } catch (error) {
    console.error('\n❌ Erreur lors de la création de l\'administrateur:');
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors && error.errors[0] ? error.errors[0].path : 'champ';
      console.error(`   Un utilisateur existe déjà avec ce ${field === 'email' ? 'email' : 'numéro de téléphone'}.`);
    } else if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message).join(', ');
      console.error(`   Erreur de validation: ${messages}`);
    } else {
      console.error(`   ${error.message}`);
      if (process.env.NODE_ENV === 'development') {
        console.error(error.stack);
      }
    }
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Exécuter le script
createAdmin();

