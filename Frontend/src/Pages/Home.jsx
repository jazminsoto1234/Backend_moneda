import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home({
  accounts,
  selectedAccountIndex,
  setSelectedAccountIndex,
}) {
  const navigate = useNavigate();

  // 1) ESTADOS PARA DATOS DINÁMICOS
  const [username, setUsername] = useState("");       // Nombre real del usuario
  const [cardNumber, setCardNumber] = useState("");   // Número de tarjeta simulado

  // 2) Si aún no llegaron las cuentas, mostramos “Cargando…”
  if (!accounts || accounts.length === 0) {
    return (
      <div
        className="home-container"
        style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
      >
        <p style={{ color: "#374151", fontSize: "1rem" }}>Cargando cuentas...</p>
      </div>
    );
  }

  // 3) Extraemos la cuenta seleccionada del array cargado
  const account = accounts[selectedAccountIndex];

  // 4) Encontrar la cuenta en PEN y en USD (para los recuadros pequeños)
  const penAccount = accounts.find((a) => a.currency === "PEN") || null;
  const usdAccount = accounts.find((a) => a.currency === "USD") || null;

  // —————————————————————————————————————————————
  // 5) AL MONTAR: traer el nombre real desde /user/information
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://backend-monedas.onrender.com/user/information", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar la información de usuario");
        return res.json();
      })
      .then((data) => {
        // Tu backend devuelve { id, usermame, email } (ojo: campo “usermame” según mencionaste)
        setUsername(data.usermame || data.username || "Usuario");
      })
      .catch((err) => {
        console.error("Error al obtener info de usuario:", err);
      });
  }, []);

  // 6) Al cambiar la cuenta seleccionada (account.id), generamos un número nuevo “aleatorio” de 16 dígitos
  useEffect(() => {
    // Generar 16 dígitos aleatorios
    const digits = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join("");
    const first4 = digits.slice(0, 4);
    const last4 = digits.slice(12, 16);
    const maskedMiddle = "•••• ••••";
    setCardNumber(`${first4} ${maskedMiddle} ${last4}`);
  }, [account.id]);

  return (
    <div className="home-container">
      {/* 1) TÍTULO PRINCIPAL */}
      <h1 className="home-title">Affiliated Accounts</h1>

      {/* 2) TARJETA DINÁMICA */}
      <div className="home-card-wrapper">
        <div className="home-card">
          {/* 2.1) Toggle decorativo arriba a la derecha */}
          <div className="home-card-toggle">
            <div className="toggle-background">
              <div className="toggle-circle"></div>
            </div>
          </div>

          {/* 2.2) Número de tarjeta (con 8 dígitos centrales ocultos) */}
          <div className="home-card-number">{cardNumber}</div>

          {/* 2.3) Etiqueta “Card Holder” y nombre */}
          <div className="home-card-holder-label">Nombre del titular</div>
          <div className="home-card-holder-name">{username}</div>

          {/* 2.4) Tipo fijo “Visa Classic Crédito” */}
          <div className="home-card-type">Visa Classic Crédito</div>

          {/* 2.5) Expiración (estático MM/YY) */}
          <div className="home-card-expiry">MM/YY</div>

          {/* 2.6) Saldo real abajo a la izquierda */}
          <div className="home-card-balance-label">Saldo</div>
          <div className="home-card-balance-amount">
            {account.currency} {account.balance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 3) BOTÓN “Select Account” */}
      <button
        className="btn btn-dark select-account-button"
        onClick={() => navigate("/app/select-account")}
      >
        Select Account
      </button>

      {/* 4) SECCIÓN DE FONDO CELESTE */}
      <div className="home-blue-section">
        {/* 4.1) TRES BOTONES DE FUNCIONALIDAD */}
        <div className="home-features">
          <button
            className="feature-btn"
            onClick={() => navigate("/app/add-amount")}
          >
            <img src="/Add-Amount.png" alt="Add Amount" className="feature-icon" />
            <span className="feature-text">Add Amount</span>
          </button>

          <button
            className="feature-btn"
            onClick={() => navigate("/app/currency")}
          >
            <img
              src="/Currency-Conversion.png"
              alt="Currency Conversion"
              className="feature-icon"
            />
            <span className="feature-text">Currency Conversion</span>
          </button>

          <button
            className="feature-btn"
            onClick={() => navigate("/app/add-account")}
          >
            <img src="/Add-Account.png" alt="Add Account" className="feature-icon" />
            <span className="feature-text">Add Account</span>
          </button>
        </div>

        {/* 4.2) RECUADRO “Available balance” */}
        <div className="balance-card">
          <div className="balance-info">
            <span className="balance-label">Available balance</span>
            <span className="balance-amount">
              {account.currency} {account.balance.toLocaleString()}
            </span>
          </div>
          <div className="balance-decoration-wrapper">
            <img src="/leaf.png" alt="Decoración" className="balance-decoration" />
          </div>
        </div>

        {/* 4.3) RECUADROS “Soles” y “Dollars” */}
        <div className="home-currencies-section">
          {penAccount && (
            <div className="currency-box rojo">
              <img src="/Sol.png" alt="Soles Icon" className="currency-icon" />
              <div className="currency-texts">
                <span className="currency-amount">
                  S/. {penAccount.balance.toLocaleString()}
                </span>
                <span className="currency-label">Soles</span>
              </div>
            </div>
          )}
          {usdAccount && (
            <div className="currency-box celeste">
              <img src="/dollar.png" alt="Dollars Icon" className="currency-icon" />
              <div className="currency-texts">
                <span className="currency-amount">
                  $ {usdAccount.balance.toLocaleString()}
                </span>
                <span className="currency-label">Dollars</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
