import React, { createContext, useContext, useState, useEffect } from 'react';
 
export const AuthContext = createContext();
 
export const useAuth = () => useContext(AuthContext);
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
  const login = (userData) => {
    const completeUser = {
      id: userData.id,
      matricula: userData.rol === 'alumno' ? userData.matricula || userData.id : null,
      rol: userData.rol,
      nombre: userData.nombre,
      email: userData.email || '',
      foto_perfil: userData.foto_perfil || null
    };
   
    setUser(completeUser);
    localStorage.setItem('user', JSON.stringify(completeUser));
  };
 
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
 
  const updateUser = (newData) => {
    setUser(prev => {
      const updatedUser = {...prev, ...newData};
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };
 
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data:", e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);
 
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};