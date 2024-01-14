// noteService.js is a service that handles all database calls for notes
// ========================================================


// Dependancies
//---------------------------------------------------------------------------------------------
const { getConnection } = require('../database/connection');
const { validateString, validateId } = require('../utils/validate');
const { NotFoundError } = require('../utils/errors/query.errors');
const { ValidationError } = require('../utils/errors/validation.errors');

// Constants
//---------------------------------------------------------------------------------------------
const NOTES_TABLE = 'Notes';
const NOTE_TITLE_MAX_LENGTH = 100;
const NOTE_TITLE_MIN_LENGTH = 1;
const NOTE_CONTENT_MAX_LENGTH = 10000;

/** 
 *  Create a new note with the specified title and content
 * 
 *  @param {string} title - The title of the note
 *  @param {string} content - The content of the note
 * 
 *  @throws {Error} Will throw an error if the value does not meet the validation criteria 
 *
 *  @returns {Promise<Object>} A promise that resolves to the newly created note. The note is an object with properties 'id', 'title', and 'content'.
 *  
 *  @example
 *  const note = await createNote('My note', 'This is my note');
 *  console.log(note);
 *  // { id: '1', title: 'My note', content: 'This is my note' }
 */ 
async function createNote(title, content) {
    try {
        validateString('title', title, NOTE_TITLE_MAX_LENGTH, NOTE_TITLE_MIN_LENGTH);
        validateString('content', content, NOTE_CONTENT_MAX_LENGTH);
    } catch (err) {
        throw err;
    };
        
    // Create the note
    const conn = await getConnection();
    try {
        const result = await conn.query(`INSERT INTO ${NOTES_TABLE} (title, content) VALUES (?, ?)`, [title, content]);
        return { id: result.insertId.toString(), title, content };
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

/** 
 * Read a note by its ID
 * 
 * @param {string} id - The ID of the note to read
 * 
 * @throws {Error} Will throw an error if the value does not meet the validation criteria
 * @throws {NotFoundError} Will throw a NotFoundError if the note is not found
 * 
 * @returns {Promise<Object>} A promise that resolves to the note. The note is an object with properties 'id', 'title', and 'content'.
 * 
 * @example
 * const note = await readNoteById('1');
 * console.log(note);
 * // { id: '1', title: 'My note', content: 'This is my note' }
 * 
 * @example
 * const note = await readNoteById('999');
 * // NotFoundError: record was not found
 */ 
async function readNoteById(id) {
    validateId(id);

    const conn = await getConnection();
    const rows = await conn.query(`SELECT * FROM ${NOTES_TABLE} WHERE id = ?`, [id]);

    // If the note is not found, throw an error
    if (rows.length === 0) {
        throw new NotFoundError();
    }

    // Cast the ID to a number
    rows[0].id = Number(rows[0].id);
    return rows[0];
}

/** 
 * Read all notes
 *
 * @returns {Promise<Array>} A promise that resolves to an array of notes. Each note is an object with properties 'id', 'title', and 'content'.
 * 
 * @example
 * const notes = await readNotes();
 * console.log(notes);
 * // [
 * //   { id: 1, title: 'My note', content: 'This is my note' },
 * //   { id: 2, title: 'Another note', content: 'This is another note' }
 * // ] 
 */
async function readNotes() {
    const conn = await getConnection();
    try {
        const rows = await conn.query(`SELECT * FROM ${NOTES_TABLE}`);
        return rows;
    } finally {
        if (conn) conn.release();
    }
}

/**
 * Update a note by its ID
 * 
 * @param {string} id - The ID of the note to update
 * @param {string} title - The title of the note
 * @param {string} content - The content of the note
 * 
 * @throws {Error|ValidationError} Will throw an error if the value does not meet the validation criteria
 * @throws {NotFoundError} Will throw a NotFoundError if the note is not found
 * 
 * @returns {Promise<Object>} A promise that resolves to the updated note. The note is an object with properties 'id', 'title', and 'content'.
 */
async function updateNoteById(id, title, content) {
    validateId(id);
    validateString('title', title, NOTE_TITLE_MAX_LENGTH, NOTE_TITLE_MIN_LENGTH);
    validateString('content', content, NOTE_CONTENT_MAX_LENGTH);

    const conn = await getConnection();
    try {
        const result = await conn.query(`UPDATE ${NOTES_TABLE} SET title = ?, content = ?, modified_at = CURRENT_TIMESTAMP WHERE id = ?`, [title, content, id]);
        if (result.affectedRows === 0) {
            throw new NotFoundError();
        }
        const [updatedNote] = await conn.query(`SELECT * FROM ${NOTES_TABLE} WHERE id = ?`, [id]);
        return updatedNote;
    } finally {
        if (conn) conn.release();
    }
}

async function deleteNoteById(id) {
    validateId(id);

    const conn = await getConnection();
    try {
        const result = await conn.query(`DELETE FROM ${NOTES_TABLE} WHERE id = ?`, [id]);
        console.log(result);
        
        return result.affectedRows > 0;
    } finally {
        if (conn) conn.release();
    }
}

/**
 * Delete notes by their IDs
 * 
 * @param {Array<number>} ids - An array of note IDs
 * 
 * @throws {Error} Will throw an error if the value does not meet the validation criteria
 * @throws {NotFoundError} Will throw a NotFoundError if the note is not found
 * @throws {ValidationError} Will throw a ValidationError if the value does not meet the validation criteria
 * 
 * @returns {Promise<boolean>} A promise that resolves to true if the notes were deleted successfully
 * 
 * @example
 * const result = await deleteNotesByIds([1, 2]);
 * console.log(result);
 * // true
 * 
 * @example
 * const result = await deleteNotesByIds([999]);
 * // NotFoundError: record was not found
 * 
 * @example
 * const result = await deleteNotesByIds(['1', '2']);
 * // ValidationError: id must be a number
 */
async function deleteNotesByIds(ids) {
    const conn = await getConnection();
    try {
        const result = await conn.query(`DELETE FROM ${NOTES_TABLE} WHERE id IN (?)`, [ids]);
        console.log(result);
        return result.affectedRows > 0;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = {
    createNote,
    readNoteById,
    readNotes,
    updateNoteById,
    deleteNoteById,
    deleteNotesByIds
};