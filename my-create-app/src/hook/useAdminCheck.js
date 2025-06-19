// src/hooks/useAdminCheck.js
import { useUser } from "../UserContent/UserContext";

export const useAdminCheck = () => {
  const { userRole, loading } = useUser();

  return {
    isAdmin: userRole === "admin",
    loading,
  };
};
