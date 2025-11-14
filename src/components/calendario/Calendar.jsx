import { useState, useEffect, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { parseISO, addMinutes } from 'date-fns';
import AppointmentModal from './AppointmentModal';
import { getProfesores } from '../administrador/profesores/profesoresService';
import { useAuth } from '../../context/AuthContext';
import '../../styles/calendar.css';
import '../../styles/components.css';
 
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 5; hour <= 21; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour !== 21) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  slots.push('21:30');
  return slots;
};
 
const durationOptions = [
  { value: 30, label: '30 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1 hora 30 minutos' },
  { value: 120, label: '2 horas' },
  { value: 150, label: '2 horas 30 minutos' },
  { value: 180, label: '3 horas' },
];
 
const CalendarView = () => {
  const { user } = useAuth();
  const [view, setView] = useState('dayGridMonth');
  const [teachers, setTeachers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const timeSlots = generateTimeSlots();
 
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await getProfesores();
        const formatted = data.map(p => ({
          id: p.id,
          name: `${p.nombre} ${p.apellidoPaterno}`
        }));
        setTeachers(formatted);
      } catch (error) {
        console.error('Error al cargar profesores:', error);
      }
    };
    fetchTeachers();
  }, []);
 
  const fetchAppointments = async () => {
    try {
      const url = user?.rol === 'alumno' && user?.matricula
        ? `http://localhost/modulo_agenda/backend/clases.php?matricula=${user.matricula}`
        : 'http://localhost/modulo_agenda/backend/clases.php';
     
      const response = await fetch(url);
      const result = await response.json();
 
      if (result.success && Array.isArray(result.data)) {
        setAppointments(result.data);
      } else {
        console.error('Error al obtener citas:', result.error || 'Respuesta inválida');
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
    }
  };
 
  useEffect(() => {
    fetchAppointments();
  }, [user]);
 
  const isTimeSlotAvailable = (date, startTime, duration, teacherId) => {
    if (startTime === '21:30' && duration !== 30) return false;
    if (duration < 30 || duration > 180) return false;
    return true;
  };
 
  const calendarEvents = appointments.map(app => {
    const start = parseISO(`${app.date}T${app.time}`);
    const end = addMinutes(start, parseInt(app.duration));
    return {
      id: app.id,
      title: app.matricula ? `${app.matricula} - ${app.clientName}` : app.clientName,
      start,
      end,
      extendedProps: {
        zoomLink: app.zoomLink,
        zoomCode: app.zoomCode,
        clientName: app.clientName,
        matricula: app.matricula,
        duration: app.duration,
        date: app.date,
        time: app.time,
        teacherId: app.teacherId || null,
      },
      color: '#3498db'
    };
  });
 
  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };
 
  const handleEventClick = (info) => {
    info.jsEvent.preventDefault();
    const appointment = {
      id: info.event.id,
      title: info.event.title,
      ...info.event.extendedProps,
      start: info.event.start,
      end: info.event.end
    };
    setSelectedAppointment(appointment);
    setSelectedDate(parseISO(appointment.date));
    setIsModalOpen(true);
  };
 
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedAppointment(null);
    fetchAppointments();
  };
 
  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta clase?")) return;
 
    try {
      const response = await fetch('http://localhost/modulo_agenda/backend/clases.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancelar: true, id: appointmentId }),
      });
 
      const result = await response.json();
 
      if (result.success) {
        alert("Clase cancelada correctamente.");
        fetchAppointments();
        setSelectedAppointment(null);
      } else {
        alert("No se pudo cancelar la clase: " + (result.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error("Error al cancelar clase:", error);
      alert("Ocurrió un error: " + error.message);
    }
  };
 
  return (
    <div className="main-content" style={{ padding: '1rem' }}>
      <div className="calendar-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="calendar-controls">
          <h2 className="calendar-title">
            {user?.rol === 'alumno' ? 'Mis Clases' : 'Calendario de Clases'}
          </h2>
        </div>
 
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView={view}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={calendarEvents}
          slotMinTime="05:00:00"
          slotMaxTime="22:30:00"
          slotDuration="00:30:00"
          allDaySlot={false}
          height="auto"
          validRange={{ start: new Date() }}
          locale="es"
          eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: true }}
        />
 
        {isModalOpen && (
          <AppointmentModal
            date={selectedDate}
            appointment={selectedAppointment}
            onClose={handleCloseModal}
            onDelete={handleDeleteAppointment}
            onSave={handleCloseModal}
            timeSlots={timeSlots}
            durationOptions={durationOptions}
            isTimeSlotAvailable={isTimeSlotAvailable}
            teachers={teachers}
            currentUser={user}
          />
        )}
      </div>
    </div>
  );
};
 
export default CalendarView;