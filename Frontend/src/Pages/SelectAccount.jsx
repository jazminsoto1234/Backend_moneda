// src/pages/SelectAccount.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectAccount.css";
import defaultUser from "../assets/user1.png";

export default function SelectAccount({ accounts, setSelectedAccountIndex }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Usuario");

  // 1) Al montar, hacemos GET /users/information para obtener el username
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
        if (data.usermame) {
          setUsername(data.usermame);
        }
      })
      .catch((err) => {
        console.error("Error al obtener información del usuario:", err);
      });
  }, []);

  const chooseAccount = (idx) => {
    setSelectedAccountIndex(idx);
    navigate("/app/home");
  };

  return (
    <div className="select-account-container">
      {/* Imagen de perfil + username obtenido del backend */}
      <div className="select-account-header">
        <img
          src={defaultUser}
          alt="User Profile"
          className="select-account-user-img"
        />
        <p className="select-account-username">{username}</p>
      </div>

      {/* Lista de cuentas */}
      <div className="select-account-list">
        {accounts.length === 0 ? (
          <p className="select-account-loading">Cargando cuentas...</p>
        ) : (
          accounts.map((acc, idx) => (
            <div
              key={acc.id}
              className="account-card"
              onClick={() => chooseAccount(idx)}
            >
              <div className="account-info-left">
                <span className="account-name">{acc.name}</span>
                <span className="account-balance">Available balance</span>
                <span className="account-amount">
                  {acc.currency} {acc.balance.toLocaleString()}
                </span>
              </div>
              <div className="account-info-right">
                {/* Aquí ya mostramos el número de cuenta auténtico */}
                <span className="account-number">{acc.number}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
