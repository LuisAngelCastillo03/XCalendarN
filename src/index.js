import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/variables.css';
import './App.css'; // <-- Importa tus estilos aquí
// 🔥 Agrega esta importación
import { AuthProvider } from './context/AuthContext';  // 👈 asegúrate de que la ruta sea correcta

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>           {/* 👈 Aquí se envuelve App con el contexto */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
