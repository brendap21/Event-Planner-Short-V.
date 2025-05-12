const pool = require('../config/db');

// Listar todos los usuarios
exports.getAll = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users');
  res.json(rows);
};

// Obtener un usuario por ID
exports.getById = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(rows[0]);
};

// Crear un usuario
exports.create = async (req, res) => {
  const {
    first_name, last_name, email, password_hash,
    dob, phone, gender, street, city, state,
    postal_code, user_type, profile_image
  } = req.body;

  const [result] = await pool.query(
    `INSERT INTO users
      (first_name, last_name, email, password_hash, dob,
       phone, gender, street, city, state,
       postal_code, user_type, profile_image)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      first_name, last_name, email, password_hash,
      dob, phone, gender, street, city, state,
      postal_code, user_type, profile_image
    ]
  );

  res.status(201).json({ id: result.insertId });
};

// Actualizar un usuario
exports.update = async (req, res) => {
  const {
    first_name, last_name, phone, gender,
    street, city, state, postal_code, profile_image
  } = req.body;

  await pool.query(
    `UPDATE users SET
       first_name = ?, last_name = ?, phone = ?, gender = ?,
       street = ?, city = ?, state = ?, postal_code = ?, profile_image = ?
     WHERE id = ?`,
    [
      first_name, last_name, phone, gender,
      street, city, state, postal_code, profile_image,
      req.params.id
    ]
  );

  res.json({ message: 'Usuario actualizado' });
};

// Eliminar un usuario
exports.remove = async (req, res) => {
  await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ message: 'Usuario eliminado' });
};
