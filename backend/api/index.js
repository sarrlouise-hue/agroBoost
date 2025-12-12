// Handler serverless pour Vercel
const app = require('../src/app');
const { connectDB } = require('../src/config/database');

// Initialiser la connexion à la base de données (une seule fois)
let dbInitialized = false;
let dbInitPromise = null;

const initializeDB = async () => {
  if (dbInitialized) {
    return;
  }
  
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      try {
        await connectDB();
        dbInitialized = true;
        console.log('✅ Base de données connectée pour Vercel');
      } catch (error) {
        console.error('❌ Erreur de connexion à la base de données:', error);
        dbInitPromise = null; // Réinitialiser pour permettre une nouvelle tentative
        throw error;
      }
    })();
  }
  
  return dbInitPromise;
};

// Handler pour Vercel
module.exports = async (req, res) => {
  try {
    // Initialiser la DB si nécessaire (attendre que la promesse se résolve)
    await initializeDB();
    
    // Passer la requête à l'app Express
    return app(req, res);
  } catch (error) {
    console.error('Erreur dans le handler Vercel:', error);
    
    // Si la réponse n'a pas encore été envoyée, envoyer une erreur
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne du serveur',
      });
    }
  }
};

