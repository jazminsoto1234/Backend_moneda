// src/pages/CurrencyConversion.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CurrencyConversion.css";

export default function CurrencyConversion({
  accounts,
  selectedAccountIndex,
  setAccounts,
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 1) Cuenta activa (ya viene con campo `number` = nro_cuenta real)
  const account = accounts[selectedAccountIndex];
  const { number: fromAccountNumber, balance: fromBalance, currency: fromCurrency } =
    account;

  // 2) Estados para la conversión
  const [currencyList, setCurrencyList] = useState([]); // ej: ["USD", "PEN", ...]
  const [toCurrency, setToCurrency] = useState(""); // moneda destino
  const [exchangeRate, setExchangeRate] = useState(1); // tasa en vivo
  const [fromAmount, setFromAmount] = useState(""); // monto que ingresa usuario
  const [toAmount, setToAmount] = useState(""); // resultado en destino
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Si aún no hay cuentas cargadas, mostramos un cargando
  if (!accounts || accounts.length === 0) {
    return (
      <div className="cc-container">
        <p className="cc-loading">Cargando información de la cuenta...</p>
      </div>
    );
  }

  // 3) Al montar: traemos la lista de monedas soportadas
  useEffect(() => {
     if (!token) return;
 
     fetch("https://backend-monedas.onrender.com/exchange/codes", {
       method: "GET",
       headers: { Authorization: `Bearer ${token}` },
     })
       .then((r) => r.json())
       .then((data) => {
         // `supported_codes` llega como  [["PEN","Peruvian Sol"],["USD","United States Dollar"], ...]
         const list = (data.codes || data.supported_codes || []).map(
           ([code, name]) => ({ code, name })
         );
         setCurrencyList(list);
 
         // Primer destino que NO sea la moneda de la cuenta
         const firstDest =
           list.find((c) => c.code !== fromCurrency)?.code || "";
         setToCurrency(firstDest);
       })
       .catch((err) => console.error(err));
   }, [fromCurrency, token]);

  // 4) Cada vez que cambie fromCurrency o toCurrency: pedimos la tasa
  useEffect(() => {
    if (!toCurrency || !fromCurrency || toCurrency === fromCurrency) {
      setExchangeRate(1);
      return;
    }
    if (!token) return;

    fetch(
      `https://backend-monedas.onrender.com/exchange/tasaconversion?from=${fromCurrency}&to=${toCurrency}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo obtener la tasa");
        return res.json();
      })
      .then((data) => {
        setExchangeRate(data.rate);
      })
      .catch((err) => {
        console.error(err);
        setExchangeRate(1);
      });
  }, [fromCurrency, toCurrency, token]);

  // 5) Cada vez que cambie fromAmount O exchangeRate O toCurrency: pedimos el monto convertido
  useEffect(() => {
    if (!fromAmount || !toCurrency || !fromCurrency) {
      setToAmount("");
      return;
    }
    if (!token) return;

    fetch(
      `https://backend-monedas.onrender.com/exchange/rate?from=${fromCurrency}&to=${toCurrency}&amount=${fromAmount}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo convertir el monto");
        return res.json();
      })
      .then((data) => {
        setToAmount(data.result.toFixed(2));
      })
      .catch((err) => {
        console.error(err);
        setToAmount("");
      });
  }, [fromAmount, fromCurrency, toCurrency, token]);

  // Función para intercambiar monedas (no necesaria en este momento)
  const handleSwapCurrencies = () => {
    // Por si queremos que el ícono invierta “from” ↔ “to” en el futuro
    // let temp = fromCurrency;
    // setFromCurrency(toCurrency);
    // setToCurrency(temp);
  };

  // 6) handleExchange: hace POST a /exchange/transfer
  const handleExchange = () => {
    setErrorMessage("");

    const amountNum = parseFloat(fromAmount);
    if (!amountNum || amountNum <= 0) {
      setErrorMessage("Ingrese un monto válido.");
      return;
    }
    // Verificar que exista una cuenta destino en `toCurrency`:
    const destAccount = accounts.find((a) => a.currency === toCurrency);
    if (!destAccount) {
      setErrorMessage("No existe cuenta destino en esa moneda.");
      return;
    }

    // Construimos el payload:
    const payload = {
      from_nro_cuenta: fromAccountNumber,
      to_nro_cuenta: destAccount.number,
      amount: amountNum,
    };

    // Ejecutamos la transferencia:
    fetch("https://backend-monedas.onrender.com/exchange/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, body: data })))
      .then(({ ok, body }) => {
        if (!ok) {
          setErrorMessage(body.message || "Error en la transferencia.");
          return;
        }

        // 6.1) El backend devuelve “monto_convertido”
        const convertedAmt = body.monto_convertido;

        // 6.2) Actualizamos localmente los balances:
        const newAccounts = accounts.map((acct) => {
          if (acct.id === account.id) {
            // Resta de la cuenta origen
            return {
              ...acct,
              balance: acct.balance - amountNum,
            };
          } else if (acct.id === destAccount.id) {
            // Suma a la cuenta destino
            return {
              ...acct,
              balance: acct.balance + convertedAmt,
            };
          }
          return acct;
        });

        setAccounts(newAccounts);
        // 6.3) Redirigir a Home
        navigate("/app/home");
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Error de conexión. Intenta de nuevo.");
      });
  };

  // 7) Función para cerrar el dropdown
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const selectCurrency = (code) => {
    setToCurrency(code);
    setShowDropdown(false);
  };

  return (
    <div className="cc-container">
      {/* Título */}
      <h1 className="cc-title">Currency Conversion</h1>

      {/* 1) Recuadro con datos de la cuenta activa */}
      <div className="cc-account-card">
        <div className="cc-account-left">
          <span className="cc-account-name">{account.name}</span>
          {/* Mostrar nro_cuenta real */}
          <span className="cc-account-number">{account.number}</span>
          <span className="cc-account-branch">{account.branch}</span>
        </div>
        <div className="cc-account-right">
          <span className="cc-account-balance">
            {fromCurrency} {fromBalance.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 2) Caja de conversión */}
      <div className="cc-conversion-box">
        {/* 2.1) From */}
        <div className="cc-input-group">
          <label className="cc-label">From</label>
          <div className="cc-input-wrapper">
            <input
              type="number"
              className="cc-input"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
            />
            <span className="cc-input-currency">{fromCurrency}</span>
          </div>
        </div>

        {/* 2.2) Icono de intercambio (swap), opcional */}
        <div className="cc-swap-icon-wrapper">
          <img
            src="/exchange.png"
            alt="Swap"
            className="cc-swap-icon"
            onClick={handleSwapCurrencies}
          />
        </div>

        {/* 2.3) To */}
        <div className="cc-input-group">
          <label className="cc-label">To</label>
          <div className="cc-input-wrapper cc-with-dropdown">
            <input
              type="text"
              className="cc-input"
              placeholder="0.00"
              value={toAmount}
              readOnly
            />
            <button
              className="cc-input-currency cc-currency-button"
              onClick={toggleDropdown}
            >
              {toCurrency || "---"}
              <span className="cc-caret">▾</span>
            </button>
          </div>

          {/* Dropdown superpuesto */}
          {showDropdown && (
            <div className="cc-dropdown-overlay">
              <div className="cc-dropdown-list">
                <div className="cc-dropdown-header">
                  <span>Select the currency</span>
                  <button
                    className="cc-dropdown-close"
                    onClick={() => setShowDropdown(false)}
                  >
                    ×
                  </button>
                </div>
                <ul>
                  {currencyList.map(({ code, name }) => (
                    <li
                    key={code}
                    className={code === toCurrency ? "cc-dropdown-item selected" : "cc-dropdown-item"}
                    onClick={() => selectCurrency(code)}
                    >
                      {code} – {name}
                    </li>
                  ))}   
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 2.4) Currency rate en tiempo real */}
        <div className="cc-exchange-rate">
          {fromCurrency} → {toCurrency}: 1 {fromCurrency} = {exchangeRate}{" "}
          {toCurrency}
        </div>

        {/* Mensaje de error, si existe */}
        {errorMessage && (
          <p className="cc-error-message">{errorMessage}</p>
        )}

        {/* 2.5) Botón “Exchange” */}
        <button
          className="cc-exchange-button"
          onClick={handleExchange}
          disabled={!fromAmount || !toCurrency || fromCurrency === toCurrency}
        >
          Exchange
        </button>
      </div>
    </div>
  );
}
