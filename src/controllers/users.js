const pool = require('../config/db');

// Listar todos los usuarios
exports.getAll = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users');
  res.json(rows);
};

exports.getMe = async (req, res) => {
  const uid = req.user.uid;
  const email = req.user.email;

  // 1) Intentar leer al usuario
  let [rows] = await pool.query(
    `SELECT id, firebase_uid, first_name, last_name, email,
            dob, phone, gender,
            street, city, state, postal_code,
            user_type, profile_image
     FROM users
     WHERE firebase_uid = ?`,
    [uid]
  );

  // 2) Si no existe, crearlo con nombres vacíos
  if (!rows.length) {
    const [r] = await pool.query(
      `INSERT INTO users
         (firebase_uid, email, first_name, last_name)
       VALUES (?,?,?,?)`,
      [uid, email, '', '']
    );
    [rows] = await pool.query(
      `SELECT id, firebase_uid, first_name, last_name, email,
              dob, phone, gender,
              street, city, state, postal_code,
              user_type, profile_image
       FROM users
       WHERE id = ?`,
      [r.insertId]
    );
  }

  const u = rows[0];
  // 3) Normalizar nombres de campo y anidar address
  const profile = {
    id: u.id,
    firebase_uid: u.firebase_uid,
    first_name: u.first_name,            // cadena (vacía si no la has editado aún)
    last_name: u.last_name,
    email: u.email,
    birthDate: u.dob ? u.dob.toISOString().substr(0, 10) : null,
    phoneNumber: u.phone || '',
    gender: u.gender || '',
    address: {
      street: u.street || '',
      city: u.city || '',
      state: u.state || '',
      postalCode: u.postal_code || ''
    },
    user_type: u.user_type,
    profilePicture: u.profile_image || '',
    created_at: u.created_at
  };

  res.json(profile);
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

  if (req.body.profilePicture !== undefined) {
    fields.push('profile_image = ?');
    values.push(req.body.profilePicture);
  }

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
