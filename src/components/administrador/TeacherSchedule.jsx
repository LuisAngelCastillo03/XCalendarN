import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../../styles/teacher-schedule.css';
import '../../styles/components.css';
import { getTeacherSchedule, saveTeacherSchedule } from './horarios/horariosService';

const TeacherSchedule = ({ onScheduleUpdate }) => {
  const location = useLocation();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);
  const [workingHours, setWorkingHours] = useState({ start: '09:00', end: '18:00' });
  const [customSlots, setCustomSlots] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const daysOfWeek = [
    { id: 0, shortName: 'Dom' },
    { id: 1, shortName: 'Lun' },
    { id: 2, shortName: 'Mar' },
    { id: 3, shortName: 'Mié' },
    { id: 4, shortName: 'Jue' },
    { id: 5, shortName: 'Vie' },
    { id: 6, shortName: 'Sáb' }
  ];

  const generateWorkingSlots = useCallback((days, hours) => {
    const slots = [];
    const [startH, startM] = hours.start.split(':').map(Number);
    const [endH, endM] = hours.end.split(':').map(Number);
    const today = new Date();

    days.forEach(dayId => {
      const diffDays = (dayId - today.getDay() + 7) % 7;
      const slotDate = new Date(today);
      slotDate.setDate(today.getDate() + diffDays);

      const start = new Date(slotDate);
      start.setHours(startH, startM, 0, 0);
      const end = new Date(slotDate);
      end.setHours(endH, endM, 0, 0);

      if (start < end) {
        slots.push({
          start: start.toISOString(),
          end: end.toISOString(),
          isGenerated: true
        });
      }
    });

    return slots;
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/modulo_agenda/backend/profesores.php');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();

      const teachersData = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
        ? result.data
        : [];

      const normalized = teachersData.map(t => ({
        id: t.id || t.ID,
        nombre: t.nombre || t.Nombre,
        apellido_paterno: t.apellidoPaterno || t.apellido_paterno || t.ApellidoPaterno || '',
        apellido_materno: t.apellidoMaterno || t.apellido_materno || t.ApellidoMaterno || '',
        email: t.email || t.Email || ''
      }));

      setTeachers(normalized);
      setError(null);
    } catch (err) {
      setError(`Error al cargar profesores: ${err.message}`);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    const generated = generateWorkingSlots(workingDays, workingHours);
    const combined = [
      ...generated,
      ...customSlots.filter(s => !s.isGenerated && new Date(s.start) < new Date(s.end))
    ];
    setAvailability(combined);
  }, [workingDays, workingHours, customSlots, generateWorkingSlots]);

  const availabilityEvents = useMemo(() => (
    availability.map(slot => ({
      title: 'Disponible',
      start: slot.start,
      end: slot.end,
      color: slot.isGenerated ? '#4CAF50' : '#2196F3',
      extendedProps: {
        type: 'availability',
        isGenerated: slot.isGenerated
      }
    }))
  ), [availability]);

  const handleTeacherSelect = async (teacher) => {
    if (!teacher) {
      setSelectedTeacher(null);
      setWorkingDays([]);
      setWorkingHours({ start: '09:00', end: '18:00' });
      setCustomSlots([]);
      setAvailability([]);
      return;
    }

    setSelectedTeacher(teacher);
    setLoading(true);

    try {
      const schedule = await getTeacherSchedule(teacher.id);
      setWorkingDays(schedule.workingDays || []);
      setWorkingHours(schedule.workingHours || { start: '09:00', end: '18:00' });

      const loadedCustom = (schedule.availability || [])
        .filter(s => !s.isGenerated && new Date(s.start) < new Date(s.end))
        .map(s => ({
          start: s.start,
          end: s.end,
          isGenerated: false
        }));

      setCustomSlots(loadedCustom);
    } catch (error) {
      console.error("Error al cargar horario:", error);
      setWorkingDays([]);
      setWorkingHours({ start: '09:00', end: '18:00' });
      setCustomSlots([]);
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkingDay = (dayId) => {
    setWorkingDays(prev =>
      prev.includes(dayId)
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const handleAddAvailability = (arg) => {
    const start = new Date(arg.startStr);
    const end = new Date(arg.endStr);

    if (start >= end) {
      alert('La hora de fin debe ser posterior a la hora de inicio');
      return;
    }

    const minDuration = 30 * 60 * 1000;
    if ((end - start) < minDuration) {
      alert('La franja horaria debe ser de al menos 30 minutos');
      return;
    }

    const newSlot = {
      start: start.toISOString(),
      end: end.toISOString(),
      isGenerated: false
    };

    const exists = customSlots.some(s =>
      s.start === newSlot.start &&
      s.end === newSlot.end
    );

    if (!exists) {
      setCustomSlots([...customSlots, newSlot]);
    }
  };

  const handleRemoveAvailability = (arg) => {
    if (arg.event.extendedProps.type !== 'availability') return;
    if (!window.confirm('¿Eliminar esta disponibilidad?')) return;

    const event = arg.event;

    if (event.extendedProps.isGenerated) {
      const eventDate = new Date(event.start);
      const dayOfWeek = eventDate.getDay();
      setWorkingDays(prev => prev.filter(d => d !== dayOfWeek));
    } else {
      setCustomSlots(prev =>
        prev.filter(slot =>
          slot.start !== event.startStr ||
          slot.end !== event.endStr
        )
      );
    }
  };

  const saveSchedule = async () => {
    if (!selectedTeacher) {
      alert('Por favor seleccione un profesor');
      return;
    }

    const [startH, startM] = workingHours.start.split(':').map(Number);
    const [endH, endM] = workingHours.end.split(':').map(Number);

    if ((startH * 60 + startM) >= (endH * 60 + endM)) {
      alert('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    if (workingDays.length === 0) {
      alert('Seleccione al menos un día laboral');
      return;
    }

    const generated = generateWorkingSlots(workingDays, workingHours);
    const combinedAvailability = [...generated, ...customSlots];

    const invalidSlots = combinedAvailability.filter(s =>
      new Date(s.start) >= new Date(s.end)
    );

    if (invalidSlots.length > 0) {
      alert('Hay franjas horarias inválidas (fin antes de inicio)');
      return;
    }

    const sortedSlots = [...combinedAvailability].sort((a, b) =>
      new Date(a.start) - new Date(b.start)
    );

    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const currentEnd = new Date(sortedSlots[i].end);
      const nextStart = new Date(sortedSlots[i + 1].start);
      if (currentEnd > nextStart) {
        alert('Existen franjas horarias que se solapan');
        return;
      }
    }

    const schedule = {
      workingDays,
      workingHours,
      availability: combinedAvailability
    };

    setIsSaving(true);
    setSaveError(null);

    try {
      await saveTeacherSchedule(selectedTeacher.id, schedule);
      if (onScheduleUpdate) onScheduleUpdate(selectedTeacher.id, schedule);
      alert('Horario guardado correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      setSaveError(error.message || 'Error desconocido');
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const formatTeacherName = (teacher) => {
    if (!teacher) return '';
    return `${teacher.nombre} ${teacher.apellido_paterno} ${teacher.apellido_materno}`.trim();
  };

  return (
    <div className="main-content">
      <div className="teacher-schedule-container">
        <h2>Gestión de Horarios de Profesores</h2>

        {loading && <div className="loading-indicator">Cargando profesores...</div>}
        {error && (
          <div className="error-alert">
            <p>{error}</p>
            <button onClick={fetchTeachers}>Reintentar</button>
          </div>
        )}

        {!loading && teachers.length > 0 && (
          <>
            <div className="teacher-selector">
              <label>Seleccionar Profesor:</label>
              <select
                value={selectedTeacher?.id || ''}
                onChange={(e) => handleTeacherSelect(
                  teachers.find(t => t.id.toString() === e.target.value)
                )}
              >
                <option value="">-- Seleccione un profesor --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {formatTeacherName(t)}
                  </option>
                ))}
              </select>
            </div>

            {selectedTeacher && (
              <>
                <div className="teacher-info">
                  <h3>{formatTeacherName(selectedTeacher)}</h3>
                  <p>{selectedTeacher.email}</p>
                </div>

                <div className="schedule-controls">
                  <div className="working-days">
                    <label>Días laborales:</label>
                    <div className="days-container">
                      {daysOfWeek.map(day => (
                        <label key={day.id} className="day-checkbox">
                          <input
                            type="checkbox"
                            checked={workingDays.includes(day.id)}
                            onChange={() => toggleWorkingDay(day.id)}
                          />
                          <span>{day.shortName}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="working-hours">
                    <label>Horario laboral:</label>
                    <div className="time-inputs">
                      <input
                        type="time"
                        value={workingHours.start}
                        onChange={(e) => setWorkingHours({ ...workingHours, start: e.target.value })}
                      />
                      <span>a</span>
                      <input
                        type="time"
                        value={workingHours.end}
                        onChange={(e) => setWorkingHours({ ...workingHours, end: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="calendar-container">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    selectable={true}
                    selectMirror={true}
                    selectOverlap={false}
                    select={handleAddAvailability}
                    eventClick={handleRemoveAvailability}
                    events={availabilityEvents}
                    slotMinTime="07:00:00"
                    slotMaxTime="22:00:00"
                    slotDuration="00:30:00"
                    allDaySlot={false}
                    height="auto"
                    locale="es"
                    weekends={true}
                    dayHeaderFormat={{ weekday: 'short' }}
                    buttonText={{
                      today: 'Hoy',
                      month: 'Mes',
                      week: 'Semana',
                      day: 'Día'
                    }}
                  />
                </div>

                <div className="save-section">
                  <button
                    className="btn-primary"
                    onClick={saveSchedule}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner"></span>
                        Guardando...
                      </>
                    ) : 'Guardar Horario'}
                  </button>
                  {saveError && <div className="error-message">{saveError}</div>}
                </div>
              </>
            )}
          </>
        )}

        {!loading && teachers.length === 0 && !error && (
          <div className="no-teachers">
            <p>No se encontraron profesores</p>
            <button onClick={fetchTeachers}>Reintentar carga</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherSchedule;
