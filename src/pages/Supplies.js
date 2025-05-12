// src/pages/Supplies.js
import React, { useState, useEffect } from 'react';
import api from '../api';

const Supplies = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/supplies')
      .then(res => setList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando insumos…</p>;

  return (
    <div className="supplies-page">
      <h1>Insumos</h1>
      <ul>
        {list.map(s => (
          <li key={s.id}>
            {s.name} – ${parseFloat(s.price).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Supplies;
