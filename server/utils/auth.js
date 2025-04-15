// Load environment variables from .env file into process.env
require('dotenv').config();

// Import JWT utility for token verification
const jwt = require('./jwt');

// Import Mongoose models for database operations
const models = require('../models');

/**
 * Authentication middleware factory for verifying JWT tokens and user sessions
 * @module utils/auth
 * @param {Boolean} [redirectAuthenticated=true] - Determines if authenticated users are redirected on failure
 * @returns {Function} Express middleware function
 */
module.exports = (redirectAuthenticated = true) => {
  /**
   * Middleware function to authenticate requests using JWT
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  return function (req, res, next) {
    // Extract token from cookie, default to empty string if not present
    const token = req.cookies[process.env.COOKIE] || '';

    // Verify token and check if it's blacklisted
    Promise.all([
      jwt.verifyToken(token),
      models.TokenBlacklist.findOne({ token }),
    ])
      .then(([data, blacklistToken]) => {
        // Reject if token is blacklisted
        if (blacklistToken) {
          return Promise.reject(new Error('blacklisted token'));
        }

        // Fetch user by ID from token data and attach to request
        models.User.findById(data.id).then((user) => {
          req.user = user;
          next();
        });
      })
      .catch((err) => {
        // Skip authentication check if redirectAuthenticated is false
        if (!redirectAuthenticated) {
          next();
          return;
        }

        // Handle specific authentication errors with 401 response
        if (
          ['token expired', 'blacklisted token', 'jwt must be provided'].includes(
            err.message
          )
        ) {
          res.status(401).send('UNAUTHORIZED!');
          return;
        }

        // Pass other errors to the next middleware
        next(err);
      });
  };
};