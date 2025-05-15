// server.js (en backend/)
require('dotenv').config();
const path   = require('path');
const Module = require('module');

//  ———> Añade tu node_modules de backend a la búsqueda global:
//      Esto hace que cualquier require('mysql2/promise')  
//      o require('express') también vea backend/node_modules
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

// Ruta a src (un nivel arriba de backend/)
const SRC = path.resolve(__dirname, '..', 'src');

// Importar routers directamente desde src/routes
// Rutas públicas (no requieren token)
app.use('/api/contacts', require(path.join(SRC, 'routes', 'contacts')));

// A partir de aquí, todo va protegido
app.use('/api', verifyToken);

app.use('/api/users',      require(path.join(SRC, 'routes', 'users')));
app.use('/api/categories', require(path.join(SRC, 'routes', 'categories')));
app.use('/api/events',     require(path.join(SRC, 'routes', 'events')));
app.use('/api/events/:eventId/guests',      require(path.join(SRC, 'routes', 'guests')));
app.use('/api/supplies',                     require(path.join(SRC, 'routes', 'supplies')));
app.use('/api/events/:eventId/supplies',     require(path.join(SRC, 'routes', 'eventSupplies')));
app.use('/api/events/:eventId/shopping-list',require(path.join(SRC, 'routes', 'shoppingList')));

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Server escuchando en http://localhost:${PORT}`));