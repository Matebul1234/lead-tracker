
import mysql from 'mysql2'
import dotenv from 'dotenv';
dotenv.config();

var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME
});

connection.connect(function (err) {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Database Connected');
});

export default connection;