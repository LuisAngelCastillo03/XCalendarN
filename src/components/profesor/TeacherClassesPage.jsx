import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const TeacherClassesPage = () => {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatDateTimeForDisplay = (isoString) => {
    if (!isoString) return 'Fecha no disponible';
    
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      
      return date.toLocaleString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Error en fecha';
    }
  };

  // ✅ Aceptar clase
  const handleAcceptClass = async (classId) => {
    if (!window.confirm('¿Deseas aceptar esta clase?')) return;
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost';
      const response = await axios.post(`${API_URL}/modulo_agenda/backend/scripts/update_class_status.php`, {
        id: classId,
        status: 'aceptada'
      });

      if (response.data.success) {
        alert('Clase aceptada y notificación enviada al alumno.');
        setEvents(prev => prev.map(event => 
          event.id === classId ? { ...event, status: 'aceptada' } : event
        ));
      } else {
        alert(response.data.error || 'Error al aceptar la clase');
      }
    } catch (err) {
      console.error('Error al aceptar clase:', err);
      alert('Error al aceptar la clase. Intenta nuevamente.');
    }
  };

  // ❌ Cancelar clase
  const handleCancelClass = async (classId) => {
    if (!window.confirm('¿Seguro que deseas cancelar esta clase?')) return;
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost';
      const response = await axios.post(`${API_URL}/modulo_agenda/backend/scripts/update_class_status.php`, {
        id: classId,
        status: 'cancelada'
      });

      if (response.data.success) {
        alert('Clase cancelada y notificación enviada al alumno.');
        setEvents(prev => prev.filter(event => event.id !== classId));
      } else {
        alert(response.data.error || 'Error al cancelar la clase');
      }
    } catch (err) {
      console.error('Error al cancelar clase:', err);
      alert('Error al cancelar la clase. Intenta nuevamente.');
    }
  };

  // ⏰ Posponer clase (placeholder - puedes implementar la lógica específica)
  const handlePostponeClass = async (classId) => {
    alert('Funcionalidad de posponer clase en desarrollo');
    // Aquí puedes implementar un modal para seleccionar nueva fecha/hora
  };

  // 🔄 Cargar clases
  useEffect(() => {
    if (authLoading) return;

    if (!currentUser || currentUser.rol !== 'profesor' || !currentUser.id) {
      setError('Acceso no autorizado. Solo disponible para profesores.');
      setLoading(false);
      return;
    }

    const fetchClasses = async () => {
      setLoading(true);
      setError('');
      
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost';
        const response = await axios.get(
          `${API_URL}/modulo_agenda/backend/scripts/get_teacher_classes.php?profesorId=${currentUser.id}`,
          {
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else if (response.data && response.data.error) {
          setError(response.data.error);
          setEvents([]);
        } else {
          setError('Formato de respuesta inesperado del servidor');
          setEvents([]);
        }
      } catch (err) {
        console.error('Error al cargar clases:', err);
        if (err.code === 'ECONNABORTED') {
          setError('El servidor tardó demasiado en responder');
        } else if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.statusText}`);
        } else if (err.request) {
          setError('No se pudo conectar con el servidor. Verifica tu conexión.');
        } else {
          setError(err.message || 'Error desconocido al cargar las clases');
        }
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [currentUser, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando clases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Mis Clases</h1>
        <p className="page-subtitle">Gestiona tus clases programadas</p>
        {events.length > 0 && (
          <div className="classes-count">
            {events.length} clase{events.length !== 1 ? 's' : ''} programada{events.length !== 1 ? 's' : ''}
          </div>
        )}
      </header>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>No tienes clases programadas</p>
          <small>Las clases que aceptes aparecerán aquí</small>
        </div>
      ) : (
        <div className="classes-list">
          {events.map((event) => (
            <div 
              className={`class-card ${event.status || 'pendiente'}`} 
              key={event.id}
            >
              <div className="class-header">
                <h2>Clase con {event.details?.nombre || 'Alumno'}</h2>
                {event.status && (
                  <span className={`status-badge status-${event.status}`}>
                    {event.status}
                  </span>
                )}
              </div>
              
              <div className="class-info">
                <div className="info-item">
                  <strong>Alumno:</strong>
                  <span>{event.details?.nombre || 'No disponible'}</span>
                </div>
                <div className="info-item">
                  <strong>Fecha y hora:</strong>
                  <span>{formatDateTimeForDisplay(event.start)}</span>
                </div>
                <div className="info-item">
                  <strong>Duración:</strong>
                  <span>{event.details?.duracion || 'No especificada'}</span>
                </div>
                {event.details?.materia && (
                  <div className="info-item">
                    <strong>Materia:</strong>
                    <span>{event.details.materia}</span>
                  </div>
                )}
              </div>

              {(event.status === 'pendiente' || !event.status) && (
                <div className="actions">
                  <button 
                    className="btn accept" 
                    onClick={() => handleAcceptClass(event.id)}
                  >
                    ✓ Aceptar
                  </button>
                  <button 
                    className="btn postpone" 
                    onClick={() => handlePostponeClass(event.id)}
                  >
                    ⏰ Posponer
                  </button>
                  <button 
                    className="btn cancel" 
                    onClick={() => handleCancelClass(event.id)}
                  >
                    ✖ Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .page-container {
          max-width: 900px;
          margin: 2rem auto;
          background: #f8f9fb;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .page-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #029e99;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          color: #555;
          margin-bottom: 1rem;
        }

        .classes-count {
          display: inline-block;
          background: #029e99;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #029e99;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          text-align: center;
          padding: 2rem;
          color: #dc2626;
        }

        .error-container h2 {
          margin-bottom: 1rem;
        }

        .retry-btn {
          background: #029e99;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 1rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .empty-state p {
          font-size: 1.125rem;
          margin-bottom: 0.5rem;
        }

        .classes-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .class-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .class-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          border-bottom: 2px solid #d9f2f2;
          padding-bottom: 0.5rem;
        }

        .class-card h2 {
          color: #029e99;
          font-size: 1.25rem;
          margin: 0;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-pendiente {
          background: #fff3cd;
          color: #856404;
        }

        .status-aceptada {
          background: #d1edff;
          color: #02587e;
        }

        .class-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .info-item strong {
          color: #333;
          font-size: 0.875rem;
        }

        .info-item span {
          color: #666;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn {
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .btn.accept { 
          background-color: #00b07c; 
          color: white; 
        }
        .btn.accept:hover { 
          background-color: #00c88e; 
        }

        .btn.postpone { 
          background-color: #ffa726; 
          color: white; 
        }
        .btn.postpone:hover { 
          background-color: #ffb84d; 
        }

        .btn.cancel { 
          background-color: #ff4d4d; 
          color: white; 
        }
        .btn.cancel:hover { 
          background-color: #ff6666; 
        }

        @media (max-width: 768px) {
          .page-container {
            margin: 1rem;
            padding: 1rem;
          }

          .class-header {
            flex-direction: column;
            gap: 0.5rem;
          }

          .class-info {
            grid-template-columns: 1fr;
          }

          .actions {
            justify-content: stretch;
          }

          .btn {
            flex: 1;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherClassesPage;