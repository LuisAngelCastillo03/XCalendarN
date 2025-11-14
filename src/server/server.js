const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite peticiones desde tu React
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { profesorEmail, estudianteNombre, fechaClase } = req.body;

  if (!profesorEmail || !estudianteNombre || !fechaClase) {
    return res.status(400).json({ error: 'Faltan datos para enviar el correo' });
  }

  // Configura el transporter con Gmail
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'barrera.angelica.1dm@gmail.com',      // <-- Cambia aquí tu correo Gmail
      pass: 'ndsynnxvttbdweep'           // <-- Cambia aquí tu contraseña de aplicación Gmail
    },
  });

  const mailOptions = {
    from: '"Sistema de Clases" <TU_EMAIL@gmail.com>',
    to: profesorEmail,
    subject: 'Nueva clase agendada',
    text: `Hola,\n\nTienes una nueva clase agendada con ${estudianteNombre} para el día ${fechaClase}.\n\nSaludos.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
