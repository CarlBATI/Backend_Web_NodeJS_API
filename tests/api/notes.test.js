// Tests for the notes API
// Note: these tests will fail if the database is not running
const request = require('supertest');
const express = require('express');
const notesRouter = require('../../routes/notes');

const app = express();
app.use(express.json());
app.use('/', notesRouter);

const title = 'Test Title';
const content = 'Test Content';

/**  
 * Test route for POST /api/notes
 */ 
describe('POST /notes', () => {
    it('should create a new note and return it with status code 201', async () => {
        const newNote = { title, content };
        
        const response = await request(app)
            .post('/notes')
            .send(newNote);
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newNote.title);
        expect(response.body.content).toBe(newNote.content);
        
        // console.log(`Created note for POST /note test with ID: ${response.body.id}, title: ${response.body.title}, content: ${response.body.content}`);
    });

    it('should return 400 if the request body is missing a title', async () => {
        const newNote = { content };
        
            const response = await request(app)
            .post('/notes')
            .send(newNote);

        expect(response.statusCode).toBe(400);
    });

    it('should return 400 if the request body is missing content', async () => {
        const newNote = { title };

        const response = await request(app)
            .post('/notes')
            .send(newNote);

        expect(response.statusCode).toBe(400);
    });

    it('should return 400 if the title is empty (\'\')', async () => {
        const newNote = { title: '', content };
        
        const response = await request(app)
        .post('/notes')
        .send(newNote);
        
        expect(response.statusCode).toBe(400);
    });
    
    it('should return 400 if the title is longer than 100 characters', async () => {
        const newNote = { title: 'a'.repeat(101), content };
        
        const response = await request(app)
        .post('/notes')
        .send(newNote);
        
        expect(response.statusCode).toBe(400);
    });
    
    it('should return 400 if the content is longer than 10000 characters', async () => {
        const newNote = { title, content: 'a'.repeat(10001) };
        
        const response = await request(app)
        .post('/notes')
        .send(newNote);
        
        expect(response.statusCode).toBe(400);
    });

    it('should return 400 if the title is not a string', async () => {
        const newNote = { title: 123, content };
    
        const response = await request(app)
            .post('/notes')
            .send(newNote);
    
        expect(response.statusCode).toBe(400);
    });
    
    it('should return 400 if the content is not a string', async () => {
        const newNote = { title, content: 123 };
        
        const response = await request(app)
            .post('/notes')
            .send(newNote);
        
        expect(response.statusCode).toBe(400);
    });
});

/**  
 * Test route for GET /api/notes/:id
 * 
 * Note: this test will fail if the database is not running
 */ 
describe('GET /notes/:id', () => {
    it('should return a note with the given id', async () => {
        const newNote = { title, content };
        const postResponse = await request(app).post('/notes').send(newNote);
        if (postResponse.body.id === undefined || postResponse.body.id === null) {
        return;
        }
        const noteId = Number(postResponse.body.id);
        const getResponse = await request(app).get(`/notes/${noteId}`);

        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.body).toHaveProperty('id');
        expect(getResponse.body.id).toBe(Number(noteId));
        expect(getResponse.body.title).toBe(newNote.title);
        expect(getResponse.body.content).toBe(newNote.content);
    });

    // Only works if the database is not up to the point where it id 1234567890 exists
    it('should return 404 if the note does not exist', async () => {
        const nonExistentId = '1234567890';
        const response = await request(app).get(`/notes/${nonExistentId}`);

        expect(response.statusCode).toBe(404);
    });

    it('should return 400 if the id is not an integer', async () => {
        const nonIntegerId = 'abc';
        const response = await request(app).get(`/notes/${nonIntegerId}`);

        expect(response.statusCode).toBe(400);
    });

    it('should return 400 if the id is not a positive integer', async () => {
        const nonPositiveIntegerId = '-1';
        const response = await request(app).get(`/notes/${nonPositiveIntegerId}`);

        expect(response.statusCode).toBe(400);
    });

    it('should return 400 if the id is 0', async () => {
        const zeroId = '0';
        const response = await request(app).get(`/notes/${zeroId}`);

        expect(response.statusCode).toBe(400);
    });
});

// close the database connection pool after all tests
// this is necessary to avoid open handles / memory leaks
// afterAll(async () => {
//     await closePool();
// });