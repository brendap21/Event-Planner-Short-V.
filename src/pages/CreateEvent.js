import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CategorySelect } from "../components/CategorySelect";
import { OwnerSelector } from "../components/OwnerSelector";
import { OwnerDisplay } from "../components/OwnerDisplay";
import api from "../api";
import "../styles/CreateEvent.css"

const [successMsg, setSuccessMsg] = useState("");

const initialState = {
  title: "",
  category_id: "",
  event_date: "",
  event_time: "",
  budget: "",
  description: "",
  max_guests: "",
  owner_id: "",
};

export default function CreateEvent() {
  const { profile } = useAuth();
  const [form, setForm] = useState(initialState);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Asigna owner automáticamente para usuarios normales
  useEffect(() => {
    if (profile?.user_type !== "admin") {
      setForm(f => ({ ...f, owner_id: profile?.id }));
    }
  }, [profile]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        owner_id: profile.user_type === "admin" ? form.owner_id : profile.id,
        budget: form.budget ? Number(form.budget) : 0,
        max_guests: form.max_guests ? Number(form.max_guests) : null,
      };
      const res = await api.post("/events", payload);
      // Muestra confirmación visual bonita
      setSuccessMsg("¡Evento creado exitosamente! Redirigiendo...");
      // Opcional: Limpia formulario
      setForm(initialState);
      // Espera 1.5 segundos y redirige al detalle del evento creado
      setTimeout(() => {
        window.location.href = `/eventos/${res.data.id}`; // Ajusta la ruta si tu ruta real es diferente
      }, 1500);
      if (profile?.user_type !== "admin") {
        setForm(f => ({ ...f, owner_id: profile?.id }));
      }
    } catch (err) {
      setMsg(
        err.response?.data?.error ||
        "Error al crear evento. Verifica los campos."
      );
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setForm(initialState);
    setMsg("");
    if (profile?.user_type !== "admin") {
      setForm(f => ({ ...f, owner_id: profile?.id }));
    }
  };

  return (
    <div className="main-content">
      <section className="event-form-container">
        <h2 className="event-form-title">CREAR EVENTO</h2>
        <form className="event-form-grid" onSubmit={handleSubmit} autoComplete="off">
          {/* Fila 1 */}
          <div className="event-input-group">
            <label className="event-input-label" htmlFor="title">
              TÍTULO DEL EVENTO:
            </label>
            <input
              className="event-input"
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Ej: Cumpleaños Brenda"
              required
            />
          </div>
          <div className="event-input-group">
            <label className="event-input-label" htmlFor="category_id">
              CATEGORÍA:
            </label>
            <CategorySelect value={form.category_id} onChange={handleChange} />
          </div>
          {/* Fila 2 */}
          <div className="event-input-group">
            <label className="event-input-label" htmlFor="event_date">
              FECHA DEL EVENTO:
            </label>
            <input
              className="event-input"
              id="event_date"
              name="event_date"
              type="date"
              value={form.event_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="event-input-group">
            <label className="event-input-label" htmlFor="budget">
              PRESUPUESTO (MXN):
            </label>
            <div className="event-input-money-wrapper">
              <span className="event-input-money-sign">$</span>
              <input
                className="event-input"
                id="budget"
                name="budget"
                type="number"
                min="0"
                step="0.01"
                value={form.budget}
                onChange={handleChange}
                placeholder="Ej: 1000"
                required
              />
            </div>
          </div>
          {/* Fila 3 */}
          <div className="event-input-group">
            <label className="event-input-label" htmlFor="event_time">
              HORA:
            </label>
            <input
              className="event-input"
              id="event_time"
              name="event_time"
              type="time"
              value={form.event_time}
              onChange={handleChange}
            />
          </div>

          <div className="event-input-group">
            <label className="event-input-label" htmlFor="max_guests">
              MÁX. INVITADOS:
            </label>
            <input
              className="event-input"
              id="max_guests"
              name="max_guests"
              type="number"
              min="1"
              value={form.max_guests}
              onChange={handleChange}
              placeholder="Ej: 30"
              required
            />
          </div>
          {/* Owner */}
          <div className="event-input-group" style={{ gridColumn: "1 / span 2" }}>
            <label className="event-input-label" htmlFor="owner_id">
              SELECCIONAR OWNER:
            </label>
            <OwnerSelector value={form.owner_id} onChange={handleChange} />
          </div>
          {/* Descripción */}
          <div className="event-input-group" style={{ gridColumn: "1 / span 2" }}>
            <label className="event-input-label" htmlFor="description">
              DESCRIPCIÓN DEL EVENTO:
            </label>
            <textarea
              className="event-textarea"
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe los detalles del evento..."
            />
          </div>
          {/* Botones */}
          <div className="event-button-row" style={{ gridColumn: "1 / span 2" }}>
            <button
              type="submit"
              className="btn-main event-btn-main"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Evento"}
            </button>
            <button
              type="button"
              className="btn-cancel event-btn-cancel"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
          {successMsg && (
            <div className="msg-success" style={{ gridColumn: "1 / span 2" }}>
              {successMsg}
            </div>
          )}
          {msg && (
            <div className="msg-error" style={{ gridColumn: "1 / span 2" }}>
              {msg}
            </div>
          )}

        </form>
      </section>
    </div>
  );
}
