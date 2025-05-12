const pool = require('../config/db');

// Listar invitados de un evento
exports.getAll = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM guests WHERE event_id = ?',
    [req.params.eventId]
  );
  res.json(rows);
};

// Agregar un invitado a un evento
exports.create = async (req, res) => {
  const { first_name, last_name } = req.body;
  const [result] = await pool.query(
    'INSERT INTO guests (event_id, first_name, last_name) VALUES (?,?,?)',
    [req.params.eventId, first_name, last_name]
  );
  res.status(201).json({ id: result.insertId });
};

// Eliminar un invitado de un evento
exports.remove = async (req, res) => {
  await pool.query(
    'DELETE FROM guests WHERE id = ? AND event_id = ?',
    [req.params.guestId, req.params.eventId]
  );
  res.json({ message: 'Invitado eliminado' });
};
