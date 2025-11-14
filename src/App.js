// src/App.js
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import TeacherClassesPage from './components/profesor/TeacherClassesPage';
import TeacherNotificationsPage from './components/profesor/TeacherNotificationsPage';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Páginas públicas
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import CursoIngles from './pages/CursoIngles';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';

// Páginas privadas
import Perfil from './pages/Perfil';
import CalendarView from './components/calendario/Calendar.jsx';
import AppointmentModal from './components/calendario/AppointmentModal.jsx';
import TeacherSchedule from './components/administrador/TeacherSchedule.jsx';
import DocentesCRUD from './components/administrador/profesores/DocentesCRUD.jsx';
import AlumnosCRUD from './components/administrador/alumnos/AlumnosCRUD.jsx';
import Profesor from './components/profesor/Profesor';
// Componentes de alumno
import HistorialAlumno from './components/calendario/Historial.jsx';
import NotificacionesAlumno from './components/calendario/Notificaciones.jsx';

// Estilos
import './styles/components.css';
import './styles/calendar.css';
import './styles/utilities.css';
import './styles/teacher-schedule.css';

// Librerías de fecha
import { format, parseISO, addMinutes } from 'date-fns';

function App() {
  const [appointments, setAppointments] = useState([]);
  const [teachers, setTeachers] = useState([
    { id: '1', name: 'Profesor 1', schedule: null },
    { id: '2', name: 'Profesor 2', schedule: null }
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 5; hour <= 22; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 22) slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const durationOptions = [
    { value: 30, label: '30 minutos' },
    { value: 60, label: '1 hora' },
    { value: 90, label: '1 hora 30 minutos' },
    { value: 120, label: '2 horas' },
    { value: 150, label: '2 horas 30 minutos' },
    { value: 180, label: '3 horas' }
  ];

  const createZoomMeeting = async (title, startTime, duration) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          join_url: `https://zoom.us/j/${Math.random().toString(36).substring(2, 15)}`,
          password: Math.random().toString(36).substring(2, 10).toUpperCase(),
          start_time: startTime,
          duration
        });
      }, 500);
    });
  };

  const updateTeacherSchedule = (teacherId, schedule) => {
    setTeachers(teachers.map(teacher =>
      teacher.id === teacherId ? { ...teacher, schedule } : teacher
    ));
  };

  const isTimeSlotAvailable = (date, time, duration, teacherId = null) => {
    const selectedDateTime = parseISO(`${format(date, 'yyyy-MM-dd')}T${time}:00`);
    const selectedEndTime = addMinutes(selectedDateTime, duration);

    const generalAvailability = !appointments.some(app => {
      if (teacherId && app.teacherId !== teacherId) return false;

      const appStart = parseISO(`${app.date}T${app.time}:00`);
      const appEnd = addMinutes(appStart, app.duration);

      return (
        (selectedDateTime >= appStart && selectedDateTime < appEnd) ||
        (selectedEndTime > appStart && selectedEndTime <= appEnd) ||
        (selectedDateTime <= appStart && selectedEndTime >= appEnd)
      );
    });

    if (!teacherId) return generalAvailability;

    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher || !teacher.schedule) return generalAvailability;

    const dayOfWeek = selectedDateTime.getDay();
    const isWorkingDay = teacher.schedule.workingDays?.includes(dayOfWeek) || false;

    const [startHour, startMinute] = teacher.schedule.workingHours?.start?.split(':').map(Number) || [0, 0];
    const [endHour, endMinute] = teacher.schedule.workingHours?.end?.split(':').map(Number) || [23, 59];

    const slotStartHour = selectedDateTime.getHours();
    const slotStartMinute = selectedDateTime.getMinutes();
    const slotEndHour = selectedEndTime.getHours();
    const slotEndMinute = selectedEndTime.getMinutes();

    const withinWorkingHours =
      (slotStartHour > startHour || (slotStartHour === startHour && slotStartMinute >= startMinute)) &&
      (slotEndHour < endHour || (slotEndHour === endHour && slotEndMinute <= endMinute));

    const isAvailableInSchedule = teacher.schedule.availability?.some(slot => {
      const slotStart = parseISO(slot.start);
      const slotEnd = parseISO(slot.end);
      return selectedDateTime >= slotStart && selectedEndTime <= slotEnd;
    }) ?? true;

    return generalAvailability && isWorkingDay && withinWorkingHours && isAvailableInSchedule;
  };

  const handleDateClick = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date >= today) {
      setSelectedDate(date);
      setSelectedAppointment(null);
      setModalOpen(true);
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedDate(parseISO(appointment.date));
    setModalOpen(true);
  };

  const addAppointment = async (appointment) => {
    const zoomMeeting = await createZoomMeeting(
      `${appointment.matricula} - ${appointment.clientName}`,
      `${appointment.date}T${appointment.time}`,
      appointment.duration
    );

    const newAppointment = {
      ...appointment,
      id: Date.now(),
      zoomLink: zoomMeeting.join_url,
      zoomCode: zoomMeeting.password,
      date: format(new Date(appointment.date), 'yyyy-MM-dd'),
      teacherId: appointment.teacherId
    };

    setAppointments(prev => [...prev, newAppointment]);
    setModalOpen(false);
  };

  const updateAppointment = async (updatedAppointment) => {
    if (
      selectedAppointment.time !== updatedAppointment.time ||
      selectedAppointment.duration !== updatedAppointment.duration
    ) {
      const zoomMeeting = await createZoomMeeting(
        `${updatedAppointment.matricula} - ${updatedAppointment.clientName}`,
        `${updatedAppointment.date}T${updatedAppointment.time}`,
        updatedAppointment.duration
      );

      updatedAppointment.zoomLink = zoomMeeting.join_url;
      updatedAppointment.zoomCode = zoomMeeting.password;
    }

    setAppointments(prev =>
      prev.map(app => (app.id === updatedAppointment.id ? updatedAppointment : app))
    );
    setModalOpen(false);
  };

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
    setModalOpen(false);
  };

  const handleFormSubmit = async (appointmentData) => {
    if (selectedAppointment) {
      await updateAppointment({ ...selectedAppointment, ...appointmentData });
    } else {
      const dateFormatted = format(selectedDate, 'yyyy-MM-dd');
      await addAppointment({ ...appointmentData, date: dateFormatted });
    }
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container">
          <Routes>
            {/* Públicas */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cursos/ingles" element={<CursoIngles />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Route>

            {/* Perfil */}
            <Route
              element={
                <PrivateRoute allowedRoles={['administrador', 'profesor', 'alumno']}>
                  <DashboardLayout type="perfil" />
                </PrivateRoute>
              }
            >
              <Route path="/perfil" element={<Perfil />} />
            </Route>

            {/* Administrador */}
            <Route
              element={
                <PrivateRoute allowedRoles={['administrador']}>
                  <DashboardLayout type="admin" />
                </PrivateRoute>
              }
            >
              <Route path="/admin" element={<TeacherSchedule />} />
              <Route path="/administrador/docentes" element={<DocentesCRUD />} />
              <Route path="/administrador/alumnos" element={<AlumnosCRUD />} />
            </Route>

            {/* Profesor */}
            <Route
              element={
                <PrivateRoute allowedRoles={['profesor']}>
                  <DashboardLayout type="profesor" />
                </PrivateRoute>
              }
            >
              <Route path="/profesor" element={<Profesor />} />
              <Route path="/profesor/mis-clases" element={<TeacherClassesPage />} />
              <Route path="/profesor/notificaciones" element={<TeacherNotificationsPage />} />
            </Route>

            {/* Alumno */}
            <Route
              element={
                <PrivateRoute allowedRoles={['alumno']}>
                  <DashboardLayout type="alumno" />
                </PrivateRoute>
              }
            >
              <Route
                path="/alumno"
                element={
                  <CalendarView
                    appointments={appointments}
                    onDateClick={handleDateClick}
                    onAppointmentClick={handleAppointmentClick}
                  />
                }
              />
              <Route path="/alumno/notificaciones" element={<NotificacionesAlumno />} />
              <Route path="/alumno/historial" element={<HistorialAlumno />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Modal fuera de rutas */}
          {modalOpen && (
            <AppointmentModal
              date={selectedDate}
              appointment={selectedAppointment}
              onSave={handleFormSubmit}
              onDelete={deleteAppointment}
              onClose={() => setModalOpen(false)}
              timeSlots={generateTimeSlots()}
              durationOptions={durationOptions}
              isTimeSlotAvailable={isTimeSlotAvailable}
              teachers={teachers}
            />
          )}
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
