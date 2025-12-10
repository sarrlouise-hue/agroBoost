/**
 * Script d'initialisation de la base de données
 * 
 * Ce script crée toutes les tables nécessaires dans la base de données.
 * À exécuter une fois lors du premier déploiement en production.
 * 
 * Usage:
 *   node scripts/init-db.js
 *   ou
 *   npm run init-db
 */

require('dotenv').config();
const { sequelize } = require('../src/config/database');

const initDatabase = async () => {
  try {
    console.log('🔗 Connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion établie avec succès.');

    // Charger tous les modèles
    console.log('📦 Chargement des modèles...');
    require('../src/models/User');
    require('../src/models/OTP');
    require('../src/models/PasswordResetToken');
    require('../src/models/Provider');
    require('../src/models/Service');

    // Charger les associations
    require('../src/models/associations');
    console.log('✅ Modèles chargés.');

    // Vérifier si les tables existent
    console.log('🔍 Vérification de l\'existence des tables...');
    const [results] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const tablesExist = results[0]?.exists || false;

    if (tablesExist) {
      console.log('⚠️  Les tables existent déjà.');
      console.log('💡 Pour recréer les tables, utilisez: npm run init-db:force');
      console.log('⚠️  ATTENTION: Cela supprimera toutes les données existantes!');
    } else {
      console.log('📦 Création des tables...');
      await sequelize.sync({ force: false });
      console.log('✅ Tables créées avec succès!');
    }

    // Afficher les tables créées
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tables dans la base de données:');
    tables.forEach(({ table_name }) => {
      console.log(`   - ${table_name}`);
    });

    console.log('\n✅ Initialisation terminée avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Exécuter le script
initDatabase();

