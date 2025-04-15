// Import controller modules for handling specific routes
const home = require('./home.controller'); // Note: Imported but not exported, may be unused
const user = require('./user.controller');
const event = require('./event.controller');

/**
 * Aggregates and exports controller modules for use in application routing
 * @module controllers/index
 */
module.exports = {
  /**
   * User controller for handling user-related operations
   */
  user,
  /**
   * Event controller for handling event-related operations
   */
  event,
};