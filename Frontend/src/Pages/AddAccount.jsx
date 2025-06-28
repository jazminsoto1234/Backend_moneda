// src/pages/AddAccount.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AddAccount.css";

export default function AddAccount() {
  const navigate = useNavigate();

  // Lista de bancos (supone que las imágenes están en public/)
  const banks = [
    { id: "paypal", name: "PayPal", logo: "/Paypal.png" },
    { id: "westernunion", name: "Western Union", logo: "/WesternUnion.png" },
    { id: "bcp", name: "BCP", logo: "/BCP.png" },
    { id: "interbank", name: "Interbank", logo: "/Interbank.png" },
    // … añade más si lo deseas …
  ];

  return (
    <div className="add-account-container">
      {/* 1) Título */}
      <h1 className="aa-title">Add Account</h1>

      {/* 2) Lista de bancos, cada uno con borde negro y clickable */}
      <div className="aa-bank-list">
        {banks.map((bank) => (
          <div
            key={bank.id}
            className="aa-bank-card"
            onClick={() => navigate("/app/add-account/card-details")}
          >
            <img
              src={bank.logo}
              alt={bank.name}
              className="aa-bank-logo"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
