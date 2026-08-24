import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRole?: "ADMIN" | "CUSTOMER";
}

export default function ProtectedRoute({
  allowedRole,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  try {
    const parsedUser = JSON.parse(user);

    if (
      allowedRole &&
      parsedUser.role !== allowedRole
    ) {
      return (
        <Navigate
          to={
            parsedUser.role === "ADMIN"
              ? "/admin"
              : "/dashboard"
          }
          replace
        />
      );
    }

    return <Outlet />;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }
}