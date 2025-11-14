// pages/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso no autorizado</h2>
        <p className="mb-4">No tienes permisos para acceder a esta página.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;