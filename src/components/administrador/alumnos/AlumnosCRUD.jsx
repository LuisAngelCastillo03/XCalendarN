import React, { useState, useEffect } from 'react';
import { getAlumnos, createAlumno, updateAlumno, deleteAlumno } from './alumnosServices';
import { User, Edit2, Trash2, PlusCircle, Search } from 'react-feather';
import './acrud.css';
 
const AlumnosCRUD = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [currentAlumno, setCurrentAlumno] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filtroMatricula, setFiltroMatricula] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
 
  const initialForm = {
    matricula: '',
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    password: '',
    estado: 'activo'
  };
  const [formData, setFormData] = useState(initialForm);
 
  useEffect(() => {
    loadAlumnos();
  }, [filtroMatricula, filtroNombre]);
 
  const loadAlumnos = async () => {
    try {
      const data = await getAlumnos(
        filtroMatricula || null,
        filtroNombre || null
      );
      setAlumnos(data);
    } catch (error) {
      alert('Error al cargar alumnos: ' + error.message);
    }
  };
 
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let envio = { ...formData };
      if (currentAlumno && (!envio.password || envio.password.trim() === '')) {
        delete envio.password;
      }
 
      if (currentAlumno) {
        await updateAlumno(currentAlumno.matricula, envio);
      } else {
        await createAlumno(envio);
      }
      setShowModal(false);
      setFormData(initialForm);
      loadAlumnos();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };
 
  const handleEdit = (alumno) => {
    setCurrentAlumno(alumno);
    setFormData({
      ...alumno,
      password: '',
      estado: alumno.estado || 'activo'
    });
    setShowModal(true);
  };
 
  const handleDelete = async (matricula) => {
    if (window.confirm('¿Eliminar este alumno?')) {
      try {
        await deleteAlumno(matricula);
        loadAlumnos();
      } catch (error) {
        alert('Error al eliminar: ' + error.message);
      }
    }
  };
 
  return (
    <div className="app-container">
      <div className="main-content">
        <div className="crud-container">
          <h2><User size={24} /> Gestión de Alumnos</h2>
 
          {/* Sección de Filtros */}
          <div className="filters-container">
            <div className="filter-group">
              <label><Search size={16} /> Filtrar por Matrícula:</label>
              <input
                type="text"
                placeholder="Matrícula"
                value={filtroMatricula}
                onChange={(e) => setFiltroMatricula(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label><Search size={16} /> Filtrar por Nombre:</label>
              <input
                type="text"
                placeholder="Nombre"
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
              />
            </div>
            <button
              className="btn-clear"
              onClick={() => {
                setFiltroMatricula('');
                setFiltroNombre('');
              }}
            >
              Limpiar filtros
            </button>
          </div>
 
          <button className="btn-add" onClick={() => {
            setCurrentAlumno(null);
            setFormData(initialForm);
            setShowModal(true);
          }}>
            <PlusCircle size={18} /> Nuevo Alumno
          </button>
 
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Matrícula</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.map(alumno => (
                  <tr key={alumno.matricula}>
                    <td>{alumno.matricula}</td>
                    <td>{alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno}</td>
                    <td>{alumno.email}</td>
                    <td>
                      <span className={`status-badge ${alumno.estado}`}>
                        {alumno.estado}
                      </span>
                    </td>
                    <td>{alumno.fecha_registro ? new Date(alumno.fecha_registro).toLocaleDateString() : ''}</td>
                    <td className="actions">
                      <button onClick={() => handleEdit(alumno)}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(alumno.matricula)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
 
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h3>{currentAlumno ? 'Editar' : 'Agregar'} Alumno</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Matrícula:</label>
                    <input
                      type="text"
                      name="matricula"
                      value={formData.matricula}
                      onChange={handleInputChange}
                      required
                      disabled={!!currentAlumno}
                    />
                  </div>
                  <div className="form-group">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellido Paterno:</label>
                    <input
                      type="text"
                      name="apellido_paterno"
                      value={formData.apellido_paterno}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellido Materno:</label>
                    <input
                      type="text"
                      name="apellido_materno"
                      value={formData.apellido_materno}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{currentAlumno ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña:'}</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!currentAlumno}
                      placeholder={currentAlumno ? 'Dejar vacío para no cambiar' : ''}
                    />
                  </div>
                  <div className="form-group">
                    <label>Estado:</label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                    >
                      <option value="activo">Activo</option>
                      <option value="no activo">No activo</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-save">Guardar</button>
                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumnosCRUD;