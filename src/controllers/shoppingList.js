const pool = require('../config/db');

// Listar lista de compras de un evento
exports.getAll = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT sl.id, s.name, s.price, sl.quantity, sl.purchased
     FROM shopping_list sl
     JOIN supplies s ON sl.supply_id = s.id
     WHERE sl.event_id = ?`,
    [req.params.eventId]
  );
  res.json(rows);
};

// Agregar ítem a la lista de compras
exports.create = async (req, res) => {
  const { supply_id, quantity } = req.body;
  const [result] = await pool.query(
    'INSERT INTO shopping_list (event_id, supply_id, quantity, purchased) VALUES (?,?,?,?)',
    [req.params.eventId, supply_id, quantity, 0]
  );
  res.status(201).json({ id: result.insertId });
};

// Actualizar ítem de la lista
exports.update = async (req, res) => {
  const { purchased, quantity } = req.body;
  await pool.query(
    'UPDATE shopping_list SET purchased = ?, quantity = ? WHERE id = ? AND event_id = ?',
    [purchased, quantity, req.params.id, req.params.eventId]
  );
  res.json({ message: 'Ítem de compra actualizado' });
};

// Eliminar ítem de la lista
exports.remove = async (req, res) => {
  await pool.query(
    'DELETE FROM shopping_list WHERE id = ? AND event_id = ?',
    [req.params.id, req.params.eventId]
  );
  res.json({ message: 'Ítem de compra eliminado' });
};
