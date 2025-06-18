const pool = require('../config/db');

// Listar todos los usuarios
exports.getAll = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users');
  res.json(rows);
};

exports.getMe = async (req, res) => {
  try {
    console.log("🟣 req.user:", req.user); // <-- Asegúrate de que exista
    const firebase_uid = req.user?.uid;
    if (!firebase_uid) return res.status(401).json({ error: 'Token inválido o no enviado' });

    const [rows] = await pool.query('SELECT * FROM users WHERE firebase_uid = ?', [firebase_uid]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('🔴 Error al obtener el perfil de usuario:', err);
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

    const formattedDOB = dob ? dob.split('T')[0] : null;

    await pool.query(
      `UPDATE users SET
        first_name=?, last_name=?, phone=?, gender=?,
        street=?, city=?, state=?, postal_code=?, profile_image=?, dob=?
      WHERE id=?`,
      [
        first_name || '', last_name || '', phone || '', gender || '',
        street || '', city || '', state || '', postal_code || '', profile_image || '', formattedDOB, id
      ]
    );

    console.log('🟡 req.body:', req.body);
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    console.error('❌ Error actualizando perfil:', err);
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

    const formattedDOB = dob ? dob.split('T')[0] : null;

    const [exists] = await pool.query(
      `SELECT id FROM users WHERE firebase_uid = ? OR email = ?`, [firebase_uid, email]
    );
    if (exists.length > 0) {
      return res.status(400).json({ error: 'Usuario ya existe.' });
    }

    const [result] = await pool.query(
      `INSERT INTO users (firebase_uid, first_name, last_name, email, dob, phone, gender, street, city, state, postal_code, profile_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firebase_uid, first_name, last_name, email, formattedDOB, phone, gender, street, city, state, postal_code, profile_image]
    );

    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json(user[0]);
  } catch (err) {
    console.error('❌ Error en create:', err);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

// Eliminar un usuario
exports.remove = async (req, res) => {
  await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ message: 'Usuario eliminado' });
};
