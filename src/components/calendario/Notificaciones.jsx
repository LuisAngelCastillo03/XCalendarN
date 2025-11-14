import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FiBell, FiCheck, FiAlertCircle, FiClock, FiFilter } from 'react-icons/fi';

const StudentNotificationsPage = () => {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [markingAsRead, setMarkingAsRead] = useState([]);

  // Memoizar la función de fetch para evitar recreaciones
  const fetchNotifications = useCallback(async () => {
    if (authLoading || !currentUser || currentUser.rol !== 'alumno' || !currentUser.matricula) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost';
      const endpoint = `${API_URL}/modulo_agenda/backend/scripts/get_student_notifications.php`;
      
      const response = await axios.get(endpoint, {
        params: { 
          matricula: currentUser.matricula,
          _t: Date.now() // Evitar cache
        },
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (Array.isArray(response.data)) {
        const formattedNotifications = response.data.map(notif => ({
          ...notif,
          id: notif.id || notif.ID || notif.notification_id, // Manejar diferentes nombres de ID
          read: Boolean(notif.read || notif.leido), // Manejar diferentes nombres
          date: notif.date || notif.fecha || notif.created_at // Manejar diferentes nombres de fecha
        }));
        setNotifications(formattedNotifications);
      } else if (response.data?.error) {
        setError(response.data.error);
        setNotifications([]);
      } else {
        setError('Formato de respuesta inesperado del servidor');
        setNotifications([]);
      }
    } catch (err) {
      console.error('Error al obtener notificaciones:', err);
      handleFetchError(err);
    } finally {
      setLoading(false);
    }
  }, [authLoading, currentUser]);

  // Separar el manejo de errores en una función
  const handleFetchError = (err) => {
    if (err.code === 'ECONNABORTED') {
      setError('El servidor tardó demasiado en responder. Intenta nuevamente.');
    } else if (err.response) {
      const status = err.response.status;
      if (status === 404) {
        setError('El servicio de notificaciones no está disponible.');
      } else if (status >= 500) {
        setError('Error del servidor. Por favor, intenta más tarde.');
      } else {
        setError(`Error ${status}: ${err.response.statusText}`);
      }
    } else if (err.request) {
      setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    } else {
      setError('Error inesperado: ' + (err.message || 'Error desconocido'));
    }
    setNotifications([]);
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mejorar la función de marcar como leído con feedback visual
  const markNotificationAsRead = async (id) => {
    if (markingAsRead.includes(id)) return;
    
    setMarkingAsRead(prev => [...prev, id]);
    
    try {
      // Aquí iría la llamada real al API
      // await axios.post('/mark-notification-read', { id });
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error al marcar como leída:', error);
      // Podrías mostrar un toast de error aquí
    } finally {
      setMarkingAsRead(prev => prev.filter(notifId => notifId !== id));
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    setMarkingAsRead(unreadIds);
    
    try {
      // await axios.post('/mark-all-notifications-read');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    } finally {
      setMarkingAsRead([]);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Componente de carga mejorado
  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando notificaciones...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 60vh;
            gap: 1rem;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f4f6;
            border-top: 4px solid #3a86ff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <div className="error-container">
        <FiAlertCircle size={48} className="error-icon" />
        <h2>Error al cargar notificaciones</h2>
        <p>{error}</p>
        <button 
          className="retry-btn"
          onClick={fetchNotifications}
        >
          Reintentar
        </button>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
            text-align: center;
            color: #dc2626;
            gap: 1rem;
            padding: 0 1rem;
          }
          .error-icon {
            margin-bottom: 0.5rem;
          }
          h2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0;
          }
          p {
            color: #6b7280;
            max-width: 400px;
            line-height: 1.5;
          }
          .retry-btn {
            padding: 0.75rem 1.5rem;
            background-color: #3a86ff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
          }
          .retry-btn:hover {
            background-color: #2563eb;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <header className="notifications-header">
        <div className="title-container">
          <div className="icon-wrapper">
            <FiBell size={28} className="bell-icon" />
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          <div>
            <h1>Tus Notificaciones</h1>
            <p className="subtitle">
              {notifications.length} notificación{notifications.length !== 1 ? 'es' : ''} en total
            </p>
          </div>
        </div>
        
        <div className="filter-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              <FiFilter size={14} />
              Todas ({notifications.length})
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'unread' ? 'active' : ''}`}
              onClick={() => setActiveFilter('unread')}
            >
              No leídas ({unreadCount})
            </button>
          </div>
          
          {unreadCount > 0 && (
            <button 
              className="mark-all-btn"
              onClick={markAllAsRead}
              disabled={markingAsRead.length > 0}
            >
              <FiCheck size={16} />
              {markingAsRead.length > 0 ? 'Procesando...' : 'Marcar todas'}
            </button>
          )}
        </div>
      </header>

      {filteredNotifications.length === 0 ? (
        <div className="empty-state">
          <FiClock size={64} className="clock-icon" />
          <h3>No hay notificaciones {activeFilter === 'unread' ? 'no leídas' : ''}</h3>
          <p>Cuando tengas nuevas notificaciones, aparecerán aquí.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${notification.read ? 'read' : 'unread'} ${
                markingAsRead.includes(notification.id) ? 'updating' : ''
              }`}
              onClick={() => !notification.read && markNotificationAsRead(notification.id)}
            >
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                {notification.date && (
                  <div className="notification-meta">
                    <span className="notification-date">
                      {new Date(notification.date).toLocaleString('es-MX', {
                        year: 'numeric',
                        month: 'short',
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
                  disabled={markingAsRead.includes(notification.id)}
                >
                  {markingAsRead.includes(notification.id) ? (
                    <div className="mini-spinner"></div>
                  ) : (
                    <FiCheck size={16} />
                  )}
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
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #f0f4f8;
        }
        
        .title-container {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        
        .icon-wrapper {
          position: relative;
          padding: 0.5rem;
          background: linear-gradient(135deg, #3a86ff, #2563eb);
          border-radius: 12px;
          color: white;
        }
        
        .bell-icon {
          display: block;
        }
        
        .unread-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: #ef4444;
          color: white;
          border-radius: 9999px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          min-width: 20px;
          text-align: center;
          border: 2px solid white;
        }
        
        h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.25rem 0;
        }
        
        .subtitle {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0;
        }
        
        .filter-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .filter-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .filter-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          border: 1px solid #d1d5db;
          background: white;
          cursor: pointer;
          font-weight: 500;
          color: #6b7280;
          border-radius: 8px;
          transition: all 0.2s;
          font-size: 0.875rem;
        }
        
        .filter-btn.active {
          background-color: #3a86ff;
          color: white;
          border-color: #3a86ff;
        }
        
        .filter-btn:hover:not(.active) {
          border-color: #9ca3af;
          background-color: #f9fafb;
        }
        
        .mark-all-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          color: white;
          transition: all 0.2s;
          font-size: 0.875rem;
        }
        
        .mark-all-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        .mark-all-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 4rem 2rem;
          color: #9ca3af;
          text-align: center;
        }
        
        .clock-icon {
          opacity: 0.5;
        }
        
        .empty-state h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
          color: #6b7280;
        }
        
        .empty-state p {
          margin: 0;
          max-width: 300px;
          line-height: 1.5;
        }
        
        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .notification-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.25rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .notification-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #3a86ff;
          transition: all 0.3s;
        }
        
        .notification-card.read::before {
          background: #d1d5db;
          width: 2px;
        }
        
        .notification-card.unread {
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #f0f4f8;
        }
        
        .notification-card.read {
          background-color: #fafbfc;
          border: 1px solid #f0f4f8;
        }
        
        .notification-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }
        
        .notification-card.updating {
          opacity: 0.7;
          pointer-events: none;
        }
        
        .notification-content {
          flex: 1;
          min-width: 0; /* Para que el texto no desborde */
        }
        
        .notification-message {
          margin: 0;
          font-size: 0.95rem;
          color: #374151;
          line-height: 1.5;
          word-wrap: break-word;
        }
        
        .notification-card.unread .notification-message {
          font-weight: 500;
        }
        
        .notification-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.75rem;
          font-size: 0.8rem;
        }
        
        .notification-date {
          color: #6b7280;
        }
        
        .unread-dot {
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #3a86ff, #2563eb);
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .mark-read-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          margin-left: 1rem;
          flex-shrink: 0;
          transition: all 0.2s;
          opacity: 0;
        }
        
        .notification-card:hover .mark-read-btn {
          opacity: 1;
        }
        
        .mark-read-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        .mark-read-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .mini-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 640px) {
          .notifications-container {
            padding: 1rem 0.75rem;
          }
          
          .notifications-header {
            gap: 1rem;
          }
          
          .filter-controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-buttons {
            justify-content: center;
          }
          
          .mark-all-btn {
            width: 100%;
            justify-content: center;
          }
          
          .notification-card {
            padding: 1rem;
          }
          
          .mark-read-btn {
            opacity: 1; /* Siempre visible en móvil */
          }
        }
      `}</style>
    </div>
  );
};

export default StudentNotificationsPage;