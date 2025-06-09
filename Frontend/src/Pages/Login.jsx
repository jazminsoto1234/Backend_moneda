// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import eyeOpen from '../assets/show.png'; 
import eyeClosed from '../assets/hide.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Misma función para validar dominio de email
  const validEmailDomain = (em) => {
    return /@(gmail\.com|hotmail\.com|utec\.edu\.pe)$/.test(em);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // 1) Campos vacíos
    if (!email || !password) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    // 2) Validar dominio de email
    if (!validEmailDomain(email)) {
      setErrorMessage(
        'El email debe terminar con @gmail.com, @hotmail.com o @utec.edu.pe'
      );
      return;
    }

    // 3) Enviar petición al backend (nota: backend espera “username”)
    try {
      const response = await fetch(
        'https://backend-monedas.onrender.com/user/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // En el body enviamos “username” igual al email:
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Credenciales incorrectas.');
      }else {
        // ★ GUARDAMOS el token en localStorage
        localStorage.setItem("token", data.access_token);
        // → Ahora sí redirigimos a Home
        navigate("/app/home");
      }
    } catch (err) {
      setErrorMessage('Error de conexión. Intenta más tarde.');
      console.error(err);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-box">
        <h1 className="auth-title">CashFlow</h1>

        {/* Input de email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="auth-input"
        />

        {/* Input de password + ícono para mostrar/ocultar */}
        <div className="input-password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="auth-input"
          />
          <img
            src={showPassword ? eyeClosed : eyeOpen}
            alt="Toggle visibility"
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>

        <div className="auth-options">
          <a href="#" className="auth-link">
            Forgot Password?
          </a>
        </div>

        {/* Mensaje de error si lo hubiera */}
        {errorMessage && (
          <span style={{ color: 'red', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            {errorMessage}
          </span>
        )}

        {/* Botón Login */}
        <button className="btn btn-dark" onClick={handleLogin}>
          Login
        </button>

        <div className="divider">────────────── Or Login with ──────────────</div>
        <div className="social-buttons">
          <button className="social-btn" onClick={() => alert('Login with Facebook')}>
            <img src="/facebook.png" alt="Facebook" />
          </button>
          <button className="social-btn" onClick={() => alert('Login with Google')}>
            <img src="/google.png" alt="Google" />
          </button>
          <button className="social-btn" onClick={() => alert('Login with Apple')}>
            <img src="/apple.png" alt="Apple" />
          </button>
        </div>

        <p className="auth-footer">
          <span style={{ color: '#111' }}>Don't have an account?</span>{' '}
          <Link to="/register" className="auth-link-colored">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}
