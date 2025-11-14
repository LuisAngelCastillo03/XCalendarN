const API_BASE = 'http://localhost/modulo_agenda/backend';

// Función para formatear fechas en hora local sin conversión UTC
const formatLocalDate = (date) => {
  const d = new Date(date);
  const pad = num => num.toString().padStart(2, '0');
  
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
};

export const getTeacherSchedule = async (teacherId) => {
  try {
    const response = await fetch(`${API_BASE}/horarios.php?profesor_id=${teacherId}`);
    if (!response.ok) throw new Error('Error al obtener el horario');
    const data = await response.json();

    if (data.success) {
      // Convertimos las fechas para el calendario
      const normalizedData = {
        ...data.data,
        availability: data.data.availability.map(slot => ({
          ...slot,
          start: slot.start.replace(' ', 'T'),
          end: slot.end.replace(' ', 'T')
        }))
      };
      return normalizedData;
    } else {
      throw new Error(data.error || 'Error desconocido al obtener el horario');
    }
  } catch (error) {
    console.error('Error en getTeacherSchedule:', error);
    throw error;
  }
};

export const saveTeacherSchedule = async (teacherId, schedule) => {
  try {
    // Normalizamos las fechas manteniendo hora local exacta
    const normalizedSchedule = {
      ...schedule,
      availability: schedule.availability.map(slot => ({
        ...slot,
        start: formatLocalDate(slot.start),
        end: formatLocalDate(slot.end)
      }))
    };

    const response = await fetch(`${API_BASE}/horarios.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profesor_id: teacherId,
        workingDays: normalizedSchedule.workingDays,
        workingHours: normalizedSchedule.workingHours,
        availability: normalizedSchedule.availability
      })
    });

    if (!response.ok) throw new Error('Error al guardar el horario');
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Error desconocido al guardar el horario');
    }

    return data;
  } catch (error) {
    console.error('Error en saveTeacherSchedule:', error);
    throw error;
  }
};
