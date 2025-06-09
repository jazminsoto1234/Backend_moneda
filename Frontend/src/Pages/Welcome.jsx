import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-screen">
      <div className="title-box">
        <h1 className="title">CashFlow</h1>
      </div>
      <div className="actions">
        <button className="btn btn-dark" onClick={() => navigate('/login')}>Login</button>
        <button className="btn btn-outline" onClick={() => navigate('/register')}>Register</button>
        <a href="#" className="guest-link">Continue as a guest</a>
      </div>
    </div>
  );
}
