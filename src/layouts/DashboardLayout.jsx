import React, { useState, useEffect } from 'react';
import Sidebar from '../components/UI/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Outlet } from 'react-router-dom';
import '../styles/Sidebar.css';
import '../styles/dashboard-layout.css';
import '../styles/components.css';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [profilePicModalOpen, setProfilePicModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Escuchar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile) {
        setShowMobileSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Alternar sidebar
  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileSidebar(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar envío de nueva foto
  const handleSubmit = () => {
    if (selectedFile) {
      // Aquí iría la lógica para subir la imagen al servidor
      console.log('Subiendo imagen:', selectedFile);
      // Luego de subirla, cerrar el modal
      setProfilePicModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl('');
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        isMobile={isMobile}
        sidebarCollapsed={sidebarCollapsed}
        showMobileSidebar={showMobileSidebar}
        toggleSidebar={toggleSidebar}
        onLogout={logout}
        user={user}
        onProfilePicClick={() => setProfilePicModalOpen(true)}
      />

      <main
        className={`main-content ${
          isMobile ? 'mobile' : sidebarCollapsed ? 'collapsed' : 'expanded'
        }`}
      >
        <Outlet />
      </main>

      {/* Modal para cambiar foto de perfil */}
      {profilePicModalOpen && (
        <div className="profile-pic-modal">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setProfilePicModalOpen(false)}>
              &times;
            </button>
            <h3>Cambiar foto de perfil</h3>
            
            <div className="preview-container">
              <div className="current-pic">
                <h4>Foto actual</h4>
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=4e73df&color=fff`} 
                  alt="Current profile" 
                  className="avatar-preview"
                />
              </div>
              
              <div className="new-pic">
                <h4>Nueva foto</h4>
                <img 
                  src={previewUrl || 'https://via.placeholder.com/120?text=Selecciona+una+imagen'} 
                  alt="Preview" 
                  className="avatar-preview"
                />
                <label className="file-input-label">
                  Seleccionar imagen
                  <input 
                    type="file" 
                    className="file-input" 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setProfilePicModalOpen(false)}>
                Cancelar
              </button>
              <button 
                className="confirm-btn" 
                onClick={handleSubmit}
                disabled={!selectedFile}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;