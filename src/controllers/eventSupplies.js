const pool = require('../config/db');

// Listar insumos asignados a un evento
exports.getAll = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT es.id, s.name, s.description, s.price, es.quantity
     FROM event_supplies es
     JOIN supplies s ON es.supply_id = s.id
     WHERE es.event_id = ?`,
    [req.params.eventId]
  );
  res.json(rows);
};

// Agregar insumo a un evento
exports.create = async (req, res) => {
  const { supply_id, quantity } = req.body;
  const [result] = await pool.query(
    'INSERT INTO event_supplies (event_id, supply_id, quantity) VALUES (?,?,?)',
    [req.params.eventId, supply_id, quantity]
  );
  res.status(201).json({ id: result.insertId });
};

// Actualizar cantidad de insumo en evento
exports.update = async (req, res) => {
  const { quantity } = req.body;
  await pool.query(
    'UPDATE event_supplies SET quantity = ? WHERE id = ? AND event_id = ?',
    [quantity, req.params.id, req.params.eventId]
  );
  res.json({ message: 'Cantidad actualizada' });
};

// Eliminar insumo de un evento
exports.remove = async (req, res) => {
  await pool.query(
    'DELETE FROM event_supplies WHERE id = ? AND event_id = ?',
    [req.params.id, req.params.eventId]
  );
  res.json({ message: 'Insumo removido del evento' });
};
