import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminDashboard from './pages/Dashboard/Admin';
import ProfesorDashboard from './pages/Dashboard/Profesor';
import AlumnoDashboard from './pages/Dashboard/Alumno';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<PrivateRoute allowedRoles={['administradores']} />}>
                <Route path="/administradores/dashboard" element={<AdminDashboard />} />
            </Route>
            
            <Route element={<PrivateRoute allowedRoles={['profesores']} />}>
                <Route path="/profesores/dashboard" element={<ProfesorDashboard />} />
            </Route>
            
            <Route element={<PrivateRoute allowedRoles={['alumnos']} />}>
                <Route path="/alumnos/dashboard" element={<AlumnoDashboard />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;