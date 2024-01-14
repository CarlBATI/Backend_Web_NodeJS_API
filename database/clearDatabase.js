const { query, closePool } = require('./connection');

async function clearDatabase() {
    // List of tables to clear
    // Must be in the right order to avoid foreign key constraint errors
    const tables = ['Notes'];

    for (let table of tables) {
        console.log(`Clearing table ${table}...`);
        await query(`DELETE FROM ${table}`);
    }
    console.log('Database cleared');
}

// If this file is run directly, clear the database
if (require.main === module) {
    // The file is being run directly, so call the function
    clearDatabase()
    .catch(console.error)
    .finally(() => {
        closePool();
    });
}

// Otherwise, export the function
module.exports = clearDatabase;