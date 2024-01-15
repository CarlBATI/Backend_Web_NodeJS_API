const dotenv = require('dotenv');
const express = require('express');
// Routes
const notesRouter = require('./routes/notesRouter');

// Load environment variables
dotenv.config();
// Create new express instance
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', notesRouter);

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// Start the server
const server = app.listen(port, () => {
    console.log(`App listening at http://${host}:${port}`);
});

// Export the app
module.exports = server;