const express = require('express');
const notesRouter = express.Router();
const { getConnection, closePool } = require('../database/connection');
const { createNote, readNoteById, readNotes, deleteNoteById, deleteNotesByIds, updateNote  } = require('../services/notesService');
const { ValidationError } = require('../utils/errors/validation.errors');
const { NotFoundError } = require('../utils/errors/query.errors');

// POST route for creating a new note
notesRouter.post('/notes', async (req, res) => {
    const { title, content } = req.body;
    
    const conn = await getConnection();
    try {
        const note = await createNote(title, content);
        res.status(201).json(note);
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(400).send(err.message);
        }
        else {
            res.status(500).send('Server error');
        }
    } finally {
        if (conn) conn.release();
    }
});

// GET route for retrieving a note by its ID
notesRouter.get('/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const note = await readNoteById(id);
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

// PUT route for updating a note by its ID
notesRouter.put('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const conn = await getConnection();
    try {
        const [result] = await conn.query('UPDATE Notes SET title = ?, content = ? WHERE id = ?', [title, content, id]);
        if (result.affectedRows > 0) {
            res.status(200).send('Note updated successfully');
        } else {
            res.status(404).send('Note not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    } finally {
        if (conn) conn.release();
    }
});

module.exports = notesRouter;