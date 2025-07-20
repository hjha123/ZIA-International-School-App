import { Navigate } from "react-router-dom";
import authService from "../services/authService";

function ProtectedRoute({ children, allowedRoles }) {
  const token = authService.getToken();
  const role = authService.getRole();

  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
