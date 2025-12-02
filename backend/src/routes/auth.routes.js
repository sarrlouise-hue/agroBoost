const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/auth.controller');
const {
  registerSchema,
  verifyOTPSchema,
  resendOTPSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  validate,
} = require('../validators/auth.validator');
const { authRateLimiter } = require('../middleware/rateLimit.middleware');
const { authenticate } = require('../middleware/auth.middleware');

router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  authController.register
);

router.post(
  '/verify-otp',
  authRateLimiter,
  validate(verifyOTPSchema),
  authController.verifyOTP
);

router.post(
  '/resend-otp',
  authRateLimiter,
  validate(resendOTPSchema),
  authController.resendOTP
);

router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  authController.login
);

router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  authController.refreshToken
);

router.post('/logout', authenticate, authController.logout);

router.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authRateLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);

router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

module.exports = router;
