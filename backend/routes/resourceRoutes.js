/**
 * Resource Routes
 * Handles career preparation resources routes
 */
const express = require('express');
const router = express.Router();
const { resourceController } = require('../controllers');
const { auth, adminOnly } = require('../middleware/auth');
const { resourceValidation } = require('../middleware/validation');

/**
 * @route   GET /api/resources
 * @desc    Get all resources with filters
 * @access  Public
 */
router.get('/', resourceController.getResources);

/**
 * @route   GET /api/resources/popular
 * @desc    Get popular resources
 * @access  Public
 */
router.get('/popular', resourceController.getPopularResources);

/**
 * @route   GET /api/resources/category/:category
 * @desc    Get resources by category
 * @access  Public
 */
router.get('/category/:category', resourceController.getResourcesByCategory);

/**
 * @route   GET /api/resources/:id
 * @desc    Get resource by ID
 * @access  Public
 */
router.get('/:id', resourceController.getResourceById);

/**
 * @route   POST /api/resources
 * @desc    Create a new resource
 * @access  Private (Admin only)
 */
router.post('/', auth, adminOnly, resourceValidation, resourceController.createResource);

/**
 * @route   PUT /api/resources/:id
 * @desc    Update resource
 * @access  Private (Admin only)
 */
router.put('/:id', auth, adminOnly, resourceController.updateResource);

/**
 * @route   DELETE /api/resources/:id
 * @desc    Delete resource
 * @access  Private (Admin only)
 */
router.delete('/:id', auth, adminOnly, resourceController.deleteResource);

module.exports = router;
