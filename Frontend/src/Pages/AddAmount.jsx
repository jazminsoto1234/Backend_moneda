// src/pages/AddAmount.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddAmount.css";

export default function AddAmount({
  accounts,
  selectedAccountIndex,
  setAccounts,
}) {
  const navigate = useNavigate();
  const [amountToAdd, setAmountToAdd] = useState(""); // monto que ingresa el usuario
  const [errorMessage, setErrorMessage] = useState(""); // para mostrar errores
  const [isSubmitting, setIsSubmitting] = useState(false); // para deshabilitar botón

  // Si aún no hay cuentas cargadas:
  if (!accounts || accounts.length === 0) {
    return (
      <div className="aa-container">
        <p className="aa-loading">Cargando información de la cuenta...</p>
      </div>
    );
  }

  // Cuenta actualmente seleccionada:
  const account = accounts[selectedAccountIndex];
  const currentBalance = account.balance;

  // Convertir el input a float (o 0 si está vacío)
  const parsedAmount = parseFloat(amountToAdd) || 0;
  const newBalance = currentBalance + parsedAmount;

  // Prefijo de moneda
  const currencyPrefix = account.currency === "PEN" ? "S/." : "$";

  const handleConfirm = async () => {
    setErrorMessage("");

    // 1) Validación: monto debe ser mayor que 0
    if (parsedAmount <= 0) {
      setErrorMessage("Ingrese un monto mayor a 0.");
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    try {
      // 2) POST para añadir dinero
      const response = await fetch(
        "https://backend-monedas.onrender.com/user/addmoney",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: account.id,
            amount: parsedAmount,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        // Si la API devuelve error, lo mostramos
        setErrorMessage(data.message || "No se pudo añadir el monto.");
        setIsSubmitting(false);
        return;
      }

      // 3) Como el backend quizás NO está devolviendo el balance actualizado,
      //    calculamos nosotros el nuevo balance localmente:
      const updatedAccount = {
        ...account,
        balance: newBalance,
      };

      // 4) Reemplazamos la cuenta antigua en el arreglo
      const newAccountsArray = accounts.map((acc, idx) =>
        idx === selectedAccountIndex ? updatedAccount : acc
      );
      setAccounts(newAccountsArray);

      // 5) Volvemos a Home
      navigate("/app/home");
    } catch (err) {
      console.error(err);
      setErrorMessage("Error de conexión. Intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/app/home");
  };

  return (
    <div className="aa-container">
      {/* 1) Título centrado */}
      <h1 className="aa-title">Add Amount</h1>

      {/* 2) Recuadro con el balance actual */}
      <div className="aa-current-balance-card">
        <div className="aa-balance-info">
          <span className="aa-balance-label">Current Balance</span>
          <span className="aa-balance-amount">
            {currencyPrefix} {currentBalance.toLocaleString()}
          </span>
        </div>
        <div className="aa-balance-decoration-wrapper">
          <img
            src="/leaf.png"
            alt="Decoración"
            className="aa-balance-decoration"
          />
        </div>
      </div>

      {/* 3) Recuadro “Enter Amount” */}
      <div className="aa-entry-card">
        {/* 3.1) Label “Enter Amount” */}
        <label htmlFor="amountInput" className="aa-entry-label">
          Enter Amount
        </label>

        {/* 3.2) Wrapper del input con prefijo de moneda */}
        <div className="aa-input-wrapper">
          <span className="aa-currency-prefix">{currencyPrefix}</span>
          <input
            type="number"
            id="amountInput"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amountToAdd}
            onChange={(e) => setAmountToAdd(e.target.value)}
            className="aa-input"
          />
        </div>

        {/* 3.3) Fila “New Balance” (vista previa) */}
        <div className="aa-new-balance-row">
          <span className="aa-new-balance-label">New Balance</span>
          <span className="aa-new-balance-amount">
            {currencyPrefix}{" "}
            {Number(newBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {/* 4) Mensaje de error, si existe */}
      {errorMessage && (
        <p className="aa-error-message">{errorMessage}</p>
      )}

      {/* 5) Botones “Confirm Addition” y “Cancel” */}
      <button
        className="aa-confirm-btn"
        onClick={handleConfirm}
        disabled={isSubmitting}
      >
        Confirm Addition
      </button>
      <button className="aa-cancel-btn" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
}
