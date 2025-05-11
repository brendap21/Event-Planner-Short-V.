// src/contexts/EventContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig'; 
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const EventContext = createContext();

export function useEvents() {
  return useContext(EventContext);
}

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventList);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Función para archivar un evento
  const archiveEvent = async (id) => {
    const eventRef = doc(db, 'events', id);
    try {
      await updateDoc(eventRef, {
        archived: true,
      });
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === id ? { ...event, archived: true } : event
        )
      );
    } catch (error) {
      console.error('Error archiving event:', error);
    }
  };

  return (
    <EventContext.Provider value={{ events, loading, setEvents, archiveEvent }}>
      {children}
    </EventContext.Provider>
  );
}
