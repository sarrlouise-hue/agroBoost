/**
 * Données de test pour les utilisateurs
 */
const testUsers = {
  validUser: {
    phoneNumber: '+221771234567',
    firstName: 'Amadou',
    lastName: 'Diallo',
    email: 'amadou@example.com',
    language: 'fr',
  },
  validUser2: {
    phoneNumber: '+221771234568',
    firstName: 'Fatou',
    lastName: 'Sarr',
    email: 'fatou@example.com',
    language: 'fr',
  },
  invalidUser: {
    phoneNumber: 'invalid',
    firstName: 'A',
    lastName: 'B',
  },
  existingUser: {
    phoneNumber: '+221771234569',
    firstName: 'Moussa',
    lastName: 'Ba',
    email: 'moussa@example.com',
    language: 'fr',
  },
};

/**
 * Données de test pour les OTP
 */
const testOTPs = {
  validOTP: {
    phoneNumber: '+221771234567',
    code: '123456',
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes dans le futur
    isUsed: false,
  },
  expiredOTP: {
    phoneNumber: '+221771234567',
    code: '654321',
    expiresAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes dans le passé
    isUsed: false,
  },
  usedOTP: {
    phoneNumber: '+221771234567',
    code: '111111',
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    isUsed: true,
  },
};

module.exports = {
  testUsers,
  testOTPs,
};

