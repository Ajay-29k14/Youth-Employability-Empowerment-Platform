/**
 * Controllers Index
 * Export all controllers from a single file
 */

const authController = require('./authController');
const jobController = require('./jobController');
const schemeController = require('./schemeController');
const resourceController = require('./resourceController');

module.exports = {
  authController,
  jobController,
  schemeController,
  resourceController
};
