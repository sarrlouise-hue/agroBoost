// S'assurer que pg est chargé avant Sequelize
require('pg');
const { Sequelize } = require('sequelize');
const { DB } = require('./env');

// Normaliser l'URL de connexion (postgres:// -> postgresql://)
let databaseUrl = DB.URI;
if (databaseUrl && databaseUrl.startsWith('postgres://')) {
  databaseUrl = databaseUrl.replace('postgres://', 'postgresql://');
}

// S'assurer que le mot de passe est une chaîne (même si vide)
// PostgreSQL nécessite que le mot de passe soit une chaîne, pas undefined
if (databaseUrl && DB.PASSWORD === undefined) {
  // Si le mot de passe est undefined, le remplacer par une chaîne vide
  databaseUrl = databaseUrl.replace(/:(undefined|null)@/, ':@');
}

// Log de l'URL de connexion (sans mot de passe) pour débogage
if (databaseUrl) {
  const urlForLog = databaseUrl.replace(/:[^:@]+@/, ':****@');
  console.log('🔗 Tentative de connexion à PostgreSQL:', urlForLog.split('@')[1] || 'URL invalide');
} else {
  console.error('❌ DATABASE_URL non définie. Vérifiez vos variables d\'environnement.');
}

// Configuration Sequelize
// Utiliser les options de connexion directes pour éviter les problèmes de parsing d'URL avec le mot de passe
// S'assurer que le mot de passe est toujours une chaîne
const password = String(DB.PASSWORD || '');

// En mode test, utiliser les options directes pour éviter les problèmes de parsing
const useDirectOptions = process.env.NODE_ENV === 'test' || !databaseUrl || DB.PASSWORD === undefined;

let sequelize;
if (useDirectOptions) {
  // Utiliser les options de connexion directes
  // S'assurer que le mot de passe est bien une chaîne avant de le passer à Sequelize
  const safePassword = password || '';
  sequelize = new Sequelize(DB.NAME, DB.USER, safePassword, {
    host: DB.HOST,
    port: DB.PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      // NeonDB nécessite SSL en production
      ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('neon.tech') ? {
        require: true,
        rejectUnauthorized: false,
      } : false,
    },
  });
} else {
  // Utiliser l'URL si disponible
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      // NeonDB nécessite SSL en production
      ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('neon.tech') ? {
        require: true,
        rejectUnauthorized: false,
      } : false,
    },
  });
}

// Connexion à PostgreSQL
const connectDB = async () => {
  try {
    if (!databaseUrl || databaseUrl === 'postgresql://postgres:@127.0.0.1:5432/agroboost') {
      console.error('❌ DATABASE_URL non configurée ou utilise les valeurs par défaut.');
      console.error('💡 Sur Vercel avec NeonDB, assurez-vous que la variable DATABASE_URL est définie dans les variables d\'environnement Vercel.');
      throw new Error('DATABASE_URL non configurée');
    }

    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL établie avec succès.');
    
    // Charger les modèles pour qu'ils soient enregistrés
    require('../models/User');
    require('../models/OTP');
    require('../models/PasswordResetToken');
    require('../models/Provider');
    require('../models/Service');
    require('../models/Booking');
    require('../models/Payment');
    require('../models/Maintenance');
    require('../models/Review');
    require('../models/Notification');
    
    // Charger les associations entre modèles
    require('../models/associations');
    
    // Synchroniser les modèles
    if (process.env.NODE_ENV === 'development') {
      // En développement, utiliser alter pour mettre à jour les tables
      try {
        await sequelize.sync({ alter: true });
        console.log('✅ Modèles synchronisés avec la base de données (développement).');
      } catch (syncError) {
        // Gérer spécifiquement l'erreur de conversion ENUM pour maintenances.status
        if (syncError.message && syncError.message.includes('cannot be cast automatically to type enum_maintenances_status')) {
          console.warn('⚠️  Erreur de conversion ENUM pour maintenances.status');
          console.log('💡 Exécutez la migration: node migrations/20250103-convert-maintenances-status-to-enum.js');
          console.log('   Ou modifiez manuellement la colonne status en ENUM dans PostgreSQL');
          // Essayer de continuer sans alter pour les autres tables
          try {
            await sequelize.sync({ alter: false });
            console.log('✅ Autres tables synchronisées (sans alter).');
          } catch (fallbackError) {
            console.error('❌ Erreur lors de la synchronisation de secours:', fallbackError.message);
            throw syncError; // Relancer l'erreur originale
          }
        } else {
          throw syncError;
        }
      }
    } else {
      // En production, créer les tables seulement si elles n'existent pas
      try {
        // Vérifier si la table users existe (table principale)
        const [results] = await sequelize.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'users'
          ) as exists;
        `);
        
        const tablesExist = results && results[0] && (results[0].exists === true || results[0].exists === 't');
        
        if (!tablesExist) {
          console.log('📦 Création des tables en production...');
          // Créer les tables sans alter (force: false pour ne pas supprimer les données existantes)
          await sequelize.sync({ force: false, alter: false });
          console.log('✅ Tables créées avec succès en production.');
        } else {
          console.log('✅ Tables existent déjà en production.');
        }
      } catch (syncError) {
        // Si la vérification échoue, essayer quand même de créer les tables
        // (peut arriver si la base de données est vide)
        console.warn('⚠️  Erreur lors de la vérification des tables:', syncError.message);
        console.log('📦 Tentative de création des tables...');
        try {
          await sequelize.sync({ force: false, alter: false });
          console.log('✅ Tables créées avec succès en production.');
        } catch (createError) {
          console.error('❌ Erreur lors de la création des tables:', createError.message);
          // Ne pas faire échouer le démarrage si les tables existent déjà
          if (!createError.message.includes('already exists') && !createError.message.includes('déjà existe')) {
            throw createError;
          }
          console.log('✅ Les tables existent déjà.');
        }
      }
    }
  } catch (error) {
    console.error('❌ Erreur de connexion à PostgreSQL:', error.message);
    if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Vérifiez que la base de données NeonDB est provisionnée et que DATABASE_URL est correctement configurée sur Vercel.');
    }
    throw error;
  }
};

// Fermeture gracieuse
process.on('SIGINT', async () => {
  await sequelize.close();
  console.log('Connexion PostgreSQL fermée via SIGINT');
  process.exit(0);
});

module.exports = {
  sequelize,
  connectDB,
};
