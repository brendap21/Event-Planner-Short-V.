// src/pages/Calendar.js
import React, { useState, useEffect } from 'react';
import { useEvents } from '../contexts/EventContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarPage = () => {
  const { events, loading } = useEvents();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState([]);

  useEffect(() => {
    if (!loading) {
      // Filtramos los eventos activos
      const activeEvents = events.filter(event => !event.archived);
      // Convertimos la fecha a formato 'YYYY-MM-DD' para compararlo con las fechas de los eventos
      const formattedSelectedDate = selectedDate.toISOString().split('T')[0];

      // Filtramos los eventos que ocurren en la fecha seleccionada
      const filteredEvents = activeEvents.filter(event => {
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        return eventDate === formattedSelectedDate;
      });

      setEventsOnSelectedDate(filteredEvents);
    }
  }, [events, selectedDate, loading]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <h1>Calendario de Eventos</h1>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ marginRight: '20px' }}>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            showNeighboringMonth={false}
          />
        </div>
        <div>
          <h2>Eventos para {selectedDate.toDateString()}</h2>
          {eventsOnSelectedDate.length > 0 ? (
            <ul>
              {eventsOnSelectedDate.map((event) => (
                <li key={event.id}>
                  <h3>{event.name}</h3>
                  <p>{event.description}</p>
                  <p>{event.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay eventos para esta fecha.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
