const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PAYMENT_METHOD = {
  PAYTECH: 'paytech',
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  bookingId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'bookings',
      key: 'id',
    },
    onDelete: 'CASCADE',
    validate: {
      notNull: { msg: 'L\'ID réservation est requis' },
    },
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
  providerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'providers',
      key: 'id',
    },
    onDelete: 'CASCADE',
    validate: {
      notNull: { msg: 'L\'ID prestataire est requis' },
    },
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notNull: { msg: 'Le montant est requis' },
      min: 0,
    },
  },
  paymentMethod: {
    type: DataTypes.ENUM(...Object.values(PAYMENT_METHOD)),
    defaultValue: PAYMENT_METHOD.PAYTECH,
    validate: {
      isIn: {
        args: [Object.values(PAYMENT_METHOD)],
        msg: 'La méthode de paiement n\'est pas valide',
      },
    },
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  paytechTransactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Transaction ID de PayTech',
  },
  status: {
    type: DataTypes.ENUM(...Object.values(PAYMENT_STATUS)),
    defaultValue: PAYMENT_STATUS.PENDING,
    validate: {
      isIn: {
        args: [Object.values(PAYMENT_STATUS)],
        msg: 'Le statut de paiement n\'est pas valide',
      },
    },
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Données supplémentaires du paiement (webhook, etc.)',
  },
}, {
  tableName: 'payments',
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
      fields: ['status'],
    },
    {
      fields: ['transactionId'],
    },
    {
      fields: ['paytechTransactionId'],
    },
    {
      fields: ['paymentDate'],
    },
  ],
});

// Ajouter les constantes au modèle
Payment.METHOD = PAYMENT_METHOD;
Payment.STATUS = PAYMENT_STATUS;

module.exports = Payment;

