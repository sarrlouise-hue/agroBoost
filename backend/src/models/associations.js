/**
 * Fichier centralisé pour définir toutes les associations Sequelize
 * Cela évite les dépendances circulaires entre les modèles
 */

const User = require('./User');
const Provider = require('./Provider');
const Service = require('./Service');
const Booking = require('./Booking');
const Payment = require('./Payment');

// Association User <-> Provider
Provider.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
});

User.hasOne(Provider, {
  foreignKey: 'userId',
  as: 'provider',
});

// Association Provider <-> Service
Service.belongsTo(Provider, {
  foreignKey: 'providerId',
  as: 'provider',
  onDelete: 'CASCADE',
});

Provider.hasMany(Service, {
  foreignKey: 'providerId',
  as: 'services',
});

// Association User <-> Booking
Booking.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
});

User.hasMany(Booking, {
  foreignKey: 'userId',
  as: 'bookings',
});

// Association Service <-> Booking
Booking.belongsTo(Service, {
  foreignKey: 'serviceId',
  as: 'service',
  onDelete: 'CASCADE',
});

Service.hasMany(Booking, {
  foreignKey: 'serviceId',
  as: 'bookings',
});

// Association Provider <-> Booking
Booking.belongsTo(Provider, {
  foreignKey: 'providerId',
  as: 'provider',
  onDelete: 'CASCADE',
});

Provider.hasMany(Booking, {
  foreignKey: 'providerId',
  as: 'bookings',
});

// Association Booking <-> Payment
Payment.belongsTo(Booking, {
  foreignKey: 'bookingId',
  as: 'booking',
  onDelete: 'CASCADE',
});

Booking.hasOne(Payment, {
  foreignKey: 'bookingId',
  as: 'payment',
});

// Association User <-> Payment
Payment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
});

User.hasMany(Payment, {
  foreignKey: 'userId',
  as: 'payments',
});

// Association Provider <-> Payment
Payment.belongsTo(Provider, {
  foreignKey: 'providerId',
  as: 'provider',
  onDelete: 'CASCADE',
});

Provider.hasMany(Payment, {
  foreignKey: 'providerId',
  as: 'payments',
});

module.exports = {
  User,
  Provider,
  Service,
  Booking,
  Payment,
};

