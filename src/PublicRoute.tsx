import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  // If token exists, redirect to dashboard, otherwise show the Login page
  return token ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;