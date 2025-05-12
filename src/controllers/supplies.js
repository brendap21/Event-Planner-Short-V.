const pool = require('../config/db');

// Listar todos los insumos
exports.getAll = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM supplies');
  res.json(rows);
};

// Obtener un insumo por ID
exports.getById = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM supplies WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Insumo no encontrado' });
  res.json(rows[0]);
};

// Crear un insumo
exports.create = async (req, res) => {
  const { name, description, price, category } = req.body;
  const [result] = await pool.query(
    'INSERT INTO supplies (name, description, price, category) VALUES (?,?,?,?)',
    [name, description, price, category]
  );
  res.status(201).json({ id: result.insertId });
};

// Actualizar un insumo
exports.update = async (req, res) => {
  const { name, description, price, category } = req.body;
  await pool.query(
    'UPDATE supplies SET name = ?, description = ?, price = ?, category = ? WHERE id = ?',
    [name, description, price, category, req.params.id]
  );
  res.json({ message: 'Insumo actualizado' });
};

// Eliminar un insumo
exports.remove = async (req, res) => {
  await pool.query('DELETE FROM supplies WHERE id = ?', [req.params.id]);
  res.json({ message: 'Insumo eliminado' });
};
