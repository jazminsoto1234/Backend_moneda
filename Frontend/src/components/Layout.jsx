// src/components/Layout.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./Layout.css"; // estilos del sidebar

export default function Layout() {
  return (
    <div className="layout-container">
      {/* Sidebar lateral */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          {/* Puedes poner aquí el nombre / logo de tu app */}
          <h2>CashFlow</h2>
        </div>

        <ul className="sidebar-menu">
          <li>
            <NavLink
              to="/app/home"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {/* Icono “Home” */}
              <img
                src="/Home.png"
                alt="Home"
                className="sidebar-icon"
              />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
               to="/app/historial"
               className={({ isActive }) =>
                 isActive ? "sidebar-link active" : "sidebar-link"
               }
             >
               <img
                 src="/Historial.png"
                 alt="History"
                 className="sidebar-icon"
               />
               Historial
             </NavLink>
          </li>
          <li>
            <NavLink
               to="/app/account"
               className={({ isActive }) =>
                 isActive ? "sidebar-link active" : "sidebar-link"
               }
             >
               <img
                 src="/User.png"
                 alt="Account"
                 className="sidebar-icon"
               />
               Cuenta
             </NavLink>
          </li>
          <li>
            <NavLink
              to="/app/transfer"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {/* Reemplaza "/Transfer.png" por la ruta real de tu icono de Transferencias */}
              <img
                src="/Transfer.png"
                alt="Transferencias"
                className="sidebar-icon"
              />
              Transferencias
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Contenido principal (Home, SelectAccount, etc) */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
