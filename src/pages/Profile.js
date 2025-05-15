import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { FaEdit, FaRandom, FaBirthdayCake, FaHome, FaMapMarkerAlt, FaPhone, FaUser, FaMale, FaFemale, FaTransgender, FaTimes, FaSave } from 'react-icons/fa'; // Import additional icons
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-identicon-sprites';
import '../styles/Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [hasChanges, setHasChanges] = useState(false); // Estado para verificar si hay cambios
  const [errors, setErrors] = useState({}); // Estado para los mensajes de error

  // Obtén currentUser del contexto
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    (async () => {
      try {
        setLoading(true);
        // Fuerza refresh si lo necesitas (token no expirado)
        const token = await currentUser.getIdToken(/* forceRefresh= */ true);
        const { data } = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(data);
      } catch (err) {
        console.error('Error al cargar perfil', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  if (loading || !userData) return <p>Cargando perfil...</p>;

  const handleEditClick = () => {
    setIsEditing(true); // Cambia a modo de edición
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setEditedData(prevData => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value
        }
      }));
    } else {
      setEditedData({
        ...editedData,
        [name]: value
      });
    }
    validateField(name, value); // Validar el campo en tiempo real
    checkForChanges(); // Verificar si hay cambios
  };

  const validateField = (name, value) => {
    let error = '';
    if (!value) {
      error = 'Este campo es obligatorio';
    } else {
      switch (name) {
        case 'phoneNumber':
          if (!/^\d{10}$/.test(value)) {
            error = 'El número de teléfono debe tener 10 dígitos';
          }
          break;
        case 'address.postalCode':
          if (!/^\d{5}$/.test(value)) {
            error = 'El código postal debe tener 5 dígitos';
          }
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

  const checkForChanges = () => {
    const hasChanges = Object.keys(editedData).some(key => {
      if (typeof editedData[key] === 'object') {
        return Object.keys(editedData[key]).some(subKey => editedData[key][subKey] !== userData[key][subKey]);
      }
      return editedData[key] !== userData[key];
    });
    setHasChanges(hasChanges);
  };

  const handleSaveClick = () => {
    if (hasChanges && Object.values(errors).every(error => !error)) {
      setShowModal(true); // Muestra el modal de confirmación
    }
  };

  const handleModalConfirm = async () => {
    try {
      const token = await currentUser.getIdToken(/* true para forzar refresh si quieres */);
      const { data } = await api.put(`/users/${userData.id}`, { profilePicture: dataUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(data);
      setShowModal(false);
      setIsEditing(false);
      alert('Perfil actualizado');
    } catch (err) {
      console.error('Error al actualizar perfil', err);
      alert('No se pudo actualizar el perfil');
    }
  };

  const handleModalCancel = () => {
    setShowModal(false); // Cierra el modal sin hacer cambios
  };

  const handleCancelClick = () => {
    setIsEditing(false); // Exit edit mode
    setEditedData(userData); // Reset edited data to original user data
    setHasChanges(false); // Reset changes flag
    setErrors({}); // Reset errors
  };

  const generateRandomAvatar = async () => {
    const svg = createAvatar(style, { seed: Math.random().toString() });
    const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;

    // 1) Actualizar preview
    setEditedData(prev => ({ ...prev, profilePicture: dataUrl }));

    // 2) Guardar en MySQL
    const token = await currentUser.getIdToken(true);
    try {
      const { data } = await api.put(
        `/users/${userData.id}`,
        { profilePicture: dataUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(data);
      alert('Avatar guardado correctamente');
    } catch (err) {
      console.error('Error actualizando avatar:', err);
      alert('No se pudo guardar el avatar');
    }
  };


  const uploadImage = (event) => {

    const file = event.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Check if file size exceeds 5MB
        alert('El tamaño de la imagen no debe exceder los 5MB.');
        return;
      }

      const reader = new FileReader();

      reader.onload = async (e) => {
        const result = e.target.result;
        setEditedData(prevData => ({
          ...prevData,
          profilePicture: result
        }));
        const dataUrl = e.target.result;
        try {
          const token = await currentUser.getIdToken(/* true para forzar refresh si quieres */);
          const { data } = await api.put(`/users/${userData.id}`, { profilePicture: dataUrl }, { headers: { Authorization: `Bearer ${token}` } }
          );
          setUserData(prev => ({
            ...prev,
            profilePicture: data.profilePicture
          }));
          alert('Imagen actualizada');
        } catch (err) {
          console.error('Error al actualizar imagen', err);
          alert('No se pudo actualizar la imagen');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'male':
        return <FaMale />;
      case 'female':
        return <FaFemale />;
      case 'other':
        return <FaTransgender />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="profile-title"><FaUser style={{ marginRight: '10px' }} />PERFIL</h1>
      <div className="profile-container">
        <div className={`background ${isEditing ? 'edit-form' : ''}`}>
          <label className="profile-image">
            <input type="file" accept="image/*" className="hidden-file-input" onChange={uploadImage} />
            <img id="profile-image" src={editedData.profilePicture || 'https://api.dicebear.com/7.x/adventurer/svg?seed=default'} alt="Foto de perfil" />
          </label>
          <button className="random-image-button" onClick={generateRandomAvatar}>
            <FaRandom />
          </button>
        </div>
        <div className="info-container">
          {isEditing ? (
            <div className="edit-form">
              <h2>EDITAR PERFIL</h2>
              <div className="grid-row">
                <div className="grid-column">
                  <label htmlFor="name">NOMBRE:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={editedData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="grid-column">
                  <label htmlFor="lastname">APELLIDO:</label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder="LastName"
                    value={editedData.lastname}
                    onChange={handleChange}
                    required
                  />
                  {errors.lastname && <span className="error-message">{errors.lastname}</span>}
                </div>
              </div>

              <div className="grid-row">
                <div className="grid-column">
                  <label htmlFor="birthDate"><FaBirthdayCake /> FECHA DE NACIMIENTO:</label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    placeholder="mm/dd/aaaa"
                    value={editedData.birthDate}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="grid-column">
                  <label htmlFor="phoneNumber"><FaPhone /> NÚMERO DE TELÉFONO:</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Número de Teléfono"
                    value={editedData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                  {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                </div>
              </div>

              <div className="grid-row">
                <div className="grid-column">
                  <label htmlFor="address.street">CALLE:</label>
                  <input
                    type="text"
                    id="address.street"
                    name="address.street"
                    placeholder="Calle"
                    value={editedData.address.street}
                    onChange={handleChange}
                  />
                  {errors['address.street'] && <span className="error-message">{errors['address.street']}</span>}
                </div>
                <div className="grid-column">
                  <label htmlFor="address.city">CIUDAD:</label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    placeholder="Ciudad"
                    value={editedData.address.city}
                    onChange={handleChange}
                  />
                  {errors['address.city'] && <span className="error-message">{errors['address.city']}</span>}
                </div>
              </div>

              <div className="grid-row">
                <div className="grid-column">
                  <label htmlFor="address.state">ESTADO:</label>
                  <select
                    id="address.state"
                    name="address.state"
                    value={editedData.address.state}
                    onChange={handleChange}
                    required
                  >
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
                  {errors['address.state'] && <span className="error-message">{errors['address.state']}</span>}
                </div>
                <div className="grid-column">
                  <label htmlFor="address.postalCode">CÓDIGO POSTAL:</label>
                  <input
                    type="text"
                    id="address.postalCode"
                    name="address.postalCode"
                    placeholder="Código Postal"
                    value={editedData.address.postalCode}
                    onChange={handleChange}
                  />
                  {errors['address.postalCode'] && <span className="error-message">{errors['address.postalCode']}</span>}
                </div>
              </div>

              <div className="grid-row gender-row">
                <div className="grid-column">
                  <label>GÉNERO:</label>
                  <div className="gender-options">
                    <div className="gender-option">
                      <input
                        type="radio"
                        id="male"
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

              <div className="button-row">
                <button
                  className="save-button"
                  onClick={handleSaveClick}
                  disabled={!hasChanges || Object.values(errors).some(error => error)} // Disable button if no changes or errors
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
            </div>)
            : (
              <>
                <h2 className="user-name">
                  {userData.first_name?.toUpperCase() || ''}{' '}
                  {userData.last_name?.toUpperCase() || ''}
                </h2>

                {/* Gender */}
                <p className="gender">
                  {getGenderIcon(userData.gender)}
                  {userData.gender ? ` ${userData.gender.toUpperCase()}` : ''}
                </p>

                {/* Birth date */}
                <p className="birth-date">
                  <FaBirthdayCake />
                  {userData.birthDate || '—'}
                </p>

                {/* Address */}
                <p className="address">
                  <FaHome /> {userData.address.street || '—'}<br />
                  {userData.address.city || '—'}
                </p>
                <p className="postal-code">
                  <FaMapMarkerAlt />
                  C.P. {userData.address.postalCode || '—'} – {userData.address.state || '—'}
                </p>

                {/* Phone */}
                <p className="phone-number">
                  <FaPhone />
                  {userData.phoneNumber || '—'}
                </p>

                {/* Avatar */}
                <img
                  id="profile-image"
                  src={userData.profilePicture || 'https://api.dicebear.com/7.x/adventurer/svg?seed=default'}
                  alt="Foto de perfil"
                />

                <button className="edit-button" onClick={handleEditClick}>
                  <FaEdit /> EDITAR PERFIL
                </button>
              </>
            )}
        </div>
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
  );
};

export default Profile;
