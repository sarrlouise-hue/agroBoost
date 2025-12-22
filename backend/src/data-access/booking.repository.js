const Booking = require('../models/Booking');
const { Op } = require('sequelize');

/**
 * Repository pour les opérations sur les réservations
 */
class BookingRepository {
  /**
   * Créer une réservation
   */
  async create(bookingData) {
    return Booking.create(bookingData);
  }

  /**
   * Trouver une réservation par ID
   */
  async findById(bookingId) {
    return Booking.findByPk(bookingId, {
      include: [
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'service' },
        { association: 'provider', include: [{ association: 'user', attributes: { exclude: ['password'] } }] },
        { association: 'payment' },
      ],
    });
  }

  /**
   * Vérifier la disponibilité d'un service pour une date/heure
   */
  async checkAvailability(serviceId, bookingDate, startTime, endTime, excludeBookingId = null) {
    const whereConditions = {
      serviceId,
      bookingDate,
      status: {
        [Op.in]: ['pending', 'confirmed'], // Seulement les réservations actives
      },
    };

    if (excludeBookingId) {
      whereConditions.id = { [Op.ne]: excludeBookingId };
    }

    // Vérifier les conflits de temps
    whereConditions[Op.or] = [
      // Nouvelle réservation commence pendant une réservation existante
      {
        [Op.and]: [
          { startTime: { [Op.lte]: startTime } },
          { endTime: { [Op.gte]: startTime } },
        ],
      },
      // Nouvelle réservation se termine pendant une réservation existante
      {
        [Op.and]: [
          { startTime: { [Op.lte]: endTime } },
          { endTime: { [Op.gte]: endTime } },
        ],
      },
      // Nouvelle réservation englobe une réservation existante
      {
        [Op.and]: [
          { startTime: { [Op.gte]: startTime } },
          { endTime: { [Op.lte]: endTime } },
        ],
      },
    ];

    const conflictingBooking = await Booking.findOne({ where: whereConditions });

    return !conflictingBooking; // true si disponible, false si conflit
  }

  /**
   * Trouver toutes les réservations avec filtres avancés
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 20,
      userId = null,
      providerId = null,
      serviceId = null,
      status = null,
      search = null,
      startDate = null,
      endDate = null,
      bookingDateStart = null,
      bookingDateEnd = null,
    } = options;

    const where = {};

    if (userId) where.userId = userId;
    if (providerId) where.providerId = providerId;
    if (serviceId) where.serviceId = serviceId;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }
    if (bookingDateStart || bookingDateEnd) {
      where.bookingDate = {};
      if (bookingDateStart) where.bookingDate[Op.gte] = bookingDateStart;
      if (bookingDateEnd) where.bookingDate[Op.lte] = bookingDateEnd;
    }

    const includeOptions = [
      {
        association: 'user',
        attributes: { exclude: ['password'] },
        where: search
          ? {
              [Op.or]: [
                { firstName: { [Op.iLike]: `%${search}%` } },
                { lastName: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { phoneNumber: { [Op.iLike]: `%${search}%` } },
              ],
            }
          : undefined,
        required: !!search,
      },
      { association: 'service' },
      {
        association: 'provider',
        include: [
          {
            association: 'user',
            attributes: { exclude: ['password'] },
          },
        ],
      },
      { association: 'payment' },
    ];

    const offset = (page - 1) * limit;

    return Booking.findAndCountAll({
      where,
      include: includeOptions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true,
    });
  }

  /**
   * Mettre à jour une réservation
   */
  async updateById(bookingId, updateData) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return null;

    await booking.update(updateData);
    return booking.reload({
      include: [
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'service' },
        { association: 'provider' },
        { association: 'payment' },
      ],
    });
  }

  /**
   * Supprimer une réservation
   */
  async deleteById(bookingId) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return false;

    await booking.destroy();
    return true;
  }
}

module.exports = new BookingRepository();

