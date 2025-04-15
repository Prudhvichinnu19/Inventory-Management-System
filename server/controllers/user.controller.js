// Load environment variables from .env file into process.env
require('dotenv').config();

// Import Mongoose models for database operations
const models = require('../models');

// Import utility functions for JWT and other operations
const utils = require('../utils');

/**
 * User controller module for handling user-related CRUD and authentication operations
 * @module controllers/user
 */
module.exports = {
  // GET operations for retrieving user data
  get: {
    /**
     * Retrieves all users from the database
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    all: (req, res, next) => {
      // Fetch all users from the database
      models.User.find()
        .then((users) => res.send(users))
        .catch(next);
    },

    /**
     * Retrieves the authenticated user's details with populated liked and created events
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    one: (req, res, next) => {
      const { _id } = req.user;

      // Find user by ID and populate likedEvents and createdEvents fields
      models.User.findById(_id)
        .populate('likedEvents')
        .populate('createdEvents')
        .exec((err, result) => {
          if (err) {
            // Log errors for debugging purposes
            console.error('Error fetching user:', err);
            return next(err);
          }
          res.send(result);
        });
    },
  },

  // POST operations for user registration, login, and logout
  post: {
    /**
     * Registers a new user and issues a JWT token
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    register: (req, res, next) => {
      const { firstName, lastName, username, password } = req.body;

      // Create new user in the database
      models.User.create({ firstName, lastName, username, password })
        .then((createdUser) => {
          // Generate JWT token for the new user
          const token = utils.jwt.createToken({ id: createdUser._id });
          // Set token as a cookie and send user data
          res.cookie(process.env.COOKIE, token).send(createdUser);
        })
        .catch(next);
    },

    /**
     * Authenticates a user and issues a JWT token upon successful login
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    login: (req, res, next) => {
      const { username, password } = req.body;

      // Find user by username and verify password
      models.User.findOne({ username })
        .then((user) => (user ? Promise.all([user, user.matchPassword(password)]) : [null, false]))
        .then(([user, match]) => {
          if (!match) {
            // Return unauthorized status for invalid credentials
            res.status(401).send('Invalid username or password');
            return;
          }

          // Generate JWT token and set it as a cookie
          const token = utils.jwt.createToken({ id: user._id });
          res.cookie(process.env.COOKIE, token).send(user);
        })
        .catch(next);
    },

    /**
     * Logs out the user by blacklisting the JWT token and clearing the cookie
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    logout: (req, res, next) => {
      const token = req.cookies[process.env.COOKIE];

      // Add token to blacklist to invalidate it
      models.TokenBlacklist.create({ token })
        .then(() => {
          // Clear cookie and confirm logout
          res.clearCookie(process.env.COOKIE).send('Logout successfully!');
        })
        .catch(next);
    },
  },

  /**
   * Deletes a user by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  delete: (req, res, next) => {
    const id = req.params.id;

    // Remove user from the database by ID
    models.User.deleteOne({ _id: id })
      .then((removedUser) => res.send(removedUser))
      .catch(next);
  },
};