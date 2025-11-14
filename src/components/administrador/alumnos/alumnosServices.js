const API_ALUMNOS = 'http://localhost/modulo_agenda/backend/alumnos.php';
 
// Función para manejar respuestas de la API
const handleApiResponse = async (response) => {
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Error en la solicitud');
  }
  return data.data;
};
 
// Obtener alumnos con filtros opcionales
export const getAlumnos = async (matricula = null, nombre = null) => {
  try {
    const params = new URLSearchParams();
    if (matricula) params.append('matricula', matricula);
    if (nombre) params.append('nombre', nombre);
 
    const url = params.toString() ? `${API_ALUMNOS}?${params.toString()}` : API_ALUMNOS;
   
    const response = await fetch(url);
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error en getAlumnos:', error);
    throw error;
  }
};
 
// Resto de funciones permanecen igual
export const createAlumno = async (alumno) => {
  const response = await fetch(API_ALUMNOS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alumno)
  });
  return await handleApiResponse(response);
};
 
export const updateAlumno = async (matricula, alumno) => {
  const response = await fetch(`${API_ALUMNOS}?matricula=${encodeURIComponent(matricula)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alumno)
  });
  return await handleApiResponse(response);
};
 
export const deleteAlumno = async (matricula) => {
  const response = await fetch(`${API_ALUMNOS}?matricula=${encodeURIComponent(matricula)}`, {
    method: 'DELETE'
  });
  return await handleApiResponse(response);
};