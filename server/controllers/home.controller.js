// Load environment variables from .env file into process.env
require('dotenv').config();

// Import Mongoose models for database operations
const models = require('../models');

/**
 * User controller module for handling user-related operations
 * @module controllers/user
 */
module.exports = {
  /**
   * Retrieves all users from the database
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  get: (req, res, next) => {
    // Fetch all users from the database
    models.User.find()
      .then((users) => res.send(users))
      .catch(next);
  },
};