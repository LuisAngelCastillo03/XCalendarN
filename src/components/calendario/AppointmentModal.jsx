import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AppointmentModal({
  date,
  appointment,
  onDelete,
  onClose,
  durationOptions,
  isTimeSlotAvailable,
  teachers
}) {
  const [matricula, setMatricula] = useState('');
  const [clientName, setClientName] = useState('');
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState(30);
  const [teacherId, setTeacherId] = useState('');
  const [timeError, setTimeError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (appointment) {
      setMatricula(appointment.matricula || '');
      setClientName(appointment.clientName || '');
      setTime(appointment.time || '');
      setDuration(appointment.duration || 30);
      setTeacherId(appointment.teacherId || '');
    } else {
      setMatricula('');
      setClientName('');
      const defaultTeacher = teachers[0]?.id || '';
      setTeacherId(defaultTeacher);
      setDuration(30);
    }
  }, [appointment, date, teachers]);

  useEffect(() => {
    const fetchDisponibilidad = async () => {
      if (!teacherId || !date || !duration) return;
      try {
        const response = await fetch(
          `http://localhost/modulo_agenda/backend/obtener_horarios_disponibles.php?profesor_id=${teacherId}&fecha=${format(date, 'yyyy-MM-dd')}&duracion=${duration}`
        );
        const data = await response.json();
        console.log("Horarios disponibles desde PHP:", data);
        setTimeSlots(data);
        if (data.length > 0) {
          const firstAvailable = data.find(t => isTimeSlotAvailable(date, t, duration, teacherId)) || data[0];
          setTime(firstAvailable);
        } else {
          setTime('');
        }
      } catch (error) {
        console.error('Error cargando horarios disponibles:', error);
        setTimeSlots([]);
        setTime('');
      }
    };
    fetchDisponibilidad();
  }, [teacherId, date, duration, isTimeSlotAvailable]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeError('');

    if (!teacherId || timeSlots.length === 0) {
      setTimeError('No hay horarios disponibles para la duración seleccionada.');
      setIsSubmitting(false);
      return;
    }

    if (!isTimeSlotAvailable(date, time, duration, teacherId)) {
      setTimeError('Este horario ya está ocupado. Por favor selecciona otro.');
      setIsSubmitting(false);
      return;
    }

    const newAppointment = {
      matricula,
      clientName,
      time,
      duration,
      teacherId,
      date: format(date, 'yyyy-MM-dd')
    };

    try {
      // Guardar la clase en el backend PHP
      const response = await fetch('http://localhost/modulo_agenda/backend/guardar_clase.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment)
      });

      const result = await response.json();
      if (!result.success) {
        setTimeError(result.error || 'Ocurrió un error al guardar la clase. Intenta nuevamente.');
        setIsSubmitting(false);
        return;
      }

      // Enviar correo al profesor usando backend Node.js con Nodemailer
      const profesor = teachers.find(t => t.id === teacherId);
      if (profesor && profesor.email) {
        try {
          await fetch('http://localhost:3001/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              profesorEmail: profesor.email,
              estudianteNombre: clientName,
              fechaClase: `${format(date, 'yyyy-MM-dd')} ${time}`
            })
          });
        } catch (error) {
          console.warn('Error enviando correo al profesor:', error);
          // Opcional: mostrar mensaje al usuario o simplemente continuar
        }
      } else {
        console.warn('No se encontró el email del profesor para enviar notificación');
      }

      onClose();
    } catch (error) {
      setTimeError('Ocurrió un error al guardar la clase o enviar el correo. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (!isTimeSlotAvailable(date, newTime, duration, teacherId)) {
      setTimeError('Este horario ya está ocupado. Por favor selecciona otro.');
    } else {
      setTimeError('');
    }
  };

  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value);
    setDuration(newDuration);
    if (!isTimeSlotAvailable(date, time, newDuration, teacherId)) {
      setTimeError('Este horario ya está ocupado con la duración seleccionada.');
    } else {
      setTimeError('');
    }
  };

  const handleTeacherChange = (e) => {
    const newTeacherId = e.target.value;
    setTeacherId(newTeacherId);
    if (!isTimeSlotAvailable(date, time, duration, newTeacherId)) {
      setTimeError('Este profesor no está disponible en el horario seleccionado.');
    } else {
      setTimeError('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className={`modal ${appointment ? 'view-modal' : 'compact-modal'}`} style={{ padding: '2rem', borderRadius: '12px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="close-btn" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {appointment ? (
          <>
            <h2 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem', gap: '0.4rem', fontWeight: '600', fontSize: '1.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Clase programada
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div className="modal-section" style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '10px' }}>
                <h4>Información del alumno</h4>
                <p><strong>Matrícula:</strong> {appointment.matricula || 'N/A'}</p>
                <p><strong>Nombre:</strong> {appointment.clientName || 'N/A'}</p>
                <p><strong>Profesor:</strong> {teachers.find(t => t.id === appointment.teacherId)?.name || 'No asignado'}</p>
              </div>
              <div className="modal-section" style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '10px' }}>
                <h4>Horario</h4>
                <p><strong>Fecha:</strong> {format(new Date(appointment.date), 'EEEE d MMMM yyyy', { locale: es })}</p>
                <p><strong>Hora de inicio:</strong> {appointment.time}</p>
                <p><strong>Duración:</strong> {durationOptions.find(d => d.value === appointment.duration)?.label}</p>
              </div>
              {appointment.zoomLink && (
                <div className="modal-section" style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '10px' }}>
                  <h4>Información de Zoom</h4>
                  <p><strong>Enlace:</strong> <a href={appointment.zoomLink} target="_blank" rel="noopener noreferrer">Unirse a la clase</a></p>
                  {appointment.zoomCode && <p><strong>Código:</strong> {appointment.zoomCode}</p>}
                </div>
              )}
            </div>

            <div className="modal-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-danger" onClick={() => onDelete(appointment.id)}>Cancelar clase</button>
              <button className="btn-secondary" onClick={onClose}>Cerrar</button>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>Nueva clase</h2>
            <p className="modal-date">{format(date, 'EEEE d MMMM yyyy', { locale: es })}</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Matrícula:</label>
                <input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} required placeholder="Número de matrícula" />
              </div>
              <div className="form-group">
                <label>Nombre del alumno:</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required placeholder="Nombre completo" />
              </div>
              <div className="form-group">
                <label>Profesor:</label>
                <select value={teacherId} onChange={handleTeacherChange} required>
                  <option value="">-- Seleccione profesor --</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Hora de inicio:</label>
                  <select value={time} onChange={handleTimeChange} required disabled={timeSlots.length === 0}>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {timeSlots.length === 0 && <p style={{ color: 'red' }}>No hay disponibilidad para la duración seleccionada en este día.</p>}
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Duración:</label>
                  <select value={duration} onChange={handleDurationChange} required>
                    {durationOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {timeError && <div className="error-message">{timeError}</div>}
              <div className="modal-actions" style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className={`btn-primary ${isSubmitting ? 'btn-loading' : ''}`} disabled={isSubmitting}>Programar clase</button>
                <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
