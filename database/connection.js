const dotenv = require('dotenv');
dotenv.config();

const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    connectionLimit: 100
});

async function getConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Total connections: ", pool.totalConnections());
        console.log("Active connections: ", pool.activeConnections());
        console.log("Idle connections: ", pool.idleConnections());
        return conn;
    } catch (err) {
        console.error("Error connecting to MariaDB: ", err);
    }
}

async function closePool() {
    await pool.end();
}

module.exports = { getConnection, closePool };