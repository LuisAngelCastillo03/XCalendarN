import React, { useState, useEffect } from 'react';
import { healthCheck } from '../services/api';

const HealthCheck = () => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await healthCheck();
        setStatus(response);
      } catch (err) {
        setError(err.message || 'Error desconocido');
      }
    };

    checkApi();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Prueba de Conexión API</h3>
      {status && (
        <div style={{ color: 'green' }}>
          <pre>{JSON.stringify(status, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div style={{ color: 'red' }}>
          <p>Error: {error}</p>
          <p>Verifica:
            <ul>
              <li>Que el servidor Apache esté corriendo</li>
              <li>Que la URL sea correcta</li>
              <li>La consola del navegador para errores CORS</li>
            </ul>
          </p>
        </div>
      )}
    </div>
  );
};

export default HealthCheck;