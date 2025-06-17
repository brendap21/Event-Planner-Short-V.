// src/pages/EventDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { CategorySelect } from '../components/CategorySelect';
import { OwnerDisplay } from '../components/OwnerDisplay';
import '../styles/EventDetail.css';

export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [event, setEvent] = useState(null);
  const [category, setCategory] = useState(null);
  const [owner, setOwner] = useState(null);
  const [guests, setGuests] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [allSupplies, setAllSupplies] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [archiving, setArchiving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showGuests, setShowGuests] = useState(false);
  const [showSupplies, setShowSupplies] = useState(false);
  const [showNewSupplyForm, setShowNewSupplyForm] = useState(false);

  // --- Invitado UI ---
  const [newGuest, setNewGuest] = useState({ first_name: '', last_name: '' });
  const [categories, setCategories] = useState([]);

  // --- Insumo UI ---
  const [supplySearch, setSupplySearch] = useState('');
  const [supplyQty, setSupplyQty] = useState(1);
  const [newSupply, setNewSupply] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  const handleAddSupply = async (supplyId, quantity) => {
    const exists = supplies.find(s => s.supply_id === supplyId);
    if (exists) {
      await api.put(`/events/${eventId}/supplies/${exists.id}`, { quantity: exists.quantity + quantity });
      setSupplies(supplies.map(s =>
        s.supply_id === supplyId ? { ...s, quantity: s.quantity + quantity } : s
      ));
    } else {
      const res = await api.post(`/events/${eventId}/supplies`, { supply_id: supplyId, quantity });

      // 🔍 Nueva línea: obtener info completa del insumo
      const fullSupply = await api.get(`/supplies/${supplyId}`);

      setSupplies([
        ...supplies,
        {
          ...fullSupply.data,
          id: res.data.id,
          supply_id: supplyId,
          quantity
        }
      ]);
    }
  };


  const handleCreateAndAddSupply = async () => {
    const price = parseFloat(newSupply.price);
    if (!newSupply.name || isNaN(price) || price <= 0) {
      alert('Nombre y precio válido (> 0) son obligatorios.');
      return;
    }

    const res = await api.post('/supplies', { ...newSupply, price });
    setAllSupplies([...allSupplies, res.data]);
    await handleAddSupply(res.data.id, 1);
    setNewSupply({ name: '', description: '', price: '', category: '' });
  };




  // Cargar datos del evento
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const res = await api.get(`/events/${eventId}`);
        if (!mounted) return;
        setEvent(res.data);
        setForm({
          title: res.data.title,
          category_id: res.data.category_id,
          event_date: res.data.event_date,
          event_time: res.data.event_time,
          budget: res.data.budget,
          description: res.data.description,
          max_guests: res.data.max_guests,
        });
        // Cargar categoría
        api.get(`/categories/${res.data.category_id}`).then(r => setCategory(r.data));
        // Cargar owner
        api.get(`/users/${res.data.owner_id}`).then(r => setOwner(r.data));
      } catch (err) {
        if (err.response && err.response.status === 404) {
          alert("El evento no existe o fue eliminado.");
        } else {
          alert("Error al cargar el evento.");
        }
        navigate('/events');
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, [eventId, navigate]);
  useEffect(() => {
    api.get('/categories')
      .then(r => setCategories(r.data))
      .catch(() => setCategories([]));
  }, []);


  // Cargar invitados
  useEffect(() => {
    if (!event) return;
    api.get(`/events/${eventId}/guests`)
      .then(r => setGuests(r.data))
      .catch(err => {
        if (err.response && err.response.status === 404) {
          setGuests([]);
        }
      });
  }, [event, eventId]);



  // Cargar todos los insumos disponibles (para agregar)
  useEffect(() => {
    api.get('/supplies')
      .then(r => setAllSupplies(r.data))
      .catch(err => {
        if (err.response && err.response.status === 404) {
          setAllSupplies([]);
        }
      });
  }, []);
  // Cargar insumos del evento y combinarlos con info completa
  useEffect(() => {
    if (!event || allSupplies.length === 0) return;
    api.get(`/events/${eventId}/supplies`)
      .then(r => {
        const enriched = r.data.map(es => {
          const full = allSupplies.find(s => s.id === es.supply_id);
          return {
            ...es,
            name: full?.name || es.name,
            description: full?.description || es.description,
            price: full?.price || es.price,
            category: full?.category || 'sin categoría'
          };
        });
        setSupplies(enriched);
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          setSupplies([]);
        }
      });
  }, [event, eventId, allSupplies]);



  if (!event) return <div>Cargando evento...</div>;

  // Permisos de edición
  const isOwner = profile && (profile.id === event.owner_id || profile.user_type === 'admin');

  // --- Invitados ---
  const handleAddGuest = async (guest) => {
    if (guests.length >= event.max_guests) {
      alert('No puedes agregar más invitados.');
      return;
    }
    const res = await api.post(`/events/${eventId}/guests`, guest);
    setGuests([...guests, { ...guest, id: res.data.id }]);
  };
  const handleRemoveGuest = async (guestId) => {
    await api.delete(`/events/${eventId}/guests/${guestId}`);
    setGuests(guests.filter(g => g.id !== guestId));
  };

  // --- Insumos ---

  const handleRemoveSupply = async (eventSupplyId) => {
    await api.delete(`/events/${eventId}/supplies/${eventSupplyId}`);
    setSupplies(supplies.filter(s => s.id !== eventSupplyId));
  };

  // --- Edición general ---
  const handleEdit = () => setEditing(true);
  const handleCancelEdit = () => {
    setEditing(false);
    setForm({
      title: event.title,
      category_id: event.category_id,
      event_date: event.event_date,
      event_time: event.event_time,
      budget: event.budget,
      description: event.description,
      max_guests: event.max_guests,
    });
  };
  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleSave = async () => {
    await api.put(`/events/${eventId}`, form);
    setEvent({ ...event, ...form });
    setEditing(false);
  };

  // --- Archivar/Desarchivar ---
  const handleArchiveToggle = async () => {
    setArchiving(true);
    const newStatus = event.status === 'archived' ? 'active' : 'archived';
    await api.put(`/events/${eventId}`, { status: newStatus });
    setEvent(e => ({ ...e, status: newStatus }));
    setArchiving(false);
  };

  return (
    <div className="main-content" style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1>Detalles del Evento</h1>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 4px 18px #0001' }}>
        {/* Título */}
        <div style={{ marginBottom: 12 }}>
          <b>Título:</b>{' '}
          {editing ? (
            <input name="title" value={form.title} onChange={handleFormChange} />
          ) : (
            event.title
          )}
        </div>
        {/* Categoría */}
        <div style={{ marginBottom: 12 }}>
          <b>Categoría:</b>{' '}
          {editing ? (
            <CategorySelect value={form.category_id} onChange={handleFormChange} />
          ) : (
            category && (
              <span>
                <span style={{
                  display: 'inline-block',
                  width: 18, height: 18, borderRadius: 4,
                  background: category.color, marginRight: 7, verticalAlign: 'middle'
                }} />
                {category.name}
              </span>
            )
          )}
        </div>
        {/* Fecha y hora */}
        <div style={{ marginBottom: 12 }}>
          <b>Fecha:</b>{' '}
          {editing ? (
            <input type="date" name="event_date" value={form.event_date} onChange={handleFormChange} />
          ) : (
            event.event_date.toString().split('T')[0].replace(/-/g, '/')
          )}
          {' '}
          <b>Hora:</b>{' '}
          {editing ? (
            <input type="time" name="event_time" value={form.event_time} onChange={handleFormChange} />
          ) : (
            event.event_time?.slice(0, 5) || 'No especificada'
          )}
        </div>
        {/* Owner */}
        <div style={{ marginBottom: 12 }}>
          <b>Datos del titular:</b>
          {owner && (
            <div style={{ marginLeft: 12 }}>
              <div><b>Nombre:</b> {owner.first_name} {owner.last_name}</div>
              <div><b>Email:</b> {owner.email}</div>
              <div><b>Teléfono:</b> {owner.phone}</div>
            </div>
          )}
        </div>
        {/* Presupuesto */}
        <div style={{ marginBottom: 12 }}>
          <b>Presupuesto estimado:</b>{' '}
          {editing ? (
            <input type="number" name="budget" value={form.budget} onChange={handleFormChange} />
          ) : (
            `$${event.budget}`
          )}
        </div>
        {/* Cantidad de invitados */}
        <div style={{ marginBottom: 12 }}>
          <b>Cantidad máxima de invitados:</b>{' '}
          {editing ? (
            <input type="number" name="max_guests" value={form.max_guests} onChange={handleFormChange} />
          ) : (
            event.max_guests
          )}
        </div>
        {/* Descripción */}
        <div style={{ marginBottom: 12 }}>
          <b>Descripción:</b>
          <div>
            {editing ? (
              <textarea name="description" value={form.description} onChange={handleFormChange} />
            ) : (
              event.description
            )}
          </div>
        </div>
        {/* INVITADOS */}
        <div style={{ marginBottom: 18 }}>
          <b style={{ cursor: 'pointer' }} onClick={() => setShowGuests(!showGuests)}>
            {showGuests ? '- INVITADOS:' : '+ INVITADOS:'}
          </b>
          {showGuests && (
            <>
              <ul>
                {guests.map(g => (
                  <li key={g.id}>
                    {g.first_name} {g.last_name}
                    {isOwner && (
                      <button style={{ marginLeft: 8 }} onClick={() => handleRemoveGuest(g.id)}>Eliminar</button>
                    )}
                  </li>
                ))}
              </ul>
              {isOwner && guests.length < event.max_guests && (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!newGuest.first_name || !newGuest.last_name) return;
                    handleAddGuest(newGuest);
                    setNewGuest({ first_name: '', last_name: '' });
                  }}
                  style={{ display: 'flex', gap: 8, marginTop: 8 }}
                >
                  <input placeholder="Nombre" value={newGuest.first_name} onChange={e => setNewGuest(g => ({ ...g, first_name: e.target.value }))} required />
                  <input placeholder="Apellido" value={newGuest.last_name} onChange={e => setNewGuest(g => ({ ...g, last_name: e.target.value }))} required />
                  <button type="submit">+</button>
                </form>
              )}
            </>
          )}
        </div>
        <br />
     <hr />

        {/* INSUMOS */}
        <div style={{ marginBottom: 18 }}>
          <b style={{ cursor: 'pointer' }} onClick={() => setShowSupplies(!showSupplies)}>
            {showSupplies ? '- INSUMOS:' : '+ INSUMOS:'}
          </b>
          {showSupplies && (
            <>
              <ul>
                {supplies.map(s => {
                  const full = allSupplies.find(x => x.id === s.supply_id);
                  return (
                    <li key={s.id} className="supply-item">
                      <span className="supply-name">{full?.name || s.name}</span>
                      <span className="supply-description">{s.description || 'Sin descripción'}</span>
                      <span className="supply-price">${s.price}</span>
                      <span className="supply-quantity">× {s.quantity}</span>
                      {isOwner && (
                        <button className="remove-button" onClick={() => handleRemoveSupply(s.id)}>Eliminar</button>
                      )}
                    </li>

                  );
                })}
              </ul>

              {/* Formulario para agregar insumo existente */}
              {isOwner && (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    const supply = allSupplies.find(s => String(s.id) === String(supplySearch));
                    if (!supply) return;
                    handleAddSupply(supply.id, Number(supplyQty));
                    setSupplySearch('');
                    setSupplyQty(1);
                  }}
                  style={{ display: 'flex', gap: 8, marginTop: 8 }}
                >
                  <select value={supplySearch} onChange={e => setSupplySearch(e.target.value)} required>
                    <option value="">Selecciona insumo...</option>
                    {allSupplies.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (${s.price}) [{s.category}]</option>
                    ))}
                  </select>
                  <input type="number" min={1} value={supplyQty} onChange={e => setSupplyQty(e.target.value)} style={{ width: 60 }} required />
                  Cantidad
                  <button type="submit">+</button>
                </form>
              )}

              {/* Toggle para mostrar formulario nuevo */}
              {isOwner && (
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => setShowNewSupplyForm(!showNewSupplyForm)}>
                    {showNewSupplyForm ? 'Cancelar nuevo insumo' : 'Agregar nuevo insumo'}
                  </button>
                </div>
              )}

              {/* Formulario nuevo insumo */}
              {showNewSupplyForm && isOwner && (
                <div style={{ marginTop: 12, padding: 12, background: '#f9f9f9', borderRadius: 8 }}>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleCreateAndAddSupply();
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                    <input placeholder="Nombre" value={newSupply.name} onChange={e => setNewSupply(s => ({ ...s, name: e.target.value }))} required />
                    <input placeholder="Descripción" value={newSupply.description} onChange={e => setNewSupply(s => ({ ...s, description: e.target.value }))} />
                    <input type="number" placeholder="Precio" value={newSupply.price} onChange={e => setNewSupply(s => ({ ...s, price: e.target.value }))} required />
                    <input placeholder="Categoría" value={newSupply.category} onChange={e => setNewSupply(s => ({ ...s, category: e.target.value }))} />
                    <button type="submit">Crear y agregar</button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ marginBottom: 18 }}>
          <Link to={`/event/${eventId}/shopping-list`}>Ver lista de compras</Link>
        </div>

        {/* Botones editar y archivar */}
        {isOwner && (
          <div style={{ marginTop: 18 }}>
            {!editing ? (
              <button onClick={handleEdit}>Editar Evento</button>
            ) : (
              <>
                <button onClick={handleSave}>Guardar Cambios</button>
                <button onClick={handleCancelEdit}>Cancelar</button>
              </>
            )}
            <button style={{ marginLeft: 12 }} onClick={handleArchiveToggle} disabled={archiving}>
              {event.status === 'archived' ? 'Desarchivar Evento' : 'Archivar Evento'}
            </button>
          </div>
        )}
        {event.status === 'archived' && (
          <div style={{ color: 'red', marginTop: 12 }}>
            Este evento está archivado.
          </div>
        )}
      </div>
    </div>
  );
}
