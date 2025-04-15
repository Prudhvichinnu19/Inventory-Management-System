// Import the collection of controllers for handling route logic
const controllers = require('../controllers/');

// Initialize Express router for defining API endpoints
const router = require('express').Router();

// Import authentication middleware for securing routes
const { auth } = require('../utils');

/**
 * User API Routes
 * Defines RESTful endpoints for managing user operations
 * @module routes/user
 */

/**
 * GET: Fetch all users
 * Retrieves the complete list of users from the database
 */
router.get('/', controllers.user.get.all);

/**
 * GET: Fetch a single user by ID
 * Retrieves details of a specific user, requires authentication
 * @middleware auth
 */
router.get('/:id', auth(), controllers.user.get.one);

/**
 * POST: Register a new user
 * Creates a new user account with provided credentials
 */
router.post('/register', controllers.user.post.register);

/**
 * POST: User login
 * Authenticates a user and issues a JWT token
 */
router.post('/login', controllers.user.post.login);

/**
 * POST: User logout
 * Invalidates the user's session by blacklisting the JWT token
 */
router.post('/logout', controllers.user.post.logout);

/**
 * DELETE: Remove a user by ID
 * Deletes a user account from the database
 */
router.delete('/:id', controllers.user.delete);

/**
 * Exports the router for integration into the application
 */
module.exports = router;