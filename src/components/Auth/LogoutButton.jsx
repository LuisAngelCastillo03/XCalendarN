// src/components/UI/LogoutButton.jsx
import React from 'react';
import { LogOut } from 'react-feather';

const LogoutButton = ({ onLogout }) => {
  return (
    <button className="logout-button" onClick={onLogout} title="Cerrar sesión" style={{
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      width: '100%',
      fontSize: '1rem',
      gap: '0.5rem',
      outline: 'none',
    }}>
      <LogOut size={18} />
      <span style={{ display: 'inline-block' }}>Cerrar sesión</span>
    </button>
  );
};

export default LogoutButton;
