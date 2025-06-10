const pool = require('../config/db');

// Listar todos los usuarios
exports.getAll = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users');
  res.json(rows);
};

// Obtener o crear el perfil del usuario autenticado
exports.getMe = async (req, res) => {
  try {
    const firebase_uid = req.user.uid; // del token verificado
    const [rows] = await pool.query('SELECT * FROM users WHERE firebase_uid = ?', [firebase_uid]);
    if (!rows.length) {
      // Si no existe, responde 404 (NO crear nada aquí, el registro ya lo hizo el POST /users)
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el perfil de usuario' });
  }
};

// Actualizar perfil
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      first_name, last_name, phone, gender,
      street, city, state, postal_code, profile_image, dob
    } = req.body;
    await pool.query(
      `UPDATE users SET
        first_name=?, last_name=?, phone=?, gender=?,
        street=?, city=?, state=?, postal_code=?, profile_image=?, dob=?
      WHERE id=?`,
      [first_name, last_name, phone, gender, street, city, state, postal_code, profile_image, dob, id]
    );
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando perfil' });
  }
};


// Obtener un usuario por ID
exports.getById = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(rows[0]);
};

// Crear un usuario
exports.create = async (req, res) => {
  try {
    console.log('BODY RECIBIDO EN /users:', req.body);
    const {
      firebase_uid, first_name, last_name, email,
      dob, phone, gender, street, city, state,
      postal_code, profile_image
    } = req.body;

    // Checa si ya existe por UID o email
    const [exists] = await pool.query(
      `SELECT id FROM users WHERE firebase_uid = ? OR email = ?`, [firebase_uid, email]
    );
    if (exists.length > 0) {
      return res.status(400).json({ error: 'Usuario ya existe.' });
    }

    const [result] = await pool.query(
      `INSERT INTO users (firebase_uid, first_name, last_name, email, dob, phone, gender, street, city, state, postal_code, profile_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firebase_uid, first_name, last_name, email, dob, phone, gender, street, city, state, postal_code, profile_image]
    );

    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json(user[0]);
  } catch (err) {
    console.error('Error en create:', err);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};


// Eliminar un usuario
exports.remove = async (req, res) => {
  await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ message: 'Usuario eliminado' });
};
