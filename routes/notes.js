const express = require('express');
const router = express.Router();
const { getConnection } = require('../database/connection');

let notes = []; // This would typically be a database

// Create
router.post('/notes', async (req, res) => {
    const { title, content } = req.body;
    const conn = await getConnection();
    try {
        const result = await conn.query('INSERT INTO Notes (title, content) VALUES (?, ?)', [title, content]);
        const note = { id: result.insertId, title, content };
        res.status(201).json(note);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    } finally {
        if (conn) conn.release();
    }
});

module.exports = router;