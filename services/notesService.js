const { getConnection } = require('../database/connection');
const { validateString, validateId } = require('../utils/validate');
const { NotFoundError } = require('../utils/errors/query.errors');


/** 
 *  Create a new note with the specified title and content
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
        validateString('title', title, 100, 1);
        validateString('content', content, 10000);
    } catch (err) {
        throw err;
    };
        
    // Create the note
    const conn = await getConnection();
    try {
        const result = await conn.query('INSERT INTO Notes (title, content) VALUES (?, ?)', [title, content]);
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
    const rows = await conn.query('SELECT * FROM Notes WHERE id = ?', [id]);

    // If the note is not found, throw an error
    if (rows.length === 0) {
        throw new NotFoundError();
    }

    // Cast the ID to a number
    rows[0].id = Number(rows[0].id);
    return rows[0];
}

async function readNotes() {}

async function updateNote(id, title, content) {
    const conn = await getConnection();
    try {
        const [result] = await conn.query('UPDATE Notes SET title = ?, content = ? WHERE id = ?', [title, content, id]);
        return result.affectedRows > 0;
    } finally {
        if (conn) conn.release();
    }
}

async function deleteNoteById(id) {
    const conn = await getConnection();
    try {
        const [result] = await conn.query('DELETE FROM Notes WHERE id = ?', [id]);
        return result.affectedRows > 0;
    } finally {
        if (conn) conn.release();
    }
}

async function deleteNotesByIds(ids) {
    const conn = await getConnection();
    try {
        const [result] = await conn.query('DELETE FROM Notes WHERE id IN (?)', [ids]);
        return result.affectedRows > 0;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = {
    createNote,
    readNoteById,
    readNotes,
    updateNote,
    deleteNoteById,
    deleteNotesByIds
};