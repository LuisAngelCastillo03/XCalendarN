import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Perfil = () => {
  const { user } = useAuth();
  const [alumno, setAlumno] = useState(null);

  useEffect(() => {
    if (user?.matricula) {
      axios.get(`http://localhost/proyecto/backend/get_alumno_info.php?matricula=${user.matricula}`)
        .then(res => setAlumno(res.data))
        .catch(() => setAlumno(null));
    }
  }, [user]);

  if (!user || !alumno) return <p>Cargando...</p>;

  return (
    <div className="container mt-5">
      <h2>Perfil de usuario</h2>
      <img src={alumno.foto_perfil} alt="Perfil" style={{ width: '100px', borderRadius: '50%' }} />
      <p><strong>Nombre:</strong> {alumno.nombre}</p>
      <p><strong>Email:</strong> {alumno.email}</p>
      <p><strong>Estado:</strong> {alumno.estado}</p>
      <p><strong>Fecha de registro:</strong> {new Date(alumno.fecha_registro).toLocaleString()}</p>
    </div>
  );
};

export default Perfil;
