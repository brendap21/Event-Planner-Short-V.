// backend/server.js
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const verifyToken = require('./verifyToken');

const app = express();

// CORS
app.use(
  cors({
    origin: '*', // Puedes reemplazar con tu frontend si necesitas seguridad
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// PATH a las rutas
const SRC = path.resolve(__dirname, '../src');

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

// SERVIR EL FRONTEND COMPILADO (React)
const buildPath = path.resolve(__dirname, '../build');
app.use(express.static(buildPath));

// Cualquier otra ruta → index.html del frontend (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// PUERTO
const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
