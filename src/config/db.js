// src/config/db.js
const path = require('path');

// Forzar carga de mysql2 desde backend/node_modules
const mysql = require(path.join(
  __dirname,              // .../Event-Planner/src/config
  '..',                    // .../Event-Planner/src
  '..',                    // .../Event-Planner
  'backend',               // .../Event-Planner/backend
  'node_modules',          // .../Event-Planner/backend/node_modules
  'mysql2',                // .../mysql2
  'promise'                // .../promise
));

require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     process.env.DB_PORT
});

module.exports = pool;
