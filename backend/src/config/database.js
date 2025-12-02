const { Sequelize } = require('sequelize');
const { DB } = require('./env');

// Configuration Sequelize
const sequelize = new Sequelize(DB.URI, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Connexion à PostgreSQL
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL établie avec succès.');
    
    // Synchroniser les modèles en développement
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modèles synchronisés avec la base de données.');
    }
  } catch (error) {
    console.error('❌ Erreur de connexion à PostgreSQL:', error);
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
