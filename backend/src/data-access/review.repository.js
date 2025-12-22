const { Op, fn, col } = require('sequelize');
const Review = require('../models/Review');

/**
 * Repository pour les opérations sur les avis (reviews)
 */
class ReviewRepository {
  async create(data) {
    return Review.create(data);
  }

  async findById(id) {
    return Review.findByPk(id, {
      include: [
        { association: 'booking' },
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'provider', include: [{ association: 'user', attributes: { exclude: ['password'] } }] },
        { association: 'service' },
      ],
    });
  }

  async findByBookingId(bookingId) {
    return Review.findOne({
      where: { bookingId },
    });
  }

  async findForService(serviceId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    return Review.findAndCountAll({
      where: { serviceId },
      include: [
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'provider' },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true,
    });
  }

  async findForProvider(providerId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    return Review.findAndCountAll({
      where: { providerId },
      include: [
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'service' },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true,
    });
  }

  async findForUser(userId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    return Review.findAndCountAll({
      where: { userId },
      include: [
        { association: 'provider', include: [{ association: 'user', attributes: { exclude: ['password'] } }] },
        { association: 'service' },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true,
    });
  }

  async updateById(id, data) {
    const review = await Review.findByPk(id);
    if (!review) return null;

    await review.update(data);
    return this.findById(id);
  }

  async deleteById(id) {
    const review = await Review.findByPk(id);
    if (!review) return false;
    await review.destroy();
    return true;
  }

  /**
   * Retourne la note moyenne et le nombre d'avis pour un prestataire.
   */
  async getProviderStats(providerId) {
    const result = await Review.findOne({
      where: { providerId },
      attributes: [
        [fn('AVG', col('rating')), 'avgRating'],
        [fn('COUNT', col('id')), 'count'],
      ],
      raw: true,
    });

    const avgRating = result && result.avgRating ? parseFloat(result.avgRating) : 0;
    const count = result && result.count ? parseInt(result.count, 10) : 0;

    return { avgRating, count };
  }
}

module.exports = new ReviewRepository();


