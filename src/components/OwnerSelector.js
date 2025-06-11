import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/OwnerSelector.css";

export function OwnerSelector({ value, onChange }) {
  const [users, setUsers] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    api.get("/users?type=user")
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="owner-selector-group">
      <button
        type="button"
        className="btn-main event-btn-main owner-selector-btn"
        onClick={() => setShowList(s => !s)}
      >
        <span className="owner-btn-plus">+</span> AGREGAR OWNER
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
                <div>{u.email}</div>
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
