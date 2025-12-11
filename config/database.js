

const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port:process.env.DB_PORT  ||  '5432',
    user: process.env.DB_USER ||  'postgres',
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME  || 'taskdb',
    max:20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000
});

console.log('Database Configuration:', {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    database: process.env.DB_NAME || 'taskdb',
    password: '***hidden***'
});

pool.on('connect',() => {
    console.log('Connected to postgreSQL database');
});

pool.on('error',(err) => {
    console.error('Unexpected error on idle client',err);
    process.exit(-1);
});

module.exports = pool;

