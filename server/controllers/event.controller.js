// Import Mongoose models for database operations
const models = require('../models');

/**
 * Event controller module handling CRUD operations and interactions for events
 * @module controllers/event
 */
module.exports = {
  // GET operations for retrieving event data
  get: {
    /**
     * Retrieves all events with optional limit query parameter
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    all: (req, res, next) => {
      const limit = Number(req.query.limit);

      if (limit) {
        // Fetch limited events sorted by name and populate admin field
        models.Event.find()
          .sort('name')
          .limit(limit)
          .populate('admin')
          .exec((err, events) => {
            if (err) return next(err);
            res.send(events);
          });
      } else {
        // Fetch all events and populate admin field
        models.Event.find()
          .populate('admin')
          .then((events) => res.send(events))
          .catch(next);
      }
    },

    /**
     * Retrieves a single event by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    details: (req, res, next) => {
      const id = req.params.id;

      // Find event by ID and populate admin field
      models.Event.findById(id)
        .populate('admin')
        .then((ev) => res.send(ev))
        .catch(next);
    },
  },

  // POST operations for creating new events
  post: {
    /**
     * Creates a new event and associates it with the authenticated user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    create: (req, res, next) => {
      const { description, location, name, date, imageURL } = req.body;
      const { _id } = req.user;

      // Create new event and link it to the user
      models.Event.create({ description, location, name, date, imageURL, admin: _id })
        .then((createdEvent) => {
          // Update user's createdEvents and fetch the created event
          return Promise.all([
            models.User.updateOne({ _id }, { $push: { createdEvents: createdEvent } }),
            models.Event.findOne({ _id: createdEvent._id }),
          ]);
        })
        .then(([userObj, eventObj]) => res.send(eventObj))
        .catch(next);
    },
  },

  // PUT operations for updating event data
  put: {
    /**
     * Updates an existing event by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    edit: (req, res, next) => {
      const id = req.params.id;
      const { name, description, imageURL, date, location } = req.body;

      // Update event with new details
      models.Event.findByIdAndUpdate(id, { name, description, imageURL, date, location })
        .then((updatedEvent) => res.send(updatedEvent))
        .catch(next);
    },

    /**
     * Adds a like to an event and updates the user's liked events
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    like: (req, res, next) => {
      const id = req.params.id;
      const { _id } = req.user;

      // Add user to event's likes and update user's likedEvents
      models.Event.findByIdAndUpdate(id, { $push: { likes: _id } })
        .then((updatedEvent) => {
          return Promise.all([
            models.User.findByIdAndUpdate(_id, { $push: { likedEvents: id } }),
            models.Event.findOne({ _id: updatedEvent._id }),
          ]);
        })
        .then(([userObj, eventObj]) => res.send(eventObj))
        .catch(next);
    },

    /**
     * Removes a like from an event and updates the user's liked events
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    dislike: (req, res, next) => {
      const id = req.params.id;
      const { _id } = req.user;

      // Remove user from event's likes and update user's likedEvents
      models.Event.findByIdAndUpdate(id, { $pull: { likes: _id } })
        .then((updatedEvent) => {
          return Promise.all([
            models.User.findByIdAndUpdate(_id, { $pull: { likedEvents: id } }),
            models.Event.findOne({ _id: updatedEvent._id }),
          ]);
        })
        .then(([userObj, eventObj]) => res.send(eventObj))
        .catch(next);
    },
  },

  /**
   * Deletes an event by ID and removes it from the user's created events
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  delete: (req, res, next) => {
    const id = req.params.id;
    const { _id } = req.user;

    // Delete event and remove it from user's createdEvents
    models.Event.deleteOne({ _id: id })
      .then((deletedEvent) => {
        return Promise.all([
          models.User.updateOne({ _id }, { $pull: { createdEvents: id } }),
          models.Event.findOne({ _id: deletedEvent._id }),
        ]);
      })
      .then(([obj, deletedEvent]) => res.send(deletedEvent))
      .catch(next);
  },
};