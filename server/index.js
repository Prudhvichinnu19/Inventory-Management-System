// Load environment variables from .env file into process.env
require('dotenv').config();

// Import database connection configuration
const dbConnection = require('./config/database');

// Initialize Express application
const app = require('express')();

/**
 * Establishes database connection and initializes the Express server
 * @async
 * @function
 */
dbConnection()
  .then(() => {
    // Configure Express middleware
    require('./config/express')(app);

    // Set up application routes
    require('./config/routes')(app);

    // Start the server and listen on the specified port
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}!`);
    });

    // Log successful database connection
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });