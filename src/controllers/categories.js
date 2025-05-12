const pool = require('../config/db');

// Listar todas las categorías
exports.getAll = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories');
  res.json(rows);
};

// Obtener categoría por ID
exports.getById = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Categoría no encontrada' });
  res.json(rows[0]);
};

// Crear categoría
exports.create = async (req, res) => {
  const { name, color } = req.body;
  const [result] = await pool.query(
    'INSERT INTO categories (name, color) VALUES (?,?)',
    [name, color]
  );
  res.status(201).json({ id: result.insertId });
};

// Actualizar categoría
exports.update = async (req, res) => {
  const { name, color } = req.body;
  await pool.query(
    'UPDATE categories SET name = ?, color = ? WHERE id = ?',
    [name, color, req.params.id]
  );
  res.json({ message: 'Categoría actualizada' });
};

// Eliminar categoría
exports.remove = async (req, res) => {
  await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
  res.json({ message: 'Categoría eliminada' });
};
