// server.js (en backend/)
require('dotenv').config();
const path   = require('path');
const Module = require('module');

Module.globalPaths.push(path.join(__dirname, 'node_modules'));

const express = require('express');
const cors    = require('cors');
const verifyToken = require('./verifyToken');

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000'
  })
);
app.use(express.json());

const SRC = path.resolve(__dirname, '..', 'src');

// Rutas públicas
app.use('/api/contacts', require(path.join(SRC, 'routes', 'contacts')));

// Rutas protegidas (requieren token)
app.use('/api', verifyToken);

app.use('/api/users',      require(path.join(SRC, 'routes', 'users')));
app.use('/api/categories', require(path.join(SRC, 'routes', 'categories')));
app.use('/api/events',     require(path.join(SRC, 'routes', 'events')));
app.use('/api/supplies',   require(path.join(SRC, 'routes', 'supplies')));

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Server escuchando en http://localhost:${PORT}`));
