// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Splash from "./pages/Splash";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SelectAccount from "./pages/SelectAccount";
import CurrencyConversion from "./pages/CurrencyConversion";

import AddAccount from "./pages/AddAccount";
import CardDetails from "./pages/CardDetails";
import AddAmount from "./pages/AddAmount";
import Transfer from "./pages/Transfer"; //  ← Importa el nuevo componente
import Historial from "./pages/Historial";     // ← Nueva vista “Historial”
import Account from "./pages/Account";         // ← Nueva vista “Cuenta”

import "./App.css";

export default function App() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://backend-monedas.onrender.com/user/account", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar las cuentas");
        return res.json();
      })
      .then((data) => {
        // Decodificamos el JWT para sacar el username
        let usernameFromToken = "";
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          usernameFromToken = payload.username || "";
        } catch (err) {
          console.error("Error decodificando token:", err);
        }

        // Mapeamos cada cuenta recibida:
        const mapped = data.map((acc) => {
          // Escogemos la imagen según el usuario y la moneda
          let imagePath = "";
          if (usernameFromToken === "Jefri") {
            imagePath =
              acc.currency === "PEN"
                ? "/jefri-soles.png"
                : "/jefri-dollars.png";
          } else if (usernameFromToken === "Jazmin") {
            imagePath =
              acc.currency === "PEN"
                ? "/jazmin-soles.png"
                : "/jazmin-dollars.png";
          } else {
            imagePath =
              acc.currency === "PEN"
                ? "/default-soles.png"
                : "/default-dollars.png";
          }

          return {
            id: acc.id,
            name: `Account ${acc.id}`,       // Mantenemos “Account <id>”
            number: acc.nro_cuenta,           // Aquí usamos el nro_cuenta auténtico
            balance: acc.balance,
            currency: acc.currency,
            branch: "",
            image: imagePath,
          };
        });

        setAccounts(mapped);
        setSelectedAccountIndex(0);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Splash />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* RUTAS PRIVADAS (Layout incluye sidebar) */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="home" replace />} />

          <Route
            path="home"
            element={
              <Home
                accounts={accounts}
                selectedAccountIndex={selectedAccountIndex}
                setSelectedAccountIndex={setSelectedAccountIndex}
              />
            }
          />

          <Route
            path="select-account"
            element={
              <SelectAccount
                accounts={accounts}
                setSelectedAccountIndex={setSelectedAccountIndex}
              />
            }
          />

          <Route
            path="currency"
            element={
              <CurrencyConversion
                accounts={accounts}
                selectedAccountIndex={selectedAccountIndex}
                setAccounts={setAccounts}   // <- Pasamos setAccounts aquí
              />
            }
          />

          <Route path="add-account" element={<AddAccount />} />
          <Route
            path="add-account/card-details"
            element={<CardDetails />}
          />

          <Route
            path="add-amount"
            element={
              <AddAmount
                accounts={accounts}
                selectedAccountIndex={selectedAccountIndex}
                setAccounts={setAccounts}
              />
            }
          />

          {/* Ruta de Transferencias */}
          <Route
            path="transfer"
            element={
              <Transfer
                accounts={accounts}
                selectedAccountIndex={selectedAccountIndex}
                setAccounts={setAccounts}
              />
            }
          />

          {/* ******* Rutas nuevas ******* */}
          
          <Route
            path="historial"
            element={
              <Historial
                accounts={accounts}
                setAccounts={setAccounts}
              />
            }
          />
          <Route path="account" element={<Account />} />

          <Route path="*" element={<Navigate to="home" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
