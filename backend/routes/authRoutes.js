/**
 * Auth Routes
 * Handles user authentication and profile routes
 */
const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { auth } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  profileValidation
} = require('../middleware/validation');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', loginValidation, authController.login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', auth, authController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', auth, profileValidation, authController.updateProfile);

/**
 * @route   POST /api/auth/skills
 * @desc    Add skill to profile
 * @access  Private
 */
router.post('/skills', auth, authController.addSkill);

/**
 * @route   DELETE /api/auth/skills/:skill
 * @desc    Remove skill from profile
 * @access  Private
 */
router.delete('/skills/:skill', auth, authController.removeSkill);

/**
 * @route   GET /api/auth/notifications
 * @desc    Get all notifications
 * @access  Private
 */
router.get('/notifications', auth, authController.getNotifications);

/**
 * @route   PUT /api/auth/notifications/:notificationId
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/notifications/:notificationId', auth, authController.markNotificationRead);

module.exports = router;
