// src/pages/Account.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Account.css";
import defaultUser from "../assets/user1.png"; // ← Importe tu avatar por defecto

export default function Account() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("/default-avatar.png");

  // 1) Al montar, obtener información de usuario (para mostrar nombre)
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
        if (!res.ok) throw new Error("No se pudo cargar la info de usuario");
        return res.json();
      })
      .then((data) => {
        // Asumimos que data.usermame es la propiedad correcta
        setUsername(data.usermame || data.username || "Usuario");
        // Si en el futuro tienes un campo “avatar_url”, p.ej.:
        // setProfileImage(data.avatar_url || "/default-avatar.png");
      })
      .catch((err) => console.error(err));
  }, []);

  // 2) Al presionar “Log out”, borrar token y redirigir a /welcome
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/welcome");
  };

  return (
    <div className="account-container">
      <h1 className="account-title">Account</h1>

      {/* Foto de perfil (tú reemplazarás la ruta más tarde) */}
      <div className="account-profile">
        <img
        src={defaultUser}
        alt="User Profile"
        className="account-profile-img"
        />
        <p className="account-username">{username}</p>
      </div>

      {/* Opciones estáticas */}
      <div className="account-options">
        <div className="account-option">
          <span>Password</span>
          <span className="account-option-arrow">›</span>
        </div>
        <div className="account-option">
          <span>Touch ID</span>
          <span className="account-option-arrow">›</span>
        </div>
        <div className="account-option">
          <span>Languages</span>
          <span className="account-option-arrow">›</span>
        </div>
        <div className="account-option">
          <span>App information</span>
          <span className="account-option-arrow">›</span>
        </div>
        <div className="account-option">
          <span>Customer care</span>
          <span className="account-option-arrow">›</span>
        </div>
      </div>

      {/* Botón Logout */}
      <button
        className="account-logout-btn"
        onClick={handleLogout}
      >
        Log out of account
      </button>
    </div>
  );
}
