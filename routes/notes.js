const express = require('express');
const notesRouter = express.Router();
const { getConnection, closePool } = require('../database/connection');

// POST route for creating a new note
notesRouter.post('/notes', async (req, res) => {
    const { title, content } = req.body;
    const conn = await getConnection();
    try {
        const result = await conn.query('INSERT INTO Notes (title, content) VALUES (?, ?)', [title, content]);
        const note = { id: result.insertId.toString(), title, content };
        res.status(201).json(note);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    } finally {
        if (conn) conn.release();
    }
});

// GET route for retrieving a note by its ID
notesRouter.get('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const conn = await getConnection();
    try {
        console.log("ID: " + id);
        const rows = await conn.query('SELECT * FROM Notes WHERE id = ?', [id]);
        if (rows && rows.length > 0) {
            res.status(200).json(rows[0]);
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