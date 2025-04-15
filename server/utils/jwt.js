// Import JSON Web Token library for token creation and verification
const jwt = require('jsonwebtoken');

// Define the secret key for signing JWTs (should be stored securely in production)
const secret = 'secret';

/**
 * Creates a JSON Web Token with the provided data
 * @param {Object} data - Data to encode in the token
 * @returns {String} Signed JWT valid for 1 hour
 */
function createToken(data) {
  return jwt.sign(data, secret, { expiresIn: '1h' });
}

/**
 * Verifies a JSON Web Token and returns its decoded data
 * @param {String} token - JWT to verify
 * @returns {Promise<Object>} Promise resolving to decoded token data or rejecting with an error
 */
function verifyToken(token) {
  return new Promise((resolve, reject) => {
    // Verify token using the secret key
    jwt.verify(token, secret, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

/**
 * Exports JWT utility functions for token management
 * @module utils/jwt
 */
module.exports = {
  /**
   * Function to create a JWT
   */
  createToken,

  /**
   * Function to verify a JWT
   */
  verifyToken,
};