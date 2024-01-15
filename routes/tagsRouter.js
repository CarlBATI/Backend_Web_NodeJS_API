// tagsRouter.js
// --------------------------------------------------------
// Handles all routes for /tags
// ========================================================

// Dependencies
// ========================================================
const express = require('express');
const tagsRouter = express.Router();
const { createTag, readAllTags, readTagById, readTagByName, deleteTagById, deleteTagByName } = require('../services/tagsService');
const { ValidationError } = require('../utils/errors/validation.errors');
const { DuplicateEntryError, NotFoundError } = require('../utils/errors/query.errors');

// Routes
// ========================================================

// POST /tags route for creating a new tag
tagsRouter.post('/', async (req, res, next) => {
    const { name } = req.body;
    try {
        const response = await createTag(name);
        res.status(201).json(response);
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(400).send(err.message);
        } else if (err instanceof DuplicateEntryError) {
            res.status(409).send(err.message);
        } else {
            res.status(500).send('Server error');
        }
    }
});

// GET /tags route for retrieving all tags
tagsRouter.get('/', async (req, res, next) => {
  try {
    const response = await readAllTags();
    res.status(200).json(response);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

tagsRouter.get('/:id', async (req, res) => {
    console.log(tagsRouter.name)
    const { id } = req.params;
    try {
        const note = await readTagById(id);
        if (note) {
            res.status(200).json(note);
        } else {
            res.status(404).send('Note not found');
        }
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(400).send(err.message);
        } else if (err instanceof NotFoundError) {
            res.status(404).send(err.message);
        } else {
            res.status(500).send('Server error');
        }
    }
});

// Export the router
//--------------------------------------------------------
module.exports = tagsRouter;