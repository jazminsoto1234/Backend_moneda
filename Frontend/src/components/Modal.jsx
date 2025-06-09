// src/components/Modal.jsx
import React from "react";
import "./Modal.css"; // Estilos básicos para el backdrop

export default function Modal({ children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // evita cerrar al clickear dentro
      >
        {children}
      </div>
    </div>
  );
}
