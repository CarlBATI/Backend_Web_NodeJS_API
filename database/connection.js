import dotenv from 'dotenv';
dotenv.config();

import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    connectionLimit: 5
});

export async function getConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Successfully connected to MariaDB");
        return conn;
    } catch (err) {
        console.error("Error connecting to MariaDB: ", err);
    }
}