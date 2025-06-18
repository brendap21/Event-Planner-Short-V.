import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import "../styles/Register.css";
import { Link, useNavigate } from 'react-router-dom';
import registerImage from '../assets/REGISTERIMAGE.jpg';
import { FaRandom, FaMale, FaFemale, FaBirthdayCake, FaPhone } from 'react-icons/fa';
import api from '../api';

const diceBearStyle = 'identicon';
const getAvatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/${diceBearStyle}/svg?seed=${encodeURIComponent(seed || 'avatar')}`;

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const Register = () => {
  const navigate = useNavigate();
  const { currentUser, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: getAvatarUrl('default'), // <- Esto
    phoneNumber: '',
    birthDate: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: ''
    }
  });

  const [error, setError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [registering, setRegistering] = useState(false);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const generateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2);
    setFormData(prevFormData => ({
      ...prevFormData,
      profilePicture: getAvatarUrl(randomSeed)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
      if (name.includes('address.')) {
        const addressField = name.split('.')[1];
        return {
          ...prevFormData,
          address: {
            ...prevFormData.address,
            [addressField]: value
          }
        };
      } else {
        return {
          ...prevFormData,
          [name]: value
        };
      }
    });

    if (name === 'birthDate') {
      validateBirthDate(value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setError('Por favor, selecciona un archivo de imagen válido.');
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.lastname || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Todos los campos son obligatorios');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setIsEmailValid(false);
      setError('Por favor ingresa un correo electrónico válido');
      return false;
    } else {
      setIsEmailValid(true);
    }
    setError('');
    return true;
  };

  const validateBirthDate = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      setError('Debes tener al menos 18 años para registrarte.');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error || registering) return;
    if (!validateForm()) return;

    setRegistering(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      // Autorización con token de Firebase
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      // Registro en tu backend con los datos del usuario
      await api.post('/users', {
        firebase_uid: user.uid,
        first_name: formData.name,
        last_name: formData.lastname,
        email: formData.email,
        dob: formData.birthDate,
        phone: formData.phoneNumber,
        gender: formData.gender,
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        postal_code: formData.address.postalCode,
        profile_image: formData.profilePicture || getAvatarUrl(formData.email || formData.name || 'avatar')
      });

      setSuccessMessage('¡Registro exitoso! Bienvenido a EventPlanner+.');
      setTimeout(() => navigate('/'), 1500);
      setFormData({}); // limpia campos
      setError('');
    } catch (err) {
      console.error('Error al registrar el usuario:', err);
      setError('Hubo un problema al registrar tu cuenta. Inténtalo nuevamente.');
    } finally {
      setRegistering(false);
    }
  };


  const handleImageClick = () => {
    document.getElementById('profilePicture').click();
  };

  return (
    <div className="register-container">
      <div className="form-section">
        <h1 className="presentacion__titulo">¡REGÍSTRATE!</h1>
        <h2 className="presentacion_subtitulo">
          Ingresa los campos solicitados para crear una cuenta.
        </h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="register-left">
          <form onSubmit={handleSubmit}>
            <div className="container">
              <fieldset id="informacion_usuario">
                <legend>INFORMACIÓN DEL USUARIO</legend>
                <div className="grid-row">
                  <div className="grid-column">
                    <label>FOTO DE PERFIL:</label>
                    <div className="profile-picture-row" style={{ alignItems: 'center' }}>
                      <div
                        className="profile-picture-container"
                        onClick={handleImageClick}
                        style={{
                          backgroundImage: `url('${formData.profilePicture}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat"
                        }}
                      >
                        <input
                          type="file"
                          id="profilePicture"
                          name="profilePicture"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={generateRandomAvatar}
                        className="random-avatar-button"
                        tabIndex={-1}
                      >
                        <FaRandom />
                      </button>
                    </div>
                  </div>
                  <div className="grid-column">
                    <label>GÉNERO:</label>
                    <div className="gender-options">
                      <div className="gender-option">
                        <input
                          type="radio"
                          id="male"
                          name="gender"
                          value="M"
                          checked={formData.gender === 'M'}
                          onChange={handleChange}
                          required
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
                          value="F"
                          checked={formData.gender === 'F'}
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
                          value="O"
                          checked={formData.gender === 'O'}
                          onChange={handleChange}
                        />
                        <label htmlFor="other">otro</label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ...El resto de tu formulario queda IGUAL... */}
                <div className="grid-row">
                  <div className="grid-column">
                    <label htmlFor="name">NOMBRE:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid-column">
                    <label htmlFor="lastname">APELLIDO:</label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      placeholder="LastName"
                      value={formData.lastname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid-row">
                  <div className="grid-column">
                    <label htmlFor="dob">
                      <FaBirthdayCake style={{ marginRight: "8px", fontSize: "1.15em", verticalAlign: "middle" }} />
                      FECHA DE NACIMIENTO:
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid-column">
                    <label htmlFor="phone">
                      <FaPhone style={{ marginRight: "8px", fontSize: "1.15em", verticalAlign: "middle" }} />
                      NÚMERO DE TELÉFONO:
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Número de Teléfono"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
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
                      value={formData.address.street}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid-column">
                    <label htmlFor="address.city">CIUDAD:</label>
                    <input
                      type="text"
                      id="address.city"
                      name="address.city"
                      placeholder="Ciudad"
                      value={formData.address.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid-row">
                  <div className="grid-column">
                    <label htmlFor="address.state">ESTADO:</label>
                    <select
                      id="address.state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona estado</option>
                      {/* ...Los estados como antes... */}
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
                  </div>
                  <div className="grid-column">
                    <label htmlFor="address.postalCode">CÓDIGO POSTAL:</label>
                    <input
                      type="text"
                      id="address.postalCode"
                      name="address.postalCode"
                      placeholder="Código Postal"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="formContainerAccount">
              <div className="container">
                <fieldset id="informacion_cuenta">
                  <legend>INFORMACIÓN DE LA CUENTA</legend>
                  <div className="email">
                    <label htmlFor="email" className={!isEmailValid ? 'error-label' : ''}>
                      CORREO ELECTRÓNICO:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={!isEmailValid ? 'error-input' : ''}
                      required
                    />
                  </div>
                  <div className="password">
                    <label htmlFor="password">CONTRASEÑA:</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="********"
                      value={formData.password}
                      onChange={handleChange}
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"
                      title="La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula y un número"
                      required
                    />
                  </div>
                  <div className="confirm_password">
                    <label htmlFor="confirmPassword">CONFIRMAR CONTRASEÑA:</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="********"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </fieldset>
              </div>
              <div className="submitBtn">
                <button type="submit" id="submitBtn" disabled={registering}>
                  {registering ? "Registrando..." : "REGISTRARSE"}
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="switch-auth">
          <label>
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </label>
        </div>
      </div>
      <div className="register-right">
        <img src={registerImage} alt="Registro" />
      </div>
    </div>
  );
};

export default Register;
