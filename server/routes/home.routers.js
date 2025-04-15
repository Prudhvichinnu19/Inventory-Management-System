// Import the collection of controllers for handling route logic
const controllers = require('../controllers/');

// Initialize Express router for defining API endpoints
const router = require('express').Router();

/**
 * Defines the main application routes
 * @module routes/index
 */

// Note: Home route is currently commented out, may be intended for future use
// router.get('/', controllers.home.get);

/**
 * Exports the router for integration into the application
 */
module.exports = router;