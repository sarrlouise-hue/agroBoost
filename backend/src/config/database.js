// S'assurer que pg est chargé avant Sequelize
require('pg');
const { Sequelize } = require('sequelize');
const { DB } = require('./env');

// Normaliser l'URL de connexion (postgres:// -> postgresql://)
let databaseUrl = DB.URI;
if (databaseUrl && databaseUrl.startsWith('postgres://')) {
  databaseUrl = databaseUrl.replace('postgres://', 'postgresql://');
}

// Log de l'URL de connexion (sans mot de passe) pour débogage
if (databaseUrl) {
  const urlForLog = databaseUrl.replace(/:[^:@]+@/, ':****@');
  console.log('🔗 Tentative de connexion à PostgreSQL:', urlForLog.split('@')[1] || 'URL invalide');
} else {
  console.error('❌ DATABASE_URL non définie. Vérifiez vos variables d\'environnement.');
}

// Configuration Sequelize
const sequelize = new Sequelize(databaseUrl, {
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
    
    // Synchroniser les modèles en développement
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modèles synchronisés avec la base de données.');
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
