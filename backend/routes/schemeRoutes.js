/**
 * Scheme Routes
 * Handles government schemes routes
 */
const express = require('express');
const router = express.Router();
const { schemeController } = require('../controllers');
const { auth, adminOnly } = require('../middleware/auth');
const { schemeValidation } = require('../middleware/validation');


/**
 * @route   GET /api/schemes
 * @desc    Get all schemes with filters
 * @access  Public
 */
router.get('/', schemeController.getSchemes);

/**
 * @route   GET /api/schemes/latest
 * @desc    Get latest schemes
 * @access  Public
 */
router.get('/latest', schemeController.getLatestSchemes);

/**
 * @route   GET /api/schemes/:id
 * @desc    Get scheme by ID
 * @access  Public
 */
/**
 * @route   GET /api/schemes/fetch-government-schemes
 * @desc    Fetch schemes from data.gov.in
 * @access  Public
 */
router.get(
  '/fetch-government-schemes',
  schemeController.fetchGovernmentSchemes
);
/**
 * @route   GET /api/schemes/scrape-myscheme
 * @desc    Scrape schemes from MyScheme
 * @access  Public
 */
router.get(
  '/scrape-myscheme',
  schemeController.scrapeMyScheme
);
router.get(
  "/test-api",
  schemeController.testApi
);
router.get(
  "/import-myscheme",
  schemeController.importMySchemeData
);
router.get('/:id', schemeController.getSchemeById);

/**
 * @route   POST /api/schemes
 * @desc    Create a new scheme
 * @access  Private (Admin only)
 */
router.post('/', auth, adminOnly, schemeValidation, schemeController.createScheme);

/**
 * @route   PUT /api/schemes/:id
 * @desc    Update scheme
 * @access  Private (Admin only)
 */
router.put('/:id', auth, adminOnly, schemeController.updateScheme);

/**
 * @route   DELETE /api/schemes/:id
 * @desc    Delete scheme
 * @access  Private (Admin only)
 */
router.delete('/:id', auth, adminOnly, schemeController.deleteScheme);

module.exports = router;
