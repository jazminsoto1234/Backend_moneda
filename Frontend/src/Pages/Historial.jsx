// src/pages/Historial.jsx
import React, { useEffect, useState } from "react";
import "./Historial.css";

export default function Historial({ accounts, setAccounts }) {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1) Al montar, obtenemos el historial del backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No autenticado");
      setLoading(false);
      return;
    }

    fetch("https://backend-monedas.onrender.com/user/historial", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar historial");
        return res.json();
      })
      .then((data) => {
        // data es un array de objetos:
        // { timestamp, from_account, to_account, from_currency, to_currency, original_amount, converted_amount, exchange_rate }
        setHistorial(data);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar el historial");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 2) Helper para formatear la fecha en “15 ene 2024, 02:30 p.m.”
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // 3) Helper para encontrar el número de cuenta dado el ID
  const findAccountNumber = (id) => {
    const acc = accounts.find((a) => a.id === id);
    return acc ? acc.number : id;
  };

  // 4) Helper para determinar si fue “Enviada” o “Recibida”
  const isEnviada = (tx) => {
    // Si from_account coincide con alguna cuenta propia, es envío
    return accounts.some((a) => a.id === tx.from_account);
  };

  if (loading) {
    return (
      <div className="historial-container">
        <p>Cargando historial…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historial-container">
        <p className="historial-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="historial-container">
      <h1 className="historial-title">Historial de Transacciones</h1>

      {historial.length === 0 ? (
        <p className="historial-empty">No hay transacciones.</p>
      ) : (
        <div className="historial-list">
          {historial.map((tx, idx) => {
            const enviada = isEnviada(tx);
            const label = enviada ? "Transferencia Enviada" : "Transferencia Recibida";
            const sign = enviada ? "-" : "+";
            const color = enviada ? "#dc2626" /* rojo */ : "#10b981" /* verde */;
            const amountStr = `${sign}${tx.original_amount.toFixed(2)}`;
            const dateStr = formatDate(tx.timestamp);

            // Si hay cambio de moneda, mostramos el bloque “Conversión de moneda”
            const mostrarConversion = tx.from_currency !== tx.to_currency;

            return (
              <div key={idx} className="historial-item">
                <div className="historial-header">
                  <span className="historial-label">{label}</span>
                  <span className="historial-date">{dateStr}</span>
                  <span
                    className="historial-amount"
                    style={{ color: color }}
                  >
                    {amountStr}
                  </span>
                </div>

                {/* Detalles: Cuenta origen / Cuenta destino */}
                <div className="historial-details">
                  <div className="historial-detail-column">
                    <span className="historial-detail-title">Cuenta origen</span>
                    <span className="historial-detail-value">
                      {findAccountNumber(tx.from_account)}
                    </span>
                  </div>
                  <div className="historial-detail-column">
                    <span className="historial-detail-title">Cuenta destino</span>
                    <span className="historial-detail-value">
                      {findAccountNumber(tx.to_account)}
                    </span>
                  </div>
                </div>

                {/* Moneda origen / Moneda destino */}
                <div className="historial-details">
                  <div className="historial-detail-column">
                    <span className="historial-detail-title">Moneda origen</span>
                    <span className="historial-detail-value">
                      {tx.from_currency}
                    </span>
                  </div>
                  <div className="historial-detail-column">
                    <span className="historial-detail-title">Moneda destino</span>
                    <span className="historial-detail-value">
                      {tx.to_currency}
                    </span>
                  </div>
                </div>

                {/* Si hubo cambio de moneda, mostramos conversión */}
                {mostrarConversion && (
                  <div className="historial-conversion">
                    <span className="historial-conversion-label">
                      Conversión de moneda
                    </span>
                    <span className="historial-conversion-rate">
                      Tasa de cambio: {tx.exchange_rate.toFixed(4)}
                    </span>
                    <span className="historial-conversion-amount">
                      Monto convertido: {tx.converted_amount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
