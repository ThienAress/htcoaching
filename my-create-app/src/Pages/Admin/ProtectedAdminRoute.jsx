import { Navigate } from "react-router-dom";
import { useAdminCheck } from "../../hook/useAdminCheck";

const ProtectedAdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAdminCheck();

  if (loading) return <div>Đang kiểm tra quyền truy cập...</div>;

  return isAdmin ? children : <Navigate to="/" replace />;
};

export default ProtectedAdminRoute;
