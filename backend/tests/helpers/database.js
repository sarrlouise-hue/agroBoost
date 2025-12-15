const { sequelize } = require('../../src/config/database');

/**
 * Connexion à la base de données de test
 */
const connectTestDB = async () => {
  try {
    // Charger les modèles pour qu'ils soient enregistrés dans sequelize.models
    require('../../src/models/User');
    require('../../src/models/OTP');
    require('../../src/models/PasswordResetToken');
    require('../../src/models/Provider');
    require('../../src/models/Service');
    require('../../src/models/Maintenance');
    
    // Charger les associations
    require('../../src/models/associations');
    
    // Authentifier la connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données de test établie');
    
    // Synchroniser les modèles
    // Utiliser alter: false pour éviter les erreurs de contraintes
    // Les tables doivent déjà exister dans la base de données locale
    try {
      await sequelize.sync({ force: false, alter: false });
    } catch (error) {
      // Si la synchronisation échoue, essayer avec alter: true
      // Cela peut arriver si les tables n'existent pas encore
      if (error.name === 'SequelizeUnknownConstraintError' || error.message.includes('n\'existe pas')) {
        console.warn('⚠️  Tentative de synchronisation avec alter: true');
        try {
          await sequelize.sync({ force: false, alter: true });
        } catch (alterError) {
          // Si alter échoue aussi, essayer force: true (recréer les tables)
          console.warn('⚠️  Tentative de synchronisation avec force: true');
          await sequelize.sync({ force: true });
        }
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données de test:', error);
    // Ne pas faire échouer les tests si la base de données n'est pas disponible
    // Les tests d'intégration nécessitent une vraie base de données
    if (
      error.message.includes('password must be a string') ||
      error.message.includes('SASL') ||
      error.message.includes('server does not support SSL') ||
      error.message.includes('does not support SSL')
    ) {
      console.warn('⚠️  Base de données de test non configurée. Les tests d\'intégration seront ignorés.');
      throw new Error('DATABASE_NOT_CONFIGURED');
    }
    throw error;
  }
};

/**
 * Déconnexion de la base de données de test
 */
const disconnectTestDB = async () => {
  try {
    await sequelize.close();
    console.log('✅ Déconnexion de la base de données de test');
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion:', error);
    throw error;
  }
};

/**
 * Nettoyer toutes les tables de la base de données de test
 */
const clearTestDB = async () => {
  try {
    // Utiliser TRUNCATE CASCADE directement en SQL pour un nettoyage rapide et efficace
    // Ordre important : d'abord les tables avec clés étrangères, puis les tables parentes
    const tables = ['maintenances', 'services', 'providers', 'otps', 'password_reset_tokens', 'users'];
    
    // Désactiver temporairement les contraintes de clés étrangères
    await sequelize.query('SET session_replication_role = replica;');
    
    // Truncater toutes les tables en cascade
    for (const table of tables) {
      try {
        await sequelize.query(`TRUNCATE TABLE "${table}" CASCADE;`);
      } catch (error) {
        // Ignorer si la table n'existe pas
        if (!error.message.includes('n\'existe pas') && !error.message.includes('does not exist') && !error.message.includes('relation') && !error.message.includes('does not exist')) {
          // Essayer avec le nom en minuscules si la table utilise un nom différent
          try {
            await sequelize.query(`TRUNCATE TABLE "${table.toLowerCase()}" CASCADE;`);
          } catch (e) {
            // Ignorer silencieusement
          }
        }
      }
    }
    
    // Réactiver les contraintes
    await sequelize.query('SET session_replication_role = DEFAULT;');
    
    console.log('✅ Base de données de test nettoyée');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage de la base de données:', error.message);
    // Ne pas faire échouer les tests si le nettoyage échoue
  }
};

/**
 * Supprimer toutes les tables de la base de données de test
 */
const dropTestDB = async () => {
  try {
    await sequelize.drop({ cascade: true });
    console.log('✅ Base de données de test supprimée');
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la base de données:', error);
    throw error;
  }
};

module.exports = {
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
  dropTestDB,
};
