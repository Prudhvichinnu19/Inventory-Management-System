// Import the collection of controllers for handling route logic
const controllers = require('../controllers/');

// Initialize Express router for defining API endpoints
const router = require('express').Router();

// Import authentication middleware for securing routes
const { auth } = require('../utils');

/**
 * Event API Routes
 * Defines RESTful endpoints for managing events with elegance and precision
 * @module routes/event
 */

/**
 * GET: Fetch all events
 * Retrieves the full list of events, perfect for browsing what's happening
 */
router.get('/', controllers.event.get.all);

/**
 * GET: Event details by ID
 * Dives into the specifics of a single event for a closer look
 */
router.get('/details/:id', controllers.event.get.details);

/**
 * POST: Create a new event
 * Authenticated users can craft exciting new events to share
 * @middleware auth
 */
router.post('/create', auth(), controllers.event.post.create);

/**
 * PUT: Like an event
 * Lets users show love for their favorite events with a quick like
 * @middleware auth
 */
router.put('/like/:id', auth(), controllers.event.put.like);

/**
 * PUT: Dislike an event
 * Allows users to remove their like if they change their mind
 * @middleware auth
 */
router.put('/dislike/:id', auth(), controllers.event.put.dislike);

/**
 * PUT: Edit an event
 * Empowers creators to refine event details for the perfect experience
 * @middleware auth
 */
router.put('/edit/:id', auth(), controllers.event.put.edit);

/**
 * DELETE: Remove an event
 * Enables authorized users to delete events when they're no longer needed
 * @middleware auth
 */
router.delete('/delete/:id', auth(), controllers.event.delete);

// Export the router to weave these routes into the application
module.exports = router;