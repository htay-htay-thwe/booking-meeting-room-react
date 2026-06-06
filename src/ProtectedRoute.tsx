import { Outdent } from 'lucide-react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token'); // Or your auth context/state

  if (!token) {
    // Redirect to home page if not authenticated
    return <Navigate to="/"  />;
  } else {
    return <Outlet />;
  }
};

export default ProtectedRoute;