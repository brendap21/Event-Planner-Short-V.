import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';
import logo from "../assets/EVENTPLANER-40X40WHITE.png";
import { MdEventAvailable } from "react-icons/md";
import { MdEventBusy } from "react-icons/md";
import { ClipboardList } from "lucide-react";
import { Bell } from "lucide-react";

// Iconos de react-icons
import { FaCalendarAlt, FaRegCalendarAlt, FaUserAlt, FaSignOutAlt, FaHome, FaPlus, FaArchive } from 'react-icons/fa';

const Navbar = () => {
  const { currentUser } = useAuth();
  const auth = getAuth();
  const notificationRef = useRef(null);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      alert('Sesión cerrada con éxito');
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  };

  // Estado para controlar la visibilidad del dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notifications = []; // Replace with actual notifications

  // Funciones para abrir y cerrar el dropdown
  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  // Cerrar el menú de notificaciones al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className={`navbar__logo ${activeLink === '/' ? 'active' : ''}`}>
          <img src={logo} alt="EventPlanner+ Logo" />
        </Link>
        <ul className="navbar__links">
          <li>
            <Link to="/" className={`navbar__link ${activeLink === '/' ? 'active' : ''}`}>
              <FaHome className="icon" /> INICIO
            </Link>
          </li>
          {currentUser && (
            <>
              <li
                className="navbar__dropdown"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className={`navbar__link ${activeLink.startsWith('/events') || activeLink === '/create-event' || activeLink === '/archived-events' ? 'active' : ''}`}>
                  <MdEventAvailable className="icon" /> EVENTOS
                </span>
                {isDropdownOpen && (
                  <ul className="navbar__dropdown-menu">
                    <li>
                      <Link to="/events" className={`navbar__link ${activeLink === '/events' ? 'active' : ''}`}>
                        <MdEventAvailable className="icon" /> MIS EVENTOS
                      </Link>
                    </li>
                    <li>
                      <Link to="/create-event" className={`navbar__link ${activeLink === '/create-event' ? 'active' : ''}`}>
                        <FaPlus className="icon" /> CREAR EVENTO
                      </Link>
                    </li>
                    <li>
                      <Link to="/archived-events" className={`navbar__link ${activeLink === '/archived-events' ? 'active' : ''}`}>
                        <MdEventBusy className="icon" /> EVENTOS ARCHIVADOS
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              {/* Link de calendario */}
              <li>
                <Link to="/calendar" className={`navbar__link ${activeLink === '/calendar' ? 'active' : ''}`}>
                  <FaRegCalendarAlt className="icon" /> CALENDARIO
                </Link>
              </li>
              {/* Link de perfil */}
              <li>
                <Link to="/profile" className={`navbar__link ${activeLink === '/profile' ? 'active' : ''}`}>
                  <FaUserAlt className="icon" /> PERFIL
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="navbar__auth">
        {currentUser && (
          <div
            className="navbar__dropdown"
            ref={notificationRef}
            onMouseLeave={() => setIsNotificationOpen(false)}
          >
            <button
              className="auth-button notifications"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell className="icon" />
              {notifications.length > 0 && (
                <span className="notification-count">{notifications.length}</span>
              )}
            </button>
            {isNotificationOpen && (
              <ul className="navbar__dropdown-menu show-notifications">
                {notifications.length === 0 ? (
                  <li className="no-notifications">No hay notificaciones actualmente</li>
                ) : (
                  notifications.map((notification, index) => (
                    <li key={index} className="notification-item">{notification}</li>
                  ))
                )}
              </ul>
            )}
          </div>
        )}
        {!currentUser ? (
          <>
            <Link to="/login" className="auth-button">INICIAR SESIÓN</Link>
            <Link to="/register" className="auth-button">REGISTRARSE</Link>
          </>
        ) : (
          <button className="auth-button logout" onClick={handleLogout}>
            <FaSignOutAlt className="icon" /> CERRAR SESIÓN
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
