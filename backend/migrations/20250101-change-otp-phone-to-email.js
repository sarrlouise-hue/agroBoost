/**
 * Migration: Changer phoneNumber en email dans la table otps
 * Date: 2025-01-01
 * Description: Remplace la colonne phoneNumber par email dans la table otps
 *              pour permettre l'authentification par email au lieu du téléphone
 */

require('dotenv').config();
const { sequelize } = require('../src/config/database');
const { QueryTypes } = require('sequelize');

const migrate = async () => {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('🔄 Début de la migration: phoneNumber -> email dans otps');
    
    // Vérifier si la colonne phoneNumber existe
    const checkColumn = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'otps' 
      AND column_name = 'phoneNumber';
    `, { type: QueryTypes.SELECT, transaction });

    if (checkColumn && checkColumn.length > 0) {
      console.log('📋 Colonne phoneNumber trouvée, début de la migration...');
      
      // Étape 1: Vérifier si la colonne email existe déjà
      const checkEmail = await sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'otps' 
        AND column_name = 'email';
      `, { type: QueryTypes.SELECT, transaction });

      if (checkEmail && checkEmail.length > 0) {
        console.log('⚠️  La colonne email existe déjà. Migration peut-être déjà effectuée.');
        console.log('💡 Si vous voulez forcer la migration, supprimez d\'abord la colonne email.');
        await transaction.rollback();
        return;
      }

      // Étape 2: Créer la colonne email temporairement
      console.log('📝 Création de la colonne email...');
      await sequelize.query(`
        ALTER TABLE otps 
        ADD COLUMN email VARCHAR(255);
      `, { transaction });

      // Étape 3: Supprimer les anciens OTP (ils ne peuvent pas être migrés)
      // Les anciens OTP basés sur phoneNumber ne peuvent pas être convertis en email
      console.log('📦 Suppression des anciens OTP...');
      const existingData = await sequelize.query(`
        SELECT COUNT(*) as count 
        FROM otps 
        WHERE "phoneNumber" IS NOT NULL;
      `, { type: QueryTypes.SELECT, transaction });

      if (existingData && existingData.length > 0 && existingData[0].count > 0) {
        const count = existingData[0].count;
        console.log(`⚠️  ${count} enregistrements trouvés avec phoneNumber.`);
        console.log('⚠️  Les données ne peuvent pas être migrées automatiquement (phoneNumber != email).');
        console.log('🗑️  Suppression des anciens OTP...');
        
        // Supprimer tous les anciens OTP
        await sequelize.query(`
          DELETE FROM otps 
          WHERE "phoneNumber" IS NOT NULL;
        `, { transaction });
        
        console.log(`✅ ${count} anciens OTP supprimés. Les nouveaux OTP utiliseront email.`);
      }

      // Étape 4: Supprimer l'index sur phoneNumber si il existe
      console.log('🗑️  Suppression de l\'ancien index...');
      try {
        await sequelize.query(`
          DROP INDEX IF EXISTS otps_phone_number_code_idx;
        `, { transaction });
      } catch (error) {
        // L'index peut ne pas exister, on continue
        console.log('ℹ️  Index phoneNumber non trouvé ou déjà supprimé');
      }

      // Étape 5: Supprimer la colonne phoneNumber
      console.log('🗑️  Suppression de la colonne phoneNumber...');
      await sequelize.query(`
        ALTER TABLE otps 
        DROP COLUMN "phoneNumber";
      `, { transaction });

      // Étape 6: Ajouter la contrainte NOT NULL et validation email
      console.log('✅ Ajout des contraintes sur email...');
      await sequelize.query(`
        ALTER TABLE otps 
        ALTER COLUMN email SET NOT NULL;
      `, { transaction });

      // Étape 7: Créer le nouvel index sur email
      console.log('📊 Création du nouvel index sur email...');
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS otps_email_code_idx 
        ON otps(email, code);
      `, { transaction });

      await transaction.commit();
      console.log('✅ Migration terminée avec succès!');
      console.log('📋 La table otps utilise maintenant email au lieu de phoneNumber.');
      
    } else {
      console.log('✅ La colonne phoneNumber n\'existe pas.');
      
      // Vérifier si email existe déjà
      const checkEmailExists = await sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'otps' 
        AND column_name = 'email';
      `, { type: QueryTypes.SELECT, transaction });

      if (checkEmailExists && checkEmailExists.length > 0) {
        console.log('✅ La colonne email existe déjà. Migration peut-être déjà effectuée.');
      } else {
        console.log('⚠️  La table otps semble ne pas avoir été créée ou a une structure différente.');
        console.log('💡 Exécutez d\'abord: npm run init-db');
      }
      
      await transaction.commit();
    }
    
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  }
};

// Exécuter la migration
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('✅ Migration terminée');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Échec de la migration:', error);
      process.exit(1);
    });
}

module.exports = migrate;

