
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');


// Public routes
router.post('/signup',authController.signup);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-reset-otp', authController.verifyResetOTP);
router.post('/reset-password', authController.resetPassword);

// Protected routes (require authentication)
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router



