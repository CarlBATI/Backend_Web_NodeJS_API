const request = require('supertest');
const express = require('express');
const notesRouter = require('../../routes/notes');
const { closePool } = require('../../database/connection');

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

        console.log(`Created note for POST /note test with ID: ${response.body.id}, title: ${response.body.title}, content: ${response.body.content}`);
    });
});

describe('GET /notes/:id', () => {
    it('should return a note with the given id', async () => {
        const newNote = { title: 'Test Note', content: 'This is a test note.' };
        const postResponse = await request(app).post('/notes').send(newNote);
        const noteId = postResponse.body.id;

        const getResponse = await request(app).get(`/notes/${noteId}`);

        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.body).toHaveProperty('id');
        expect(getResponse.body.id).toBe(Number(noteId));
        expect(getResponse.body.title).toBe(newNote.title);
        expect(getResponse.body.content).toBe(newNote.content);
    });

    it('should return 404 if the note does not exist', async () => {
        const nonExistentId = '1234567890';
        const response = await request(app).get(`/notes/${nonExistentId}`);

        expect(response.statusCode).toBe(404);
    });
});

afterAll(async () => {
    await closePool();
});