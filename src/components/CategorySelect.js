import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import "../styles/CategorySelect.css";

export function CategorySelect({ value, onChange }) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", color: "#6495ED" });
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  useEffect(() => {
    api.get("/categories")
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setShowAdd(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = categories.find(cat => cat.id === Number(value));

  // Agregar categoría nueva
  const handleAddCategory = async e => {
    e.preventDefault();
    if (!newCat.name.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/categories", {
        name: newCat.name,
        color: newCat.color
      });
      const all = await api.get("/categories");
      setCategories(all.data);
      onChange({ target: { value: res.data.id, name: "category_id" } });
      setNewCat({ name: "", color: "#6495ED" });
      setShowAdd(false);
      setOpen(false);
    } catch {
      alert("Error al agregar categoría. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div ref={ref} className="event-category-select">
      <div
        className="event-category-selected"
        tabIndex={0}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => { if (e.key === "Enter") setOpen(o => !o); }}
      >
        {selected ? (
          <>
            <span className="event-category-color" style={{ background: selected.color }} />
            <span>{selected.name}</span>
          </>
        ) : (
          <span className="event-category-placeholder">Selecciona una categoría</span>
        )}
        <span className="event-category-arrow">▼</span>
      </div>
      {open && (
        <div className="event-category-dropdown">
          <div
            className="event-category-add-btn"
            onClick={e => { e.stopPropagation(); setShowAdd(s => !s); }}
          >
            <span className="event-category-plus">+</span> Agregar Categoría
          </div>
          {showAdd && (
            <form onSubmit={handleAddCategory} className="event-category-add-form">
              <input
                type="text"
                value={newCat.name}
                onChange={e => setNewCat(c => ({ ...c, name: e.target.value }))}
                maxLength={40}
                placeholder="Nombre de la categoría"
                className="event-input"
                required
                style={{ flex: 2 }}
              />
              <input
                type="color"
                value={newCat.color}
                onChange={e => setNewCat(c => ({ ...c, color: e.target.value }))}
                style={{
                  width: "36px", height: "36px", border: "none", background: "none", cursor: "pointer"
                }}
              />
              <button type="submit" className="btn-main event-btn-main" disabled={loading}>
                {loading ? "Agregando..." : "Agregar"}
              </button>
            </form>
          )}
          {categories.map(cat => (
            <div
              key={cat.id}
              className={`event-category-option${String(value) === String(cat.id) ? " selected" : ""}`}
              onClick={() => {
                onChange({ target: { value: cat.id, name: "category_id" } });
                setOpen(false);
              }}
            >
              <span className="event-category-color" style={{ background: cat.color }} />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      )}
      {/* Campo oculto para validación */}
      <input type="hidden" name="category_id" value={value} required readOnly />
    </div>
  );
}
