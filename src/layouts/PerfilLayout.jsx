import { useAuth } from '../../context/AuthContext';

const PerfilLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow bg-[#FFFAFA] min-h-screen p-6">
        <Outlet />
        {user && (
          <div className="mt-6 p-4 rounded-xl shadow-md bg-white border border-gray-200 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">Información adicional</h3>
            <p><strong>Estado:</strong> {user.estado}</p>
            <p><strong>Fecha de registro:</strong> {new Date(user.fecha_registro).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilLayout;
