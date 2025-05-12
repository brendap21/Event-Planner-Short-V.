const pool = require('../config/db');

// Listar todos los mensajes de contacto
exports.getAll = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM contacts ORDER BY sent_at DESC');
  res.json(rows);
};

// Crear un nuevo mensaje de contacto
exports.create = async (req, res) => {
  const { name, email, message } = req.body;
  const [result] = await pool.query(
    'INSERT INTO contacts (name, email, message) VALUES (?,?,?)',
    [name, email, message]
  );
  res.status(201).json({ id: result.insertId });
};

// Eliminar un mensaje de contacto
exports.remove = async (req, res) => {
  await pool.query('DELETE FROM contacts WHERE id = ?', [req.params.id]);
  res.json({ message: 'Mensaje eliminado' });
};
