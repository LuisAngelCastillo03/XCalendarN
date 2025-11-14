// src/components/UI/Sidebar.jsx
import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Menu, Users, Calendar, Bell, LogOut, BookOpen,
  ChevronLeft, ChevronRight, Clock, Camera, X
} from 'react-feather';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../../styles/Sidebar.css';

const Sidebar = ({ isMobile, sidebarCollapsed, showMobileSidebar, toggleSidebar, onLogout }) => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [showChangePhotoModal, setShowChangePhotoModal] = useState(false);
  const [tempProfilePic, setTempProfilePic] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const sidebarClass = `
    sidebar
    ${sidebarCollapsed ? 'collapsed' : ''}
    ${isMobile && showMobileSidebar ? 'mobile-sidebar open' : ''}
  `;

  const handleAvatarClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfilePic(reader.result);
        setShowChangePhotoModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfilePicture = async () => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('foto', selectedFile);
      formData.append('id', user.id || user.matricula);
      formData.append('rol', user.rol);

      const response = await axios.post(
        'http://localhost/modulo_agenda/backend/upload_foto.php',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        updateUser({ ...user, foto_perfil: response.data.foto_url });
        setShowChangePhotoModal(false);
        setTempProfilePic(null);
        setSelectedFile(null);
      } else {
        throw new Error(response.data.message || 'Error al subir la imagen');
      }
    } catch (error) {
      alert('Error al actualizar la foto de perfil');
    } finally {
      setIsUploading(false);
    }
  };

  const renderLinks = () => {
    if (!user) return null;
    const role = user.rol;
    const navItems = {
      administrador: [
        { to: "/admin", icon: <Calendar size={20} />, label: "Horario" },
        { to: "/administrador/docentes", icon: <Users size={20} />, label: "Docentes" },
        { to: "/administrador/alumnos", icon: <Users size={20} />, label: "Alumnos" }
      ],
      profesor: [
        { to: "/profesor/mis-clases", icon: <BookOpen size={20} />, label: "Mis clases" },
        { to: "/profesor/notificaciones", icon: <Bell size={20} />, label: "Notificaciones" }
      ],
      alumno: [
        { to: "/alumno", icon: <Calendar size={20} />, label: "Calendario" },
        { to: "/alumno/notificaciones", icon: <Bell size={20} />, label: "Notificaciones" },
        { to: "/alumno/historial", icon: <Clock size={20} />, label: "Historial" }
      ]
    };

    return navItems[role]?.map((item, idx) => (
      <li key={idx}>
        <NavLink
          to={item.to}
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={isMobile ? toggleSidebar : undefined}
        >
          {item.icon} {!sidebarCollapsed && <span>{item.label}</span>}
        </NavLink>
      </li>
    ));
  };

  return (
    <>
      {/* Botón flotante solo en móvil */}
      {isMobile && (
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Abrir menú">
          <Menu size={24} />
        </button>
      )}

      <nav className={sidebarClass}>
        {/* Botón siempre visible para colapsar/expandir en escritorio */}
        {!isMobile && (
          <button
            className="collapse-toggle fixed-toggle"
            onClick={toggleSidebar}
            aria-label="Alternar sidebar"
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}

        {/* Logo */}
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-circle" />
            {!sidebarCollapsed && <h2 className="sidebar-title">Learning Online</h2>}
          </div>
        </div>

        {/* Navegación */}
        <div className="sidebar-nav">
          <ul>{renderLinks()}</ul>
        </div>

        {/* Perfil del usuario */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="profile-avatar-container" onClick={handleAvatarClick}>
              {user?.foto_perfil && user.foto_perfil !== 'default.jpg' ? (
                <img src={user.foto_perfil} className="avatar-img" alt="Foto" />
              ) : (
                <div className="avatar-circle">{user?.nombre?.[0] || 'U'}</div>
              )}
              <div className="camera-icon"><Camera size={12} /></div>
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            {!sidebarCollapsed && (
              <div className="profile-info">
                <span className="profile-name">{user?.nombre}</span>
                <span className="profile-email">{user?.email}</span>
                <span className="profile-role centered-role">{user?.rol}</span>
              </div>
            )}
          </div>
          <button className="logout-button" onClick={onLogout}>
            <LogOut size={20} /> {!sidebarCollapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </nav>

      {/* Fondo oscuro para sidebar móvil */}
      {isMobile && showMobileSidebar && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}

      {/* Modal para cambiar foto */}
      {showChangePhotoModal && (
        <div className="profile-pic-modal">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowChangePhotoModal(false)}>
              <X size={20} />
            </button>
            <h3>¿Deseas cambiar tu foto de perfil?</h3>
            <div className="preview-container">
              <div className="current-pic">
                <h4>Actual</h4>
                {user?.foto_perfil ? (
                  <img src={user.foto_perfil} alt="Actual" />
                ) : (
                  <div className="avatar-circle">{user?.nombre?.[0]}</div>
                )}
              </div>
              <div className="new-pic">
                <h4>Nueva</h4>
                <img src={tempProfilePic} alt="Nueva" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowChangePhotoModal(false)}>
                Cancelar
              </button>
              <button className="confirm-btn" onClick={updateProfilePicture} disabled={isUploading}>
                {isUploading ? 'Subiendo...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
