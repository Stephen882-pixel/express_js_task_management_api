
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

// All user routes require authentication
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.delete('/delete', authenticate, userController.deleteAccount);

module.exports = router;