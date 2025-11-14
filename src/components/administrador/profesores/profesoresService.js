const API_URL = 'http://localhost/modulo_agenda/backend/profesores.php';
 
// Manejar respuestas de la API
const handleApiResponse = async (response) => {
  const contentType = response.headers.get('content-type');
 
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(text || 'Respuesta no JSON del servidor');
  }
 
  const data = await response.json();
 
  if (!response.ok || !data.success) {
    throw new Error(data.error || `Error HTTP ${response.status}`);
  }
 
  return data.data;
};
 
// Obtener lista de profesores con filtros opcionales
export const getProfesores = async (id = null, nombre = null) => {
  try {
    const params = new URLSearchParams();
    if (id) params.append('id', id);
    if (nombre) params.append('nombre', nombre);
 
    const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
   
    const response = await fetch(url);
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error en getProfesores:', error);
    throw error;
  }
};
 
// Crear nuevo profesor
export const createProfesor = async (profesor) => {
  try {
    const profesorData = {
      nombre: profesor.nombre,
      apellidoPaterno: profesor.apellidoPaterno,
      apellidoMaterno: profesor.apellidoMaterno || '',
      fechaNacimiento: profesor.fechaNacimiento || null,
      email: profesor.email,
      telefono: profesor.telefono || '',
      pais: profesor.pais || 'México',
      ciudad: profesor.ciudad || '',
      usuario: profesor.usuario,
      password: profesor.password
    };
 
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profesorData)
    });
 
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error en createProfesor:', error);
    throw error;
  }
};
 
// Actualizar profesor
export const updateProfesor = async (id, profesor) => {
  try {
    const profesorData = {
      nombre: profesor.nombre,
      apellidoPaterno: profesor.apellidoPaterno,
      apellidoMaterno: profesor.apellidoMaterno || '',
      fechaNacimiento: profesor.fechaNacimiento || null,
      email: profesor.email,
      telefono: profesor.telefono || '',
      pais: profesor.pais || 'México',
      ciudad: profesor.ciudad || ''
    };
 
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profesorData)
    });
 
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error en updateProfesor:', error);
    throw error;
  }
};
 
// Eliminar profesor
export const deleteProfesor = async (id) => {
  try {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE'
    });
 
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error en deleteProfesor:', error);
    throw error;
  }
};
 