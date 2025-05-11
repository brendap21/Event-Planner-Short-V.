import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Footer.css';
import logo from '../assets/EVENTPLANNERLETRASWHITE.png'; // Importamos la imagen

const Footer = () => {
  const location = useLocation();

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__logo">
          <img src={logo} alt="EventPlanner+" className="footer__logo-img" /> {/* Mostramos la imagen */}
        </div>
        <div className="footer__links">
          <a href="/about" className={`footer__link ${location.pathname === '/about' ? 'active' : ''}`}>ACERCA DE</a>
          <a href="/contact" className={`footer__link ${location.pathname === '/contact' ? 'active' : ''}`}>CONTACTO</a>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} EventPlanner. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
