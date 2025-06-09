// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import eyeOpen from '../assets/show.png';
import eyeClosed from '../assets/hide.png';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  // Para mostrar mensajes de error o éxito
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  // Expresión regular simple para validar los dominios requeridos
  const validEmailDomain = (em) => {
    return /@(gmail\.com|hotmail\.com|utec\.edu\.pe)$/.test(em);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // 1) Campos vacíos
    if (!username || !email || !password || !confirmPassword) {
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

    // 3) Contraseñas coinciden
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    // 4) Hacer petición POST al backend
    try {
      const response = await fetch(
        'https://backend-monedas.onrender.com/user/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Si el backend devuelve status != 2xx, mostrar mensaje de error
        setErrorMessage(
          data.message || 'Error al registrarse. Intenta de nuevo.'
        );
      } else {
        // 201 Created: registro exitoso
        setSuccessMessage('¡Registro completado correctamente!');
        // Opcional: esperar 1 segundo y redirigir
        setTimeout(() => {
          navigate('/login');
        }, 1000);
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

        {/* Username */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="auth-input"
        />

        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="auth-input"
        />

        {/* Contraseña */}
        <div className="input-password-container">
          <input
            type={showPass1 ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="auth-input"
          />
          <img
            src={showPass1 ? eyeClosed : eyeOpen}
            className="eye-icon"
            onClick={() => setShowPass1(!showPass1)}
            alt="toggle"
          />
        </div>

        {/* Confirmar contraseña */}
        <div className="input-password-container">
          <input
            type={showPass2 ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="auth-input"
          />
          <img
            src={showPass2 ? eyeClosed : eyeOpen}
            className="eye-icon"
            onClick={() => setShowPass2(!showPass2)}
            alt="toggle"
          />
        </div>

        {/* Mostrar mensaje de error (en rojo), si lo hay */}
        {errorMessage && (
          <span style={{ color: 'red', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            {errorMessage}
          </span>
        )}

        {/* Mostrar mensaje de éxito (en verde), si lo hay */}
        {successMessage && (
          <span style={{ color: 'green', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            {successMessage}
          </span>
        )}

        {/* Botón “Register” */}
        <button className="btn btn-dark" onClick={handleRegister}>
          Register
        </button>

        {/* Resto de botones sociales y footer */}
        <div className="divider">───────────── Or Register with ─────────────</div>
        <div className="social-buttons">
          <button className="social-btn" onClick={() => alert('Register with Facebook')}>
            <img src="/facebook.png" alt="Facebook" />
          </button>
          <button className="social-btn" onClick={() => alert('Register with Google')}>
            <img src="/google.png" alt="Google" />
          </button>
          <button className="social-btn" onClick={() => alert('Register with Apple')}>
            <img src="/apple.png" alt="Apple" />
          </button>
        </div>

        <p className="auth-footer">
          <span style={{ color: '#111' }}>Already have an account?</span>{' '}
          <Link to="/login" className="auth-link-colored">
            Login Now
          </Link>
        </p>
      </div>
    </div>
  );
}
