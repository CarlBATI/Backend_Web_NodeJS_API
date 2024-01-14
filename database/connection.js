const dotenv = require('dotenv');
dotenv.config();

const mariadb = require('mariadb');

// Create a new MariaDB connection pool with the specified options
const pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    connectionLimit: 100
});

/**
 * Get a connection from the pool.
 * @returns {Promise<Connection>} A Promise that resolves to the connection if successful, or rejects with an error.
 */
async function getConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        // consoleLogPoolStats(); // Uncomment to see pool stats
        return conn;
    } catch (err) {
        console.error("Error connecting to MariaDB: ", err);
    }
}

/**
 * Close the connection pool.
 * @returns {Promise<void>} A Promise that resolves when the pool has been closed.
 */
async function closePool() {
    await pool.end();
}

/**
 * Log the current state of the connection pool to the console.
 * This includes the total number of connections, the number of active connections, and the number of idle connections.
 */
async function consoleLogPoolStats() {
    console.log("Total connections: ", pool.totalConnections());
    console.log("Active connections: ", pool.activeConnections());
    console.log("Idle connections: ", pool.idleConnections());
}

module.exports = { getConnection, closePool };