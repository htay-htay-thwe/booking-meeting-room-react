import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Or your auth context/state

  if (!token) {
    // Redirect to home page if not authenticated
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;