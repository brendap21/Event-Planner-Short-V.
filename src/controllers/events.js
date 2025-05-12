const pool = require('../config/db');

// Listar eventos (opcionalmente filtrados por status)
exports.getAll = async (req, res) => {
  const { status } = req.query;
  const sql = status
    ? 'SELECT * FROM events WHERE status = ? ORDER BY created_at DESC'
    : 'SELECT * FROM events ORDER BY created_at DESC';
  const params = status ? [status] : [];
  const [rows] = await pool.query(sql, params);
  res.json(rows);
};

// Listar solo eventos archivados
exports.getArchived = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM events WHERE status = "archived" ORDER BY event_date DESC'
  );
  res.json(rows);
};

// Obtener un evento por ID
exports.getById = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Evento no encontrado' });
  res.json(rows[0]);
};

// Crear un nuevo evento
exports.create = async (req, res) => {
  const {
    title, category_id, status = 'active',
    event_date, event_time, owner_id,
    budget, description, max_guests
  } = req.body;

  const [result] = await pool.query(
    `INSERT INTO events
      (title, category_id, status, event_date, event_time,
       owner_id, budget, description, max_guests)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [
      title, category_id, status, event_date, event_time,
      owner_id, budget, description, max_guests
    ]
  );

  res.status(201).json({ id: result.insertId });
};

// Actualizar un evento existente
exports.update = async (req, res) => {
  const {
    title, category_id, status,
    event_date, event_time, budget,
    description, max_guests
  } = req.body;

  await pool.query(
    `UPDATE events SET
       title = ?, category_id = ?, status = ?,
       event_date = ?, event_time = ?,
       budget = ?, description = ?, max_guests = ?
     WHERE id = ?`,
    [
      title, category_id, status,
      event_date, event_time,
      budget, description, max_guests,
      req.params.id
    ]
  );

  res.json({ message: 'Evento actualizado' });
};

// Eliminar un evento
exports.remove = async (req, res) => {
  await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
  res.json({ message: 'Evento eliminado' });
};

// Archivar un evento
exports.archive = async (req, res) => {
  await pool.query('UPDATE events SET status = "archived" WHERE id = ?', [req.params.id]);
  res.json({ message: 'Evento archivado' });
};

// Desarchivar un evento
exports.unarchive = async (req, res) => {
  await pool.query('UPDATE events SET status = "active" WHERE id = ?', [req.params.id]);
  res.json({ message: 'Evento desarchivado' });
};
