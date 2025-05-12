// src/pages/Budget.js
import React from 'react';
import { useEvents } from '../contexts/EventContext';

const Budget = () => {
  const { events, loading } = useEvents();

  if (loading) return <p>Cargando presupuesto…</p>;

  // Ejemplo: sumar todos los presupuestos
  const total = events
    .filter(e => !e.archived)
    .reduce((sum, e) => sum + parseFloat(e.budget || 0), 0);

  return (
    <div className="budget-page">
      <h1>Presupuesto Total</h1>
      <p>${total.toFixed(2)}</p>
    </div>
  );
};

export default Budget;
