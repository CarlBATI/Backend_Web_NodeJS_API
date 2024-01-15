// app.js
// The main entry point for the application
// It starts the server and listens for connections
// Exports the app for testing purposes
//=========================================================

// Dependencies
//---------------------------------------------------------
const dotenv = require('dotenv');
const express = require('express');

const notesRouter = require('./routes/notesRouter');
const tagsRouter = require('./routes/tagsRouter');

// Globals
//---------------------------------------------------------
const apiPath = '/api';
const notesPath = '/notes';
const tagsPath = '/tags';
const combinedNotesPath = `${apiPath}${notesPath}`;
const combinedTagsPath = `${apiPath}${tagsPath}`;

// Load environment variables
dotenv.config();

// Create new express instance
const app = express();

// Middleware
//---------------------------------------------------------
app.use(express.json());

// Routes
//---------------------------------------------------------
// New Router
const apiRouter = express.Router();
// Add routes to router
apiRouter.use('/notes', notesRouter);
apiRouter.use('/tags', tagsRouter);

// Add router to app
app.use('/api', apiRouter);

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// Start the server
const server = app.listen(port, () => {
    console.log(`App listening at http://${host}:${port}`);
});

// Export the app
module.exports = {
    server,
    apiPath,
    notesPath,
    tagsPath,
    combinedNotesPath,
    combinedTagsPath
};