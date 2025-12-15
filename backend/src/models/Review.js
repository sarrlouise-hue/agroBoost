const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modèle Review (Avis)
 * Un avis est lié à une réservation complétée, un utilisateur (auteur),
 * un prestataire et un service.
 */
const Review = sequelize.define(
  'Review',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    providerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'providers',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'reviews',
    timestamps: true,
    indexes: [
      {
        fields: ['bookingId'],
        unique: true,
      },
      {
        fields: ['userId'],
      },
      {
        fields: ['providerId'],
      },
      {
        fields: ['serviceId'],
      },
      {
        fields: ['rating'],
      },
    ],
  }
);

module.exports = Review;


