const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { MAINTENANCE_STATUS } = require('../config/constants');

const Maintenance = sequelize.define('Maintenance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  serviceId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'services',
      key: 'id',
    },
    onDelete: 'CASCADE',
    validate: {
      notNull: { msg: 'L\'ID du service est requis' },
    },
  },
  mechanicId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'RESTRICT',
    validate: {
      notNull: { msg: 'L\'ID du mécanicien est requis' },
    },
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: 'La date de début est requise' },
      isDate: { msg: 'La date de début doit être une date valide' },
    },
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: { msg: 'La date de fin doit être une date valide' },
    },
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Durée en heures',
    validate: {
      min: 0,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  status: {
    type: DataTypes.ENUM(...Object.values(MAINTENANCE_STATUS)),
    defaultValue: MAINTENANCE_STATUS.PENDING,
    validate: {
      isIn: {
        args: [Object.values(MAINTENANCE_STATUS)],
        msg: 'Le statut de maintenance n\'est pas valide',
      },
    },
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'maintenances',
  timestamps: true,
  indexes: [
    {
      fields: ['serviceId'],
    },
    {
      fields: ['mechanicId'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['startDate'],
    },
  ],
});

module.exports = Maintenance;

