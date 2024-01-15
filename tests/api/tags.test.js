// tags.test.js is a test file that tests the /tags route.
//================================================================================================== 

// Dependencies
//--------------------------------------------------------
const request = require('supertest');
const { server, combinedTagsPath, tagsPath  } = require('../../app');
const { MAX_TAG_NAME_LENGTH, MIN_TAG_NAME_LENGTH } = require('../../database/models/Tags');
const clearDatabase = require('../../database/clearDatabase');
const { pool } = require('../../database/connection');
const { 
    testPostCreation,
    testPostDuplicateEntry, 
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
    testMalformedArg,
    testpostDuplicateEntry
} = require('../utilities/utilities');
const { 
    NOTES_TITLE_MAX_LENGTH,
    NOTES_CONTENT_MAX_LENGTH
} = require('../../database/models/Notes');

beforeEach(async () => {
    try {
        await clearDatabase();
    } catch (err) {
        console.error('Failed to clear database before test:', err);
    }
});

// Constants
const verbose = false;
const debug = false;
const name = "Test Tag";
const newTag = { name };
const newTagsArray = [
    { name: 'Tag 1' },
    { name: 'Tag 2' },
    { name: 'Tag 3' },
];

// Tests
// ========================================================
describe('Tags API', () => {
    describe(`POST ${combinedTagsPath}`, () => {
        it('Should create tags and should return 201 Created', async () => {
            await testPostCreation(server, combinedTagsPath, newTag, ['name'], verbose, debug);
        });
        it('Should trigger on duplicate entry and return status 409 ', async () => {
            await testPostDuplicateEntry(server, combinedTagsPath, newTag, verbose);
        });
        it('Should return 400 Bad Request if name is missing', async () => {
            const nameMissingOject = { nam: '' };
            await testPostBadRequest(server, combinedTagsPath, nameMissingOject, verbose);
        });
        it('Should return 400 Bad Request if name is not a string', async () => {
            const notStringName = { name: 123 };
            await testPostBadRequest(server, combinedTagsPath, notStringName, verbose);
        });
        it('Should return 400 Bad Request if name is too short', async () => {
            const toShortName = { name: 'a'.repeat(MIN_TAG_NAME_LENGTH - 1) };
            await testPostBadRequest(server, combinedTagsPath, toShortName, verbose);
        });
        it('Should return 400 Bad Request if name is too long', async () => {
            const toLongName = { name: 'a'.repeat(MAX_TAG_NAME_LENGTH + 1) };
            await testPostBadRequest(server, combinedTagsPath, toLongName, verbose);
        });
    });
    describe(`GET ${combinedTagsPath}`, () => {
        it('Should return all tags and status code 201', async () => {
            await testGetMultipleObjects(server, combinedTagsPath, newTagsArray, verbose);
        });
    });
    describe(`GET ${combinedTagsPath}:id`, () => {
        it('Should return the tag tag specified by the id and status code 201', async () => {
            const postResponse = await request(server).post(combinedTagsPath).send(newTag);
            console.log('postResponse stattus:' , postResponse.status)
            console.log('postResponse.body:', postResponse.body);
            const tagId = Number(postResponse.body.id);
            console.log('tagId:', tagId);
            const expectedTag = {id: tagId, name, color_id: null };
           await testGetSingleObjectById(server, `${combinedTagsPath}/${tagId}`, expectedTag, verbose);
        });
        it('should return 404 not found if tag with the specified id does not exist', async () => {
           const nonExistentId = 9999;
           // Could be any number as the database should be cleared for each test
           await testGetNonExistentObject(server, `${combinedTagsPath}/${nonExistentId}`, verbose); 
        });
    });
});

// close the server after each test
server.close();