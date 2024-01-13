import dotenv from 'dotenv';
import express from 'express';
import { getConnection } from './database/connection.js';
dotenv.config();

const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    const conn = await getConnection();
    // Use the connection
    conn.end();
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`App listening at http://${host}:${port}`);
});