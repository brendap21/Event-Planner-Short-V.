import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import image from '../assets/HomeImage4.jpg';
import logo from '../assets/EventPlannerBigger.png';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-image">
        <img src={image} alt="Event Planning" />
      </div>
      <div className="home-info">
        <div className="logo-container">
          <img src={logo} alt="EventPlanner+ Logo" className="logo" />
        </div>
        <h1>¡BIENVENIDO A EVENT PLANNER!</h1>
        <p>
          La mejor herramienta para planificar tus eventos de manera eficiente y divertida. Organiza
          todos los detalles, desde el presupuesto hasta la lista de suministros, ¡y haz que tu evento
          sea un éxito!
        </p>
        <button
          className="cta-button"
          onClick={() => navigate('/login')}
        >
          COMENZAR AHORA
        </button>
      </div>
    </div>
  );
};

export default Home;
