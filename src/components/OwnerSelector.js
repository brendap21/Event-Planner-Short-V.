import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/OwnerSelector.css";

export function OwnerSelector({ value, onChange }) {
  const [users, setUsers] = useState([]);
  const [showList, setShowList] = useState(false);
  const selected = users.find(u => String(u.id) === String(value));

  useEffect(() => {
    api.get("/users?type=user") // Asegúrate de que tu endpoint acepte filtro tipo de usuario
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="input-group">
      <button
        type="button"
        className="btn-main event-btn-main"
        style={{ width: "100%", marginBottom: ".7rem" }}
        onClick={() => setShowList(s => !s)}
      >
        <span>+</span> AGREGAR OWNER
      </button>
      {showList && (
        <div className="owner-list-modal">
          {users.map(u => (
            <div
              key={u.id}
              className="owner-list-item"
              onClick={() => {
                onChange({ target: { value: u.id, name: "owner_id" } });
                setShowList(false);
              }}
            >
              <img src={u.profile_image || "/default-user.png"} alt="img" className="owner-img" />
              <div>
                <b>{u.first_name} {u.last_name}</b>
                <div style={{ fontSize: ".95em", color: "#555" }}>{u.email}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Datos informativos del owner seleccionado */}
      {selected && (
        <div className="owner-info-panel">
          <img src={selected.profile_image || "/default-user.png"} alt="perfil" className="owner-info-img" />
          <div>
            <div><b>Nombre:</b> {selected.first_name}</div>
            <div><b>Apellido:</b> {selected.last_name}</div>
            <div><b>Email:</b> {selected.email}</div>
            <div><b>Teléfono:</b> {selected.phone}</div>
          </div>
        </div>
      )}
      {/* Hidden input para el form */}
      <input type="hidden" name="owner_id" value={value || ""} required readOnly />
    </div>
  );
}
