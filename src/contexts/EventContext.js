// src/contexts/EventContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from 'react';
import { useAuth } from './AuthContext';
import api from '../api';

const EventContext = createContext();
export const useEvents = () => useContext(EventContext);

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const fetchEvents = async () => {
      try {
        const token = await currentUser.getIdToken();

        // 1. Cargar eventos (igual que antes)
        const res = await api.get('/events', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const rawEvents = res.data;
        setEvents(rawEvents); // ⚠️ Se mantiene tal cual para compatibilidad

        // 2. Enriquecer eventos con categoría
        const enriched = await Promise.all(
          rawEvents.map(async (event) => {
            try {
              const catRes = await api.get(`/categories/${event.category_id}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });

              return {
                ...event,
                category: catRes.data
              };
            } catch (error) {
              console.warn(`No se pudo cargar categoría del evento ${event.id}`);
              return {
                ...event,
                category: {
                  name: 'Sin categoría',
                  color: '#999'
                }
              };
            }
          })
        );

        setEvents(enriched); // ← sobrescribe con eventos enriquecidos

      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, [currentUser]);

  return (
    <EventContext.Provider value={{ events }}>
      {children}
    </EventContext.Provider>
  );
}
