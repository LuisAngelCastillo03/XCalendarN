import React, { useState, useEffect } from 'react';
import {
  getProfesores,
  createProfesor,
  updateProfesor,
  deleteProfesor
} from './profesoresService';
 
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit2,
  Trash2,
  PlusCircle,
  Search
} from 'react-feather';
 
import './crud.css';
 
const DocentesCRUD = () => {
  const [profesores, setProfesores] = useState([]);
  const [currentProfesor, setCurrentProfesor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [credenciales, setCredenciales] = useState(null);
  const [filtroId, setFiltroId] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
 
  const initialForm = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    email: '',
    telefono: '',
    pais: 'México',
    ciudad: '',
    usuario: '',
    password: ''
  };
  const [formData, setFormData] = useState(initialForm);
 
  useEffect(() => {
    loadProfesores();
  }, [filtroId, filtroNombre]);
 
  const loadProfesores = async () => {
    try {
      const data = await getProfesores(filtroId || null, filtroNombre || null);
      setProfesores(data);
    } catch (error) {
      console.error('Error al cargar profesores:', error);
      alert('Error al cargar profesores');
    }
  };
 
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProfesor) {
        await updateProfesor(currentProfesor.id, formData);
      } else {
        const res = await createProfesor(formData);
        setCredenciales(res);
      }
      setShowModal(false);
      setFormData(initialForm);
      loadProfesores();
    } catch (error) {
      alert('Error al guardar: ' + error.message);
      console.error(error);
    }
  };
 
  const handleEdit = (profesor) => {
    setCurrentProfesor(profesor);
    setFormData({
      nombre: profesor.nombre,
      apellidoPaterno: profesor.apellidoPaterno,
      apellidoMaterno: profesor.apellidoMaterno || '',
      fechaNacimiento: profesor.fechaNacimiento || '',
      email: profesor.email,
      telefono: profesor.telefono || '',
      pais: profesor.pais || 'México',
      ciudad: profesor.ciudad || '',
      usuario: profesor.usuario,
      password: '' // no mostrar contraseña
    });
    setShowModal(true);
  };
 
  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este profesor?')) {
      try {
        await deleteProfesor(id);
        loadProfesores();
      } catch (error) {
        alert('Error al eliminar: ' + error.message);
      }
    }
  };
 
  return (
    <div className="crud-container">
      <h2>
        <User size={24} /> Gestión de Docentes
      </h2>
 
      <div className="filtros-container">
        <div className="form-group">
          <label><Search size={16} /> Filtrar por ID:</label>
          <input
            type="text"
            placeholder="ID del docente"
            value={filtroId}
            onChange={(e) => setFiltroId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label><Search size={16} /> Filtrar por Nombre:</label>
          <input
            type="text"
            placeholder="Nombre del docente"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
        </div>
        <button
          className="btn-clear"
          onClick={() => {
            setFiltroId('');
            setFiltroNombre('');
          }}
        >
          Limpiar filtros
        </button>
      </div>
 
      <button
        className="btn-add"
        onClick={() => {
          setCurrentProfesor(null);
          setFormData(initialForm);
          setShowModal(true);
        }}
      >
        <PlusCircle size={18} /> Nuevo Profesor
      </button>
 
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profesores.map((profesor) => (
              <tr key={profesor.id}>
                <td>{profesor.id}</td>
                <td>{profesor.nombre} {profesor.apellidoPaterno} {profesor.apellidoMaterno}</td>
                <td>{profesor.email}</td>
                <td>{profesor.telefono || 'N/A'}</td>
                <td>{profesor.ciudad}, {profesor.pais}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(profesor)}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(profesor.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {credenciales && (
        <div className="credenciales-modal">
          <h3>Credenciales generadas</h3>
          <p><strong>Usuario:</strong> {credenciales.usuario}</p>
          <p><strong>Contraseña:</strong> {credenciales.password}</p>
          <button onClick={() => setCredenciales(null)}>Cerrar</button>
        </div>
      )}
 
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{currentProfesor ? 'Editar' : 'Agregar'} Profesor</h3>
            <form onSubmit={handleSubmit}>
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
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Apellido Materno:</label>
                <input
                  type="text"
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label><Calendar size={16} /> F. Nacimiento:</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label><Mail size={16} /> Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label><Phone size={16} /> Teléfono:</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label><MapPin size={16} /> País:</label>
                  <select
                    name="pais"
                    value={formData.pais}
                    onChange={handleInputChange}
                  >
                    <option value="México">México</option>
                    <option value="España">España</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="Canadá">Canadá</option>
                    <option value="Otro..">Otro..</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Ciudad:</label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                />
              </div>
 
              {!currentProfesor && (
                <>
                  <div className="form-group">
                    <label>Usuario:</label>
                    <input
                      type="text"
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Contraseña:</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </>
              )}
 
              <div className="form-actions">
                <button type="submit" className="btn-save">Guardar</button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default DocentesCRUD;