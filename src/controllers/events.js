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
