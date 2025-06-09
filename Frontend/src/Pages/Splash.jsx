import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/welcome');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <h1 className="title">CashFlow</h1>
    </div>
  );
}
