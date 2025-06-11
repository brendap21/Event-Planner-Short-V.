import React, { useEffect, useState } from "react";
import api from "../api";
import "../styles/OwnerSelector.css"; // Para aprovechar tus estilos

export function OwnerDisplay({ ownerId }) {
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    if (ownerId) {
      api.get(`/users/${ownerId}`)
        .then(res => setOwner(res.data))
        .catch(() => setOwner(null));
    } else {
      setOwner(null);
    }
  }, [ownerId]);

  if (!owner) return null;

  return (
    <div className="owner-info-panel">
      <img
        src={owner.profile_image || "/default-user.png"}
        alt="perfil"
        className="owner-info-img"
      />
      <div className="owner-info-data">
        <div><b>Nombre:</b> {owner.first_name}</div>
        <div><b>Apellido:</b> {owner.last_name}</div>
        <div><b>Email:</b> {owner.email}</div>
        <div><b>Teléfono:</b> {owner.phone}</div>
      </div>
    </div>
  );
}
