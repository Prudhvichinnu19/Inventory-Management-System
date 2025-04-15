// Import the User model for user-related database operations
const User = require('./User');

// Import the Event model for event-related database operations
const Event = require('./Event');

// Import the TokenBlacklist model for managing blacklisted JWT tokens
const TokenBlacklist = require('./TokenBlacklist');

/**
 * Aggregates and exports Mongoose models for use in the application
 * @module models/index
 */
module.exports = {
  /**
   * User model for handling user data and operations
   */
  User,

  /**
   * Event model for handling event data and operations
   */
  Event,

  /**
   * TokenBlacklist model for managing invalidated JWT tokens
   */
  TokenBlacklist,
};