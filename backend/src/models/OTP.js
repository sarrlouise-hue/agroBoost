const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const OTP = sequelize.define('OTP', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Le numéro de téléphone est requis' },
      is: {
        args: [/^[0-9+]+$/],
        msg: 'Le numéro de téléphone ne doit contenir que des chiffres et +',
      },
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
      fields: ['phoneNumber', 'code'],
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
