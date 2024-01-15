// Cleanup script to clear the database. Meaning, it deletes all the records from the database.
// Can be run directly from the command line, or imported and used in other scripts.
// ========================================================

// Imports
const { query, closePool } = require('./connection');
const { NOTES_TABLE_NAME } = require('../database/models/Notes')
const { TAGS_TABLE_NAME } = require('../database/models/Tags')
const { NOTES_TAGS_TABLE_NAME } = require('../database/models/NotesTags')

/**
 * Clears the database
 * 
 * @param {boolean} verbose If true, logs more information to the console
 * @returns {Promise<void>} A promise that resolves when the database is cleared
 */
async function clearDatabase(verbose = false) {
    // The order of the tables is important because of foreign key constraints
    const tables = [NOTES_TAGS_TABLE_NAME, NOTES_TABLE_NAME, TAGS_TABLE_NAME];

    try {
        // Delete all records from each table
        await Promise.all(tables.map(table => {
            if (verbose) console.log(`Clearing table ${table}...`);
            return query(`DELETE FROM ${table}`);
        }));
        if (verbose) console.log('Database cleared');
    } catch (err) {
        if (verbose) console.error('Error clearing database:', err);
        throw err; // re-throw the error so it can be caught and handled by the calling code
    }
}

// If this file is run directly, clear the database
if (require.main === module) {
    // The file is being run directly, so call the function
    clearDatabase()
    .catch(console.error)
    .finally(() => {
        // Close the database connection pool after the function completes
        closePool();
    });
};

// Otherwise, export the function
module.exports = clearDatabase;