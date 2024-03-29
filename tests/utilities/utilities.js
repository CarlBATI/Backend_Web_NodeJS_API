// Tests utilities
// This file includes utilities for testing routes
// ========================================================

// Dependencies
// ========================================================
const request = require('supertest');


/**
 * Create a temporary record in the database
 * 
 * @param {object} server - The server to send the request to
 * @param {string} path - The path to send the request to
 * @param {object} object - The object to send in the request body. Must have all required properties.
 * 
 * @returns {Promise} - A promise that resolves to the ID of the created record
 */
async function createTempRecord(server, path, object) {
    const postResponse = await request(server).post(path).send(object);
    return Number(postResponse.body.id);
}

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
async function testPostCreation(server, path, object, properties, verbose = false, debug = false) {
    const response = await request(server)
        .post(path)
        .send(object);

    if (debug) {
        console.log(testPostCreation.name);
        console.log("response");
        console.log(response);
        console.log("response body");
        console.log(response.body);
    }

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');

    properties.forEach(property => {
        expect(response.body[property]).toBe(object[property]);
    });
    if (verbose) console.log(`Created object for POST ${path} test with ID: ${response.body.id}\n${JSON.stringify(response.body, null, 2)}`);
}

async function testPostDuplicateEntry(server, path, object, verbose = false) {
    const firstResponse = await request(server).post(path).send(object);
    const duplicateResponse = await request(server).post(path).send(object);

    expect(duplicateResponse.statusCode).toBe(409);
    if (verbose) {
        console.log(`Sending two identical requests for: ${object} to POST ${path} test with status ${duplicateResponse.status}\nResponse: ${JSON.stringify(duplicateResponse.body, null, 2)}`);
    }
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
 * @param {boolean} verbose - Whether to log a message with the response status and body to the console
 *  
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
        // skip the id property
        if (property === 'id') continue;
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

/** 
 * testUpdateObject
 * 
 * @param {object} server - The server to send the request to
 * @param {string} path - The path to send the request to. This path should be the same for POST and PUT.
 * @param {object} newObject - The object to send in the request body. Must have all required properties.
 * @param {object} updatedObject - The object to send in the request body. Must have all required properties.
 * @param {boolean} verbose - Whether to log a message with the response status and body to the console
 * 
 * @returns {Promise} - A promise that resolves to the response from the server
 * 
 * @throws {Error} - An error if the response status code is not 200
 * @throws {Error} - An error if the response body does not have an id property
 * @throws {Error} - An error if the response body does not have the correct properties
 * 
 * @example
 * const path = '/tags';
 * const newObject = { name: 'Test Tag' };
 * const updatedObject = { name: 'Updated Tag' };
 * await testUpdateObject(app, path, newObject, updatedObject);
 */
async function testPutSingleObject(server, path, newObject, updatedObject, verbose = false) {
    const postResponse = await request(server).post(path).send(newObject);
    const objectId = Number(postResponse.body.id);

    const putResponse = await request(server).put(`${path}/${objectId}`).send(updatedObject);

    expect(putResponse.statusCode).toBe(200);
    expect(putResponse.body).toHaveProperty('id');
    expect(putResponse.body.id).toBe(objectId);
    for (let key in updatedObject) {
        // skip the id property
        if (key === 'id') continue;
        expect(putResponse.body[key]).toBe(updatedObject[key]);
    }

    if (verbose) {
        console.log(`POST created object: ${newObject} with id: ${objectId}\nPUT ${path}/${objectId} test with status: ${putResponse.status}\nSent object: ${JSON.stringify(updatedObject, null, 2)}\nResponse: ${JSON.stringify(putResponse.body, null, 2)}`);
    }
}

/**
 * Test trying to update a single object that does not exist - PUT
 * Assumes the id in the path is the id of a non-existent object
 * 
 * @param {object} server - The server to send the request to
 * @param {string} path - The path to send the request to. Must include the PUT parameter.
 * @param {object} updatedObject - The object to send in the request body. Must have all required properties.
 * @param {boolean} verbose - Whether to log a message with the response status and body to the console
 */
async function testPutNonExistentRecord(server, path, updatedObject, verbose = false) {
    const response = await request(server).put(path).send(updatedObject);

    expect(response.statusCode).toBe(404);
    if (verbose) {
        console.log(`PUT ${path} test with status: ${response.status}\nSent object: ${JSON.stringify(updatedObject, null, 2)}\nResponse: ${JSON.stringify(response.body, null, 2)}`);
    }
}

/**
 * Test trying to update an object with a malformed argument - PUT
 * 
 * @param {object} server - The server to send the request to
 * @param {string} path - The path to send the request to. Must include the PUT parameter.
 * @param {object} updatedObject - The object to send in the request body. Must have all required properties.
 * @param {boolean} verbose - Whether to log a message with the response status and body to the console
 * 
 * @throws {Error} - An error if the response status code is not 400
 */
async function testPutMalformedArg(server, path, updatedObject, verbose = false) {
    const putResponse = await request(server).put(path).send(updatedObject);
    
    expect(putResponse.statusCode).toBe(400);
    if (verbose) {
        console.log(`Malformed path: ${path} or Arg Object: ${JSON.stringify(updatedObject, null, 2)}\nPUT ${path} test with status: ${putResponse.status}\nResponse: ${JSON.stringify(putResponse.body, null, 2)}`);
    }
}

/**
 * Test deleting a single record
 * 
 * @param {object} server - The server to send the request to
 * @param {string} path - The path to send the request to without the id parameter
 * @param {object} testObject - The object to send in the request body. Must have all required properties.
 * @param {boolean} verbose - Whether to log a message with the response status and body to the console
 * 
 * @returns {Promise} - A promise that resolves to the response from the server
 */
async function testDeleteSingleRecordById(server, path, testObject, verbose = false) {
    const testRecordId = await createTempRecord(server, path, testObject);
    
    const deleteResponse = await request(server).delete(`${path}/${testRecordId}`);

    expect(deleteResponse.statusCode).toBe(204);
    if (verbose) {
        console.log(`POST created object with id: ${testRecordId}\nDELETE ${path}/${testObject} test with status: ${deleteResponse.status}\nResponse: ${JSON.stringify(deleteResponse.body, null, 2)}`);
    }
}

/**
 * Test trying to delete a single record that does not exist - DELETE
 * Assumes the id in the path is the id of a non-existent object
 * 
 * @param {object} server - The server to send the request to
 * @param {string} path - The path to send the request to. Must include the DELETE parameter.
 * @param {boolean} verbose - Whether to log a message with the response status and body to the console
 * 
 * @throws {Error} - An error if the response status code is not 404
 */
async function testDeleteNonExistentRecord(server, path, verbose = false) {
    const deleteResponse = await request(server).delete(path);

    expect(deleteResponse.statusCode).toBe(404);
    if (verbose) {
        console.log(`DELETE ${path} test with status: ${deleteResponse.status}\nResponse: ${JSON.stringify(deleteResponse.body, null, 2)}`);
    }
}

async function testDeleteMalformedArg(server, path, verbose = false) {
    const response = await request(server).delete(path);

    expect(response.statusCode).toBe(400);
    if (verbose) {
        console.log(`DELETE ${path} test with status: ${response.status}`);
    }
}

/**
 * Test trying to send a malformed argument to a route
 * 
 * @param {object} server - The server to send the request to
 * @param {string} method - The HTTP method to use. Must be one of: GET, POST, PUT, DELETE or get, post, put, delete
 * @param {string} path - The path to send the request to
 * @param {object} data - The data to send in the request body. Must have all required properties.
 * @param {boolean} verbose - Whether to log a message with the response status and body to the console
 * 
 * @returns {Promise} - A promise that resolves to the response from the server
 * 
 * @throws {Error} - An error if the response status code is not 400
 * 
 * @example
 * const path = '/tags';
 * const data = { name: 'Test Tag' };
 * await testMalformedArg(app, 'post', path, data);
 */
async function testMalformedArg(server, method, path, data = {}, verbose = false) {
    let response;
    switch (method.toLowerCase()) {
        case 'get':
            response = await request(server).get(path);
            break;
        case 'post':
            response = await request(server).post(path).send(data);
            break;
        case 'put':
            response = await request(server).put(path).send(data);
            break;
        case 'delete':
            response = await request(server).delete(path);
            break;
        default:
            throw new Error(`Invalid method: ${method}`);
    }

    expect(response.statusCode).toBe(400);
    if (verbose) {
        console.log(`${method.toUpperCase()} ${path} test with status: ${response.status}\nResponse: ${JSON.stringify(response.body, null, 2)}`);
    }
}

module.exports = {
    createTempRecord,
    testMalformedArg,
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
    testDeleteNonExistentRecord
};