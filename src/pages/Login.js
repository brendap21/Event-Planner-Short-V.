import React, { useState } from 'react';
import "../styles/Login.css";
import loginImage from '../assets/STARTIMAGE.jpg';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/firebaseConfig'; 
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate(); // Hook para redirección
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" />; // Si ya está autenticado, redirige a la página de inicio
  }

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Todos los campos son obligatorios');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        console.log('Inicio de sesión exitoso:', userCredential.user);
        alert('¡Inicio de sesión exitoso!');

        navigate('/'); // Redirige a la página de inicio después de iniciar sesión
      } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        setError('Credenciales incorrectas. Por favor verifica tu correo y contraseña.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="seccion_izquierda">
        <h1 className="presentacion__titulo">¡BIENVENIDO!</h1>
        <h2 className="presentacion_subtitulo">Ingresa tus credenciales para acceder a tu cuenta.</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <div className="container">
              <fieldset id="informacion_login">
                <legend>INICIO DE SESIÓN</legend>
                <div className="email">
                  <label htmlFor="email">CORREO ELECTRÓNICO:</label>
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
                  <div className="error" id="emailError"></div>
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
                    required
                  />
                  <div className="error" id="passwordError"></div>
                </div>
              </fieldset>
            </div>
            <div className="submitBtn">
              <button type="submit" id="submitBtn">INICIAR SESIÓN</button>
            </div>
          </form>
        </div>
        <div className="switch-auth">
          <label>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></label>
        </div>
      </div>

      <div className="login-right">
        <img src={loginImage} alt="Inicio de Sesión" />
      </div>
    </div>
  );
};

export default Login;
