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
        // Si usas proxy en package.json, /api/events ya apunta a tu backend
        const res = await api.get('/events', {
          headers: {
            // si tu API valida token
            Authorization: `Bearer ${await currentUser.getIdToken()}`
          }
        });
        setEvents(res.data);
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
