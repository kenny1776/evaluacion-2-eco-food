import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedByRole({ allowed, children }) {
  const { userData, loading } = useAuth();

  if (loading) return <div className="text-center mt-4">Verificando permisos...</div>;

  if (!userData || !allowed.includes(userData.tipo)) {
    return <Navigate to="/login" />;
  }

  return children;
}
