import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FiBell, FiCheck, FiAlertCircle, FiClock } from 'react-icons/fi';

const StudentNotificationsPage = () => {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser || currentUser.rol !== 'alumno' || !currentUser.matricula) {
      setError('Acceso no autorizado');
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      setLoading(true);
      setError('');
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost';
        const endpoint = `${API_URL}/modulo_agenda/backend/scripts/get_student_notifications.php`;
        
        const response = await axios.get(endpoint, {
          params: { matricula: currentUser.matricula },
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        // Manejar diferentes formatos de respuesta
        if (Array.isArray(response.data)) {
          // Respuesta exitosa: array de notificaciones
          const formattedNotifications = response.data.map(notif => ({
            ...notif,
            read: Boolean(notif.read) // Convertir a booleano
          }));
          setNotifications(formattedNotifications);
        } else if (response.data && response.data.error) {
          // Respuesta con error
          setError(response.data.error);
          setNotifications([]);
        } else {
          // Respuesta inesperada
          setError('Formato de respuesta inesperado del servidor');
          setNotifications([]);
        }
      } catch (err) {
        console.error('Error al obtener notificaciones:', err);
        if (err.code === 'ECONNABORTED') {
          setError('El servidor tardó demasiado en responder');
        } else if (err.response) {
          // Manejar respuesta de error del servidor
          if (err.response.data && err.response.data.error) {
            setError(err.response.data.error);
          } else {
            setError(`Error ${err.response.status}: ${err.response.statusText}`);
          }
        } else if (err.request) {
          // No se recibió respuesta
          setError('No se pudo conectar con el servidor. Verifica:');
          setError(prev => `${prev}\n1. Que el servidor esté corriendo`);
          setError(prev => `${prev}\n2. Que la URL sea correcta`);
          setError(prev => `${prev}\n3. Tu conexión a internet`);
        } else {
          // Error inesperado
          setError(err.message || 'Error desconocido');
        }
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [authLoading, currentUser]);

  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    // Aquí iría la llamada API para actualizar el estado en el backend
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    // Aquí iría la llamada API para actualizar todas las notificaciones
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <div className="loading-animation">
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 60vh;
          }
          .loading-animation {
            width: 300px;
          }
          .loading-bar {
            height: 20px;
            background: #3a86ff;
            border-radius: 4px;
            margin-bottom: 16px;
            animation: pulse 1.5s infinite ease-in-out;
          }
          .loading-bar:last-child {
            width: 70%;
            animation-delay: 0.2s;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <FiAlertCircle size={48} className="error-icon" />
        <h2>Error</h2>
        <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
            text-align: center;
            color: #dc2626;
          }
          .error-icon {
            margin-bottom: 1rem;
          }
          h2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
          }
          p {
            color: #333;
            max-width: 400px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <header className="notifications-header">
        <div className="title-container">
          <FiBell size={28} className="bell-icon" />
          <h1>Tus Notificaciones</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        
        <div className="filter-controls">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Todas
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveFilter('unread')}
          >
            No leídas
          </button>
          {unreadCount > 0 && (
            <button 
              className="mark-all-btn"
              onClick={markAllAsRead}
            >
              <FiCheck size={16} />
              Marcar todas
            </button>
          )}
        </div>
      </header>

      {filteredNotifications.length === 0 ? (
        <div className="empty-state">
          <FiClock size={48} className="clock-icon" />
          <p>No hay notificaciones {activeFilter === 'unread' ? 'no leídas' : ''}</p>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${notification.read ? 'read' : 'unread'}`}
              onClick={() => !notification.read && markNotificationAsRead(notification.id)}
            >
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                {notification.date && (
                  <div className="notification-meta">
                    <span className="notification-date">
                      {new Date(notification.date).toLocaleString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {!notification.read && (
                      <span className="unread-dot"></span>
                    )}
                  </div>
                )}
              </div>
              {!notification.read && (
                <button
                  className="mark-read-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationAsRead(notification.id);
                  }}
                >
                  <FiCheck size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .notifications-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .notifications-header {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .title-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }
        
        .bell-icon {
          color: #3a86ff;
        }
        
        h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0;
        }
        
        .unread-badge {
          background-color: #3a86ff;
          color: white;
          border-radius: 9999px;
          padding: 0.25rem 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          margin-left: 0.5rem;
        }
        
        .filter-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .filter-btn {
          padding: 0.5rem 1rem;
          border: none;
          background: none;
          cursor: pointer;
          font-weight: 500;
          color: #4a5568;
          border-radius: 4px;
          transition: all 0.2s;
          border: 1px solid #e2e8f0;
        }
        
        .filter-btn.active {
          background-color: #3a86ff;
          color: white;
          border-color: #3a86ff;
        }
        
        .mark-all-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #edf2f7;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          color: #2d3748;
          transition: all 0.2s;
          margin-left: auto;
        }
        
        .mark-all-btn:hover {
          background-color: #3a86ff;
          color: white;
          border-color: #3a86ff;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 3rem 0;
          color: #718096;
          opacity: 0.7;
        }
        
        .clock-icon {
          color: #a0aec0;
        }
        
        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .notification-card {
          display: flex;
          justify-content: space-between;
          padding: 1.25rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        
        .notification-card.unread {
          background: linear-gradient(to right, white, #f7fafc);
          border-left: 4px solid #3a86ff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        
        .notification-card.read {
          background-color: white;
          border-left: 4px solid #e2e8f0;
          opacity: 0.85;
        }
        
        .notification-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-message {
          margin: 0;
          font-size: 0.95rem;
          color: #2d3748;
          line-height: 1.5;
        }
        
        .notification-card.unread .notification-message {
          font-weight: 500;
        }
        
        .notification-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: #718096;
          opacity: 0.7;
        }
        
        .unread-dot {
          width: 8px;
          height: 8px;
          background-color: #3a86ff;
          border-radius: 50%;
        }
        
        .mark-read-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background-color: #3a86ff;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          margin-left: 1rem;
          flex-shrink: 0;
          transition: all 0.2s;
          opacity: 0;
        }
        
        .notification-card:hover .mark-read-btn {
          opacity: 1;
        }
        
        .mark-read-btn:hover {
          background-color: #2563eb;
          transform: scale(1.1);
        }
        
        @media (max-width: 640px) {
          .notifications-header {
            flex-direction: column;
            gap: 1rem;
          }
          
          .filter-controls {
            flex-wrap: wrap;
          }
          
          .mark-all-btn {
            margin-left: 0;
            width: 100%;
            justify-content: center;
          }
          
          .notification-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentNotificationsPage;