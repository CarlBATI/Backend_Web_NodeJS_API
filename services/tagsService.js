// ===================================================================|||
// tagsService.js is service that handles all database calls for tags |||
// ===================================================================|||

//--------------||
// Dependencies ||
//--------------||
const { getConnection } = require('../database/connection');
const { ValidationError } = require('../utils/errors/validation.errors');
const { NotFoundError, DuplicateEntryError } = require('../utils/errors/query.errors');
const { validateString, validateId } = require('../utils/validate');
const { DUPLICATE_KEY_ERROR_CODE } = require('../database/globals');

//---------||
// Globals ||
//---------||

const { 
    TAGS_TABLE,
    TAG_NAME_MAX_LENGTH,
    TAG_NAME_MIN_LENGTH,
    TAGS_TABLE_NAME,
 } = require('../database/models/Tags');
 
//------------------||
// Service functions||
//------------------||

/**
 * Creates a new tag in the database
 * 
 * @param {string} name The name of the tag
 * @returns {Promise<object>} The newly created tag
 * @throws {ValidationError} If the name is not a string or is not between 1 and 25 characters
 * @throws {Error} If there is a database error
 * 
 * @example
 * const tag = await createTag('Test Tag');
 * console.log(tag);
 * // { id: 1, name: 'Test Tag' }
 */
async function createTag(name) {
    validateString('name', name, TAG_NAME_MAX_LENGTH, TAG_NAME_MIN_LENGTH);

    const conn = await getConnection();
    try {
        const insertResult = await conn.query(`INSERT INTO ${TAGS_TABLE_NAME} (name) VALUES (?)`, [name]);
        const selectResult = await conn.query(`SELECT * FROM ${TAGS_TABLE_NAME} WHERE id = ?`, [insertResult.insertId]);
        return selectResult[0];
    } catch (err) {
        if (err.errno === DUPLICATE_KEY_ERROR_CODE) {
            throw new DuplicateEntryError();
        }
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

/**
 * Retrieves all tags from the database
 * 
 * @returns {Promise<Array<object>>} An array of tags
 */
async function readAllTags() {
    const conn = await getConnection();
    try {
        const result = await conn.query(`SELECT * FROM ${TAGS_TABLE_NAME}`);
        return result;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

/**
 * Retrieves a single tag from the database
 * 
 * @param {number|string} id The id of the tag to retrieve
 *
 * @returns {Promise<object>} The tag object
 *
 * @throws {NotFoundError} If the tag is not found
 * @throws {Error} If there is a database error
 */
async function readTagById(id) {
    validateId(id);

    const conn = await getConnection();
    try {
        const result = await conn.query(`SELECT * FROM ${TAGS_TABLE_NAME} WHERE id = ?`, [id]);
        console.log('result of query:');
        console.log(result);
        if (result.length === 0) {
            throw new NotFoundError();
        }
        result[0].id = Number(result[0].id);
        console.log('result after casting id to number:');
        console.log(result[0]);
        return result[0];
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

/**
 * Retrieves a single tag from the database
 * 
 * @param {string} name The name of the tag to retrieve
 * 
 * @returns {Promise<object>} The tag object
 * 
 * @throws {NotFoundError} If the tag is not found
 * @throws {Error} If there is a database error
 */
async function readTagByName(name) {
    validateString('name', name, TAG_NAME_MAX_LENGTH, TAG_NAME_MIN_LENGTH);

    const conn = await getConnection();
    try {
        const result = await conn.query(`SELECT * FROM ${TAGS_TABLE_NAME} WHERE name = ?`, [name]);
        if (result.length === 0) {
            throw new NotFoundError();
        }
        return result[0];
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

/**
 * Delete a tag from the database using the tag's id
 * 
 * @param {number|string} id The id of the tag to delete
 * 
 * @returns {Promise<void>}
 * 
 * @throws {NotFoundError} If the tag is not found
 * @throws {Error} If there is a database error
 */
async function deleteTagById(id) {
    validateId(id);

    const conn = await getConnection();
    try {
        const result = await conn.query(`DELETE FROM ${TAGS_TABLE_NAME} WHERE id = ?`, [id]);
        if (result.affectedRows === 0) {
            throw new NotFoundError();
        }
        return result;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

/**
 * Deletes a tag from the database using the tag's name
 * 
 * @param {string} name The name of the tag to delete
 * 
 * @returns {Promise<void>}
 * 
 * @throws {NotFoundError} If the tag is not found
 * @throws {Error} If there is a database error
 */
async function deleteTagByName(name) {
    validateString('name', name, TAG_NAME_MAX_LENGTH, TAG_NAME_MIN_LENGTH);

    const conn = await getConnection();
    try {
        const result = await conn.query(`DELETE FROM ${TAGS_TABLE_NAME} WHERE name = ?`, [name]);
        if (result.affectedRows === 0) {
            throw new NotFoundError();
        }
        return result;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

//----------------||
// Module Exports ||
//----------------||
module.exports = {
    createTag,
    readAllTags,
    readTagById,
    readTagByName,
    deleteTagById,
    deleteTagByName,
};