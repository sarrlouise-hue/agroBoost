const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const PasswordResetToken = sequelize.define('PasswordResetToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    validate: {
      notNull: { msg: 'L\'ID utilisateur est requis' },
    },
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Le token est requis' },
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
  tableName: 'password_reset_tokens',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'isUsed'],
    },
    {
      fields: ['token', 'isUsed'],
    },
    {
      fields: ['expiresAt'],
    },
  ],
});

// Association avec User
const User = require('./User');
PasswordResetToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Hook pour nettoyer les tokens expirés
PasswordResetToken.addHook('beforeFind', (options) => {
  if (!options.where) {
    options.where = {};
  }
  // Exclure automatiquement les tokens expirés
  options.where.expiresAt = {
    [Op.gt]: new Date(),
  };
});

module.exports = PasswordResetToken;
