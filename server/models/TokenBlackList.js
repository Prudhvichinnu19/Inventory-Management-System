// Import Mongoose for MongoDB schema and model creation
const mongoose = require('mongoose');

/**
 * Defines the schema for the TokenBlacklist collection in MongoDB
 * @constant {mongoose.Schema}
 */
const TokenBlacklist = new mongoose.Schema({
  /**
   * JWT token to be blacklisted
   * @type {String}
   */
  token: String,
});

/**
 * Exports the TokenBlacklist model for use in the application
 * @module models/TokenBlacklist
 */
module.exports = mongoose.model('TokenBlacklist', TokenBlacklist);