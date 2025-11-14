import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Calendar, Clock, X, Check, AlertTriangle } from 'react-feather';
import '../../styles/Historial.css';
 
const HistorialAlumno = () => {
  const { user } = useAuth();
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchClases = async () => {
      try {
        setLoading(true);
        setError(null);
       
        if (!user || user.rol !== 'alumno') {
          throw new Error('Acceso restringido a alumnos');
        }
 
        const matricula = user.matricula;
        console.log('Consultando clases para matrícula:', matricula);
 
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost';
        const endpoint = `${API_URL}/modulo_agenda/backend/get_clases_alumno.php`;
       
        const response = await axios.get(endpoint, {
          params: { matricula },
          timeout: 10000, // 10 segundos de timeout
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
 
        console.log('Respuesta del servidor:', response.data);
 
        if (!response.data.success) {
          throw new Error(response.data.error || 'Error en los datos recibidos');
        }
 
        setClases(response.data.clases || []);
      } catch (err) {
        console.error('Error completo:', err);
        if (err.code === 'ECONNABORTED') {
          setError('El servidor tardó demasiado en responder');
        } else if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data?.error || 'Error del servidor'}`);
        } else if (err.request) {
          setError('No se pudo conectar con el servidor. Verifica:');
          setError(prev => `${prev}\n1. Que el servidor esté corriendo`);
          setError(prev => `${prev}\n2. Que la URL sea correcta`);
          setError(prev => `${prev}\n3. Tu conexión a internet`);
        } else {
          setError(err.message || 'Error desconocido');
        }
      } finally {
        setLoading(false);
      }
    };
 
    if (user && user.rol === 'alumno') {
      fetchClases();
    }
  }, [user]);
 
  const getEstadoIcono = (estado) => {
    switch (estado) {
      case 'completada': return <Check className="icon-completada" />;
      case 'cancelada': return <X className="icon-cancelada" />;
      case 'agendada': return <Clock className="icon-agendada" />;
      default: return <AlertTriangle className="icon-default" />;
    }
  };
 
  if (loading) {
    return <div className="loading-container">
      <p>Cargando historial de clases...</p>
    </div>;
  }
 
  if (error) {
    return <div className="error-container">
      <h3>Error al cargar el historial</h3>
      <p>{error}</p>
      <details>
        <summary>Detalles técnicos</summary>
        <p>Usuario: {user?.nombre} ({user?.matricula})</p>
        <p>Rol: {user?.rol}</p>
      </details>
    </div>;
  }
 
  return (
    <div className="historial-container">
      <h2>Historial de Clases</h2>
     
      {clases.length === 0 ? (
        <div className="no-clases">
          <p>No tienes clases registradas.</p>
        </div>
      ) : (
        <div className="clases-list">
          {clases.map((clase) => (
            <div key={clase.id} className="clase-card">
              <div className="clase-header">
                <div className="clase-fecha">
                  <Calendar size={16} />
                  <span>{clase.fecha_formateada}</span>
                </div>
                <div className={`estado-${clase.estado}`}>
                  {getEstadoIcono(clase.estado)}
                  <span>{clase.estado.toUpperCase()}</span>
                </div>
              </div>
             
              <div className="clase-body">
                <div className="clase-horario">
                  <span>{clase.hora_formateada} - {clase.hora_fin}</span>
                  <span>({clase.duration} minutos)</span>
                </div>
               
                <div className="clase-profesor">
                  <span>Profesor: {clase.nombre_profesor_completo}</span>
                </div>
               
                {clase.zoomLink && (
                  <div className="clase-zoom">
                    <a href={clase.zoomLink} target="_blank" rel="noopener noreferrer">
                      Unirse a clase Zoom
                    </a>
                    {clase.zoomCode && <span>Código: {clase.zoomCode}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
 
export default HistorialAlumno;