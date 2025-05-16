import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { FaEdit, FaRandom, FaBirthdayCake, FaHome, FaMapMarkerAlt, FaPhone, FaUser, FaMale, FaFemale, FaTransgender, FaTimes, FaSave, FaEnvelope } from 'react-icons/fa';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-identicon-sprites';
import '../styles/Profile.css';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function mapGenderToDB(value) {
  if (value === "male") return "M";
  if (value === "female") return "F";
  if (value === "other") return "O";
  return value || null;
}

function renderGender(gender) {
  // Acepta tanto valores del frontend como los del backend
  if (gender === "male" || gender === "M") return "MUJER";
  if (gender === "female" || gender === "F") return "MUJER";
  if (gender === "other" || gender === "O") return "OTRO";
  return "—";
}

function getGenderIcon(gender) {
  if (gender === "male" || gender === "M") return <FaFemale />;
  if (gender === "female" || gender === "F") return <FaFemale />;
  if (gender === "other" || gender === "O") return <FaTransgender />;
  return null;
}

// Traduce de la base de datos a lo que espera el frontend
function mapGenderFromDB(value) {
  if (value === "M") return "male";
  if (value === "F") return "female";
  if (value === "O") return "other";
  return value || "";
}

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});

  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        setLoading(true);
        const token = await currentUser.getIdToken(true);
        const { data } = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(data);
        setEditedData(data);
      } catch (err) {
        console.error('Error al cargar perfil', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  if (loading || !userData) return <p>Cargando perfil...</p>;

  // --- HANDLERS ---
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedData(userData);
    setHasChanges(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('CHANGE', name, value); // 👈 checa aquí
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
    checkForChanges({ ...editedData, [name]: value });
  };

  const validateField = (name, value) => {
    let error = '';
    if (!value) {
      error = 'Este campo es obligatorio';
    } else {
      switch (name) {
        case 'phone':
          if (!/^\d{10}$/.test(value)) error = 'El número debe tener 10 dígitos';
          break;
        case 'postal_code':
          if (!/^\d{5}$/.test(value)) error = 'El código postal debe tener 5 dígitos';
          break;
        default:
          break;
      }
    }
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const checkForChanges = (newEditedData = editedData) => {
    const hasAnyChange = Object.keys(userData).some(key => newEditedData[key] !== userData[key]);
    setHasChanges(hasAnyChange);
  };

  const handleSaveClick = () => {
    if (hasChanges && Object.values(errors).every(error => !error)) {
      setShowModal(true);
    }
  };

  const handleModalConfirm = async () => {
    try {
      const token = await currentUser.getIdToken(true);

      // <-- MAPEA GÉNERO
      const dataToSend = {
        ...editedData,
        gender: mapGenderToDB(editedData.gender),
      };

      await api.put(`/users/${userData.id}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ¡OJO! Actualiza el userData local para reflejar el mapeo (para que se vea al instante)
      setUserData(prev => ({
        ...editedData,
        gender: mapGenderToDB(editedData.gender),
      }));

      setShowModal(false);
      setIsEditing(false);
      alert('Perfil actualizado');
    } catch (err) {
      console.error('Error al actualizar perfil', err);
      alert('No se pudo actualizar el perfil');
    }
  };

  const handleModalCancel = () => setShowModal(false);

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedData(userData);
    setHasChanges(false);
    setErrors({});
  };

  const generateRandomAvatar = async () => {
    const svg = createAvatar(style, { seed: Math.random().toString() });
    const dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`; // <- Esta línea asegura compatibilidad unicode

    setEditedData(prev => ({ ...prev, profile_image: dataUrl }));
    setUserData(prev => ({ ...prev, profile_image: dataUrl }));

    try {
      const token = await currentUser.getIdToken(true);
      await api.put(
        `/users/${userData.id}`,
        { ...userData, profile_image: dataUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Error actualizando avatar:', err);
      alert('No se pudo actualizar el avatar');
    }
  };

  const uploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('El tamaño de la imagen no debe exceder los 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        setEditedData(prev => ({ ...prev, profile_image: e.target.result }));
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'male':
      case 'M':
        return <><FaMale /> Hombre</>;
      case 'female':
      case 'F':
        return <><FaFemale /> Mujer</>;
      case 'other':
      case 'O':
        return <><FaTransgender /> Otro</>;
      default:
        return null;
    }
  };

  // --- RENDER ---
  return (
    <div>
      <h1 className="profile-title"><FaUser style={{ marginRight: '10px' }} />PERFIL</h1>
      <div className="profile-container">
        {/* Tu sección de imagen, avatar, random avatar, etc. NO SE TOCA */}
        <div className={`background ${isEditing ? 'edit-form' : ''}`}>
          <label className="profile-image">
            <input type="file" accept="image/*" className="hidden-file-input" onChange={uploadImage} />
            <img id="profile-image" src={editedData.profile_image || 'https://api.dicebear.com/7.x/adventurer/svg?seed=default'} alt="Foto de perfil" />
          </label>
          <button className="random-image-button" onClick={generateRandomAvatar}>
            <FaRandom />
          </button>
        </div>

        <div className="info-container">
          {isEditing ? (
            <div className="edit-form">
              {/* Encabezado EDITAR PERFIL centrado y con icono */}
              <div className="edit-profile-title-wrapper">
                <FaEdit className="edit-profile-icon" />
                <h2 className="edit-profile-title">EDITAR PERFIL</h2>
              </div>
              {/* EMAIL SOLO LECTURA, ANCHO COMPLETO */}
              <div className="grid-row">
                <div className="grid-column">
                  <label htmlFor="email" style={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
                    <FaEnvelope style={{ marginRight: "8px", fontSize: "1.15em" }} />
                    EMAIL:
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={userData.email}
                    readOnly
                    className="readonly-email"
                    tabIndex={-1}
                  />
                </div>
              </div>
              {/* NOMBRE Y APELLIDO */}
              <div className="grid-row">
                <div className="grid-column">
                  <label htmlFor="first_name">NOMBRE:</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    placeholder="Name"
                    value={editedData.first_name || ''}
                    onChange={handleChange}
                    required
                  />
                  {errors.first_name && <span className="error-message">{errors.first_name}</span>}
                </div>
                <div className="grid-column">
                  <label htmlFor="last_name">APELLIDO:</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    placeholder="LastName"
                    value={editedData.last_name || ''}
                    onChange={handleChange}
                    required
                  />
                  {errors.last_name && <span className="error-message">{errors.last_name}</span>}
                </div>
              </div>
              {/* FECHA DE NACIMIENTO Y TELÉFONO EN LA MISMA FILA */}
              <div className="grid-row">
                <div className="grid-column">
                  <label htmlFor="dob" style={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
                    <FaBirthdayCake style={{ marginRight: "8px", fontSize: "1.15em" }} />
                    FECHA DE NACIMIENTO:
                  </label>
                  <input
                    type="text"
                    id="dob"
                    name="dob"
                    value={formatDate(userData.dob)}
                    readOnly
                    className="readonly-date"
                    tabIndex={-1}
                  />
                </div>
                <div className="grid-column">
                  <label htmlFor="phone" style={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
                    <FaPhone style={{ marginRight: "8px", fontSize: "1.15em" }} />
                    NÚMERO DE TELÉFONO:
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Número de Teléfono"
                    value={editedData.phone || ""}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>
              {/* CALLE Y CIUDAD */}
              <div className="grid-row">
                <div className="grid-column">
                  <label htmlFor="street">CALLE:</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    placeholder="Calle"
                    value={editedData.street || ''}
                    onChange={handleChange}
                  />
                  {errors.street && <span className="error-message">{errors.street}</span>}
                </div>
                <div className="grid-column">
                  <label htmlFor="city">CIUDAD:</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Ciudad"
                    value={editedData.city || ''}
                    onChange={handleChange}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
              </div>
              {/* ESTADO Y CÓDIGO POSTAL */}
              <div className="grid-row">
                <div className="grid-column">
                  <label htmlFor="state">ESTADO:</label>
                  <select
                    id="state"
                    name="state"
                    value={editedData.state || ''}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona estado</option>
                    <option value="Aguascalientes">Aguascalientes</option>
                    <option value="Baja California">Baja California</option>
                    <option value="Baja California Sur">Baja California Sur</option>
                    <option value="Campeche">Campeche</option>
                    <option value="Chiapas">Chiapas</option>
                    <option value="Chihuahua">Chihuahua</option>
                    <option value="Ciudad de México">Ciudad de México</option>
                    <option value="Coahuila">Coahuila</option>
                    <option value="Colima">Colima</option>
                    <option value="Durango">Durango</option>
                    <option value="Estado de México">Estado de México</option>
                    <option value="Guanajuato">Guanajuato</option>
                    <option value="Guerrero">Guerrero</option>
                    <option value="Hidalgo">Hidalgo</option>
                    <option value="Jalisco">Jalisco</option>
                    <option value="Michoacán">Michoacán</option>
                    <option value="Morelos">Morelos</option>
                    <option value="Nayarit">Nayarit</option>
                    <option value="Nuevo León">Nuevo León</option>
                    <option value="Oaxaca">Oaxaca</option>
                    <option value="Puebla">Puebla</option>
                    <option value="Querétaro">Querétaro</option>
                    <option value="Quintana Roo">Quintana Roo</option>
                    <option value="San Luis Potosí">San Luis Potosí</option>
                    <option value="Sinaloa">Sinaloa</option>
                    <option value="Sonora">Sonora</option>
                    <option value="Tabasco">Tabasco</option>
                    <option value="Tamaulipas">Tamaulipas</option>
                    <option value="Tlaxcala">Tlaxcala</option>
                    <option value="Veracruz">Veracruz</option>
                    <option value="Yucatán">Yucatán</option>
                    <option value="Zacatecas">Zacatecas</option>
                  </select>
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
                <div className="grid-column">
                  <label htmlFor="postal_code">CÓDIGO POSTAL:</label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    placeholder="Código Postal"
                    value={editedData.postal_code || ''}
                    onChange={handleChange}
                  />
                  {errors.postal_code && <span className="error-message">{errors.postal_code}</span>}
                </div>
              </div>
              {/* GÉNERO */}
              <div className="grid-row gender-row">
                <div className="grid-column">
                  <label>GÉNERO:</label>
                  <div className="gender-options">
                    <div className="gender-option">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={editedData.gender === 'male'}
                        onChange={handleChange}
                      />
                      <label htmlFor="male">
                        <FaMale />
                      </label>
                    </div>
                    <div className="gender-option">
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        checked={editedData.gender === 'female'}
                        onChange={handleChange}
                      />
                      <label htmlFor="female">
                        <FaFemale />
                      </label>
                    </div>
                    <div className="gender-option">
                      <input
                        type="radio"
                        id="other"
                        name="gender"
                        value="other"
                        checked={editedData.gender === 'other'}
                        onChange={handleChange}
                      />
                      <label htmlFor="other">otro</label>
                    </div>
                  </div>
                </div>
              </div>
              {/* BOTONES */}
              <div className="button-row">
                <button
                  className="save-button"
                  onClick={handleSaveClick}
                  disabled={!hasChanges || Object.values(errors).some(error => error)}
                >
                  <FaSave /> GUARDAR CAMBIOS
                </button>
                <button
                  className="cancel-button"
                  onClick={handleCancelClick}
                >
                  <FaTimes /> CANCELAR
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="user-name">
                {userData.first_name?.toUpperCase() || ''}{' '}
                {userData.last_name?.toUpperCase() || ''}
              </h2>

              {/* Email */}
              <p className="profile-field">
                <FaEnvelope className="label-svg" />
                {userData.email}
              </p>

              {/* Fecha de nacimiento */}
              <p className="profile-field">
                <FaBirthdayCake className="label-svg" />
                {formatDate(userData.dob) || '—'}
              </p>

              {/* Dirección TODO EN UNA SOLA LÍNEA */}
              <p className="profile-field">
                <FaHome className="label-svg" />
                {userData.street ? `${userData.street}, ` : ''}
                {userData.city ? `${userData.city}, ` : ''}
                {userData.state ? `${userData.state}, ` : ''}
                {userData.postal_code ? `C.P. ${userData.postal_code}` : ''}
              </p>

              {/* Teléfono */}
              <p className="profile-field">
                <FaPhone className="label-svg" />
                {userData.phone || '—'}
              </p>

              {/* Género: icono + texto */}
              <p className="profile-field">
                {userData.gender ? (
                  <>
                    {getGenderIcon(userData.gender)}
                  </>
                ) : (
                  "—"
                )}
              </p>

              <button className="edit-button" onClick={handleEditClick}>
                <FaEdit /> EDITAR PERFIL
              </button>
            </>
          )}
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>¿Estás seguro de que quieres guardar los cambios?</h2>
                <button onClick={handleModalConfirm}>Confirmar</button>
                <button onClick={handleModalCancel}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
