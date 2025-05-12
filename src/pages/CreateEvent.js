// src/pages/CreateEvent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import EventForm from '../components/EventForm';

const CreateEvent = () => {
  const { setEvents } = useEvents();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [guests, setGuests] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  
  // Validación de errores
  const [errors, setErrors] = useState({
    name: '',
    date: '',
    description: '',
    budget: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de campos obligatorios
    let validationErrors = {};
    if (!name) validationErrors.name = 'El nombre del evento es obligatorio';
    if (!date) validationErrors.date = 'La fecha del evento es obligatoria';
    if (!description) validationErrors.description = 'La descripción es obligatoria';
    if (!budget) validationErrors.budget = 'El presupuesto es obligatorio';

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'events'), {
        name,
        date,
        description,
        budget,
        location,
        contact,
        guests,
        category,
        notes,
        archived: false,
      });

      setEvents((prevEvents) => [
        ...prevEvents,
        { id: docRef.id, name, date, description, budget, location, contact, guests, category, notes, archived: false },
      ]);

      navigate('/mis-eventos');
    } catch (error) {
      console.error('Error creando evento:', error);
    }
  };

  return (
    <div>
      <h1>Crear Evento</h1>
      <EventForm
        name={name}
        setName={setName}
        date={date}
        setDate={setDate}
        description={description}
        setDescription={setDescription}
        budget={budget}
        setBudget={setBudget}
        location={location}
        setLocation={setLocation}
        contact={contact}
        setContact={setContact}
        guests={guests}
        setGuests={setGuests}
        category={category}
        setCategory={setCategory}
        notes={notes}
        setNotes={setNotes}
        errors={errors}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateEvent;
