// src/pages/EventDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const EventDetail = () => {
  const { eventId } = useParams();
  const { events, setEvents } = useEvents();
  const navigate = useNavigate();

  const event = events.find((event) => event.id === eventId);

  if (!event) {
    navigate('/events');
    return null;
  }

  const [editedEvent, setEditedEvent] = useState(event);

  useEffect(() => {
    setEditedEvent(event);
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent({
      ...editedEvent,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        ...editedEvent,
      });

      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === eventId ? { ...ev, ...editedEvent } : ev
        )
      );

      alert('Evento modificado exitosamente');
      navigate('/events');
    } catch (error) {
      console.error('Error actualizando evento:', error);
    }
  };

  const handleArchiveToggle = async () => {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        archived: !editedEvent.archived,
      });

      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === eventId ? { ...ev, archived: !ev.archived } : ev
        )
      );

      navigate(editedEvent.archived ? '/events' : '/archived-events');
    } catch (error) {
      console.error('Error cambiando estado de archivado:', error);
    }
  };

  return (
    <div>
      <h1>Detalles del Evento: {editedEvent.name}</h1>
      <div>
        <p><strong>Fecha:</strong> {editedEvent.date}</p>
        <p><strong>Descripción:</strong> {editedEvent.description}</p>
        <p><strong>Presupuesto:</strong> {editedEvent.budget}</p>
        <div>
          <h3>Modificar Evento</h3>
          <input
            type="text"
            name="name"
            value={editedEvent.name}
            onChange={handleChange}
            placeholder="Nombre del evento"
          />
          <textarea
            name="description"
            value={editedEvent.description}
            onChange={handleChange}
            placeholder="Descripción del evento"
          />
          <input
            type="date"
            name="date"
            value={editedEvent.date}
            onChange={handleChange}
          />
          <input
            type="number"
            name="budget"
            value={editedEvent.budget}
            onChange={handleChange}
            placeholder="Presupuesto"
          />
          <button onClick={handleSave}>Guardar Cambios</button>
          <button onClick={handleArchiveToggle}>
            {editedEvent.archived ? 'Desarchivar Evento' : 'Archivar Evento'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
