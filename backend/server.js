require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const verifyToken = require('./verifyToken');

const app = express();

app.use(
  cors({
    origin: '*', // Puedes ajustar a tu frontend si deseas más seguridad
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const SRC = path.resolve(__dirname);

// Rutas públicas
app.use('/api/contacts', require(path.join(SRC, 'routes', 'contacts')));
app.use('/api/users', require(path.join(SRC, 'routes', 'users')));

// Middleware de verificación (autenticación)
app.use(verifyToken);

// Rutas protegidas
app.use('/api/categories', require(path.join(SRC, 'routes', 'categories')));
app.use('/api/events', require(path.join(SRC, 'routes', 'events')));
app.use('/api/supplies', require(path.join(SRC, 'routes', 'supplies')));
app.use('/api/events/:eventId/guests', require(path.join(SRC, 'routes', 'guests')));
app.use('/api/events/:eventId/supplies', require(path.join(SRC, 'routes', 'eventSupplies')));

// Sirve el frontend compilado (React)
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.resolve(__dirname, '../build');
  app.use(express.static(publicPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
