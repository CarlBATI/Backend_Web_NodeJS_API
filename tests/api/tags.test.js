// tags.test.js is a test file that tests the /tags route.
//================================================================================================== 

// Dependencies
// ========================================================
const server = require('../../app');
const request = require('supertest');
const tagsRouter = require('../../routes/tagsRouter');
const { MAX_TAG_NAME_LENGTH, MIN_TAG_NAME_LENGTH } = require('../../services/tagsService');
const clearDatabase = require('../../database/clearDatabase');
const { pool } = require('../../database/connection');

// Setup
// app.use('/', tagsRouter);

beforeEach(async () => {
    try {
        await clearDatabase();
    } catch (err) {
        console.error('Failed to clear database before test:', err);
    }
});

// Constants
const name = "Test Tag";
const newTag = { name };

// Tests
// ========================================================
describe('Tags API', () => {
    describe('POST /tags', () => {
        it('Should create tags and should return 201 Created', async () => {
            const response = await request(server)
                .post('/tags')
                .send({ name });

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(newTag.name);
        });
        it('Should trigger on duplicate entry and return status 409 ', async () => {

            const response = await request(server)
                .post('/tags')
                .send({ name });
            const responseDuplicate = await request(server)
                .post('/tags')
                .send({ name });

            expect(responseDuplicate.statusCode).toBe(409);
        });
        it('Should return 400 Bad Request if name is missing', async () => {
            const response = await request(server)
                .post('/tags')
                .send({});

            expect(response.statusCode).toBe(400);
        });
        it('Should return 400 Bad Request if name is not a string', async () => {
            const response = await request(server)
                .post('/tags')
                .send({ name: 123 });

            expect(response.statusCode).toBe(400);
        });
        it('Should return 400 Bad Request if name is too short', async () => {
            const response = await request(server)
                .post('/tags')
                .send({ name: '' + 'a'.repeat(MIN_TAG_NAME_LENGTH - 1)});

            expect(response.statusCode).toBe(400);
        });
        it('Should return 400 Bad Request if name is too long', async () => {
            const response = await request(server)
                .post('/tags')
                .send({ name: 'a'.repeat(MAX_TAG_NAME_LENGTH + 1) });

            expect(response.statusCode).toBe(400);
        });
    });
    describe('GET /tags', () => {
        it('Should return 200 OK', async () => {
            const response = await request(server)
                .get('/tags');

            expect(response.statusCode).toBe(200);
        });
        it('Should return an array', async () => {
            const response = await request(server)
                .get('/tags');

            expect(response.body).toBeInstanceOf(Array);
        });
        it('Should return an array of tag objects', async () => {
            // create multiple tags
            const tags = [
                { name: 'Tag 1' },
                { name: 'Tag 2' },
                { name: 'Tag 3' },
            ];
            await Promise.all(tags.map(tag => request(server).post('/tags').send(tag)));

            const response = await request(server)
                .get('/tags');

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toBeInstanceOf(Object);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('name');
        });
    });
    describe('GET /tags/:id', () => {
        it('Should return the tag', async () => {
            const tags = [
                { name: 'Tag 1' },
                { name: 'Tag 2' },
                { name: 'Tag 3' },
            ];

            await Promise.all(tags.map(tag => request(server).post('/tags').send(tag)));

            await request(server)
                .get('/tags')
            console.log('tags', tags);
            const createResponse = await request(server)
                .post('/tags')
                .send({ name });

            const createResponseId = createResponse.body.id;
            console.log('createResponseId', createResponseId);

            const response = await request(server)
                .get(`/tags/${createResponseId}`);
                

            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('name');
        });
        it('Should return a single tag object', async () => {
            const response = await request(server)
                .get('/tags/1');

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('name');
        });
        it('Should return 404 Not Found if tag (id: 9999999) does not exist', async () => {
            const response = await request(server)
                .get('/tags/9999999');

            expect(response.statusCode).toBe(404);
        });
    });
});

afterAll(async (done) => { 
    await pool.end(); // close the database connection pool
    server.
    done(); 
});