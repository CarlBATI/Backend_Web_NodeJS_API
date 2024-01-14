const express = require('express');
const notesRouter = express.Router();
const { getConnection, closePool } = require('../database/connection');

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

module.exports = notesRouter;