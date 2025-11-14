import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Footer from '../components/UI/Footer';
import Navbar from '../components/UI/Navbar';
 
const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
 
  const navigate = useNavigate();
  const { login } = useAuth();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
 
    try {
      // Enviar solicitud de login al backend
      const response = await axios.post(
        'http://localhost/modulo_agenda/backend/scripts/login.php',
        { usuario, contrasena }
      );
 
      if (response.data.success) {
        // Construir objeto de usuario con datos de respuesta
        const userData = {
          id: response.data.id,
          matricula: response.data.matricula,
          rol: response.data.rol.toLowerCase(),
          nombre: response.data.nombre,
          email: response.data.email || '',
          foto_perfil: response.data.foto_perfil || null
        };
 
        // Guardar usuario en contexto y localStorage
        login(userData);
 
        // Mostrar mensaje de bienvenida
        setSuccess(`¡Bienvenido ${userData.nombre}! Redirigiendo...`);
 
        // Determinar ruta de redirección según rol
        const routeByRole = {
          administrador: 'admin',
          profesor: 'profesor',
          alumno: 'alumno',
        };
 
        // Redirigir después de 1.5 segundos
        setTimeout(() => {
          navigate(`/${routeByRole[userData.rol] || 'dashboard'}`);
        }, 1500);
      } else {
        setError(response.data.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('Error en el login:', err);
      setError(err.response?.data?.message || 'Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <div className="login-container">
      <Navbar />
 
      <main className="login-main">
        <div className="login-card">
          <h2>Iniciar Sesión</h2>
 
          {error && <div className="message-error">{error}</div>}
          {success && <div className="message-success">{success}</div>}
 
          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="usuario">Usuario o Matrícula</label>
              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                placeholder="Ingresa tu usuario"
                disabled={isLoading}
              />
            </div>
 
            <div className="input-group">
              <label htmlFor="contrasena">Contraseña</label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
                disabled={isLoading}
              />
            </div>
 
            <button
              type="submit"
              disabled={isLoading}
              className={`login-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? 'Cargando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </main>
 
      <Footer />
 
      <style jsx>{`
        .login-container {
          min-height: 100vh;
          background: #101010;
          color: #eee;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
       
        .login-main {
          flex-grow: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 2rem;
        }
       
        .login-card {
          background: rgba(26, 26, 26, 0.9);
          padding: 2.5rem;
          border-radius: 16px;
          max-width: 450px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(10, 248, 155, 0.2);
        }
       
        h2 {
          margin-bottom: 1.8rem;
          color: #0af89b;
          font-size: 1.8rem;
          text-align: center;
        }
       
        .input-group {
          margin-bottom: 1.5rem;
        }
       
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #ddd;
        }
       
        input {
          width: 100%;
          padding: 0.9rem;
          border-radius: 10px;
          border: 1px solid #444;
          background: #252525;
          color: #eee;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
       
        input:disabled {
          background: #333;
          opacity: 0.7;
        }
       
        input::placeholder {
          color: #777;
        }
       
        input:focus {
          outline: none;
          border-color: #0af89b;
          box-shadow: 0 0 0 3px rgba(10, 248, 155, 0.2);
        }
       
        .login-button {
          margin-top: 1.5rem;
          width: 100%;
          padding: 1rem;
          font-weight: bold;
          font-size: 1.1rem;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #5942ec, #029e99);
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
       
        .login-button.loading {
          color: transparent;
        }
       
        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
       
        .login-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #4a36c7, #018a85);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
       
        .message-error {
          background: rgba(220, 53, 69, 0.2);
          color: #ff6b6b;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }
       
        .message-success {
          background: rgba(25, 135, 84, 0.2);
          color: #69db7c;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(25, 135, 84, 0.3);
        }
      `}</style>
    </div>
  );
};
 
export default Login;