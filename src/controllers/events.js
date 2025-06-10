// src/controllers/events.js
const pool = require('../config/db');

exports.create = async (req, res) => {
  try {
    const {
      title, category_id, event_date, event_time,
      owner_id, budget, description, max_guests
    } = req.body;

    // Validación de campos obligatorios
    if (!title || !category_id || !event_date || !owner_id) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: título, categoría, fecha de evento y titular.'
      });
    }

    // Puedes validar más campos aquí si lo deseas

    const [result] = await pool.query(
      `INSERT INTO events
      (title, category_id, event_date, event_time, owner_id, budget, description, max_guests)
      VALUES (?,?,?,?,?,?,?,?)`,
      [
        title,
        category_id,
        event_date,
        event_time || null,
        owner_id,
        budget || 0,
        description || '',
        max_guests || null
      ]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Error al crear evento:', err);
    res.status(500).json({ error: 'Error en servidor al crear evento.' });
  }
};

// Traer todos los eventos (ejemplo básico)
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE status = "active"');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener eventos.' });
  }
};

// Traer eventos archivados
exports.getArchived = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE status = "archived"');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener archivados.' });
  }
};

// Traer un evento por ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Evento no encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el evento.' });
  }
};

// Actualizar evento
exports.update = async (req, res) => {
  try {
    const { title, category_id, event_date, event_time, budget, description, max_guests } = req.body;
    await pool.query(
      `UPDATE events SET title=?, category_id=?, event_date=?, event_time=?, budget=?, description=?, max_guests=?
       WHERE id=?`,
      [title, category_id, event_date, event_time, budget, description, max_guests, req.params.id]
    );
    res.json({ message: 'Evento actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar evento.' });
  }
};

// Eliminar evento
exports.remove = async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Evento eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar evento.' });
  }
};

// Archivar evento
exports.archive = async (req, res) => {
  try {
    await pool.query('UPDATE events SET status="archived" WHERE id=?', [req.params.id]);
    res.json({ message: 'Evento archivado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al archivar evento.' });
  }
};

// Desarchivar evento
exports.unarchive = async (req, res) => {
  try {
    await pool.query('UPDATE events SET status="active" WHERE id=?', [req.params.id]);
    res.json({ message: 'Evento desarchivado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al desarchivar evento.' });
  }
};