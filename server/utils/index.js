// Import JWT utility for token creation and verification
const jwt = require('./jwt');

// Import authentication middleware for securing routes
const auth = require('./auth');

/**
 * Aggregates and exports utility modules for authentication and token management
 * @module utils/index
 */
module.exports = {
  /**
   * JWT utility for generating and verifying JSON Web Tokens
   */
  jwt,

  /**
   * Authentication middleware for protecting routes and verifying user sessions
   */
  auth,
};