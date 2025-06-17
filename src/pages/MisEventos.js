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
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Mis Eventos</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
        }}
      >
        {events
          .filter(event => !event.archived)
          .map((event) => (
            <div
              key={event.id}
              onClick={() => navigate(`/event/${event.id}`)}
              style={{
                backgroundColor: event.category?.color || '#999',
                color: '#fff',
                borderRadius: '20px',
                padding: '20px',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>
                {event.title?.toUpperCase() || 'SIN TÍTULO'}
              </h2>
              <p style={{ margin: '10px 0' }}>
                {(event.event_date?.split('T')[0] || '').replace(/-/g, '/')}
              </p>
              <p style={{ fontWeight: 500 }}>
                {event.category?.name || 'Sin categoría'}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MisEventos;
