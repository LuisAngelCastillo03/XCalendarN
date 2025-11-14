import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
 
const UploadProfilePicture = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
 
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
 
    setSelectedFile(file);
 
    // Mostrar preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };
 
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
 
  const uploadImage = async () => {
    if (!selectedFile) {
      setMsg('Selecciona una imagen primero');
      return;
    }
 
    setLoading(true);
    setMsg('');
 
    const formData = new FormData();
 
    formData.append('foto', selectedFile);
    formData.append('rol', user.rol);
 
    // Segun rol, mandar id o matricula
    if (user.rol === 'alumno') {
      formData.append('matricula', user.id); // o user.matricula según tu contexto
    } else {
      formData.append('id', user.id);
    }
 
    try {
      const res = await axios.post('http://localhost/modulo_agenda/backend/upload_foto.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
 
      if (res.data.success) {
        setMsg('¡Foto actualizada con éxito!');
        updateUser({ ...user, foto_perfil: res.data.foto_url }); // actualizar contexto usuario con nueva foto
        setSelectedFile(null);
        setPreview(null);
      } else {
        setMsg(res.data.message || 'Error al subir la imagen');
      }
    } catch (error) {
      setMsg('Error en el servidor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
 
  return (
<div style={{ maxWidth: 200, margin: 'auto' }}>
<div
        onClick={triggerFileInput}
        style={{
          width: 150,
          height: 150,
          borderRadius: '50%',
          backgroundColor: '#eee',
          cursor: 'pointer',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
          border: '2px dashed #ccc',
        }}
>
        {preview ? (
<img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
<span style={{ fontSize: 48, color: '#aaa' }}>+</span>
        )}
</div>
 
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />
 
      <button
        onClick={uploadImage}
        disabled={loading || !selectedFile}
        style={{
          width: '100%',
          padding: 10,
          backgroundColor: '#40E0D0',
          border: 'none',
          color: 'white',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: 10,
        }}
>
        {loading ? 'Subiendo...' : 'Guardar Foto'}
</button>
 
      {msg && (
<div
          style={{
            padding: 10,
            color: msg.includes('éxito') ? '#155724' : '#721c24',
            backgroundColor: msg.includes('éxito') ? '#d4edda' : '#f8d7da',
            borderRadius: 4,
            textAlign: 'center',
          }}
>
          {msg}
</div>
      )}
</div>
  );
};
 
export default UploadProfilePicture;