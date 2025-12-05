/**
 * Fichier centralisé pour définir toutes les associations Sequelize
 * Cela évite les dépendances circulaires entre les modèles
 */

const User = require('./User');
const Provider = require('./Provider');
const Service = require('./Service');

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

module.exports = {
  User,
  Provider,
  Service,
};

