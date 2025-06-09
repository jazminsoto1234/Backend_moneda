// src/pages/Transfer.jsx
import React, { useState, useEffect } from "react";
import Modal from "../components/Modal"; // (Ver nota al final para un Modal sencillo)
import "./Transfer.css";

export default function Transfer({
  accounts,
  selectedAccountIndex,
  setAccounts,
}) {
  // 1) Obtenemos la cuenta activa
  const account = accounts[selectedAccountIndex] || null;

  // 2) Estados locales
  const [loading, setLoading] = useState(true);
  const [fromBalance, setFromBalance] = useState(0);
  const [fromAccountNumber, setFromAccountNumber] = useState("");
  const [currency, setCurrency] = useState("");

  const [destAccountNumber, setDestAccountNumber] = useState("");
  const [amountToSend, setAmountToSend] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transferredAmount, setTransferredAmount] = useState(0);

  // 3) Al montar, cargamos datos básicos de “from” (balance, número, moneda)
  useEffect(() => {
    if (!account) {
      setLoading(false);
      return;
    }

    // Ya tenemos account.balance, account.number y account.currency
    setFromBalance(account.balance);
    setFromAccountNumber(account.number);
    setCurrency(account.currency);
    setLoading(false);
  }, [account]);

  // 4) Handler para confirmar la transferencia
  const handleConfirm = async () => {
    setErrorMessage("");
    const parsedAmount = parseFloat(amountToSend);

    // Validaciones mínimas
    if (!destAccountNumber) {
      setErrorMessage("Debes ingresar el número de cuenta destino.");
      return;
    }
    if (!parsedAmount || parsedAmount <= 0) {
      setErrorMessage("Ingresa un monto válido (> 0).");
      return;
    }
    if (parsedAmount > fromBalance) {
      setErrorMessage("No tienes suficiente saldo.");
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("No autenticado.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(
        "https://backend-monedas.onrender.com/exchange/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            from_nro_cuenta: fromAccountNumber,
            to_nro_cuenta: destAccountNumber,
            amount: parsedAmount,
          }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Error en la transferencia.");
        setIsSubmitting(false);
        return;
      }

      // 5) Si todo fue exitoso, “data.monto_convertido” es lo que llegó a la cuenta destino
      setTransferredAmount(parsedAmount);

      // 6) Actualizamos ambos balances localmente:
      const updatedAccounts = accounts.map((acc) => {
        if (acc.id === account.id) {
          // Resta de la cuenta origen
          return {
            ...acc,
            balance: acc.balance - parsedAmount,
          };
        } else if (acc.number === destAccountNumber) {
          // Suma en caso de que la cuenta destino sea propia
          return {
            ...acc,
            balance: acc.balance + data.monto_convertido,
          };
        }
        return acc;
      });

      setAccounts(updatedAccounts);

      // 7) Mostramos el modal de éxito
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error de conexión, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 8) Handler para cerrar el modal
  const closeModal = () => {
    setShowSuccessModal(false);
    // Opcional: limpiar campos para una nueva transferencia
    setDestAccountNumber("");
    setAmountToSend("");
  };

  // 9) Renderizar
  if (loading) {
    return (
      <div className="transfer-container">
        <p>Cargando datos de la cuenta…</p>
      </div>
    );
  }

  return (
    <div className="transfer-container">
      {/* A) Título */}
      <h1 className="transfer-title">Transferencias</h1>

      {/* B) Recuadro con saldo actual y número de cuenta */}
      <div className="transfer-balance-card">
        <div className="transfer-balance-left">
          <span className="transfer-balance-label">Saldo disponible</span>
          <span className="transfer-balance-amount">
            {currency} {fromBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="transfer-account-number">
            {fromAccountNumber}
          </span>
        </div>
        <div className="transfer-balance-icon">
          {/* Aquí podrías colocar un ícono de tarjeta si quieres */}
          <img src="/CardIcon.png" alt="Tarjeta" />
        </div>
      </div>

      {/* C) Formulario de Nueva Transferencia */}
      <div className="transfer-form">
        <label htmlFor="destAccount" className="transfer-label">
          Número de cuenta destino
        </label>
        <input
          id="destAccount"
          type="text"
          placeholder="Ingresa el número de cuenta"
          value={destAccountNumber}
          onChange={(e) => setDestAccountNumber(e.target.value)}
          className="transfer-input"
        />

        <label htmlFor="amount" className="transfer-label">
          Monto a transferir
        </label>
        <div className="transfer-amount-wrapper">
          <span className="transfer-currency-symbol">
            {currency === "PEN" ? "S/." : "$"}
          </span>
          <input
            id="amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={amountToSend}
            onChange={(e) => setAmountToSend(e.target.value)}
            className="transfer-input transfer-input-amount"
          />
        </div>

        {errorMessage && (
          <p className="transfer-error">{errorMessage}</p>
        )}

        {/* Botones: “Confirmar Transferencia” y “Cancelar” */}
        <div className="transfer-buttons">
          <button
            className="transfer-btn confirm"
            disabled={
              !destAccountNumber ||
              !amountToSend ||
              isSubmitting
            }
            onClick={handleConfirm}
          >
            Confirmar Transferencia
          </button>
          <button
            className="transfer-btn cancel"
            onClick={() => {
              setDestAccountNumber("");
              setAmountToSend("");
            }}
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* D) Modal de Éxito */}
      {showSuccessModal && (
        <Modal onClose={closeModal}>
          <div className="transfer-modal-content">
            <h2 className="transfer-modal-title">
              Transferencia exitosa
            </h2>
            <p className="transfer-modal-amount">
              Se transfirieron {currency}{" "}
              {parseFloat(transferredAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <img
              src="/check-icon.png"
              alt="Check"
              className="transfer-modal-check"
            />
            <button
              className="transfer-modal-close"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
