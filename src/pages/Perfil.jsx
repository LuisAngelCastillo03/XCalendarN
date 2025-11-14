import React from 'react';
import { useAuth } from '../context/AuthContext';
import UploadProfilePicture from '../components/UploadProfilePicture'; // Importar componente para subir foto

const Perfil = () => {
  const { user } = useAuth();

  // Mostrar mensaje de carga mientras se obtiene el usuario
  if (!user) {
    return <p>Cargando usuario...</p>;
  }

  return (
    <div className="container mt-5">
      <h2>Perfil de Usuario</h2>
      
      {/* Sección de información básica */}
      <div className="profile-info-section">
        <div className="profile-avatar-container">
          {user.foto_perfil ? (
            <img 
              src={user.foto_perfil} 
              alt="Perfil" 
              className="profile-avatar" 
            />
          ) : (
            <div className="avatar-placeholder">
              {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>
        
        <div className="profile-details">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Rol:</strong> {user.rol}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>
      
      {/* Componente para subir foto de perfil */}
      <div className="mt-4">
        <h4>Cambiar foto de perfil</h4>
        <UploadProfilePicture />
      </div>
    </div>
  );
};

export default Perfil;