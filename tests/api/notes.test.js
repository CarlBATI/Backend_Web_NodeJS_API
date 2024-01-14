const request = require('supertest');
const express = require('express');
const notesRouter = require('../../routes/notes');
const { getConnection, closePool } = require('../../database/connection');

const app = express();
app.use(express.json());
app.use('/', notesRouter);

describe('POST /notes', () => {
    it('should create a new note and return it', async () => {
        const newNote = { title: 'Test Title', content: 'Test Content' };

        const response = await request(app)
            .post('/notes')
            .send(newNote);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newNote.title);
        expect(response.body.content).toBe(newNote.content);

        console.log(`Created note with ID: ${response.body.id}, title: ${response.body.title}, content: ${response.body.content}`);
    });
});

afterAll(async () => {
    await closePool();
});