module.exports = {
  // User roles
  ROLES: {
    USER: 'user',
    PROVIDER: 'provider',
    ADMIN: 'admin',
  },

  // Booking status
  BOOKING_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },

  // Payment status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
  },

  // Payment methods
  PAYMENT_METHODS: {
    WAVE: 'wave',
    ORANGE_MONEY: 'orangeMoney',
    FREE_MONEY: 'freeMoney',
  },

  // Service types
  SERVICE_TYPES: {
    TRACTOR: 'tractor',
    SEMOIR: 'semoir',
    OPERATOR: 'operator',
    OTHER: 'other',
  },

  // Notification types
  NOTIFICATION_TYPES: {
    BOOKING: 'booking',
    PAYMENT: 'payment',
    REVIEW: 'review',
    SYSTEM: 'system',
  },

  // Languages
  LANGUAGES: {
    FR: 'fr',
    WOLOF: 'wolof',
  },

  // Default pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
};

