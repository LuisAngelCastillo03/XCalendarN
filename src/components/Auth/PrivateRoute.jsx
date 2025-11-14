import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const rolUsuario = user.rol?.toLowerCase();
  const rolesPermitidos = allowedRoles.map(r => r.toLowerCase());

  if (!rolesPermitidos.includes(rolUsuario)) {
    return (
      <div className="container mt-5 text-center">
        <h2>Acceso no autorizado</h2>
        <p>No tienes permisos para acceder a esta página.</p>
        <a href="/" className="btn btn-primary mt-3">Volver al inicio</a>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
