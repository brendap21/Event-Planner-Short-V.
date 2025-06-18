// backend/server.js
require('dotenv').config();
const path = require('path');
const Module = require('module');

Module.globalPaths.push(path.join(__dirname, 'node_modules'));

const express = require('express');
const cors = require('cors');
const verifyToken = require('./verifyToken');

const app = express();

app.use(
  cors({
    origin: '*', // Puedes restringir si quieres
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const SRC = path.resolve(__dirname, '..', 'src');

// Rutas públicas
app.use('/api/contacts', require(path.join(SRC, 'routes', 'contacts')));
app.use('/api/users', require(path.join(SRC, 'routes', 'users')));

// Middleware de autenticación
app.use(verifyToken);

// Rutas protegidas
app.use('/api/categories', require(path.join(SRC, 'routes', 'categories')));
app.use('/api/events', require(path.join(SRC, 'routes', 'events')));
app.use('/api/supplies', require(path.join(SRC, 'routes', 'supplies')));
app.use('/api/events/:eventId/guests', require(path.join(SRC, 'routes', 'guests')));
app.use('/api/events/:eventId/supplies', require(path.join(SRC, 'routes', 'eventSupplies')));

// -----------------------------
// SERVIR FRONTEND (React Build)
// -----------------------------
app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
