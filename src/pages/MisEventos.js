// src/components/EventList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';

const MisEventos = () => {
  const { events, loading } = useEvents();
  const navigate = useNavigate();

  if (loading) {
    return <p>Cargando eventos...</p>;
  }

  if (events.length === 0) {
    return <p>No hay eventos disponibles.</p>;
  }

  return (
    
    <ul>
      <h1>Mis Eventos</h1>
      {events.filter(event => !event.archived).map((event) => (
        <li key={event.id}>
          <button onClick={() => navigate(`/event/${event.id}`)}>
            <h3>{event.name}</h3>
            <p>{event.date}</p>
            <p>{event.description}</p>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default MisEventos;

