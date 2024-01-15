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
const { server, combinedNotesPath } = require('../../app');
const clearDatabase = require('../../database/clearDatabase');
const { 
    testPostCreation, 
    testPostBadRequest, 
    testGetSingleObjectById, 
    testGetNonExistentObject,
    testGetMalformedArg,
    testGetMultipleObjects,
    testPutSingleObject,
    testPutNonExistentRecord,
    testPutMalformedArg,
    testDeleteSingleRecordById,
    testDeleteNonExistentRecord,
    testMalformedArg
} = require('../utilities/utilities');
const { 
    NOTES_TITLE_MAX_LENGTH,
    NOTES_CONTENT_MAX_LENGTH
} = require('../../database/models/Notes');

// Constants
//---------------------------------------------------------------------------------------------
const verbose = false;
const title = 'Test Title';
const content = 'Test Content';


// Clear the database before each test
beforeEach(async () => {
    try {
        await clearDatabase();
    } catch (err) {
        console.error('Failed to clear database before test:', err);
    }
});

// Tests
//---------------------------------------------------------------------------------------------
describe('Notes API', () => {
    /**  
     * Test route for POST /api/notes
     */ 
    describe(`POST ${combinedNotesPath}`, () => {
        it('should create a new note and return it with status code 201', async () => {
            const newNote = { title, content };
            testPostCreation(server, combinedNotesPath, newNote, ['title', 'content'], verbose);
        });
        it('should return 400 if the request body is missing a title', async () => {
            const newNote = { content };
            testPostBadRequest(server, combinedNotesPath, newNote, verbose);
        });
        it('should return 400 if the request body is missing content', async () => {
            const newNote = { title };
            testPostBadRequest(server, combinedNotesPath, newNote, verbose);
        });
        it('should return 400 if the title is empty (\'\')', async () => {
            const newNote = { title: '', content };
            testPostBadRequest(server, combinedNotesPath, newNote, verbose);
        });
        it('should return 400 if the title is longer than 100 characters', async () => {
            const newNote = { title: 'a'.repeat(101), content };
            testPostBadRequest(server, combinedNotesPath, newNote, verbose);
        });
        it('should return 400 if the content is longer than 10000 characters', async () => {
            const newNote = { title, content: 'a'.repeat(10001) };
            testPostBadRequest(server, combinedNotesPath, newNote, verbose);
        });
        it('should return 400 if the title is not a string', async () => {
            const newNote = { title: 123, content };
            testPostBadRequest(server, combinedNotesPath, newNote, verbose);
        });
        it('should return 400 if the content is not a string', async () => {
            const newNote = { title, content: 123 };
            testPostBadRequest(server, combinedNotesPath, newNote, verbose);
        });
    });
    
    /**  
     * Test route for GET /api/notes/:id
     * 
     * Note: this test will fail if the database is not running
     */ 
    describe(`GET ${combinedNotesPath}/:id`, () => {
        it('should return a note with the given id', async () => {
            const newNote = { title, content };
            const postResponse = await request(server).post(combinedNotesPath).send(newNote);

            const noteId = Number(postResponse.body.id);
            const expectedObject = { id: noteId, title, content}
            await testGetSingleObjectById(server, `${combinedNotesPath}/${noteId}`, expectedObject, verbose);
        });
        it('should return 404 if the note does not exist', async () => {
            await testGetNonExistentObject(server, `${combinedNotesPath}/1234567890`, verbose);
        });
        it('should return 400 if the id is not an integer', async () => {
            const nonIntegerId = 'abc';
            testGetMalformedArg(server, `${combinedNotesPath}/${nonIntegerId}`, verbose);
        });
        it('should return 400 if the id is not a positive integer', async () => {
            const nonPositiveIntegerId = '-1';
            testGetMalformedArg(server, `${combinedNotesPath}/${nonPositiveIntegerId}`, verbose);
        });
        it('should return 400 if the id is 0', async () => {
            const zeroId = '0';
            testGetMalformedArg(server, `${combinedNotesPath}/${zeroId}`, verbose);
        });
    });
    
    
    /**
     * Test route for GET /api/notes
     */
    describe(`GET ${combinedNotesPath}`, () => {
        it('should return an array of notes', async () => {
            const newNotes = [
            { title: 'Test Title 1', content: 'Test Content 1' },
            { title: 'Test Title 2', content: 'Test Content 2' },
            { title: 'Test Title 3', content: 'Test Content 3' }
        ];
        await testGetMultipleObjects(server, combinedNotesPath, newNotes, verbose);
        });
    });
    
    /**
     * Test route for PUT /api/notes/:id
     */
    describe(`PUT ${combinedNotesPath}:id`, () => {
        const newNote = { title: 'Test Title', content: 'Test Content' };
        const updatedNote = { title: 'Updated Title', content: 'Updated Content' };
        it('should update a note with the given id and return a status code 200 and the note'  , async () => {
            await testPutSingleObject(server, combinedNotesPath, newNote, updatedNote, verbose);
        });
        it('should update the modified_at timestamp when a note is updated', async () => {
            const postResponse = await request(server).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);
        
            // Fetch the note after it's created
            const getResponseBeforeUpdate = await request(server).get(`/notes/${noteId}`);
            const timestampBeforeUpdate = new Date(getResponseBeforeUpdate.body.modified_at);
        
            // Wait for 1 second to ensure the timestamp will be different
            await new Promise(resolve => setTimeout(resolve, 1000));
        
            const updatedNote = { title: 'Updated Title', content: 'Updated Content' };
            await request(server).put(`/notes/${noteId}`).send(updatedNote);
        
            // Fetch the note after it's updated
            const getResponseAfterUpdate = await request(server).get(`/notes/${noteId}`);
            const timestampAfterUpdate = new Date(getResponseAfterUpdate.body.modified_at);
        
            // The modified_at timestamp should be different after the note is updated
            expect(timestampAfterUpdate).not.toEqual(timestampBeforeUpdate);
        });
        it('should return 404 if the note does not exist', async () => {
            // Before each test the db is cleared, so we can use any id
            const nonExistentId = '1234567890';
            await testPutNonExistentRecord(server, `${combinedNotesPath}/${nonExistentId}`, updatedNote, verbose);
        });
        it('should return 400 if the id is not an integer', async () => {
            const nonIntegerId = 'abc';
            await testPutMalformedArg(server, `${combinedNotesPath}/${nonIntegerId}`, updatedNote, verbose);
        });
        it('should return 400 if the id is not valid', async () => {
            const nonPositiveIntegerId = '-1';
            await testPutMalformedArg(server, `${combinedNotesPath}/${nonPositiveIntegerId}`, updatedNote, verbose);
        });
        it('should return 400 if the id is 0', async () => {
            const zeroId = '0';
            await testPutMalformedArg(server, `${combinedNotesPath}/${zeroId}`, updatedNote, verbose); 
        });
        it('should return 400 if the title is empty (\'\')', async () => {
            const postResponse = await request(server).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);

            const emptyTitleUpdatedNote = { title: '', content: 'Updated Content' };
            await testPutMalformedArg(server, `${combinedNotesPath}/${noteId}`, emptyTitleUpdatedNote, verbose);
        });
        it('should return 400 if the title is longer than 100 characters', async () => {
            const postResponse = await request(server).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);

            const titleTooLongUpdatedNote = { title: 'a'.repeat(NOTES_TITLE_MAX_LENGTH + 1), content: 'Updated Content' };
            await testPutMalformedArg(server, `${combinedNotesPath}/${noteId}`, titleTooLongUpdatedNote, verbose);
        });
        it('should return 400 if the content is longer than 10000 characters', async () => {
            const postResponse = await request(server).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);

            const updatedNote = { title: 'Updated Title', content: 'a'.repeat(NOTES_CONTENT_MAX_LENGTH + 1) };
            await testPutMalformedArg(server, `${combinedNotesPath}/${noteId}`, updatedNote, verbose);
        });
        it('should return 400 if the title is not a string', async () => {
            const postResponse = await request(server).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);

            const updatedNote = { title: 123, content: 'Updated Content' };
            await testPutMalformedArg(server, `${combinedNotesPath}/${noteId}`, updatedNote, verbose);
        });
        it('should return 400 if the content is not a string', async () => {
            const postResponse = await request(server).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);

            const updatedNote = { title: 'Updated Title', content: 123 };
            await testPutMalformedArg(server, `${combinedNotesPath}/${noteId}`, updatedNote, verbose);
        });
        it('should return 400 if the title is missing', async () => {
            const postResponse = await request(server).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);

            const updatedNote = { content: 'Updated Content' };
            await testPutMalformedArg(server, `${combinedNotesPath}/${noteId}`, updatedNote, verbose);
        });
        it('should return 400 if the content is missing', async () => {
            const postResponse = await request(server).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);

            const updatedNote = { title: 'Updated Title' };
            await testPutMalformedArg(server, `${combinedNotesPath}/${noteId}`, updatedNote, verbose);
        });
        it('should return 400 if the request body is empty', async () => {
            const postResponse = await request(server).post('/notes').send(newNote);
            const noteId = Number(postResponse.body.id);

            await testPutMalformedArg(server, `${combinedNotesPath}/${noteId}`, {}, verbose);
        });
    });
    
    /**
     * Test route for DELETE /api/notes/:id
     */
    describe(`DELETE ${combinedNotesPath}:id`, () => {
        const newNote = { title, content };
        it('should delete a note with the given id and return a status code 204', async () => {
            await testDeleteSingleRecordById(server, combinedNotesPath, newNote, verbose);
        });
        it('should return 404 if the note does not exist', async () => {
           await testDeleteNonExistentRecord(server, `${combinedNotesPath}/1234567890`, verbose);
        });
        it('should return 400 if the id is not an integer', async () => {
            const nonIntegerId = 'abc';
            await testMalformedArg(server, 'delete', `${combinedNotesPath}/${nonIntegerId}`, verbose);
        });
        it('should return 400 if the id is not valid', async () => {
            const nonPositiveIntegerId = '-1';
            await testMalformedArg(server, 'delete', `${combinedNotesPath}/${nonPositiveIntegerId}`, verbose);
        });
        it('should return 400 if the id is 0', async () => {
            const zeroId = '0';
            await testMalformedArg(server, 'delete', `${combinedNotesPath}/${zeroId}`, verbose);
        });
    });
});