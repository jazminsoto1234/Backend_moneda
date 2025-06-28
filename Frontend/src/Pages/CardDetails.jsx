// src/pages/CardDetails.jsx
import React from "react";
import "./CardDetails.css";

export default function CardDetails() {
  return (
    <div className="cd-container">
      {/* 1) Título centrado */}
      <h1 className="cd-title">Card Details</h1>

      {/* 2) Recuadro superior que simula la “tarjeta” */}
      <div className="cd-card-preview">
        <div className="cd-card-chip-and-dots">
          {/* Usamos “•••• •••• •••• ••••” como placeholder */}
          <span className="cd-card-dots">•••• •••• •••• ••••</span>
        </div>
        <div className="cd-card-details-row">
          <div className="cd-card-holder-label">
            <span>Card Holder</span>
            <span className="cd-card-holder-name">YOUR NAME</span>
          </div>
          <div className="cd-card-expiry">
            <span>Expires</span>
            <span className="cd-card-expiry-value">MM/YY</span>
          </div>
        </div>
        {/* Toggle switch (botón estilo “iOS”) */}
        <div className="cd-toggle-wrapper">
          <label className="cd-switch">
            <input type="checkbox" />
            <span className="cd-slider" />
          </label>
        </div>
      </div>

      {/* 3) Formulario con todos los campos */}
      <form className="cd-form">
        <div className="cd-form-row">
          <div className="cd-input-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter first name"
              className="cd-input"
            />
          </div>
          <div className="cd-input-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter last name"
              className="cd-input"
            />
          </div>
        </div>

        <div className="cd-input-group-full">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            className="cd-input cd-input-full"
          />
        </div>

        <div className="cd-form-row">
          <div className="cd-input-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              placeholder="MM/YY"
              className="cd-input"
            />
          </div>
          <div className="cd-input-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              placeholder="123"
              className="cd-input"
            />
          </div>
        </div>

        <div className="cd-input-group-full">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="cd-input cd-input-full"
          />
        </div>

        {/* 4) Botón “Add Account” al fondo */}
        <button type="submit" className="cd-submit-button">
          Add Account
        </button>
      </form>
    </div>
  );
}
