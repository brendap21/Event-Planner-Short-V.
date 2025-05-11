// src/components/EventForm.js
import React from 'react';

const EventForm = ({
  name, setName, date, setDate, description, setDescription, budget, setBudget,
  location, setLocation, contact, setContact, guests, setGuests, category, setCategory,
  notes, setNotes, errors, handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre del Evento</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del evento"
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div>
        <label>Fecha del Evento</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && <p className="error">{errors.date}</p>}
      </div>

      <div>
        <label>Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción del evento"
        />
        {errors.description && <p className="error">{errors.description}</p>}
      </div>

      <div>
        <label>Presupuesto</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Presupuesto estimado"
        />
        {errors.budget && <p className="error">{errors.budget}</p>}
      </div>

      <div>
        <label>Lugar</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ubicación del evento"
        />
      </div>

      <div>
        <label>Contacto</label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Información de contacto"
        />
      </div>

      <div>
        <label>Invitados</label>
        <input
          type="text"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          placeholder="Lista de invitados"
        />
      </div>

      <div>
        <label>Categoría</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Selecciona categoría</option>
          <option value="Boda">Boda</option>
          <option value="Cumpleaños">Cumpleaños</option>
          <option value="Fiesta">Fiesta</option>
          <option value="Conferencia">Conferencia</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div>
        <label>Notas Adicionales</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas adicionales"
        />
      </div>

      <button type="submit">Crear Evento</button>
    </form>
  );
};

export default EventForm;
