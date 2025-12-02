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
    
    // Authentifier la connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données de test établie');
    
    // Synchroniser les modèles
    await sequelize.sync({ force: false, alter: true });
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données de test:', error);
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
    // Récupérer tous les modèles
    const models = sequelize.models;
    
    // Désactiver les contraintes de clés étrangères temporairement
    await sequelize.query('SET session_replication_role = replica;');
    
    // Supprimer toutes les données de chaque table
    const deletePromises = Object.keys(models).map((modelName) => {
      const model = models[modelName];
      return model.destroy({ where: {}, truncate: true, cascade: true, force: true });
    });
    
    await Promise.all(deletePromises);
    
    // Réactiver les contraintes
    await sequelize.query('SET session_replication_role = DEFAULT;');
    
    console.log('✅ Base de données de test nettoyée');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage de la base de données:', error);
    throw error;
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
