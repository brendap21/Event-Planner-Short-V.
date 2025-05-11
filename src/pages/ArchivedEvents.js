// src/pages/ArchivedEvents.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';

const ArchivedEvents = () => {
  const { events, loading } = useEvents();
  const navigate = useNavigate();

  if (loading) {
    return <p>Cargando eventos archivados...</p>;
  }

  const archivedEvents = events.filter((event) => event.archived);

  return (
    <div>
      <h1>Eventos Archivados</h1>
      {archivedEvents.length > 0 ? (
        <ul>
          {archivedEvents.map((event) => (
            <li key={event.id}>
              <button onClick={() => navigate(`/event/${event.id}`)}>
                <h3>{event.name}</h3>
                <p>{event.date}</p>
                <p>{event.description}</p>
                <p>Presupuesto: {event.budget}</p>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes eventos archivados.</p>
      )}
    </div>
  );
};

export default ArchivedEvents;
