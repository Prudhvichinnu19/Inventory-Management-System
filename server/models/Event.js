// Import Mongoose for MongoDB schema and model creation
const mongoose = require('mongoose');

/**
 * Defines the schema for the Event collection in MongoDB
 * @constant {mongoose.Schema}
 */
const EventSchema = new mongoose.Schema({
  /**
   * Name of the event
   * @type {String}
   * @required
   */
  name: {
    type: String,
    required: true,
  },

  /**
   * Description of the event
   * @type {String}
   * @required
   * @minlength 3
   */
  description: {
    type: String,
    required: true,
    minlength: 3,
  },

  /**
   * URL of the event's image
   * @type {String}
   * @required
   */
  imageURL: {
    type: String,
    required: true,
  },

  /**
   * Date and time of the event
   * @type {Date}
   * @required
   */
  date: {
    type: Date,
    required: true,
  },

  /**
   * Location of the event
   * @type {String}
   * @required
   */
  location: {
    type: String,
    required: true,
  },

  /**
   * Reference to the user who created the event
   * @type {mongoose.Types.ObjectId}
   * @ref User
   */
  admin: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },

  /**
   * Array of users who liked the event
   * @type {Array<mongoose.Types.ObjectId>}
   * @ref User
   */
  likes: [{
    type: mongoose.Types.ObjectId,
    ref: 'User',
  }],
});

/**
 * Exports the Event model for use in the application
 * @module models/Event
 */
module.exports = mongoose.model('Event', EventSchema);