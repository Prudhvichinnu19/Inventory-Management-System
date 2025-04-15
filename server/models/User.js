// Import Mongoose for MongoDB schema and model creation
const mongoose = require('mongoose');

// Import bcrypt for password hashing
const bcrypt = require('bcrypt');

// Define the number of salt rounds for bcrypt hashing
const saltRounds = 10;

/**
 * Defines the schema for the User collection in MongoDB
 * @constant {mongoose.Schema}
 */
const UserSchema = new mongoose.Schema({
  /**
   * User's first name
   * @type {String}
   * @required
   */
  firstName: {
    type: String,
    required: true,
  },

  /**
   * User's last name
   * @type {String}
   * @required
   */
  lastName: {
    type: String,
    required: true,
  },

  /**
   * User's unique username
   * @type {String}
   * @required
   * @unique
   * @lowercase
   * @minlength 3
   * @maxlength 50
   */
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: 3,
    maxlength: 50,
  },

  /**
   * User's hashed password
   * @type {String}
   * @required
   * @minlength 6
   * @maxlength 255
   */
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },

  /**
   * Array of events created by the user
   * @type {Array<mongoose.Types.ObjectId>}
   * @ref Event
   */
  createdEvents: [{
    type: mongoose.Types.ObjectId,
    ref: 'Event',
  }],

  /**
   * Array of events liked by the user
   * @type {Array<mongoose.Types.ObjectId>}
   * @ref Event
   */
  likedEvents: [{
    type: mongoose.Types.ObjectId,
    ref: 'Event',
  }],
});

/**
 * Custom methods for the User schema
 */
UserSchema.methods = {
  /**
   * Compares a provided password with the stored hashed password
   * @param {String} password - Plaintext password to compare
   * @returns {Promise<Boolean>} True if passwords match, false otherwise
   */
  matchPassword: function (password) {
    return bcrypt.compare(password, this.password);
  },
};

/**
 * Pre-save middleware to hash the password before saving the user document
 * @param {Function} next - Mongoose next middleware function
 */
UserSchema.pre('save', function (next) {
  // Only hash the password if it has been modified
  if (this.isModified('password')) {
    // Generate salt for hashing
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);

      // Hash the password with the generated salt
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) return next(err);

        // Store the hashed password
        this.password = hash;
        next();
      });
    });
    return;
  }
  next();
});

/**
 * Exports the User model for use in the application
 * @module models/User
 */
module.exports = mongoose.model('User', UserSchema);