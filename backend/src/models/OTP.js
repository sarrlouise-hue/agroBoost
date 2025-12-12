const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const OTP = sequelize.define('OTP', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'L\'email est requis' },
      isEmail: { msg: 'L\'email doit être une adresse email valide' },
    },
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Le code OTP est requis' },
    },
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: 'La date d\'expiration est requise' },
    },
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'otps',
  timestamps: true,
  indexes: [
    {
      fields: ['email', 'code'],
    },
    {
      fields: ['expiresAt'],
    },
  ],
});

// Hook pour nettoyer les OTP expirés (filtre automatique des OTP expirés dans les requêtes)
OTP.addHook('beforeFind', (options) => {
  if (!options.where) {
    options.where = {};
  }
  // Exclure automatiquement les OTP expirés
  options.where.expiresAt = {
    [Op.gt]: new Date(),
  };
});

module.exports = OTP;
