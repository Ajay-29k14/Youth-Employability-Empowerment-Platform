/**
 * Routes Index
 * Export all routes from a single file
 */

const authRoutes = require('./authRoutes');
const jobRoutes = require('./jobRoutes');
const schemeRoutes = require('./schemeRoutes');
const resourceRoutes = require('./resourceRoutes');

module.exports = {
  authRoutes,
  jobRoutes,
  schemeRoutes,
  resourceRoutes
};
