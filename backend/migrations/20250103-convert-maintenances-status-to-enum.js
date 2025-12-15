/**
 * Migration: Convertir la colonne status de maintenances en ENUM
 * Date: 2025-01-03
 * Description: Convertit la colonne status de VARCHAR vers ENUM pour correspondre au modèle Sequelize
 */

require('dotenv').config();
const { sequelize } = require('../src/config/database');
const { QueryTypes } = require('sequelize');

const migrate = async () => {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('🔄 Début de la migration: Conversion de status en ENUM');
    
    // Vérifier si la table existe
    const checkTable = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'maintenances';
    `, { type: QueryTypes.SELECT, transaction });

    if (!checkTable || checkTable.length === 0) {
      console.log('⚠️  La table maintenances n\'existe pas. Migration ignorée.');
      await transaction.rollback();
      return;
    }

    // Vérifier si le type ENUM existe déjà
    const checkEnum = await sequelize.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_maintenances_status'
      ) as exists;
    `, { type: QueryTypes.SELECT, transaction });

    const enumExists = checkEnum && checkEnum[0] && (checkEnum[0].exists === true || checkEnum[0].exists === 't');

    // Vérifier le type actuel de la colonne status
    const checkColumn = await sequelize.query(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'maintenances' 
      AND column_name = 'status';
    `, { type: QueryTypes.SELECT, transaction });

    if (!checkColumn || checkColumn.length === 0) {
      console.log('⚠️  La colonne status n\'existe pas. Migration ignorée.');
      await transaction.rollback();
      return;
    }

    const currentType = checkColumn[0].data_type;

    // Si c'est déjà un ENUM, ne rien faire
    if (currentType === 'USER-DEFINED' && enumExists) {
      console.log('✅ La colonne status est déjà un ENUM. Migration ignorée.');
      await transaction.rollback();
      return;
    }

    // Créer le type ENUM s'il n'existe pas
    if (!enumExists) {
      await sequelize.query(`
        CREATE TYPE enum_maintenances_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
      `, { transaction });
      console.log('✅ Type ENUM enum_maintenances_status créé');
    }

    // Supprimer la valeur par défaut temporairement
    await sequelize.query(`
      ALTER TABLE maintenances ALTER COLUMN status DROP DEFAULT;
    `, { transaction });

    // Convertir la colonne en ENUM
    await sequelize.query(`
      ALTER TABLE maintenances 
      ALTER COLUMN status TYPE enum_maintenances_status 
      USING status::enum_maintenances_status;
    `, { transaction });

    // Remettre la valeur par défaut
    await sequelize.query(`
      ALTER TABLE maintenances 
      ALTER COLUMN status SET DEFAULT 'pending'::enum_maintenances_status;
    `, { transaction });

    // Supprimer l'ancienne contrainte CHECK si elle existe
    try {
      await sequelize.query(`
        ALTER TABLE maintenances DROP CONSTRAINT IF EXISTS maintenances_status_check;
      `, { transaction });
    } catch (error) {
      // Ignorer si la contrainte n'existe pas
      console.log('ℹ️  Contrainte CHECK non trouvée (normal si déjà supprimée)');
    }

    await transaction.commit();
    console.log('✅ Migration terminée: Colonne status convertie en ENUM avec succès');
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

