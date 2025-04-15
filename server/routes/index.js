// Import the user routes for handling user-related API endpoints
const user = require('./user');

// Import the origami routes for handling origami-related API endpoints
const origami = require('./origami');

/**
 * Aggregates and exports route modules for use in the application
 * @module routes/index
 */
module.exports = {
  /**
   * User routes for managing user-related operations
   */
  user,

  /**
   * Origami routes for managing origami-related operations
   */
  origami,
};