const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Configuración CORS esencial
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/api/healthcheck', (req, res) => {
  console.log('Healthcheck recibido');
  res.json({ status: 'ok', timestamp: new Date() });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error en el servidor');
});

// Inicia el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Error al iniciar:', err.message);
});