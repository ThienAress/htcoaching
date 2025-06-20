// src/Pages/Admin/ProtectedAdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useUser } from "../../UserContent/UserContext";

const ProtectedAdminRoute = ({ children }) => {
  const { user, userRole, loading } = useUser();

  if (loading) {
    return <div>Đang kiểm tra quyền truy cập...</div>;
  }

  if (!user || userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
