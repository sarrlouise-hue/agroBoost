const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Provider = sequelize.define('Provider', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    validate: {
      notNull: { msg: 'L\'ID utilisateur est requis' },
    },
  },
  businessName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Le nom de l\'entreprise est requis' },
      len: {
        args: [2, 100],
        msg: 'Le nom de l\'entreprise doit contenir entre 2 et 100 caractères',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  documents: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  totalBookings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    validate: {
      min: -90,
      max: 90,
    },
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    validate: {
      min: -180,
      max: 180,
    },
  },
}, {
  tableName: 'providers',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
      unique: true,
    },
    {
      fields: ['isApproved'],
    },
    {
      fields: ['rating'],
    },
    {
      fields: ['latitude', 'longitude'],
    },
  ],
});

// Les associations seront définies dans un fichier séparé pour éviter les dépendances circulaires

module.exports = Provider;

