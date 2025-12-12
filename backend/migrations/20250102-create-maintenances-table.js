/**
 * Migration: Créer la table maintenances
 * Date: 2025-01-02
 * Description: Crée la table maintenances pour le suivi des réparations et entretiens de matériel
 */

require('dotenv').config();
const { sequelize } = require('../src/config/database');
const { QueryTypes } = require('sequelize');

const migrate = async () => {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('🔄 Début de la migration: Création de la table maintenances');
    
    // Vérifier si la table existe déjà
    const checkTable = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'maintenances';
    `, { type: QueryTypes.SELECT, transaction });

    if (checkTable && checkTable.length > 0) {
      console.log('⚠️  La table maintenances existe déjà. Migration ignorée.');
      await transaction.rollback();
      return;
    }

    // Créer la table maintenances
    await sequelize.query(`
      CREATE TABLE maintenances (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "serviceId" UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
        "mechanicId" UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
        "endDate" TIMESTAMP WITH TIME ZONE,
        duration INTEGER,
        description TEXT,
        cost DECIMAL(10, 2),
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
        notes TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `, { transaction });

    // Créer les index
    await sequelize.query(`
      CREATE INDEX idx_maintenances_service_id ON maintenances("serviceId");
      CREATE INDEX idx_maintenances_mechanic_id ON maintenances("mechanicId");
      CREATE INDEX idx_maintenances_status ON maintenances(status);
      CREATE INDEX idx_maintenances_start_date ON maintenances("startDate");
    `, { transaction });

    await transaction.commit();
    console.log('✅ Migration terminée: Table maintenances créée avec succès');
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Exécuter la migration si le script est appelé directement
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('✅ Migration exécutée avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur lors de l\'exécution de la migration:', error);
      process.exit(1);
    });
}

module.exports = migrate;

