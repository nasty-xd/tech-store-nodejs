// Initialize connection to MySQL and create the database if needed
// Using mysql2 to create the database and Sequelize as the ORM

const mysql  = require('mysql2/promise');
const { Sequelize } = require('sequelize');

// Create the database if needed and return a Sequelize instance
async function createSequelize() {
    // Read configuration from environment variables
    const host = process.env.DB_HOST || 'localhost';
    const port = Number(process.env.DB_HOST || 3306);
    const user = process.env.DB_USER || 'root';
    const pass = process.env.DB_PASS || '';
    const dbName = process.env.DB_NAME || 'PhoneShop';

    // First, connect to the server without specifying a database
    const connection = await mysql.createConnection({ host, port, user, password: pass });
    // Create the database if it doesn't exist
    await connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await connection.end();

   // Initialize Sequelize with the newly created (or existing) database
    const sequelize = new Sequelize(dbName, user, pass, {
        host,
        port,
        dialect: 'mysql',
        logging: false
    });

    return sequelize;
}

module.exports = { createSequelize };
