/**
 * Models Index
 * Export all models from a single file for easy imports
 */

const User = require('./User');
const Job = require('./Job');
const Scheme = require('./Scheme');
const Resource = require('./Resource');

module.exports = {
  User,
  Job,
  Scheme,
  Resource
};
