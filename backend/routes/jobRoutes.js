/**
 * Job Routes
 * Handles job opportunities routes
 */
const express = require('express');
const router = express.Router();
const { jobController } = require('../controllers');
const { auth, adminOnly } = require('../middleware/auth');
const { jobValidation } = require('../middleware/validation');

/**
 * @route   GET /api/jobs
 * @desc    Get all jobs with filters
 * @access  Public
 */
router.get('/', jobController.getJobs);

/**
 * @route   GET /api/jobs/recommendations
 * @desc    Get recommended jobs for logged in user
 * @access  Private
 */
router.get('/recommendations', auth, jobController.getRecommendedJobs);

/**
 * @route   GET /api/jobs/:id
 * @desc    Get job by ID
 * @access  Public
 */
router.get('/:id', jobController.getJobById);

/**
 * @route   POST /api/jobs
 * @desc    Create a new job
 * @access  Private (Admin only)
 */
router.post('/', auth, adminOnly, jobValidation, jobController.createJob);

/**
 * @route   PUT /api/jobs/:id
 * @desc    Update job
 * @access  Private (Admin only)
 */
router.put('/:id', auth, adminOnly, jobController.updateJob);

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Delete job
 * @access  Private (Admin only)
 */
router.delete('/:id', auth, adminOnly, jobController.deleteJob);

module.exports = router;
