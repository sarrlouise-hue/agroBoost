const Payment = require('../models/Payment');
const { Op } = require('sequelize');

/**
 * Repository pour les opérations sur les paiements
 */
class PaymentRepository {
  /**
   * Créer un paiement
   */
  async create(paymentData) {
    return Payment.create(paymentData);
  }

  /**
   * Trouver un paiement par ID
   */
  async findById(paymentId) {
    return Payment.findByPk(paymentId, {
      include: [
        { association: 'booking' },
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'provider' },
      ],
    });
  }

  /**
   * Trouver un paiement par bookingId
   */
  async findByBookingId(bookingId) {
    return Payment.findOne({
      where: { bookingId },
      include: [
        { association: 'booking' },
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'provider' },
      ],
    });
  }

  /**
   * Trouver un paiement par transaction ID
   */
  async findByTransactionId(transactionId) {
    return Payment.findOne({
      where: {
        [Op.or]: [
          { transactionId: transactionId },
          { paytechTransactionId: transactionId },
        ],
      },
      include: [
        { association: 'booking' },
        { association: 'user' },
        { association: 'provider' },
      ],
    });
  }

  /**
   * Trouver tous les paiements avec filtres
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 20,
      userId = null,
      providerId = null,
      status = null,
    } = options;

    const where = {};

    if (userId) where.userId = userId;
    if (providerId) where.providerId = providerId;
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    return Payment.findAndCountAll({
      where,
      include: [
        { association: 'booking' },
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'provider' },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true,
    });
  }

  /**
   * Mettre à jour un paiement
   */
  async updateById(paymentId, updateData) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) return null;

    await payment.update(updateData);
    return payment.reload({
      include: [
        { association: 'booking' },
        { association: 'user' },
        { association: 'provider' },
      ],
    });
  }

  /**
   * Mettre à jour un paiement par bookingId
   */
  async updateByBookingId(bookingId, updateData) {
    const payment = await this.findByBookingId(bookingId);
    if (!payment) return null;

    await payment.update(updateData);
    return payment.reload({
      include: [
        { association: 'booking' },
        { association: 'user' },
        { association: 'provider' },
      ],
    });
  }
}

module.exports = new PaymentRepository();

