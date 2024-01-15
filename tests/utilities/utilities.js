// Tests utilities
// ========================================================

// Dependencies
// ========================================================
const request = require('supertest');

/**
 * Test object creation
 * 
 * @param {object} server - The server to send the request to
 * @param {string} path - The path to send the request to
 * @param {object} object - The object to send in the request body. Must have all required properties.
 * @param {array} properties - The properties to check in the response body. Must be in the same order as in the request body.
 * @param {boolean} verbose - Whether to log the response body to the console
 * @returns {Promise} - A promise that resolves to the response from the server. The response body should have an id property.
 * @throws {Error} - An error if the response status code is not 201
 * @throws {Error} - An error if the response body does not have an id property
 * @throws {Error} - An error if the response body does not have the correct properties
 * 
 * @example
 * const path = '/tags';
 * const object = { name: 'Test Tag' };
 * const properties = ['name'];
 * await testObjectCreation(path, object, properties);
 */
async function testPostCreation(server, path, object, properties, verbose = false) {
    const response = await request(server)
        .post(path)
        .send(object);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');

    properties.forEach(property => {
        expect(response.body[property]).toBe(object[property]);
    });
    if (verbose) console.log(`Created object for POST ${path} test with ID: ${response.body.id}\n${JSON.stringify(response.body, null, 2)}`);
}

/**
 * Test bad request - POST
 * Sending a malformed object should return status 400 Bad Request
 * 
 * @param {object} server - The server to send the request to
 * @param {string} path - The path to send the request to
 * @param {object} object - The object to send in the request body. Must have all required properties.
 * @returns {Promise} - A promise that resolves to the response from the server
 * @throws {Error} - An error if the response status code is not 400
 * 
 * @example
 * const path = '/tags';
 * const object = { name: 'Test Tag' };
 * await testPostBadRequest(path, object);
 */
async function testPostBadRequest(server, path, object, verbose = false) {
    const response = await request(server)
        .post(path)
        .send(object);

    expect(response.statusCode).toBe(400);
    if (verbose && response.statusCode === 400) {
        console.log(`Bad request for POST ${path} test with status ${response.status}\nSent malformed object: ${JSON.stringify(object, null, 2)}\nResponse: ${JSON.stringify(response.body, null, 2)}`);
    }
}

/**
 * Test reading a single object - GET
 * Objects must have an id property
 * A database object must exist with the same id as the object in the request
 * The expected object must have an id property with a value that matches the id of the object in the database
 * 
 * 
 * @param {object} server - The server to send the request to
 * @param {string} path - The path to send the request to
 * @param {object} expectedObject - The object to compare the response body to. 
 * @returns {Promise} - A promise that resolves to the response from the server
 * @throws {Error} - An error if the response status code is not 200
 * @throws {Error} - An error if the response body does not have an id property
 * @throws {Error} - An error if the response body does not have the correct properties
 * 
 * @example
 * const path = '/tags/1';
 * const expectedObject = { id: 1, name: 'Test Tag' };
 * await testGetSingleObject(path, expectedObject);
 */
async function testGetSingleObjectById(server, path, expectedObject, verbose = false) {
    const response = await request(server).get(path);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(Number(expectedObject.id));

    // iterate over the properties of the expected object and compare them to the response body
    for (const property in expectedObject) {
        expect(response.body[property]).toBe(expectedObject[property]);
    }

    if (verbose) console.log(`GET ${path} test for ID: ${response.body.id}\n${JSON.stringify(response.body, null, 2)}`);
}

/**
 * Test trying to read a single object that does not exist - GET
 * Database object must not exist for the entry
 * 
 * @param {object} server - The server to send the request to
 * @param {string} path - The path to send the request to. Must include the GET parameter.
 * @param {boolean} verbose - Whether to log a message with the response status and body to the console
 * 
 * @returns {Promise} - A promise that resolves to the response from the server
 * 
 * @throws {Error} - An error if the response status code is not 404 
 */
async function testGetNonExistentObject(server, path, verbose = false) {
    const response = await request(server).get(`${path}`);

    expect(response.statusCode).toBe(404);
    if (verbose && response.statusCode === 404) {
        console.log(`GET ${path} test returns status ${response.status}\nResponse: ${JSON.stringify(response.body, null, 2)}`);
    }
}

/** 
 * Test trying to read an object with a malformed argument - GET
 *
 * @param {object} server - The server to send the request to
 * @param {string} path - The path to send the request to. Must include the GET parameter.
 * @param {boolean} verbose - Whether to log a message with the response status and body to the console
 * 
 * @returns {Promise} - A promise that resolves to the response from the server
 * 
 * @throws {Error} - An error if the response status code is not 400
 */
async function testGetMalformedArg(server, path, verbose = false) {
    const response = await request(server).get(`${path}`);

    expect(response.statusCode).toBe(400);
    if (verbose && response.statusCode === 400) {
        console.log(`GET ${path} test returns status ${response.status}\nResponse: ${JSON.stringify(response.body, null, 2)}`);
    }
}

/**
 * Test getting multiple objects - GET
 * Requires the POST route to be tested first
 * Requires the POST and GET routes to have the same path
 * 
 * Only works on empty tables
 * 
 * @param {object} app - The server to send the request to
 * @param {string} path - The path to send the request to
 * 
 * @returns {Promise} - A promise that resolves to the response from the server
 * 
 * @throws {Error} - An error if the response status code is not 200
 * @throws {Error} - An error if the response body does not have an id property
 * @throws {Error} - An error if the response body does not have the correct properties
 * 
 * @example
 * const path = '/tags';
 * const newObjects = [
 *    { name: 'Test Tag 1' },
 *    { name: 'Test Tag 2' },
 *    { name: 'Test Tag 3' }
 * ];
 * await testGetMultipleObjects(path, newObjects);
 */
async function testGetMultipleObjects(server, path, newObjects, verbose = false) {
    for (let object of newObjects) {
        await request(server).post(path).send(object);
    }

    const response = await request(server).get(path);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');

    for (let key in newObjects[0]) {
        // skip the id property
        if (key === 'id') continue;
        expect(response.body[0]).toHaveProperty(key);
    }

    if (verbose) {
        console.log(`Created: ${JSON.stringify(newObjects)}\nPOST objects to ${path}\nGET ${path} test with status: ${response.status}\nResponse: ${JSON.stringify(response.body, null, 2)}`);
    }
}

module.exports = {
    testPostCreation,
    testPostBadRequest,
    testGetSingleObjectById,
    testGetNonExistentObject,
    testGetMalformedArg,
    testGetMultipleObjects
};