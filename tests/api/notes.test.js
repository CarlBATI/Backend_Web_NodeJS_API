// Tests for the notes API:
// 
// Note: 
// These tests will fail if the database is not running.
// The POST /notes route must be tested first because the other tests rely on it.
// The tests in this file do not clean up after themselves.
// Tests are ordered according to CRUD (Create, Read, Update, Delete)
//==================================================================================================

// Dependencies
//--------------------------------------------------------
const request = require('supertest');
const express = require('express');
const notesRouter = require('../../routes/notesRouter');

// Setup
//--------------------------------------------------------
const app = express();
app.use(express.json());
app.use('/', notesRouter);

// Constants
//--------------------------------------------------------
const title = 'Test Title';
const content = 'Test Content';

// Tests
//--------------------------------------------------------
describe('Notes API', () => {
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
    
    
    /**
     * Test route for GET /api/notes
     */
    describe('GET /notes', () => {
        it('should return an array of notes', async () => {
            const response = await request(app).get('/notes');
        
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });
    
    /**
     * Test route for PUT /api/notes/:id
     */
    describe('PUT /notes/:id', () => {
        it('should update a note with the given id and return a status code 200 and the note'  , async () => {
            const newNote = { title, content };
            const postResponse = await request(app).post('/notes').send(newNote);
            
            const noteId = Number(postResponse.body.id);
            const updatedNote = { title: 'Updated Title', content: 'Updated Content' };
            const putResponse = await request(app).put(`/notes/${noteId}`).send(updatedNote);
        
            expect(putResponse.statusCode).toBe(200);
            expect(putResponse.body).toHaveProperty('id');
            expect(putResponse.body.id).toBe(Number(noteId));
            expect(putResponse.body.title).toBe(updatedNote.title);
            expect(putResponse.body.content).toBe(updatedNote.content);
        });
        it('should return 404 if the note does not exist', async () => {
            const nonExistentId = '1234567890';
            const updatedNote = { title: 'Updated Title', content: 'Updated Content' };
            const response = await request(app).put(`/notes/${nonExistentId}`).send(updatedNote);
        
            expect(response.statusCode).toBe(404);
        });
        it('should return 400 if the id is not an integer', async () => {
            const nonIntegerId = 'abc';
            const updatedNote = { title: 'Updated Title', content: 'Updated Content' };
            const response = await request(app).put(`/notes/${nonIntegerId}`).send(updatedNote);
        
            expect(response.statusCode).toBe(400);
        });
        it('should return 400 if the id is not valid', async () => {
            const nonPositiveIntegerId = '-1';
            const updatedNote = { title: 'Updated Title', content: 'Updated Content' };
            const response = await request(app).put(`/notes/${nonPositiveIntegerId}`).send(updatedNote);
        
            expect(response.statusCode).toBe(400);
        });
        it('should return 400 if the id is 0', async () => {
            const zeroId = '0';
            const updatedNote = { title: 'Updated Title', content: 'Updated Content' };
            const response = await request(app).put(`/notes/${zeroId}`).send(updatedNote);
        
            expect(response.statusCode).toBe(400);
        });
        it('should return 400 if the title is empty (\'\')', async () => {
            const newNote = { title, content };
            const postResponse = await request(app).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);
            const updatedNote = { title: '', content: 'Updated Content' };
            const response = await request(app).put(`/notes/${noteId}`).send(updatedNote);
        
            expect(response.statusCode).toBe(400);
        });
        it('should return 400 if the title is longer than 100 characters', async () => {
            const newNote = { title, content };
            const postResponse = await request(app).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);
            const updatedNote = { title: 'a'.repeat(101), content: 'Updated Content' };
            const response = await request(app).put(`/notes/${noteId}`).send(updatedNote);
        
            expect(response.statusCode).toBe(400);
        });
        it('should return 400 if the content is longer than 10000 characters', async () => {
            const newNote = { title, content };
            const postResponse = await request(app).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);
            const updatedNote = { title: 'Updated Title', content: 'a'.repeat(10001) };
            const response = await request(app).put(`/notes/${noteId}`).send(updatedNote);
        
            expect(response.statusCode).toBe(400);
        });
        it('should return 400 if the title is not a string', async () => {
            const newNote = { title, content };
            const postResponse = await request(app).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);
            const updatedNote = { title: 123, content: 'Updated Content' };
            const response = await request(app).put(`/notes/${noteId}`).send(updatedNote);
        
            expect(response.statusCode).toBe(400);
        });
        it('should return 400 if the content is not a string', async () => {
            const newNote = { title, content };
            const postResponse = await request(app).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);
            const updatedNote = { title: 'Updated Title', content: 123 };
            const response = await request(app).put(`/notes/${noteId}`).send(updatedNote);
        
            expect(response.statusCode).toBe(400);
        });
        it('should return 400 if the title is missing', async () => {
            const newNote = { title, content };
            const postResponse = await request(app).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);
            const updatedNote = { content: 'Updated Content' };
            const response = await request(app).put(`/notes/${noteId}`).send(updatedNote);
        
            expect(response.statusCode).toBe(400);
        });
        it('should return 400 if the content is missing', async () => {
            const newNote = { title, content };
            const postResponse = await request(app).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);
            const updatedNote = { title: 'Updated Title' };
            const response = await request(app).put(`/notes/${noteId}`).send(updatedNote);
        
            expect(response.statusCode).toBe(400);
        });
        it('should return 400 if the request body is empty', async () => {
            const newNote = { title, content };
            const postResponse = await request(app).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);
            const response = await request(app).put(`/notes/${noteId}`);
        
            expect(response.statusCode).toBe(400);
        });
        it('should update the modified_at timestamp when a note is updated', async () => {
            const newNote = { title, content };
            const postResponse = await request(app).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);
        
            // Fetch the note after it's created
            const getResponseBeforeUpdate = await request(app).get(`/notes/${noteId}`);
            const timestampBeforeUpdate = new Date(getResponseBeforeUpdate.body.modified_at);
        
            // Wait for 1 second to ensure the timestamp will be different
            await new Promise(resolve => setTimeout(resolve, 1000));
        
            const updatedNote = { title: 'Updated Title', content: 'Updated Content' };
            await request(app).put(`/notes/${noteId}`).send(updatedNote);
        
            // Fetch the note after it's updated
            const getResponseAfterUpdate = await request(app).get(`/notes/${noteId}`);
            const timestampAfterUpdate = new Date(getResponseAfterUpdate.body.modified_at);
        
            // The modified_at timestamp should be different after the note is updated
            expect(timestampAfterUpdate).not.toEqual(timestampBeforeUpdate);
        });
    });
    
    /**
     * Test route for DELETE /api/notes/:id
     */
    describe('DELETE /notes/:id', () => {
        it('should delete a note with the given id and return a status code 204', async () => {
            const newNote = { title, content };
            const postResponse = await request(app).post('/notes').send(newNote);
            
            const noteId = Number(postResponse.body.id);
            const deleteResponse = await request(app).delete(`/notes/${noteId}`);
        
            expect(deleteResponse.statusCode).toBe(204);
        });
        it('should return 404 if the note does not exist', async () => {
            const nonExistentId = '1234567890';
            const response = await request(app).delete(`/notes/${nonExistentId}`);
        
            expect(response.statusCode).toBe(404);
        });
        it('should return 400 if the id is not an integer', async () => {
            const nonIntegerId = 'abc';
            const response = await request(app).delete(`/notes/${nonIntegerId}`);
        
            expect(response.statusCode).toBe(400);
        });
        it('should return 400 if the id is not valid', async () => {
            const nonPositiveIntegerId = '-1';
            const response = await request(app).delete(`/notes/${nonPositiveIntegerId}`);
        
            expect(response.statusCode).toBe(400);
        });
        it('should return 400 if the id is 0', async () => {
            const zeroId = '0';
            const response = await request(app).delete(`/notes/${zeroId}`);
        
            expect(response.statusCode).toBe(400);
        });
    });
});